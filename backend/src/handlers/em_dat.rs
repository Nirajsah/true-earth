use crate::{models::em_dat::DisasterRecord, services::db::DbService};
use axum::{Json, extract::State, response::IntoResponse};
use futures::stream::StreamExt;
use http::StatusCode;
use mongodb::bson::{self, doc};

#[axum::debug_handler]
pub async fn get_em_dat_events(State(state): State<DbService>) -> impl IntoResponse {
    let filter = doc! {};

    // Get collection
    let collection = match state.handle_collection("em_dat").await {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Failed to get collection: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to get collection".to_string(),
            )
                .into_response();
        }
    };

    // Find documents
    let mut cursor = match collection.find(filter).await {
        // Added None for options as it's often needed
        Ok(c) => c,
        Err(e) => {
            eprintln!("Failed to find documents: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to find documents".to_string(),
            )
                .into_response();
        }
    };

    let mut events = Vec::new();
    while let Some(result) = cursor.next().await {
        match result {
            Ok(doc) => {
                // Deserialize Bson Document to strongly-typed struct
                match bson::from_document::<DisasterRecord>(doc) {
                    Ok(event) => events.push(event),
                    Err(e) => {
                        eprintln!("Error deserializing fire_event: {}", e);
                    }
                }
            }
            Err(e) => {
                eprintln!("Cursor error: {}", e);
            }
        }
    }

    // Return OK status code with JSON response
    (StatusCode::OK, Json(events)).into_response()
}
