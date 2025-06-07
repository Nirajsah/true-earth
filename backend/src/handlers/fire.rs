// handlers/fire.rs
use crate::ingest::fire_event::FireReport;
use crate::models::firms::Firms;
use crate::services::db::DbService;
use crate::services::firms;
use axum::{Json, extract::State, http::StatusCode};

pub async fn get_fire_events() -> Result<Json<Vec<Firms>>, StatusCode> {
    match firms::fetch_firms_data().await {
        Ok(events) => Ok(Json(events)),
        Err(e) => {
            eprintln!("Error fetching FIRMS data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn add_fire_report(
    State(db_service): State<DbService>,
    Json(fire_report): Json<FireReport>,
) -> Result<StatusCode, StatusCode> {
    match db_service.insert_fire_report(fire_report).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => {
            eprintln!("Error inserting fire report: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
