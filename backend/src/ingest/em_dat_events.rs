// This ingestion is not complete, it is just a starting point for processing EM-DAT disaster records from a JSON file.
use std::fs::File;

use mongodb::Collection;

use crate::{
    models::em_dat::DisasterRecord, proto::llm_service::EmbeddingResult,
    services::ai::AiServiceClient,
};

pub async fn process_em_dat_events(
    em_dat_coll: Collection<DisasterRecord>,
    mut ai_client: AiServiceClient,
    BATCH_SIZE: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    match File::open("disaster_data_output/all_disaster_records.json") {
        Ok(file) => {
            let rdr = std::io::BufReader::new(file);
            match serde_json::from_reader::<_, Vec<DisasterRecord>>(rdr) {
                Ok(mut em_dat_events) => {
                    let mut embedded_em_dat_events: Vec<DisasterRecord> =
                        Vec::with_capacity(em_dat_events.len());

                    for chunk in em_dat_events.chunks_mut(BATCH_SIZE) {
                        let texts: Vec<String> =
                            chunk.iter_mut().map(|event| event.to_text()).collect();

                        println!("Sending batch of {} texts for embedding...", texts.len());

                        let request = texts;

                        // Call the gRPC service for batch embeddings
                        let response: Vec<EmbeddingResult> =
                            ai_client.gen_batch_embeddings(request).await?;

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
                            embedded_em_dat_events.push(event);
                        }

                        println!("Processed {} embeddings in current batch.", chunk.len());
                    }
                    println!(
                        "All embeddings processed. Total embedded events: {}.",
                        embedded_em_dat_events.len()
                    );

                    em_dat_coll.insert_many(embedded_em_dat_events).await?;
                }
                Err(e) => {
                    tracing::error!("Failed to deserialize EM-DAT events: {}", e);
                    return Err(Box::new(e));
                }
            }
        }
        Err(e) => {
            tracing::error!("Failed to open EM-DAT events file: {}", e);
            return Err(Box::new(e));
        }
    }
    Ok(())
}
