// services/pollution.rs
use crate::models::pollution::PollutionData;

pub async fn fetch_pollution_data() -> Result<Vec<PollutionData>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        PollutionData {
            location: "New Delhi, India".to_string(),
            date: "2024-06-01".to_string(),
            pollutant: "PM2.5".to_string(),
            level: 120.5,
            unit: "µg/m³".to_string(),
            country: Some("India".to_string()),
            state_province: Some("Delhi".to_string()),
            aqi: Some(180),
        },
        PollutionData {
            location: "Los Angeles, USA".to_string(),
            date: "2024-06-01".to_string(),
            pollutant: "O3".to_string(),
            level: 80.2,
            unit: "ppb".to_string(),
            country: Some("USA".to_string()),
            state_province: Some("California".to_string()),
            aqi: Some(110),
        },
    ];
    Ok(dummy_data)
} 