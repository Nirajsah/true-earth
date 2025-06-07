// services/climate.rs
use crate::models::climate::ClimatePatternChange;

pub async fn fetch_climate_pattern_changes() -> Result<Vec<ClimatePatternChange>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        ClimatePatternChange {
            region: "Global".to_string(),
            start_year: 1990,
            end_year: 2020,
            description: "Average global temperature increase of 0.8°C.".to_string(),
            temperature_change_celsius: Some(0.8),
            rainfall_change_mm: Some(15.0),
            humidity_change_percent: Some(2.0),
        },
        ClimatePatternChange {
            region: "Arctic".to_string(),
            start_year: 2000,
            end_year: 2023,
            description: "Significant ice melt and permafrost thawing.".to_string(),
            temperature_change_celsius: Some(2.5),
            rainfall_change_mm: None,
            humidity_change_percent: None,
        },
    ];
    Ok(dummy_data)
} 