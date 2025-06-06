// models/climate.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClimatePatternChange {
    pub region: String,
    pub start_year: u32,
    pub end_year: u32,
    pub description: String,
    pub temperature_change_celsius: Option<f64>,
    pub rainfall_change_mm: Option<f64>,
    pub humidity_change_percent: Option<f64>,
} 