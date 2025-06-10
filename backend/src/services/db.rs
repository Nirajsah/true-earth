use mongodb::{bson::Document, Client, Collection, Database};

#[derive(Debug, Clone)]
pub struct DbService {
    client: Client,
    db: Database,
}

impl DbService {
    /// Connect to a Database
    pub async fn new(uri: &str, db_name: &str) -> Result<Self, mongodb::error::Error> {
        let client = Client::with_uri_str(uri).await?;
        let db = client.database(db_name);
        Ok(Self { client, db })
    }

    /// Handle a collection, given the collection name, it returns access to the collection
    pub async fn handle_collection(
        &self,
        collection_str: &str,
    ) -> Result<Collection<Document>, mongodb::error::Error> {
        let collection: Collection<Document> = self.db.collection(&collection_str);
        Ok(collection)
    }
}
