// services/firms.rs
use crate::models::firms::Firms;

// This function would interact with the actual FIRMS API.
// For now, it returns dummy data.
pub async fn fetch_firms_data() -> Result<Vec<Firms>, String> {
    // In a real application, you would make an HTTP request here
    // to the FIRMS API and parse the JSON response.
    // Example using reqwest:
    // let client = reqwest::Client::new();
    // let res = client.get("FIRMS_API_ENDPOINT").send().await.map_err(|e| e.to_string())?;
    // let body = res.text().await.map_err(|e| e.to_string())?;
    // let fire_events: Vec<FireEvent> = serde_json::from_str(&body).map_err(|e| e.to_string())?;

    // Dummy data for demonstration
    let dummy_data = vec![
        Firms {
            latitude: -12.91115,
            longitude: 133.40683,
            brightness: 313.26,
            scan: 1.12,
            track: 1.05,
            acq_date: "2025-05-17".to_string(),
            acq_time: "0033".to_string(),
            satellite: "T".to_string(),
            confidence: 70,
            version: "6.1NRT".to_string(),
            bright_t31: 296.2,
            frp: 8.2,
            daynight: "D".to_string(),
        },
        Firms {
            latitude: -15.000,
            longitude: 130.000,
            brightness: 300.0,
            scan: 1.0,
            track: 1.0,
            acq_date: "2025-05-18".to_string(),
            acq_time: "1200".to_string(),
            satellite: "A".to_string(),
            confidence: 40,
            version: "6.1NRT".to_string(),
            bright_t31: 290.0,
            frp: 5.0,
            daynight: "N".to_string(),
        },
    ];

    // Filter data based on confidence (as per README.md)
    let filtered_data = dummy_data
        .into_iter()
        .filter(|event| event.confidence >= 50) // Example threshold
        .collect();

    Ok(filtered_data)
} 