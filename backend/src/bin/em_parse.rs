use calamine::{DataType, Reader, open_workbook_auto};
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::str::FromStr;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
#[serde(rename_all = "PascalCase")]
pub enum DisasterType {
    Drought,
    Flood,
    #[serde(rename = "Extreme Temperature")]
    ExtremeTemperature,
    Earthquake,
    Wildfire,
    #[serde(rename = "Mass Movement (wet)")]
    MassMovementWet,
    #[serde(rename = "Volcanic activity")]
    VolcanicActivity,
    #[serde(rename = "Mass movement (dry)")]
    MassMovementDry,
    #[serde(rename = "Glacial lake outburst")]
    GlacialLakeOutburst,
    Storm,

    #[serde(other)]
    Other,
}

impl FromStr for DisasterType {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "drought" => Ok(DisasterType::Drought),
            "flood" => Ok(DisasterType::Flood),
            "extreme temperature" => Ok(DisasterType::ExtremeTemperature),
            "earthquake" => Ok(DisasterType::Earthquake),
            "wildfire" => Ok(DisasterType::Wildfire),
            "mass movement (wet)" => Ok(DisasterType::MassMovementWet),
            "volcanic activity" => Ok(DisasterType::VolcanicActivity),
            "mass movement (dry)" => Ok(DisasterType::MassMovementDry),
            "glacial lake outburst" => Ok(DisasterType::GlacialLakeOutburst),
            "storm" => Ok(DisasterType::Storm),
            _ => Ok(DisasterType::Other), // Default case
        }
    }
}

impl Into<String> for DisasterType {
    fn into(self) -> String {
        match self {
            DisasterType::Drought => "Drought".to_string(),
            DisasterType::Flood => "Flood".to_string(),
            DisasterType::ExtremeTemperature => "Extreme Temperature".to_string(),
            DisasterType::Earthquake => "Earthquake".to_string(),
            DisasterType::Wildfire => "Wildfire".to_string(),
            DisasterType::MassMovementWet => "Mass Movement (wet)".to_string(),
            DisasterType::VolcanicActivity => "Volcanic activity".to_string(),
            DisasterType::MassMovementDry => "Mass movement (dry)".to_string(),
            DisasterType::GlacialLakeOutburst => "Glacial lake outburst".to_string(),
            DisasterType::Storm => "Storm".to_string(),
            DisasterType::Other => "Other".to_string(), // Default case
        }
    }
}

impl ToString for DisasterType {
    fn to_string(&self) -> String {
        match self {
            DisasterType::Drought => "Drought".to_string(),
            DisasterType::Flood => "Flood".to_string(),
            DisasterType::ExtremeTemperature => "Extreme Temperature".to_string(),
            DisasterType::Earthquake => "Earthquake".to_string(),
            DisasterType::Wildfire => "Wildfire".to_string(),
            DisasterType::MassMovementWet => "Mass Movement (wet)".to_string(),
            DisasterType::VolcanicActivity => "Volcanic activity".to_string(),
            DisasterType::MassMovementDry => "Mass movement (dry)".to_string(),
            DisasterType::GlacialLakeOutburst => "Glacial lake outburst".to_string(),
            DisasterType::Storm => "Storm".to_string(),
            DisasterType::Other => "Other".to_string(), // Default case
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DisasterRecord {
    #[serde(rename = "Disaster Group")]
    pub disaster_group: Option<String>,

    #[serde(rename = "Disaster Type")]
    pub disaster_type: Option<String>, // This is the key for grouping

    #[serde(rename = "Country")]
    pub country: Option<String>,

    #[serde(rename = "Location")]
    pub location: Option<String>,

    #[serde(rename = "Origin")]
    pub origin: Option<String>,

    #[serde(rename = "OFDA/BHA Response")]
    pub ofda_bha_response: Option<String>,

    #[serde(rename = "Appeal")]
    pub appeal: Option<String>,

    #[serde(rename = "Declaration")]
    pub declaration: Option<String>,

    #[serde(rename = "AID Contribution ('000 US$)")]
    pub aid_contribution_usd_000: Option<f32>,

    #[serde(rename = "Magnitude")]
    pub magnitude: Option<f32>,

    #[serde(rename = "Magnitude Scale")]
    pub magnitude_scale: Option<String>,

    #[serde(rename = "River Basin")]
    pub river_basin: Option<String>,

    #[serde(rename = "Start Year")]
    pub start_year: Option<u16>,

    #[serde(rename = "Start Month")]
    pub start_month: Option<u8>,

    #[serde(rename = "Start Day")]
    pub start_day: Option<u8>,

    #[serde(rename = "End Year")]
    pub end_year: Option<u16>,

    #[serde(rename = "End Month")]
    pub end_month: Option<u8>,

    #[serde(rename = "End Day")]
    pub end_day: Option<u8>,

    #[serde(rename = "Total Deaths")]
    pub total_deaths: Option<u32>,

    #[serde(rename = "No. Injured")]
    pub injured: Option<u32>,

    #[serde(rename = "No. Affected")]
    pub affected: Option<u32>,

    #[serde(rename = "No. Homeless")]
    pub homeless: Option<u32>,

    #[serde(rename = "Total Affected")]
    pub total_affected: Option<u32>,

    #[serde(rename = "Reconstruction Costs ('000 US$)")]
    pub reconstruction_cost_usd_000: Option<f64>,

    #[serde(rename = "Reconstruction Costs, Adjusted ('000 US$)")]
    pub reconstruction_cost_adjusted_usd_000: Option<f64>,

    #[serde(rename = "Insured Damage ('000 US$)")]
    pub insured_damage_usd_000: Option<f64>,

    #[serde(rename = "Insured Damage, Adjusted ('000 US$)")]
    pub insured_damage_adjusted_usd_000: Option<f64>,

    #[serde(rename = "Total Damage ('000 US$)")]
    pub total_damage_usd_000: Option<f64>,

    #[serde(rename = "Total Damage, Adjusted ('000 US$)")]
    pub total_damage_adjusted_usd_000: Option<f64>,

    #[serde(rename = "CPI")]
    pub cpi: Option<f32>,
}

pub fn process_disaster_data(
    input_filepath: &Path,
    output_dir_name: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting to process file: {:?}", input_filepath);

    // 1. Create the output directory
    let output_dir = PathBuf::from(output_dir_name);
    fs::create_dir_all(&output_dir)?;
    println!("Created output directory: {:?}", output_dir);

    // 2. Open the workbook
    let mut workbook = open_workbook_auto(input_filepath)?;
    let sheet_name = workbook
        .sheet_names()
        .first()
        .ok_or("No sheets found in workbook")?
        .clone();
    let range = workbook
        .worksheet_range(&sheet_name)
        .ok_or(format!("Could not find sheet '{}'", sheet_name))??;

    let mut records_by_disaster_type: HashMap<DisasterType, Vec<DisasterRecord>> = HashMap::new();

    // Get the header row to map column names to indices
    let header_row: Vec<String> = range
        .rows()
        .next()
        .ok_or("No header row found")?
        .iter()
        .map(|cell| cell.to_string())
        .collect();

    let mut records = Vec::new();

    // Iterate over rows, skipping the header
    for (row_idx, row) in range.rows().skip(1).enumerate() {
        // Create a temporary HashMap for the current row's data
        let mut row_map: HashMap<String, DataType> = HashMap::new();
        for (col_idx, cell) in row.iter().enumerate() {
            if let Some(header) = header_row.get(col_idx) {
                row_map.insert(header.clone(), cell.clone());
            }
        }

        let disaster_type: DisasterType = row_map
            .get("Disaster Type")
            .and_then(|d| d.as_string())
            .map(|s| DisasterType::from_str(s.as_str()).unwrap_or(DisasterType::Other))
            .unwrap_or(DisasterType::Other); // Default to "Other" if type is missing

        let record = DisasterRecord {
            disaster_group: row_map.get("Disaster Group").and_then(|d| d.as_string()),
            disaster_type: Some(disaster_type.to_string()), // Use the extracted disaster_type
            country: row_map.get("Country").and_then(|d| d.as_string()),
            location: row_map.get("Location").and_then(|d| d.as_string()),
            origin: row_map.get("Origin").and_then(|d| d.as_string()),
            ofda_bha_response: row_map.get("OFDA/BHA Response").and_then(|d| d.as_string()),
            appeal: row_map.get("Appeal").and_then(|d| d.as_string()),
            declaration: row_map.get("Declaration").and_then(|d| d.as_string()),
            aid_contribution_usd_000: row_map
                .get("AID Contribution ('000 US$)")
                .and_then(|d| d.as_f64())
                .map(|v| v as f32),
            magnitude: row_map
                .get("Magnitude")
                .and_then(|d| d.as_f64())
                .map(|v| v as f32),
            magnitude_scale: row_map.get("Magnitude Scale").and_then(|d| d.as_string()),
            river_basin: row_map.get("River Basin").and_then(|d| d.as_string()),
            start_year: row_map
                .get("Start Year")
                .and_then(|d| d.as_f64())
                .map(|v| v as u16),
            start_month: row_map
                .get("Start Month")
                .and_then(|d| d.as_f64())
                .map(|v| v as u8),
            start_day: row_map
                .get("Start Day")
                .and_then(|d| d.as_f64())
                .map(|v| v as u8),
            end_year: row_map
                .get("End Year")
                .and_then(|d| d.as_f64())
                .map(|v| v as u16),
            end_month: row_map
                .get("End Month")
                .and_then(|d| d.as_f64())
                .map(|v| v as u8),
            end_day: row_map
                .get("End Day")
                .and_then(|d| d.as_f64())
                .map(|v| v as u8),
            total_deaths: row_map
                .get("Total Deaths")
                .and_then(|d| d.as_f64())
                .map(|v| v as u32),
            injured: row_map
                .get("No. Injured")
                .and_then(|d| d.as_f64())
                .map(|v| v as u32),
            affected: row_map
                .get("No. Affected")
                .and_then(|d| d.as_f64())
                .map(|v| v as u32),
            homeless: row_map
                .get("No. Homeless")
                .and_then(|d| d.as_f64())
                .map(|v| v as u32),
            total_affected: row_map
                .get("Total Affected")
                .and_then(|d| d.as_f64())
                .map(|v| v as u32),
            reconstruction_cost_usd_000: row_map
                .get("Reconstruction Costs ('000 US$)")
                .and_then(|d| d.as_f64()),
            reconstruction_cost_adjusted_usd_000: row_map
                .get("Reconstruction Costs, Adjusted ('000 US$)")
                .and_then(|d| d.as_f64()),
            insured_damage_usd_000: row_map
                .get("Insured Damage ('000 US$)")
                .and_then(|d| d.as_f64()),
            insured_damage_adjusted_usd_000: row_map
                .get("Insured Damage, Adjusted ('000 US$)")
                .and_then(|d| d.as_f64()),
            total_damage_usd_000: row_map
                .get("Total Damage ('000 US$)")
                .and_then(|d| d.as_f64()),
            total_damage_adjusted_usd_000: row_map
                .get("Total Damage, Adjusted ('000 US$)")
                .and_then(|d| d.as_f64()),
            cpi: row_map
                .get("CPI")
                .and_then(|d| d.as_f64())
                .map(|v| v as f32),
        };

        records.push(record);
    }
    // Write all records to a single JSON file
    let all_records_filename = "all_disaster_records.json";
    let all_records_filepath = output_dir.join(all_records_filename);
    println!(
        "Writing all records to {:?} with {} total records",
        all_records_filepath,
        records.len()
    );
    let all_json_string = serde_json::to_string_pretty(&records)?;
    let mut all_file = fs::File::create(&all_records_filepath)?;
    all_file.write_all(all_json_string.as_bytes())?;
    println!("All records written to {:?}", all_records_filepath);
    Ok(())
}

// Example of how to use this function in your main.rs
fn main() {
    let input_file = PathBuf::from("disaster.xlsx"); // <-- **CHANGE THIS PATH**
    let output_folder = "disaster_data_output";

    match process_disaster_data(&input_file, output_folder) {
        Ok(_) => println!("Successfully processed disaster data!"),
        Err(e) => eprintln!("Error processing disaster data: {}", e),
    }
}
