// models/pollution.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PollutionData {
    pub location: String,
    pub date: String,
    pub pollutant: String,
    pub level: f64,
    pub unit: String,
    pub country: Option<String>,
    pub state_province: Option<String>,
    pub aqi: Option<u32>,
} 