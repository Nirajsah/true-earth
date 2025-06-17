use mongodb::{Collection, bson::Document};

use crate::{
    ingest::{
        earthquake_event::process_earthquake_events, em_dat_events::process_em_dat_events,
        fire_event::process_fire_events,
    },
    models::{em_dat::DisasterRecord, firms::FireEvent, usgs::EarthquakeEvent},
    services::{ai::AiServiceClient, db::DbService},
};

/// should take mongoClient and ai_client.
pub async fn start_fire_event_ingestion(
    db: DbService,
    ai_client: AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let fire_collection: Result<Collection<Document>, mongodb::error::Error> =
        db.handle_collection("fire_event").await;
    match fire_collection {
        Ok(coll) => {
            process_fire_events(coll.clone_with_type::<FireEvent>(), ai_client, BATCH_SIZE).await
        }
        Err(e) => Err(Box::new(e)),
    }
}

/// should take mongoClient and ai_client.
pub async fn start_earthquake_event_ingestion(
    db: DbService,
    ai_client: AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let quake_collection: Result<Collection<Document>, mongodb::error::Error> =
        db.handle_collection("quake_event").await;
    match quake_collection {
        Ok(coll) => {
            process_earthquake_events(
                coll.clone_with_type::<EarthquakeEvent>(),
                ai_client,
                BATCH_SIZE,
            )
            .await
        }
        Err(e) => Err(Box::new(e)),
    }
}

/// should take mongoClient and ai_client.
pub async fn start_em_dat_ingestion(
    db: DbService,
    ai_client: AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let fire_collection: Result<Collection<Document>, mongodb::error::Error> =
        db.handle_collection("em_dat").await;
    match fire_collection {
        Ok(coll) => {
            process_em_dat_events(
                coll.clone_with_type::<DisasterRecord>(),
                ai_client,
                BATCH_SIZE,
            )
            .await
        }
        Err(e) => Err(Box::new(e)),
    }
}
