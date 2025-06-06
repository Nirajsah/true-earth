use mongodb::{Client, Collection};
use serde::{Deserialize, Serialize};
use crate::ingest::fire_event::FireReport;

#[derive(Debug, Clone)]
pub struct DbService {
    client: Client,
    collection: Collection<FireReport>,
}

impl DbService {
    pub async fn new(uri: &str, db_name: &str, collection_name: &str) -> Result<Self, mongodb::error::Error> {
        let client = Client::with_uri_str(uri).await?;
        let collection = client.database(db_name).collection::<FireReport>(collection_name);
        Ok(Self { client, collection })
    }

    pub async fn insert_fire_report(&self, report: FireReport) -> Result<(), mongodb::error::Error> {
        self.collection.insert_one(report, None).await?;
        Ok(())
    }
} 