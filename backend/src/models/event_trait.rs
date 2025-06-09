use crate::services::ai::AiServiceClient;

pub trait Event {
    fn get_embeddings(&self, ai_service: AiServiceClient) -> Result<Vec<f32>, tonic::Status>;
}
