// This ingestion is not complete, it is just a starting point for processing earthquake events from a CSV file.
use std::fs::File;

use mongodb::Collection;

use crate::{
    models::usgs::{EarthquakeEvent, USGS},
    proto::llm_service::EmbeddingResult,
    services::ai::AiServiceClient,
};

/// Function to process earthquake events from a CSV file
pub async fn process_earthquake_events(
    quake_event_collection: Collection<EarthquakeEvent>,
    mut ai_client: AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open("quake.csv")?;
    let mut rdr = csv::Reader::from_reader(file);
    let mut earthquake_events: Vec<EarthquakeEvent> = Vec::new();

    for result in rdr.deserialize() {
        let record: USGS = result?;

        if let Some(event) = record.to_earthquake_event() {
            let mut event = event;
            event.set_country();
            earthquake_events.push(event);
        }
    }

    println!(
        "Finished reading {} fire events from CSV.",
        earthquake_events.len()
    );

    let mut embedded_earthquake_events: Vec<EarthquakeEvent> =
        Vec::with_capacity(earthquake_events.len());

    for chunk in earthquake_events.chunks_mut(BATCH_SIZE) {
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
        }

        // Associate embeddings back to the EarthquakeEvent objects
        for (i, mut event) in chunk.to_vec().into_iter().enumerate() {
            if i < response.len() {
                let embedding_proto: EmbeddingResult = response[i].clone();
                event.text_embedding = Some(embedding_proto.values);
            } else {
                event.text_embedding = None;
                eprintln!(
                    "Error: No embedding found for event at index {} in batch.",
                    i
                );
            }
            embedded_earthquake_events.push(event);
        }

        println!("Processed {} embeddings in current batch.", chunk.len());
    }
    println!(
        "All embeddings processed. Total embedded events: {}.",
        embedded_earthquake_events.len()
    );

    quake_event_collection
        .insert_many(embedded_earthquake_events)
        .await?;
    Ok(())
}
