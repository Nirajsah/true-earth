// handlers/geographical.rs
use axum::{Json, http::StatusCode};
use crate::models::geographical::{TemperatureData, PopulationDensity, ForestCover, Deforestation};
use crate::services::geographical;

pub async fn get_temperature_data() -> Result<Json<Vec<TemperatureData>>, StatusCode> {
    match geographical::fetch_temperature_data().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching temperature data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_population_density() -> Result<Json<Vec<PopulationDensity>>, StatusCode> {
    match geographical::fetch_population_density().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching population density data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_forest_cover() -> Result<Json<Vec<ForestCover>>, StatusCode> {
    match geographical::fetch_forest_cover().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching forest cover data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_deforestation_data() -> Result<Json<Vec<Deforestation>>, StatusCode> {
    match geographical::fetch_deforestation_data().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching deforestation data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
} 