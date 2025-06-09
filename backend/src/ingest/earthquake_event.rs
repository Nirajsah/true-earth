// This ingestion is not complete, it is just a starting point for processing earthquake events from a CSV file.
use std::fs::File;

use crate::{models::usgs::{EarthquakeEvent, USGS}, services::db::DbService};

/// Function to process earthquake events from a CSV file
pub fn process_earthquake_events(db: DbService) -> Result<Vec<EarthquakeEvent>, Box<dyn std::error::Error>> {
    let file = File::open("data.csv")?;
    let mut rdr = csv::Reader::from_reader(file);
    let mut earthquake_events: Vec<EarthquakeEvent> = Vec::new();

    for result in rdr.deserialize() {
        let record: USGS = result?;

        if let Some(event) = record.to_earthquake_event() {
            earthquake_events.push(event);
        }
    }

    Ok(earthquake_events)
}