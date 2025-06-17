// Temporary file for handling EM-DAT disaster records
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
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

    pub text: Option<String>,

    pub text_embedding: Option<Vec<f32>>,
}

impl DisasterRecord {
    /// Generate a rich, natural-language summary for embeddings.
    pub fn to_text(&mut self) -> String {
        let mut text = String::new();

        if let Some(d_group) = &self.disaster_group {
            text.push_str(&format!(
                "This event belongs to the '{}' disaster group. ",
                d_group
            ));
        }

        if let Some(d_type) = &self.disaster_type {
            text.push_str(&format!(
                "It is classified as a '{}' type disaster. ",
                d_type
            ));
        }

        if let Some(country) = &self.country {
            text.push_str(&format!("The affected country is {}. ", country));
        }

        if let Some(location) = &self.location {
            text.push_str(&format!(
                "More specifically, it impacted the area around {}. ",
                location
            ));
        }

        if let Some(origin) = &self.origin {
            text.push_str(&format!("The disaster originated due to {}. ", origin));
        }

        if let Some(response) = &self.ofda_bha_response {
            text.push_str(&format!("OFDA/BHA provided a response: {}. ", response));
        }

        if let Some(appeal) = &self.appeal {
            text.push_str(&format!("An appeal was issued: {}. ", appeal));
        }

        if let Some(declaration) = &self.declaration {
            text.push_str(&format!("A declaration was made: {}. ", declaration));
        }

        if let Some(contribution) = &self.aid_contribution_usd_000 {
            text.push_str(&format!(
                "Approximately ${} thousand USD was contributed as aid. ",
                contribution
            ));
        }

        if let Some(magnitude) = &self.magnitude {
            let scale = self.magnitude_scale.as_deref().unwrap_or("unknown scale");
            text.push_str(&format!(
                "The recorded magnitude was {:.1} on the {}. ",
                magnitude, scale
            ));
        }

        if let Some(river) = &self.river_basin {
            text.push_str(&format!("The river basin involved is {}. ", river));
        }

        // Describe event duration
        if self.start_year.is_some() || self.end_year.is_some() {
            let start_date = format!(
                "{}-{:02}-{:02}",
                self.start_year.unwrap_or(0),
                self.start_month.unwrap_or(1),
                self.start_day.unwrap_or(1)
            );
            let end_date = format!(
                "{}-{:02}-{:02}",
                self.end_year.unwrap_or(0),
                self.end_month.unwrap_or(1),
                self.end_day.unwrap_or(1)
            );
            text.push_str(&format!(
                "The disaster occurred from {} to {}. ",
                start_date, end_date
            ));
        }

        if let Some(deaths) = &self.total_deaths {
            text.push_str(&format!(
                "Tragically, around {} people lost their lives. ",
                deaths
            ));
        }

        if let Some(injured) = &self.injured {
            text.push_str(&format!("About {} people were injured. ", injured));
        }

        if let Some(affected) = &self.affected {
            text.push_str(&format!(
                "An estimated {} individuals were directly affected. ",
                affected
            ));
        }

        if let Some(homeless) = &self.homeless {
            text.push_str(&format!(
                "Approximately {} people were left homeless. ",
                homeless
            ));
        }

        if let Some(total_affected) = &self.total_affected {
            text.push_str(&format!(
                "In total, the disaster impacted around {} people. ",
                total_affected
            ));
        }

        if let Some(recon_cost) = &self.reconstruction_cost_usd_000 {
            text.push_str(&format!(
                "The reconstruction costs were estimated at ${} thousand USD. ",
                recon_cost
            ));
        }

        if let Some(ins_damage) = &self.insured_damage_usd_000 {
            text.push_str(&format!(
                "Insured damages amounted to about ${} thousand USD. ",
                ins_damage
            ));
        }

        if let Some(total_damage) = &self.total_damage_usd_000 {
            text.push_str(&format!(
                "The total damage caused by this disaster was approximately ${} thousand USD. ",
                total_damage
            ));
        }

        if let Some(cpi) = &self.cpi {
            text.push_str(&format!(
                "At the time of the disaster, the Consumer Price Index (CPI) was {:.2}. ",
                cpi
            ));
        }

        if let Some(existing) = &self.text {
            text.push_str(&format!("Additional remarks: {} ", existing));
        }

        text.push_str(
            "This summary provides an overview of the disaster's nature, impact, and economic consequences to aid in understanding and response planning."
        );

        self.text = Some(text.clone());
        text
    }
}
