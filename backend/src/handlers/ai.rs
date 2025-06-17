use std::convert::Infallible;

use axum::Json;
use axum::extract::{Extension, State};
use axum::response::sse::Event;
use axum::response::{IntoResponse, Result, Sse};
use futures::Stream;
use http::{HeaderMap, StatusCode};
use mongodb::bson::{self, doc};
use serde::Serialize;

use crate::proto::llm_service::PromptRequest;
use crate::services::ai::AiServiceClient;
use crate::services::db::DbService;

#[derive(Debug, Serialize)]
pub struct EmbeddingResponsePayload {
    embedding: Vec<f32>,
}

#[derive(Debug, serde::Deserialize)]
pub struct ChatRequestPayload {
    pub text: String,
}
use serde_json::json;

#[axum::debug_handler]
pub async fn chat_with_ai_handler(
    headers: HeaderMap,
    Extension(mut ai_client): Extension<AiServiceClient>,
    Json(payload): Json<ChatRequestPayload>,
) -> Result<Sse<impl Stream<Item = Result<Event, Infallible>>>, (StatusCode, String)> {
    // ✅ Get sessionId from header
    let session_id = headers
        .get("x-session-id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("anonymous"); // or return error if missing

    let grpc_request = PromptRequest {
        text: payload.text,
        session_id: session_id.to_string(),
    };

    let mut grpc_stream_response: tonic::Streaming<crate::proto::llm_service::PromptResponse> =
        ai_client.send_prompt(grpc_request).await.map_err(|e| {
            eprintln!("gRPC client error: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to connect to AI service or send request: {:?}", e),
            )
        })?;

    // Create an SSE stream from the gRPC response stream.
    let sse_stream = async_stream::stream! {
        while let Some(chunk) = grpc_stream_response.message().await.transpose() {
            match chunk {
                Ok(msg) => {
                    if !msg.text.is_empty() {
                        // Wrap the text in JSON format to match client expectations
                        let json_data = json!({
                            "content": msg.text
                        });

                        yield Ok(Event::default().data(json_data.to_string()));
                    }
                }
                Err(e) => {
                    eprintln!("Error during gRPC stream: {:?}", e);
                    // Send an error event to the client and break the stream.
                    let error_data = json!({
                        "error": "An error occurred during streaming."
                    });
                    yield Ok(Event::default().event("error").data(error_data.to_string()));
                    break;
                }
            }
        }
        // Signal the end of the stream with an 'end' event.
        yield Ok(Event::default().event("end"));
    };

    Ok(Sse::new(sse_stream))
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct ChatHistory {
    _id: bson::oid::ObjectId,
    user_id: String,
    messages: Vec<Message>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Message {
    query: String,
    response: String,
}

#[axum::debug_handler]
pub async fn get_chat_history(
    headers: HeaderMap,
    State(state): State<DbService>,
) -> impl IntoResponse {
    // ✅ Get sessionId from header
    let session_id = match headers.get("x-session-id").and_then(|v| v.to_str().ok()) {
        Some(id) => id,
        None => {
            return (
                StatusCode::BAD_REQUEST,
                "Missing x-session-id header".to_string(),
            )
                .into_response();
        }
    };

    let collection = match state.handle_collection("agent").await {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Failed to get collection: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to get collection".to_string(),
            )
                .into_response();
        }
    };

    let filter = doc! { "user_id": session_id };

    let maybe_doc = match collection.find_one(filter).await {
        Ok(doc) => doc,
        Err(e) => {
            eprintln!("Failed to find document: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to find document".to_string(),
            )
                .into_response();
        }
    };

    if let Some(doc) = maybe_doc {
        // Deserialize to strongly typed
        let history: ChatHistory = match bson::from_document(doc) {
            Ok(h) => h,
            Err(e) => {
                eprintln!("Deserialization error: {}", e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to parse document".to_string(),
                )
                    .into_response();
            }
        };
        // ✅ Return just the messages array
        (StatusCode::OK, Json(history.messages)).into_response()
    } else {
        (
            StatusCode::NOT_FOUND,
            "No chat history found for this user.".to_string(),
        )
            .into_response()
    }
}
