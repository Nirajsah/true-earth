export interface FireEvent {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: number;
  version: string;
  bright_t31: number;
  frp: number;
  daynight: string;
}

export interface WeatherEvent {
  event_type: string;
  description: string;
  date: string;
  location: string;
  severity: string;
  confidence?: number;
}

export interface FloodEvent {
  location: string;
  date: string;
  depth_cm: number;
  affected_area_sqkm: number;
  confidence?: number;
}

export interface ElNinoLaNinaData {
  year: number;
  status: string;
  description: string;
}

export interface TemperatureData {
  location: string;
  date: string;
  average_temperature_celsius: number;
  min_temperature_celsius?: number;
  max_temperature_celsius?: number;
  country?: string;
  state_province?: string;
  global_average?: number;
}

export interface PopulationDensity {
  location: string;
  year: number;
  density_per_sqkm: number;
  country?: string;
  state_province?: string;
}

export interface ForestCover {
  location: string;
  year: number;
  forest_area_sqkm: number;
  percentage_of_land_area: number;
  past_data?: ForestCover[];
}

export interface Deforestation {
  region: string;
  year: number;
  deforested_area_sqkm: number;
  cause?: string;
}

export interface PollutionData {
  location: string;
  date: string;
  pollutant: string;
  level: number;
  unit: string;
  country?: string;
  state_province?: string;
  aqi?: number;
}

export interface ClimatePatternChange {
  region: string;
  start_year: number;
  end_year: number;
  description: string;
  temperature_change_celsius?: number;
  rainfall_change_mm?: number;
  humidity_change_percent?: number;
} 