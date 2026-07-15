export type DataSource = "airplanes.live" | "adsb.fi";

export type AircraftCategory =
  | "landplane"
  | "seaplane"
  | "amphibian"
  | "helicopter"
  | "gyrocopter"
  | "tiltrotor"
  | "balloon"
  | "drone"
  | "unknown";

export interface Aircraft {
  id: string;
  hex: string;
  callsign?: string;
  registration?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  groundSpeed?: number;
  verticalRate?: number;
  heading?: number;
  squawk?: string;
  category?: AircraftCategory;
  aircraftType?: string;
  manufacturer?: string;
  model?: string;
  airline?: string;
  origin?: string;
  destination?: string;
  onGround?: boolean;
  emergency?: boolean;
  source: DataSource;
  lastUpdated: string;
}

export interface AircraftMetadata {
  hex?: string;
  registration?: string;
  manufacturer?: string;
  model?: string;
  type?: string;
  airline?: string;
  owner?: string;
  builtYear?: number;
  engines?: number;
  category?: AircraftCategory;
}

export interface Airport {
  icao?: string;
  iata?: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface SearchResults {
  aircraft: Aircraft[];
  flights: Aircraft[];
  airports: Airport[];
  cities: Airport[];
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface AircraftFilters {
  minAltitude: number;
  maxAltitude: number;
  minGroundSpeed: number;
  maxGroundSpeed: number;
  airlines: string[];
  aircraftTypes: string[];
  onGround: boolean | null;
  military: boolean | null;
  emergency: boolean | null;
  sources: DataSource[];
  callsignQuery: string;
}

export interface AircraftDetailResponse {
  aircraft: Aircraft;
  metadata?: AircraftMetadata;
  fetchedAt: string;
}

export interface ProviderStatus {
  source: DataSource | "adsbdb";
  ok: boolean;
  count: number;
  error?: string;
}
