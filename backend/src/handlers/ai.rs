use axum::extract::Extension;
use axum::response::{IntoResponse, Result};
use axum::Json;
use serde::{Deserialize, Serialize};

use crate::services::ai::AiServiceClient;

#[derive(Debug, Deserialize)] // The `Deserialize` trait is crucial here
pub struct EmbeddingRequestPayload {
    text: String, // <--- THIS IS THE FIELD YOU ARE LOOKING FOR!
}

#[derive(Debug, Serialize)]
pub struct EmbeddingResponsePayload {
    embedding: Vec<f32>,
}

// Example: A POST endpoint that uses the gRPC client
// This is where your UI would send data, and your Rust backend would then call the Go AI service.
#[axum::debug_handler] // This is useful for debugging, it logs the request
pub async fn generate_embedding_handler(
    // axum::Extension is a way to access shared application state (like our gRPC client)
    Extension(mut ai_client): Extension<AiServiceClient>,
    Json(payload): Json<EmbeddingRequestPayload>,
) -> Result<impl IntoResponse> {
    println!(
        "REST endpoint received request for embedding for text: {}",
        payload.text
    );

    // Call the gRPC client method
    // In a real scenario, this would be ai_client.get_embedding(payload.text).await?
    let greeting_response = ai_client.say_hello(payload.text.clone()).await; // Using say_hello for now

    match greeting_response {
        Ok(message) => {
            // For now, simulate an embedding using the greeting.
            // In reality, this would be the actual embedding vector from your Go service.
            println!("Received greeting from Go gRPC: {}", message);
            // let embeddings = ai_client.get_embedding(message).await.map_err(|e| {
            //     format!("Failed to get embedding: {:?}", e)
            // })?;
            Ok(Json(EmbeddingResponsePayload {
                embedding: vec![1.0, 2.0],
            }))
        }
        Err(e) => Err(format!("Failed to get embedding: {:?}", e).into()),
    }
}
