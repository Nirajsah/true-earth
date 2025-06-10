// handlers/fire.rs
use crate::models::firms::{FireEvent};
use crate::services::db::DbService;
use crate::services::firms;
use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use mongodb::bson::doc;


pub async fn get_fire_events(State(db_service): State<DbService>) -> impl IntoResponse {
    let collection = match db_service.handle_collection("fire_event").await {
        Ok(coll) => coll.clone_with_type::<FireEvent>(),
        Err(e) => {
            eprintln!("Error accessing collection: {}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, "Collection error").into_response();
        }
    };
    match firms::fetch_firms_data(collection).await {
        Ok(events) => Json(events).into_response(),
        Err(e) => {
            eprintln!("Error fetching FIRMS data: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Error fetching data: {}", e),
            )
                .into_response()
        }
    }
}

pub async fn return_mflix(State(db_service): State<DbService>) -> impl IntoResponse {
    match db_service.handle_collection("movies").await {
        Ok(collection) => {
            match collection
                .find_one(doc! { "title": "The Princess Blade" })
                .await
            {
                Ok(Some(document)) => {
                    // Convert BSON Document to JSON
                    match serde_json::to_value(document) {
                        Ok(json_value) => (StatusCode::OK, Json(json_value)).into_response(),
                        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Serialization error")
                            .into_response(),
                    }
                }
                Ok(None) => (StatusCode::NOT_FOUND, "Movie not found").into_response(),
                Err(err) => {
                    eprintln!("MongoDB query error: {}", err);
                    (StatusCode::INTERNAL_SERVER_ERROR, "Database error").into_response()
                }
            }
        }
        Err(e) => {
            eprintln!("Error accessing collection: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Collection error").into_response()
        }
    }
}
