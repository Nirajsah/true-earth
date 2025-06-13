use std::convert::Infallible;
use std::pin::Pin;

use async_stream::stream;
use axum::extract::Extension;
use axum::response::sse::Event;
use axum::response::{IntoResponse, Result, Sse};
use axum::Json;
use futures::Stream;
use futures::StreamExt;
use http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::proto::llm_service::{PromptRequest, PromptResponse};
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
    Extension(ai_client): Extension<AiServiceClient>,
    Json(payload): Json<EmbeddingRequestPayload>,
) -> Result<impl IntoResponse> {
    println!(
        "REST endpoint received request for embedding for text: {}",
        payload.text
    );

    // Call the gRPC client method
    // In a real scenario, this would be ai_client.get_embedding(payload.text).await?
    // let greeting_response = ai_client.say_hello(payload.text.clone()).await; // Using say_hello for now

    // match greeting_response {
    //     Ok(message) => {
    //         // For now, simulate an embedding using the greeting.
    //         // In reality, this would be the actual embedding vector from your Go service.
    //         println!("Received greeting from Go gRPC: {}", message);
    //         // let embeddings = ai_client.get_embedding(message).await.map_err(|e| {
    //         //     format!("Failed to get embedding: {:?}", e)
    //         // })?;
            Ok(Json(EmbeddingResponsePayload {
                embedding: vec![1.0, 2.0],
            }))
    //     }
    //     Err(e) => Err(format!("Failed to get embedding: {:?}", e).into()),
    // }
}

// The payload for the REST endpoint, containing the user's initial text.
// Renamed from EmbeddingRequestPayload for better semantic fit with chat.
#[derive(Debug, serde::Deserialize)]
pub struct ChatRequestPayload {
    pub text: String,
}


#[axum::debug_handler] // This is useful for debugging, it logs the request
pub async fn chat_with_ai_handler(
    // axum::Extension is a way to access shared application state (like our gRPC client)
    Extension(mut ai_client): Extension<AiServiceClient>,
    Json(payload): Json<ChatRequestPayload>,
) -> Result<Sse<impl Stream<Item = Result<Event, Infallible>>>, (StatusCode, String)> {
    println!(
        "REST endpoint received request for chat: {}",
        payload.text
    );

    // 1. Construct the gRPC PromptRequest
    let grpc_request = PromptRequest {
        text: payload.text, // The user's input text
    };


    // 2. Call the gRPC streaming method
    // This assumes ai_client.generate_content (from your updated proto)
    // returns a `tonic::Streaming<GenerateResponse>`.
    let mut grpc_stream_response = ai_client
        .send_prompt(grpc_request)
        .await
        .map_err(|e| {
            eprintln!("gRPC client error: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to connect to AI service or send request: {:?}", e),
            )
        })?; // Propagate gRPC connection/initial request errors

    println!("Initiating streaming chat response to client...");


    // Forward each gRPC chunk to SSE
    let sse_stream = stream! {
        while let Some(chunk) = grpc_stream_response.message().await.transpose() {
            match chunk {
                Ok(msg) => {
                    if !msg.text.is_empty() {
                        yield Ok(Event::default().data(msg.text));
                    }
                }
                Err(e) => {
                    eprintln!("Error during gRPC stream: {:?}", e);
                    break;
                }
            }
        }
    };

    // 4. Return the Sse response.
    // Axum will automatically set the `Content-Type: text/event-stream` header.
    Ok(Sse::new(sse_stream))
}
