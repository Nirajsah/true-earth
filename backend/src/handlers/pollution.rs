// handlers/pollution.rs
use axum::{Json, http::StatusCode};
use crate::models::pollution::PollutionData;
use crate::services::pollution;

pub async fn get_pollution_data() -> Result<Json<Vec<PollutionData>>, StatusCode> {
    match pollution::fetch_pollution_data().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching pollution data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
} 