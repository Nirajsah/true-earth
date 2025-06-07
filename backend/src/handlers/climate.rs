// handlers/climate.rs
use axum::{Json, http::StatusCode};
use crate::models::climate::ClimatePatternChange;
use crate::services::climate;

pub async fn get_climate_pattern_changes() -> Result<Json<Vec<ClimatePatternChange>>, StatusCode> {
    match climate::fetch_climate_pattern_changes().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching climate pattern changes: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
} 