/**
 * Core domain types shared across server providers, API routes, and the client.
 */

/** Lower-case provider id; used as a stable tag on every normalized aircraft. */
export type ProviderId = "airplanes.live" | "adsb.fi";

/** Normalized, provider-agnostic representation of a live aircraft. */
export interface Aircraft {
  /** Stable internal id (provider prefix + icao hex). */
  id: string;
  /** ICAO 24-bit transponder address, lower-case hex (e.g. "a92145"). */
  hex: string;
  callsign?: string;
  registration?: string;
  latitude: number;
  longitude: number;
  /** Barometric altitude in feet. */
  altitude?: number;
  /** Ground speed in knots. */
  groundSpeed?: number;
  /** Vertical rate in feet/minute (positive = climbing). */
  verticalRate?: number;
  /** True track/heading in degrees. */
  heading?: number;
  squawk?: string;
  /**
   * ICAO emitter category, e.g. "A1" (light) .. "A7" (heavy), "B1" glider, etc.
   * See ADS-B category codes.
   */
  category?: string;
  /** ICAO type designator, e.g. "B752". */
  aircraftType?: string;
  manufacturer?: string;
  model?: string;
  airline?: string;
  origin?: string;
  destination?: string;
  /** True when the aircraft reports it is on the ground. */
  onGround?: boolean;
  /** Non-"none" emergency flag from the transponder. */
  emergency?: string;
  source: ProviderId;
  lastUpdated: string;
}

/** ADS-B category groups used for coloring and filtering. */
export type CategoryGroup =
  | "light"
  | "small"
  | "large"
  | "heavy"
  | "rotor"
  | "glider"
  | "uav"
  | "ground-vehicle"
  | "tower"
  | "unknown";

/** A bounding box in WGS84 degrees. */
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/** Aircraft details enriched with ADSBDB metadata + photo. */
export interface AircraftDetails extends Aircraft {
  photo?: string;
  country?: string;
  airlineIcao?: string;
  airlineIata?: string;
}

/** Minimal airport model used for markers, search and the airport panel. */
export interface Airport {
  icao: string;
  iata?: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  size: "large" | "medium" | "small";
}

/** Discriminated search-result union. */
export type SearchResult =
  | {
      type: "aircraft";
      id: string;
      hex: string;
      label: string;
      sublabel?: string;
      latitude?: number;
      longitude?: number;
    }
  | {
      type: "airport";
      icao: string;
      iata?: string;
      name: string;
      city: string;
      country: string;
      latitude: number;
      longitude: number;
    };

/** Live status reported alongside each aircraft response. */
export interface LiveStatus {
  source: ProviderId | "none";
  /** Total aircraft returned for the viewport. */
  total: number;
  /** ISO timestamp of the most recent successful fetch. */
  lastUpdated: string | null;
  /** True when the data is older than the freshness threshold. */
  stale: boolean;
  /** Set when all providers failed for the most recent request. */
  error?: LiveError | null;
}

export type LiveError =
  | "rate-limited"
  | "provider-unavailable"
  | "network"
  | "timeout";

/** Shape of the viewport aircraft API response. */
export interface AircraftResponse {
  aircraft: Aircraft[];
  status: LiveStatus;
}

/** Shape of the search API response. */
export interface SearchResponse {
  results: SearchResult[];
}

/** Shape of the details API response. */
export interface AircraftDetailsResponse {
  aircraft: AircraftDetails | null;
  status: LiveStatus;
}

/** Color-by modes the user can select in settings. */
export type ColorMode = "default" | "altitude" | "category" | "airline";

/** Client-side user settings persisted to localStorage. */
export interface UserSettings {
  colorMode: ColorMode;
  refreshIntervalMs: number;
  showAirports: boolean;
  showLabels: boolean;
  reduceMotion: boolean;
  /** Manual override; null = follow system. */
  labelVisibilityThreshold: number;
}

/** Persistent favorite aircraft entries. */
export interface FavoriteAircraft {
  hex: string;
  label: string;
  addedAt: number;
}
