// models/geographical.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TemperatureData {
    pub location: String,
    pub date: String,
    pub average_temperature_celsius: f64,
    pub min_temperature_celsius: Option<f64>,
    pub max_temperature_celsius: Option<f64>,
    pub country: Option<String>,
    pub state_province: Option<String>,
    pub global_average: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PopulationDensity {
    pub location: String,
    pub year: u32,
    pub density_per_sqkm: f64,
    pub country: Option<String>,
    pub state_province: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ForestCover {
    pub location: String,
    pub year: u32,
    pub forest_area_sqkm: f64,
    pub percentage_of_land_area: f64,
    pub past_data: Option<Vec<ForestCover>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Deforestation {
    pub region: String,
    pub year: u32,
    pub deforested_area_sqkm: f64,
    pub cause: Option<String>,
} 