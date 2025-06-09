use axum::{
    routing::{get, post},
    Router,
};
use dotenvy::dotenv;
use http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use services::ai::AiServiceClient;
use std::{net::SocketAddr, time::Duration};
use tokio::{net::TcpListener, time::interval};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utils::event_ingestion::{start_earthquake_event_ingestion, start_fire_event_ingestion};

mod handlers;
mod ingest;
mod models;
mod proto;
mod services;
mod utils;
use crate::handlers::health::health_check;
use crate::services::db::DbService;

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
    let collection_name = std::env::var("MONGO_COLLECTION_NAME")?;
    let grpc_url = std::env::var("GRPC_URI")?;

    // Initialize gRPC Client
    // let ai_client: AiServiceClient = AiServiceClient::new(&grpc_url)
    //     .await
    //     .expect("Failed to connect to grpcClient");

    // Initialize MongoDB Client
    let db_service = DbService::new(&mongo_uri, &db_name, &collection_name)
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
        tokio::spawn(async move {
            tracing::debug!("[Main] Spawning events ingestion task...");
            // Run the main ingestion pipeline which runs for fire event.
            // if let Err(e) = start_fire_event_ingestion().await {
            //     tracing::error!("Firms ingestion task failed: {}", e);
            // }

            // Periodic live API fetching (runs continuously after initial ingestion)
            let mut _fire_interval = interval(Duration::from_secs(5));
            // loop {
            //     fire_interval.tick().await;
            //     match fetch_new_firms_data_from_api().await {
            //         Ok(new_fire_events) => {
            //             if let Err(e) = start_fire_event_ingestion(
            //                 fire_ingestion_db_client_clone.clone(),
            //                 fire_ingestion_ai_client_clone.clone(),
            //                 new_fire_events,
            //             )
            //             .await
            //             {
            //                 error!("Periodic fire event ingestion failed: {}", e);
            //             }
            //         }
            //         Err(e) => error!("Failed to fetch new fire events from API: {}", e),
            //     }
            // }
        });
        tokio::spawn(async move {
            // Run the main ingestion pipeline which runs for earthquake event.
            // if let Err(e) = start_earthquake_event_ingestion().await {
            //     tracing::error!("EarthQuake ingestion task failed: {}", e);
            // }

            // Periodic live API fetching (runs continuously after initial ingestion)
            let mut _earthquake_interval = interval(Duration::from_secs(5));
            // Or different interval
            // loop {
            // earthquake_interval.tick().await;
            // match fetch_new_earthquake_data_from_api().await {
            //     Ok(new_earthquake_events) => {
            //         if let Err(e) = start_earthquake_event_ingestion(
            //             // earthquake_ingestion_db_client_clone.clone(),
            //             // earthquake_ingestion_ai_client_clone.clone(),
            //             // new_earthquake_events
            //         )
            //         .await
            //         {
            //             tracing::error!("Periodic earthquake event ingestion failed: {}", e);
            //         }
            //     }
            //     Err(e) => {
            //         tracing::error!("Failed to fetch new earthquake events from API: {}", e)
            //     }
            // }
            // }
        });
        tracing::debug!("[Main] Events ingestion task completed.");
    } else {
        tracing::debug!("[Main] Ingestion pipeline is SKIPPED. To enable, run with `--start-ingestion` or `-i`.");
    }

    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(vec![AUTHORIZATION, ACCEPT, CONTENT_TYPE])
        .allow_origin(Any);

    // Build our application with a route
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/fire_events", get(handlers::fire::get_fire_events))
        .route("/fire_reports", post(handlers::fire::add_fire_report))
        .route(
            "/embeddings",
            post(handlers::ai::generate_embedding_handler),
        )
        .route("/em_dat", get(handlers::em_dat::get_em_dat_events))
        .layer(cors)
        // .layer(axum::Extension(ai_client)) // Adding gRPC client to app state
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
