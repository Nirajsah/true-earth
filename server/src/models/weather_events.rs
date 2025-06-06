// models/weather_events.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WeatherEvent {
    pub event_type: String,
    pub description: String,
    pub date: String,
    pub location: String,
    pub severity: String,
    pub confidence: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FloodEvent {
    pub location: String,
    pub date: String,
    pub depth_cm: f64,
    pub affected_area_sqkm: f64,
    pub confidence: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ElNinoLaNinaData {
    pub year: u32,
    pub status: String, // e.g., "El Nino", "La Nina", "Neutral"
    pub description: String,
} 