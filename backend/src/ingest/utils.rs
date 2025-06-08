use once_cell::sync::Lazy;
use rstar::RTree;
use std::fs;
use std::io;
use std::io::Read;

use crate::models::firms::CountryBoundary;
use crate::models::firms::Firms;

pub static ALL_COUNTRY_BOUNDARIES: Lazy<Result<RTree<CountryBoundary>, Box<dyn std::error::Error + Send + Sync>>> =
    Lazy::new(|| {
        let geojson_file_path = "custom.geo.json";
        load_country_boundaries(geojson_file_path)
    });

pub fn load_country_boundaries(geojson_path: &str) -> Result<RTree<CountryBoundary>, Box<dyn std::error::Error + Send + Sync>> {
    let mut file = fs::File::open(geojson_path)
        .map_err(|e| format!("Failed to open {}: {}", geojson_path, e))?;

    let mut json_str = String::new();

    file.read_to_string(&mut json_str)
        .map_err(|e| format!("Failed to read {}: {}", geojson_path, e))?;

    let geo_json: geojson::GeoJson = serde_json::from_str(&json_str)
        .map_err(|e| format!("Failed to parse GeoJSON from {}: {}", geojson_path, e))?;


    let mut parsed_countries_vec = Vec::new(); // Temporary vector to collect parsed CountryBoundary objects

    if let geojson::GeoJson::FeatureCollection(collection) = geo_json {
        for feature in collection.features {
            if let Some(geometry) = feature.geometry {
                if let Some(properties) = feature.properties {
                    let country_name_key = "name";
                    if let Some(name_value) = properties.get(country_name_key) {
                        if let Some(name) = name_value.as_str() {
                            match geometry.value {
                                geojson::Value::Polygon(poly_coords) => {
                                    let outer_ring_coords: Vec<[f64; 2]> = poly_coords[0].iter()
                                        .map(|coord_vec| [coord_vec[0], coord_vec[1]])
                                        .collect();
                                    let interior_rings: Vec<geo::LineString> = poly_coords[1..].iter()
                                        .map(|ls_coords| {
                                            let ls_fixed_coords: Vec<[f64; 2]> = ls_coords.iter()
                                                .map(|coord_vec| [coord_vec[0], coord_vec[1]])
                                                .collect();
                                            geo::LineString::from(ls_fixed_coords)
                                        })
                                        .collect();

                                    let polygon = geo::Polygon::new(
                                        geo::LineString::from(outer_ring_coords),
                                        interior_rings,
                                    );
                                    parsed_countries_vec.push(CountryBoundary { name: name.to_string(), polygon });
                                },
                                geojson::Value::MultiPolygon(multi_poly_coords) => {
                                    for poly_coords in multi_poly_coords {
                                        let outer_ring_coords: Vec<[f64; 2]> = poly_coords[0].iter()
                                            .map(|coord_vec| [coord_vec[0], coord_vec[1]])
                                            .collect();
                                        let interior_rings: Vec<geo::LineString> = poly_coords[1..].iter()
                                            .map(|ls_coords| {
                                                let ls_fixed_coords: Vec<[f64; 2]> = ls_coords.iter()
                                                    .map(|coord_vec| [coord_vec[0], coord_vec[1]])
                                                    .collect();
                                                geo::LineString::from(ls_fixed_coords)
                                            })
                                            .collect();

                                        let polygon = geo::Polygon::new(
                                            geo::LineString::from(outer_ring_coords),
                                            interior_rings,
                                        );
                                        parsed_countries_vec.push(CountryBoundary { name: name.to_string(), polygon });
                                    }
                                },
                                _ => {
                                    eprintln!("Warning: Skipping unsupported geometry type for country: {:?}", geometry.value);
                                }
                            }
                        }
                    } else {
                        eprintln!("Warning: Feature without '{}' property found, skipping.", country_name_key);
                    }
                } else {
                    eprintln!("Warning: Feature without properties found, skipping.");
                }
            } else {
                eprintln!("Warning: Feature without geometry found, skipping.");
            }
        }
    } else {
        return Err(Box::new(io::Error::new(io::ErrorKind::InvalidData, "GeoJSON file is not a FeatureCollection")));
    }

    // Build the RTree from the collected CountryBoundary objects
    Ok(RTree::bulk_load(parsed_countries_vec))
}
