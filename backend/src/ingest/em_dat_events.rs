// This ingestion is not complete, it is just a starting point for processing EM-DAT disaster records from a JSON file.
use std::fs::File;

use crate::{handlers::em_dat::DisasterRecord, services::db::DbService};

pub async fn process_em_dat_events(db: DbService) -> Result<(), Box<dyn std::error::Error>> {
    match File::open("disaster_data_output/all_disaster_records.json") {
        Ok(file) => {
            let rdr = std::io::BufReader::new(file);
            match serde_json::from_reader::<_, Vec<DisasterRecord>>(rdr) {
                Ok(em_dat_events) => {
                    println!("{:?}", em_dat_events);
                    Ok(())
                },
                Err(e) => {
                    tracing::error!("Failed to deserialize EM-DAT events: {}", e);
                    return Err(Box::new(e));
                },
            }
        }
        Err(e) => {
            tracing::error!("Failed to open EM-DAT events file: {}", e);
            return Err(Box::new(e));
        }
    }
}
