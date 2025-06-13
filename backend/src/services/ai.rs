use std::error::Error;
use std::time::Duration;
use tonic::transport::Channel; // Import the Channel type for gRPC communication

use crate::proto::llm_service::{embedding_service_client::EmbeddingServiceClient, prompt_service_client::PromptServiceClient, BatchEmbeddingRequest, EmbeddingRequest, EmbeddingResult, PromptRequest, PromptResponse};

#[derive(Clone)] // Clone trait is often needed for Axum/shared state
pub struct AiServiceClient {
    embedding_client: EmbeddingServiceClient<Channel>, 
    chat_client: PromptServiceClient<Channel>, 
}

impl AiServiceClient {
    // Constructor to create a new instance of AiServiceClient
    pub async fn new(go_server_url: &str) -> Result<Self, Box<dyn Error>> {
        let channel = Channel::from_shared(go_server_url.to_string())?
            .connect_timeout(Duration::from_secs(5))
            .timeout(Duration::from_secs(30))
            .connect()
            .await?;

        let embedding_client = EmbeddingServiceClient::new(channel.clone());
        let chat_client = PromptServiceClient::new(channel); // Uncomment if you have a chat service

        Ok(AiServiceClient { embedding_client, chat_client })
    }

    /// Method to call the gRPC service for generating embeddings for a single text input.
    pub async fn gen_embedding(&mut self, text: String) -> Result<Vec<f32>, tonic::Status> {
        let request = tonic::Request::new(EmbeddingRequest { text });
        let response = self.embedding_client.get_embedding(request).await?;
        Ok(response.into_inner().values)
    }

    /// Method to call the gRPC service for generating embeddings for a batch of text inputs.
    pub async fn gen_batch_embeddings(&mut self, texts: Vec<String>) -> Result<Vec<EmbeddingResult>, tonic::Status> {
        let request = tonic::Request::new(BatchEmbeddingRequest { texts });
        let response = self.embedding_client.get_batch_embeddings(request).await?;
        Ok(response.into_inner().embeddings)
    }

    /// Method to call the gRPC service for generating a chat response based on a prompt.
    pub async fn send_prompt(&mut self, prompt: PromptRequest) -> Result<tonic::Streaming<PromptResponse>, tonic::Status> {
    let response = self.chat_client.generate_prompt(prompt).await?;
    Ok(response.into_inner())
}

}
