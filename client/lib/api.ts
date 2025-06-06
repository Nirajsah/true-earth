// client/lib/api.ts
import type { FireEvent, WeatherEvent, FloodEvent, ElNinoLaNinaData, TemperatureData, PopulationDensity, ForestCover, Deforestation, PollutionData, ClimatePatternChange } from "../types/api";

const API_BASE_URL = "http://127.0.0.1:3000";

export const fetchFireEvents = async (): Promise<FireEvent[]> => {
  const response = await fetch(`${API_BASE_URL}/fire_events`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchExtremeWeatherEvents = async (): Promise<WeatherEvent[]> => {
  const response = await fetch(`${API_BASE_URL}/extreme_weather_events`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchFloodEvents = async (): Promise<FloodEvent[]> => {
  const response = await fetch(`${API_BASE_URL}/flood_events`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchElNinoLaNinaData = async (): Promise<ElNinoLaNinaData[]> => {
  const response = await fetch(`${API_BASE_URL}/el_nino_la_nina_data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchTemperatureData = async (): Promise<TemperatureData[]> => {
  const response = await fetch(`${API_BASE_URL}/temperature_data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchPopulationDensity = async (): Promise<PopulationDensity[]> => {
  const response = await fetch(`${API_BASE_URL}/population_density`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchForestCover = async (): Promise<ForestCover[]> => {
  const response = await fetch(`${API_BASE_URL}/forest_cover`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchDeforestationData = async (): Promise<Deforestation[]> => {
  const response = await fetch(`${API_BASE_URL}/deforestation_data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchPollutionData = async (): Promise<PollutionData[]> => {
  const response = await fetch(`${API_BASE_URL}/pollution_data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchClimatePatternChanges = async (): Promise<ClimatePatternChange[]> => {
  const response = await fetch(`${API_BASE_URL}/climate_pattern_changes`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}; 