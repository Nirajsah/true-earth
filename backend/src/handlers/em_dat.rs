// Temporary file for handling EM-DAT disaster records
use std::fs::File;
use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

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

#[axum::debug_handler]
pub async fn get_em_dat_events() -> impl IntoResponse {
    match File::open("disaster_data_output/all_disaster_records.json") {
        Ok(file) => {
            let rdr = std::io::BufReader::new(file);
            match serde_json::from_reader::<_, Vec<DisasterRecord>>(rdr) {
                Ok(em_dat_events) => Json(em_dat_events).into_response(),
                Err(e) => (
                    axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Failed to parse JSON: {}", e)
                ).into_response(),
            }
        }
        Err(e) => (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to open file: {}", e)
        ).into_response(),
    }
}
