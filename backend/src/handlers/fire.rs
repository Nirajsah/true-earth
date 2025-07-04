// handlers/fire.rs
use crate::{models::firms::FireEvent, services::db::DbService};
use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
};
use futures::stream::StreamExt;
use mongodb::{
    bson::{self, doc},
    options::FindOptions,
};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct FireEventQuery {
    from: Option<i32>, // YYYYMMDD
    to: Option<i32>,
}

#[axum::debug_handler]
pub async fn get_fire_events(
    State(state): State<DbService>,
    Query(query): Query<FireEventQuery>,
) -> impl IntoResponse {
    let collection = match state.handle_collection("fire_event").await {
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

    let filter = if let (Some(from), Some(to)) = (query.from, query.to) {
        doc! { "date": { "$gte": from, "$lte": to } }
    } else {
        doc! {} // no filter => match all documents
    };

    let projection = doc! {
        "text": 0,
        "text_embedding": 0
    };

    let find_options = FindOptions::builder().projection(projection).build();

    // Find documents
    let mut cursor = match collection.find(filter).with_options(find_options).await {
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
                match bson::from_document::<FireEvent>(doc) {
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
