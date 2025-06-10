#![allow(dead_code)]

use std::fs::File;

use crate::{
    models::firms::{FireEvent, Firms},
    services::db::DbService,
};
use mongodb::{bson::Document, Collection};
use serde::{Deserialize, Serialize};

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

/// Function to process fire events from a CSV file
pub async fn process_fire_events(
    fire_event_collection: Collection<FireEvent>,
) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open("data.csv")?;
    let mut rdr = csv::Reader::from_reader(file);
    let mut fire_events: Vec<FireEvent> = Vec::new();

    for result in rdr.deserialize() {
        let record: Firms = result?;

        if let Some(event) = record.to_fire_event() {
            let mut event = event;
            event.set_country();
            fire_events.push(event);
        }
    }

    fire_event_collection.insert_many(fire_events).await?;
    Ok(())
}
