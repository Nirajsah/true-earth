// models/firms.rs

use geo::BoundingRect;
use geo::Contains;
use rstar::Envelope;
use rstar::RTreeObject;
use rstar::AABB;
use serde::{Deserialize, Serialize};
use std::str::FromStr;

use crate::ingest::utils::ALL_COUNTRY_BOUNDARIES;

use super::event_trait::Event;

/// Represents a fire detection from the FIRMS dataset.
/// This struct is used to deserialize the JSON data from FIRMS.
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

// Data structure for pre-loaded country polygons
// We'll store the country name and its corresponding geo::Polygon
#[derive(Debug)]
pub struct CountryBoundary {
    pub name: String,
    pub polygon: geo::Polygon,
}

// Implement RTreeObject for CountryBoundary
impl RTreeObject for CountryBoundary {
    type Envelope = AABB<[f64; 2]>; // The bounding box for the country polygon

    fn envelope(&self) -> Self::Envelope {
        // Calculate the bounding box of the polygon
        let bounds = self.polygon.bounding_rect().unwrap(); // unwrap() assuming valid polygons
        AABB::from_corners(
            [bounds.min().x, bounds.min().y],
            [bounds.max().x, bounds.max().y],
        )
    }
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
            country: None, // This will be set later
            text: None, // Optional text description for the event
            text_embedding: None, // Optional text embedding for the event
        })
    }
}

/// Represents the geographic latitude in decimal degrees.
/// Positive values indicate northern hemisphere.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Latitude(pub f32);

/// Represents the geographic longitude in decimal degrees.
/// Positive values indicate eastern hemisphere.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Longitude(pub f32);

/// Brightness temperature in Kelvin (T4 band ~4µm), used to detect fire hotspots.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct BrightnessTemperature(pub f32);

/// Brightness temperature from T31 band (11µm), used for background reference.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ReferenceTemperature(pub f32);

/// UTC date of the fire detection (YYYYMMDD as u32 for compactness).
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AcquisitionDate(pub u32);

/// UTC time of fire detection in HHMM format (e.g., 1350 = 13:50).
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AcquisitionTime(pub u8);

/// Confidence level (0–100) for MODIS, or mapped (e.g., 0=low, 50=nominal, 100=high) for VIIRS.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FireConfidence(pub u8);

/// Radiative power of the fire in megawatts (MW), estimating fire intensity.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FireRadiativePower(pub f32);

/// 'D' for Day, 'N' for Night — stored as char in MongoDB.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum DayNight {
    Day,
    Night,
}

/// Indicates the satellite source of detection.
#[derive(Clone, Serialize, Deserialize, Debug)]
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
#[derive(Clone, Serialize, Deserialize, Debug)]
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
    pub country: Option<String>,
    pub text: Option<String>, // Optional text description for the event
    pub text_embedding: Option<Vec<f32>>,
}

impl FireEvent {
    pub fn try_parse(raw: &serde_json::Value) -> Option<Self> {
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
        let country = None; // This will be set later

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
            country,
            text: None,
            text_embedding: None,
        })
    }

    /// Sets the country for this fire event based on the country boundaries(RTree).
    pub fn set_country(&mut self) {
        let firm_point_coords = [self.longitude.value() as f64, self.latitude.value() as f64]; // rstar expects [x, y] = [lon, lat]

        // Query the R-tree for objects whose bounding box contains the point,
        // then filter with a precise polygon contains check.
        if let Ok(rtree) = &*ALL_COUNTRY_BOUNDARIES {
            let firm_point = geo::Point::new(firm_point_coords[0], firm_point_coords[1]);
            for country_boundary in rtree
                .iter()
                .filter(|cb| cb.envelope().contains_point(&firm_point_coords))
            {
                if country_boundary.polygon.contains(&firm_point) {
                    self.country = Some(country_boundary.name.clone());
                    return; // Found the country, exit
                }
            }
            self.country = None; // If no country is found
        } else {
            self.country = None; // If the RTree failed to load
        }
    }

    pub fn to_text(&mut self) -> String {
        let text = format!(
            "Fire detected at {}°N, {}°E on {} at {}. Confidence: {}, Satellite: {:?}, Day/Night: {:?}",
            self.latitude.value(),
            self.longitude.value(),
            self.date.0,
            self.time.0,
            self.confidence.value(),
            self.satellite,
            self.daynight
        );
        self.text = Some(text.clone()); // Store the text in the struct
        text
    }
}
