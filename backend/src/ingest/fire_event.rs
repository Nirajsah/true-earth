#![allow(dead_code)]

use std::fs::File;

use crate::{
    models::firms::{FireEvent, Firms},
    proto::llm_service::EmbeddingResult,
};
use mongodb::Collection;

/// Function to process fire events from a CSV file
pub async fn process_fire_events(
    fire_event_collection: Collection<FireEvent>,
    mut ai_client: crate::services::ai::AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open("fire.csv")?;
    let mut rdr = csv::Reader::from_reader(file);
    let mut fire_events: Vec<FireEvent> = Vec::new();

    for result in rdr.deserialize() {
        let record: Firms = result?;

        if let Some(event) = record.to_fire_event() {
            let mut event = event;
            event.set_country();
            fire_events.push(event);
        }
    }

    println!(
        "Finished reading {} fire events from CSV.",
        fire_events.len()
    );

    let mut embedded_fire_events: Vec<FireEvent> = Vec::with_capacity(fire_events.len());

    for chunk in fire_events.chunks_mut(BATCH_SIZE) {
        let texts: Vec<String> = chunk.iter_mut().map(|event| event.to_text()).collect();

        println!("Sending batch of {} texts for embedding...", texts.len());

        let request = texts;

        // Call the gRPC service for batch embeddings
        let response: Vec<EmbeddingResult> = ai_client.gen_batch_embeddings(request).await?;

        if response.len() != chunk.len() {
            eprintln!(
                "Warning: Mismatch in batch embedding response count. Expected {}, got {}",
                chunk.len(),
                response.len()
            );
            // Decide how to handle this: panic, return error, or skip this chunk.
            // For now, we'll continue but log a warning.
        }

        // Associate embeddings back to the FireEvent objects
        for (i, mut event) in chunk.to_vec().into_iter().enumerate() {
            if i < response.len() {
                let embedding_proto: EmbeddingResult = response[i].clone();
                event.text_embedding = Some(embedding_proto.values);
            } else {
                // If a mismatch occurred, this event might not have an embedding.
                // It will remain `None`. You might want to handle this explicitly.
                event.text_embedding = None;
                eprintln!(
                    "Error: No embedding found for event at index {} in batch.",
                    i
                );
            }
            embedded_fire_events.push(event);
        }

        println!("Processed {} embeddings in current batch.", chunk.len());
    }
    println!(
        "All embeddings processed. Total embedded events: {}.",
        embedded_fire_events.len()
    );

    fire_event_collection
        .insert_many(embedded_fire_events)
        .await?;
    Ok(())
}
