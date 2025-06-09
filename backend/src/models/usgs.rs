// This is not complete implementation of the USGS earthquake event model.
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct USGS {
    pub id: String,
    pub date: String,
    pub time: String,
    pub latitude: f64,
    pub longitude: f64,
    pub depth_km: f64,
    pub magnitude: f32,
    pub magnitude_scale: String,
    pub region: String,
}

impl USGS {
    /// Converts a USGS event to an EarthquakeEvent
    pub fn to_earthquake_event(&self) -> Option<EarthquakeEvent> {
        Some(EarthquakeEvent {
            id: self.id.clone(),
            date: self.date.clone(),
            time: self.time.clone(),
            latitude: self.latitude,
            longitude: self.longitude,
            depth_km: self.depth_km,
            magnitude: self.magnitude,
            magnitude_scale: self.magnitude_scale.clone(),
            region: self.region.clone(),
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EarthquakeEvent {
    pub id: String,
    pub date: String,
    pub time: String,
    pub latitude: f64,
    pub longitude: f64,
    pub depth_km: f64,
    pub magnitude: f32,
    pub magnitude_scale: String,
    pub region: String,
}