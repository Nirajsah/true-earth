use axum::{Router, routing::{get, post}};
use http::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use services::ai::AiServiceClient;
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use dotenvy::dotenv;

mod handlers;
mod ingest;
mod models;
mod services;
mod utils;
mod proto;
use crate::handlers::health::health_check;
use crate::services::db::DbService;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    // Initialize tracing for logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "server=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();


    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(vec![AUTHORIZATION, ACCEPT, CONTENT_TYPE])
        .allow_origin(Any);

    let mongo_uri = std::env::var("MONGO_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    let db_name = std::env::var("MONGO_DB_NAME")
        .unwrap_or_else(|_| "true_earth_db".to_string());
    let collection_name = std::env::var("MONGO_COLLECTION_NAME")
        .unwrap_or_else(|_| "fire_reports".to_string());

    // 1. Initialize gRPC Client
    let go_ai_orchestrator_url = "http://localhost:50051"; // Or your deployed Go service URL
    let ai_client: AiServiceClient = AiServiceClient::new(go_ai_orchestrator_url).await?;

    let db_service = DbService::new(&mongo_uri, &db_name, &collection_name)
        .await
        .expect("Failed to connect to MongoDB");

    // Build our application with a route
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/fire_events", get(handlers::fire::get_fire_events))
        .route("/fire_reports", post(handlers::fire::add_fire_report))
        .route("/embeddings", post(handlers::ai::generate_embedding_handler))
        .route("/read", get(handlers::ai::read_file_handler))
        .layer(cors)
        .layer(axum::Extension(ai_client)) // Adding gRPC client to app state
        .with_state(db_service);

    // Run our app with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 4000));
    let listener = TcpListener::bind(&addr).await.unwrap();
    tracing::debug!("listening on {}", addr);
    axum::serve(listener, app.into_make_service())
        .await?; 

    Ok(())
}
