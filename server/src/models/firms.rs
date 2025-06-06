use std::str::FromStr;

// models/firms.rs
use serde::{Deserialize, Serialize};

use crate::ingest::fire_event::{
    AcquisitionDate, AcquisitionTime, BrightnessTemperature, DayNight, FireConfidence, FireEvent,
    FireRadiativePower, Latitude, Longitude, ReferenceTemperature, Satellite,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct Firms {
    pub latitude: f64,
    pub longitude: f64,
    pub brightness: f64,
    pub scan: f64,
    pub track: f64,
    pub acq_date: String,
    pub acq_time: String,
    pub satellite: String,
    pub confidence: u32,
    pub version: String,
    pub bright_t31: f64,
    pub frp: f64,
    pub daynight: String,
}

impl Firms {
    pub fn to_fire_event(&self) -> Option<FireEvent> {
        let confidence = FireConfidence::new(self.confidence as u8)?;

        Some(FireEvent {
            latitude: Latitude::new(self.latitude as f32)?,
            longitude: Longitude::new(self.longitude as f32)?,
            brightness: BrightnessTemperature(self.brightness as f32),
            reference_temp: ReferenceTemperature(self.bright_t31 as f32),
            date: AcquisitionDate(self.acq_date.replace("-", "").parse::<u32>().ok()?),
            time: AcquisitionTime(self.acq_time.parse::<u8>().ok()?),
            satellite: Satellite::from_str(&self.satellite).ok()?,
            confidence,
            frp: FireRadiativePower(self.frp as f32),
            daynight: DayNight::from_str(&self.daynight).ok()?,
        })
    }
}
