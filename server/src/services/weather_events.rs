// services/weather_events.rs
use crate::models::weather_events::{WeatherEvent, FloodEvent, ElNinoLaNinaData};

pub async fn fetch_extreme_weather_events() -> Result<Vec<WeatherEvent>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        WeatherEvent {
            event_type: "Hurricane".to_string(),
            description: "Category 5 hurricane hitting the coast.".to_string(),
            date: "2025-09-10".to_string(),
            location: "Florida, USA".to_string(),
            severity: "Extreme".to_string(),
            confidence: Some(95),
        },
        WeatherEvent {
            event_type: "Drought".to_string(),
            description: "Severe drought affecting agricultural regions.".to_string(),
            date: "2025-07-01".to_string(),
            location: "California, USA".to_string(),
            severity: "High".to_string(),
            confidence: Some(80),
        },
    ];
    Ok(dummy_data)
}

pub async fn fetch_flood_events() -> Result<Vec<FloodEvent>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        FloodEvent {
            location: "Louisiana, USA".to_string(),
            date: "2025-08-15".to_string(),
            depth_cm: 150.0,
            affected_area_sqkm: 500.0,
            confidence: Some(85),
        },
    ];
    Ok(dummy_data)
}

pub async fn fetch_el_nino_la_nina_data() -> Result<Vec<ElNinoLaNinaData>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        ElNinoLaNinaData {
            year: 2024,
            status: "El Nino".to_string(),
            description: "Strong El Nino event causing global weather disruptions.".to_string(),
        },
    ];
    Ok(dummy_data)
} 