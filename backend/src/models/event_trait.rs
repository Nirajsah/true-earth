use crate::services::ai::AiServiceClient;
use anyhow::Error;
use async_trait::async_trait;

#[async_trait]
pub trait Event {
    async fn get_embeddings(&self, ai_service: AiServiceClient) -> Result<Vec<f64>, Error>;
}
