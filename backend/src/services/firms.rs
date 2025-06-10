use mongodb::{bson::{doc, Document}, Collection};
use futures::stream::{StreamExt, TryStreamExt};

// services/firms.rs
use crate::models::firms::{FireEvent, Firms};

// This function would interact with the actual FIRMS API.
// For now, it returns dummy data.
pub async fn fetch_firms_data(collection: Collection<FireEvent>) -> Result<Vec<FireEvent>, mongodb::error::Error> {
   let mut cursor = collection.find(doc! {}).await?;
   let mut events = Vec::new();
   while let Some(doc) = cursor.next().await {
       match doc {
           Ok(event) => events.push(event),
           Err(e) => eprintln!("Error deserializing document: {}", e),
       }
   }
   Ok(events)
}