#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use std::str::FromStr;
/// Represents the geographic latitude in decimal degrees.
/// Positive values indicate northern hemisphere.
#[derive(Serialize, Deserialize, Debug)]
pub struct Latitude(pub f32);

/// Represents the geographic longitude in decimal degrees.
/// Positive values indicate eastern hemisphere.
#[derive(Serialize, Deserialize, Debug)]
pub struct Longitude(pub f32);

/// Brightness temperature in Kelvin (T4 band ~4µm), used to detect fire hotspots.
#[derive(Serialize, Deserialize, Debug)]
pub struct BrightnessTemperature(pub f32);

/// Brightness temperature from T31 band (11µm), used for background reference.
#[derive(Serialize, Deserialize, Debug)]
pub struct ReferenceTemperature(pub f32);

/// UTC date of the fire detection (YYYYMMDD as u32 for compactness).
#[derive(Serialize, Deserialize, Debug)]
pub struct AcquisitionDate(pub u32);

/// UTC time of fire detection in HHMM format (e.g., 1350 = 13:50).
#[derive(Serialize, Deserialize, Debug)]
pub struct AcquisitionTime(pub u8);

/// Confidence level (0–100) for MODIS, or mapped (e.g., 0=low, 50=nominal, 100=high) for VIIRS.
#[derive(Serialize, Deserialize, Debug)]
pub struct FireConfidence(pub u8);

/// Radiative power of the fire in megawatts (MW), estimating fire intensity.
#[derive(Serialize, Deserialize, Debug)]
pub struct FireRadiativePower(pub f32);

/// 'D' for Day, 'N' for Night — stored as char in MongoDB.
#[derive(Serialize, Deserialize, Debug)]
pub enum DayNight {
    Day,
    Night,
}

/// Indicates the satellite source of detection.
#[derive(Serialize, Deserialize, Debug)]
pub enum Satellite {
    Terra,
    Aqua,
    SuomiNPP,
    NOAA20,
    Unknown(String),
}

impl FromStr for Satellite {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "T" | "TERRA" => Ok(Satellite::Terra),
            "A" | "AQUA" => Ok(Satellite::Aqua),
            "S" | "SUOMINPP" => Ok(Satellite::SuomiNPP),
            "N" | "NOAA20" => Ok(Satellite::NOAA20),
            other => Ok(Satellite::Unknown(other.to_string())),
        }
    }
}

impl FromStr for DayNight {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "D" => Ok(DayNight::Day),
            "N" => Ok(DayNight::Night),
            _ => Err(()),
        }
    }
}

macro_rules! validated_newtype {
    ($name:ident, $type:ty, $validate:expr) => {
        impl $name {
            /// Create a new instance if the value passes validation.
            pub fn new(value: $type) -> Option<Self> {
                if $validate(&value) {
                    Some(Self(value))
                } else {
                    None
                }
            }
        }
    };
}

macro_rules! value {
    ($name:ident, $type:ty) => {
        impl $name {
            /// Returns the inner value.
            pub fn value(&self) -> $type {
                self.0
            }
        }
    };
}

validated_newtype!(Latitude, f32, |val: &f32| (-90.0..=90.0).contains(val));
validated_newtype!(Longitude, f32, |val: &f32| (-180.0..=180.0).contains(val));
validated_newtype!(FireConfidence, u8, |val: &u8| (50..=100).contains(val));

value!(BrightnessTemperature, f32);
value!(Latitude, f32);
value!(Longitude, f32);
value!(ReferenceTemperature, f32);
value!(FireConfidence, u8);

/// Main structure representing a detected fire event from satellite imagery.
#[derive(Serialize, Deserialize, Debug)]
pub struct FireEvent {
    pub latitude: Latitude,
    pub longitude: Longitude,
    pub brightness: BrightnessTemperature,
    pub reference_temp: ReferenceTemperature,
    pub date: AcquisitionDate,
    pub time: AcquisitionTime,
    pub satellite: Satellite,
    pub confidence: FireConfidence,
    pub frp: FireRadiativePower,
    pub daynight: DayNight,
}

impl FireEvent {
    pub fn try_parse(raw: &serde_json::Value) -> Option<Self> {
        // Perform validation and extraction here

        // only construct FireEvent when confidence > 50
        let confidence = FireConfidence::new(raw.get("confidence")?.as_u64()? as u8)?;

        let latitude = Latitude::new(raw.get("latitude")?.as_f64()? as f32)?;
        let longitude = Longitude::new(raw.get("longitude")?.as_f64()? as f32)?;
        let brightness = BrightnessTemperature(raw.get("brightness")?.as_f64()? as f32);
        let reference_temp = ReferenceTemperature(raw.get("bright_t31")?.as_f64()? as f32);
        let satellite = Satellite::from_str(raw.get("satellite")?.as_str()?).unwrap(); // not supposed to panic
        let daynight = DayNight::from_str(raw.get("daynight")?.as_str()?).unwrap(); // not supposed to panic
        let frp = FireRadiativePower(raw.get("frp")?.as_f64()? as f32);

        let date_str = raw.get("acq_date")?.as_str()?;
        let date = AcquisitionDate(date_str.replace("-", "").parse::<u32>().ok()?);

        let time_str = raw.get("acq_time")?.as_str()?;
        let time = AcquisitionTime(time_str.parse::<u8>().ok()?);

        Some(Self {
            latitude,
            longitude,
            brightness,
            reference_temp,
            date,
            time,
            satellite,
            confidence,
            frp,
            daynight,
        })
    }
}

/// Estimated area in hectares (ha)
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct AreaHa(pub f32);

/// Type of land use damaged
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum LandUseType {
    Forest,
    Cropland,
    Grassland,
    Wetland,
    Urban,
    Other(String), // fallback for unknown tags
}

/// Estimated land damage from fire
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DamageImpact {
    pub total_area_burned: AreaHa,      // total area affected
    pub dominant_land_use: LandUseType, // most affected type
    pub forest_loss: Option<AreaHa>,    // forest-specific loss
    pub cropland_loss: Option<AreaHa>,  // cropland-specific loss
}

/// Climate-related emission estimates
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ClimateImpact {
    pub co2_emitted_kg: Option<f32>,  // carbon dioxide in kg
    pub ch4_emitted_kg: Option<f32>,  // methane in kg
    pub nox_emitted_kg: Option<f32>,  // NOx in kg
    pub pm25_emitted_kg: Option<f32>, // fine particulate matter
    pub aqi_change: Option<i32>,      // estimated local AQI increase
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReportMeta {
    /// Source of the fire data (e.g., "FIRMS", "MODIS", "VIIRS")
    pub data_source: String,
    /// Timestamp when the fire event was detected (Unix epoch ms)
    pub event_timestamp: u64,
    /// Timestamp when this report was created/processed (Unix epoch ms)
    pub processed_timestamp: u64,
    /// Version of your data pipeline or processing script
    pub pipeline_version: String,
    /// Confidence threshold used for filtering the fire event
    pub confidence_threshold: u8,
    /// Additional notes or remarks (optional)
    pub notes: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Embeddings {
    plot_embeddings: Vec<u8>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FireReport {
    fire_event: FireEvent,
    climate_impact: ClimateImpact,
    damage_impact: DamageImpact,
    embeddings: Embeddings,
}
