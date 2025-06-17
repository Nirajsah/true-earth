use axum::{
    Router,
    routing::{get, post},
};
use dotenvy::dotenv;
use http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE, HeaderName};
use services::ai::AiServiceClient;
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utils::event_ingestion::{
    start_earthquake_event_ingestion, start_em_dat_ingestion, start_fire_event_ingestion,
};

mod handlers;
mod ingest;
mod models;
mod proto;
mod services;
mod utils;
use crate::handlers::health::health_check;
use crate::services::db::DbService;

const BATCH_SIZE: usize = 100;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::debug!("Server starting up...");

    dotenv().ok();

    // Initialize tracing for logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "server=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let mongo_uri = std::env::var("MONGO_URI")?;
    let db_name = std::env::var("MONGO_DB_NAME")?;
    let grpc_url = std::env::var("GRPC_URI")?;

    // Initialize gRPC Client
    let ai_client: AiServiceClient = AiServiceClient::new(&grpc_url)
        .await
        .expect("Failed to connect to grpcClient");

    // Initialize MongoDB Client
    let db_service = DbService::new(&mongo_uri, &db_name)
        .await
        .expect("Failed to connect to MongoDB");

    // Parse command-line arguments
    let args: Vec<String> = std::env::args().collect();
    // Check if the "--start-ingestion" flag (or short form "-i") is present
    let should_start_ingestion = args
        .iter()
        .any(|arg| arg == "--start-ingestion" || arg == "-i");

    // Conditionally spawn ingestion task

    if should_start_ingestion {
        let db_service_clone = db_service.clone();
        let ai_client_clone = ai_client.clone();
        tokio::spawn(async move {
            tracing::debug!("[Main] Spawning events ingestion task...");
            // Run the main ingestion pipeline which runs for fire event.
            if let Err(e) =
                start_fire_event_ingestion(db_service_clone, ai_client_clone, BATCH_SIZE).await
            {
                tracing::error!("Firms ingestion task failed: {}", e);
            }
        });
        let db_service_clone = db_service.clone();
        let ai_client_clone = ai_client.clone();
        tokio::spawn(async move {
            // Run the main ingestion pipeline which runs for earthquake event.
            if let Err(e) =
                start_earthquake_event_ingestion(db_service_clone, ai_client_clone, BATCH_SIZE)
                    .await
            {
                tracing::error!("EarthQuake ingestion task failed: {}", e);
            }
        });
        let db_service_clone = db_service.clone();
        let ai_client_clone = ai_client.clone();
        tokio::spawn(async move {
            // Run the main ingestion pipeline which runs for EM-DAT event.
            if let Err(e) =
                start_em_dat_ingestion(db_service_clone, ai_client_clone, BATCH_SIZE).await
            {
                tracing::error!("EM-DAT ingestion task failed: {}", e);
            }
        });
        tracing::debug!("[Main] Events ingestion task completed.");
    } else {
        tracing::debug!(
            "[Main] Ingestion pipeline is SKIPPED. To enable, run with `--start-ingestion` or `-i`."
        );
    }

    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(vec![
            AUTHORIZATION,
            ACCEPT,
            CONTENT_TYPE,
            HeaderName::from_static("x-session-id"),
        ])
        .allow_origin(Any);

    // Build our application with a route
    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/fire_events", get(handlers::fire::get_fire_events))
        .route(
            "/api/quake_events",
            get(handlers::earthquake::get_quake_events),
        )
        .route("/api/chat", post(handlers::ai::chat_with_ai_handler))
        .route("/api/get_chat", get(handlers::ai::get_chat_history))
        .layer(cors)
        .layer(axum::Extension(ai_client)) // Adding gRPC client to app state
        .with_state(db_service);

    // Run our app
    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    let listener = TcpListener::bind(&addr).await.unwrap();
    tracing::debug!("listening on {}", addr);
    let server = axum::serve(listener, app.into_make_service());

    tokio::select! {
        _ = server => {
            tracing::error!("Axum server shut down unexpectedly.");
        }
        _ = tokio::signal::ctrl_c() => {
            tracing::debug!("Ctrl+C received. Shutting down server gracefully.");
        }
    }

    Ok(())
}
