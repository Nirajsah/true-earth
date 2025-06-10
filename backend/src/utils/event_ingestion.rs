use mongodb::{bson::Document, Collection};

use crate::{
    ingest::fire_event::process_fire_events, models::firms::FireEvent, services::db::DbService
};

/// should take mongoClient and ai_client.
pub async fn start_fire_event_ingestion(db: DbService) -> Result<(), Box<dyn std::error::Error>> {
    let fire_collection: Result<Collection<Document>, mongodb::error::Error> =
        db.handle_collection("fire_event").await;
    match fire_collection {
        Ok(coll) => process_fire_events(coll.clone_with_type::<FireEvent>()).await,
        Err(e) => Err(Box::new(e)),
    }
}

/// should take mongoClient and ai_client.
pub async fn start_earthquake_event_ingestion(
    db: DbService,
) -> Result<(), Box<dyn std::error::Error>> {
    todo!()
}
