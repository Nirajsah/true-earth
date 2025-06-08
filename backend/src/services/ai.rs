use std::{error::Error, fs::File};
use std::time::Duration;
use tonic::transport::Channel; // Import the Channel type for gRPC communication

use crate::models::firms::{Firms, FireEvent};
use crate::proto::greeter::{
    greeter_client::GreeterClient, // Import the generated client stub struct
    HelloRequest,                 // Import the generated request message struct
};

#[derive(Clone)] // Clone trait is often needed for Axum/shared state
pub struct AiServiceClient {
    client: GreeterClient<Channel>, // This would eventually be your EmbeddingServiceClient
}

impl AiServiceClient {
    // Constructor to create a new instance of AiServiceClient
    pub async fn new(go_server_url: &str) -> Result<Self, Box<dyn Error>> {
        let channel = Channel::from_shared(go_server_url.to_string())?
            .connect_timeout(Duration::from_secs(5))
            .timeout(Duration::from_secs(30))
            .connect()
            .await?;

        let client = GreeterClient::new(channel);

        Ok(AiServiceClient { client })
    }

    // Example method to call the gRPC service
    pub async fn say_hello(&mut self, name: String) -> Result<String, tonic::Status> {
        let request = tonic::Request::new(HelloRequest { name });
        let response = self.client.say_hello(request).await?;
        Ok(response.into_inner().message)
    }

    pub async fn get_embedding(&mut self, _text: String) -> Result<Vec<f32>, tonic::Status> {
        // This is where you'd call your actual EmbeddingService client
        // e.g., let request = tonic::Request::new(EmbeddingRequest { text });
        // let response = self.client.generate_embedding(request).await?.into_inner();
        // Ok(response.embedding_vector)
        let simulated_embedding = vec![1.0, 2.0, 3.0, 4.0, 5.0]; // Replace with actual embedding
        Ok(simulated_embedding)
    }
    pub async fn read_file(&mut self) -> Result<Vec<FireEvent>, tonic::Status> {
        // Simulate reading a file and returning its content
        // In a real scenario, you would read the file from disk or another source
        let file = File::open("data.csv")?;
        let mut rdr = csv::Reader::from_reader(file);
        let mut count = 0;
        let mut events: Vec<FireEvent> = Vec::new();

        for result in rdr.deserialize() {
            let record: Firms = result.map_err(|e| tonic::Status::internal(format!("Failed to deserialize record: {}", e)))?;

            if let Some(event) = record.to_fire_event() {
                count += 1;
                events.push(event);
            }
        }
        tracing::debug!("Read {} events from file", count);
        Ok(events)
    }
}