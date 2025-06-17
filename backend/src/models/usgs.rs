use chrono::{DateTime, Datelike, Timelike, Utc};
use geo::Contains;
use rstar::{Envelope, RTreeObject};
use serde::{Deserialize, Serialize};

use crate::{
    ingest::utils::ALL_COUNTRY_BOUNDARIES,
    models::firms::{AcquisitionDate, AcquisitionTime, Latitude, Longitude},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct USGS {
    pub time: String, // Event time in milliseconds since epoch (often represented as a string or a long integer)
    pub latitude: f32, // Latitude of the event
    pub longitude: f32, // Longitude of the event
    pub depth: f64,   // Depth of the event in kilometers
    pub mag: f64,     // Magnitude of the event
    pub magType: String, // Type of magnitude (e.g., "Mww", "Mb", "Ml")
    pub nst: Option<i32>, // Number of seismic stations used to determine the event's location (optional, as it might be null)
    pub gap: Option<f64>, // Largest azimuthal gap in degrees (optional)
    pub dmin: Option<f64>, // Horizontal distance from the epicenter to the nearest station in degrees (optional)
    pub rms: Option<f64>,  // Root-mean-square travel time residual (optional)
    pub net: String,       // Network that originally reported the event
    pub id: String,        // Unique identifier for the event
    pub updated: String,   // Time when the event was last updated
    pub place: String,     // Textual description of the event's location
    pub r#type: String, // Type of event (e.g., "earthquake", "quarry blast") - using r#type because 'type' is a Rust keyword
    pub horizontalError: Option<f64>, // Estimated horizontal uncertainty of the event (optional)
    pub depthError: Option<f64>, // Estimated vertical uncertainty of the event (optional)
    pub magError: Option<f64>, // Estimated uncertainty of the magnitude (optional)
    pub magNst: Option<i32>, // Number of stations used to calculate the magnitude (optional)
    pub status: String, // Status of the event (e.g., "automatic", "reviewed")
    pub locationSource: String, // Source of the location data
    pub magSource: String, // Source of the magnitude data
}

impl USGS {
    /// Converts a USGS event to an EarthquakeEvent
    pub fn to_earthquake_event(&self) -> Option<EarthquakeEvent> {
        let dt: DateTime<Utc> = self.time.parse().expect("failed to parse DateTime");

        // Format date: YYYYMMDD
        let date = (dt.year() as u32) * 10_000 + (dt.month() as u32) * 100 + (dt.day() as u32);

        // Format time: HHMM
        let time = (dt.hour() as u16) * 100 + (dt.minute() as u16);

        Some(EarthquakeEvent {
            id: self.id.clone(),
            date: AcquisitionDate(date),
            time: AcquisitionTime(time),
            latitude: Latitude::new(self.latitude)?,
            longitude: Longitude::new(self.longitude)?,
            depth_km: self.depth,
            magnitude: self.mag as f32, // Cast f64 to f32
            magnitude_scale: self.magType.clone(),
            country: None,        // Country is not directly available, so set to None
            text: None,           // Populated with a basic summary
            text_embedding: None, // Embeddings are generated externally, so None here
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EarthquakeEvent {
    pub id: String,
    pub date: AcquisitionDate,
    pub time: AcquisitionTime,
    pub latitude: Latitude,
    pub longitude: Longitude,
    pub depth_km: f64,
    pub magnitude: f32,
    pub magnitude_scale: String,
    pub country: Option<String>,
    pub text: Option<String>,
    pub text_embedding: Option<Vec<f32>>,
}

impl EarthquakeEvent {
    /// Sets the country for this fire event based on the country boundaries(RTree).
    pub fn set_country(&mut self) {
        let quake_point_coords = [self.longitude.value() as f64, self.latitude.value() as f64]; // rstar expects [x, y] = [lon, lat]

        // Query the R-tree for objects whose bounding box contains the point,
        // then filter with a precise polygon contains check.
        if let Ok(rtree) = &*ALL_COUNTRY_BOUNDARIES {
            let quake_point = geo::Point::new(quake_point_coords[0], quake_point_coords[1]);
            for country_boundary in rtree
                .iter()
                .filter(|cb| cb.envelope().contains_point(&quake_point_coords))
            {
                if country_boundary.polygon.contains(&quake_point) {
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
        let mut text = format!(
            "An earthquake event occurred at latitude {:.4} degrees north and longitude {:.4} degrees east.",
            self.latitude.value(),
            self.longitude.value()
        );

        text.push_str(&format!(
            " The earthquake was detected on {} at approximately {:04} UTC.",
            self.date.0, self.time.0
        ));

        text.push_str(&format!(
            " The earthquake had a magnitude of {:.1} {} and originated at a depth of {:.1} kilometers beneath the Earth’s surface.",
            self.magnitude,
            self.magnitude_scale,
            self.depth_km
        ));

        if let Some(country) = &self.country {
            text.push_str(&format!(
                " This seismic event was reported near {}.",
                country
            ));
        }

        if let Some(extra) = &self.text {
            text.push_str(&format!(" Additional information: {}.", extra));
        }

        text.push_str(" This description summarizes the key geophysical parameters for monitoring and analysis of global seismic activity.");

        self.text = Some(text.clone());

        text
    }
}
