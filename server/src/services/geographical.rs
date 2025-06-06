// services/geographical.rs
use crate::models::geographical::{TemperatureData, PopulationDensity, ForestCover, Deforestation};

pub async fn fetch_temperature_data() -> Result<Vec<TemperatureData>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        TemperatureData {
            location: "Global".to_string(),
            date: "2025-01-01".to_string(),
            average_temperature_celsius: 15.0,
            min_temperature_celsius: Some(-50.0),
            max_temperature_celsius: Some(50.0),
            country: None,
            state_province: None,
            global_average: Some(15.0),
        },
        TemperatureData {
            location: "California, USA".to_string(),
            date: "2025-07-15".to_string(),
            average_temperature_celsius: 28.0,
            min_temperature_celsius: Some(15.0),
            max_temperature_celsius: Some(40.0),
            country: Some("USA".to_string()),
            state_province: Some("California".to_string()),
            global_average: None,
        },
    ];
    Ok(dummy_data)
}

pub async fn fetch_population_density() -> Result<Vec<PopulationDensity>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        PopulationDensity {
            location: "Mumbai, India".to_string(),
            year: 2024,
            density_per_sqkm: 32300.0,
            country: Some("India".to_string()),
            state_province: Some("Maharashtra".to_string()),
        },
    ];
    Ok(dummy_data)
}

pub async fn fetch_forest_cover() -> Result<Vec<ForestCover>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        ForestCover {
            location: "Amazon Rainforest".to_string(),
            year: 2020,
            forest_area_sqkm: 5_500_000.0,
            percentage_of_land_area: 80.0,
            past_data: Some(vec![
                ForestCover {
                    location: "Amazon Rainforest".to_string(),
                    year: 1990,
                    forest_area_sqkm: 6_000_000.0,
                    percentage_of_land_area: 90.0,
                    past_data: None,
                },
            ]),
        },
    ];
    Ok(dummy_data)
}

pub async fn fetch_deforestation_data() -> Result<Vec<Deforestation>, String> {
    // Dummy data for demonstration
    let dummy_data = vec![
        Deforestation {
            region: "Amazon".to_string(),
            year: 2023,
            deforested_area_sqkm: 10_000.0,
            cause: Some("Agriculture".to_string()),
        },
    ];
    Ok(dummy_data)
} 