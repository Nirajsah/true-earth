// handlers/weather.rs
use axum::{Json, http::StatusCode};
use crate::models::weather_events::{WeatherEvent, FloodEvent, ElNinoLaNinaData};
use crate::services::weather_events;

pub async fn get_extreme_weather_events() -> Result<Json<Vec<WeatherEvent>>, StatusCode> {
    match weather_events::fetch_extreme_weather_events().await {
        Ok(events) => Ok(Json(events)),
        Err(e) => {
            eprintln!("Error fetching extreme weather events: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_flood_events() -> Result<Json<Vec<FloodEvent>>, StatusCode> {
    match weather_events::fetch_flood_events().await {
        Ok(events) => Ok(Json(events)),
        Err(e) => {
            eprintln!("Error fetching flood events: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_el_nino_la_nina_data() -> Result<Json<Vec<ElNinoLaNinaData>>, StatusCode> {
    match weather_events::fetch_el_nino_la_nina_data().await {
        Ok(data) => Ok(Json(data)),
        Err(e) => {
            eprintln!("Error fetching El Nino/La Nina data: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
} 