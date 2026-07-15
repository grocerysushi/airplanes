import { SERVER_CONFIG } from "../server-config";
import { TtlCache } from "../cache";

/**
 * ADSBDB provider client — aircraft and airline metadata.
 * Reference: https://api.adsbdb.com/docs
 *
 *   GET /v0/aircraft/{registration | modeS}   (modeS is case-insensitive hex)
 *   GET /v0/airline/{icao}
 */
export interface AdsbdbAircraft {
  type?: string;
  icao_type?: string;
  manufacturer?: string;
  mode_s?: string;
  registration?: string;
  registered_owner_country_iso_name?: string;
  registered_owner_country_name?: string;
  registered_owner_operator_flag_code?: string;
  registered_owner?: string;
  url_photo?: string;
  url_photo_thumbnail?: string;
}

export interface AdsbdbAircraftResponse {
  response?: {
    aircraft?: AdsbdbAircraft;
  };
}

export interface AdsbdbAirline {
  name?: string;
  icao?: string;
  iata?: string;
  country?: string;
  country_iso?: string;
  callsign?: string;
}

export interface AdsbdbAirlineResponse {
  response?: AdsbdbAirline[] | AdsbdbAirline;
}

export interface AircraftMetadata {
  aircraftType?: string;
  manufacturer?: string;
  model?: string;
  registration?: string;
  airline?: string;
  airlineIcao?: string;
  airlineIata?: string;
  country?: string;
  photo?: string;
}

const metadataCache = new TtlCache<AircraftMetadata>(1000 * 60 * 60 * 24, 1000);
const airlineCache = new TtlCache<AdsbdbAirline | null>(
  1000 * 60 * 60 * 24 * 7,
  500
);

async function fetchJson<T>(
  url: URL
): Promise<{ data: T; ok: true } | { ok: false; status: number }> {
  if (!SERVER_CONFIG.adsbdb.enabled) {
    return { ok: false, status: 503 };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      SERVER_CONFIG.network.timeoutMs
    );
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "PastelRadar/1.0 (+https://pastel-radar.app)",
    };
    if (SERVER_CONFIG.adsbdb.apiKey) {
      headers["Authorization"] = `Bearer ${SERVER_CONFIG.adsbdb.apiKey}`;
    }
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as T;
    return { data, ok: true };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** Look up rich aircraft metadata by registration or ICAO hex. */
export async function getAircraftMetadata(
  key: string
): Promise<AircraftMetadata | null> {
  const clean = key.trim();
  if (!clean) return null;
  const cacheKey = clean.toLowerCase();

  return metadataCache.getOrCompute(cacheKey, async () => {
    if (SERVER_CONFIG.network.dryRun) return {};
    const url = new URL(
      `/v0/aircraft/${encodeURIComponent(clean)}`,
      SERVER_CONFIG.adsbdb.baseUrl
    );
    const result = await fetchJson<AdsbdbAircraftResponse>(url);
    if (!result.ok || !result.data.response?.aircraft) return {};
    const a = result.data.response.aircraft;

    let model = a.type;
    if (a.manufacturer && model?.toLowerCase().startsWith(a.manufacturer.toLowerCase())) {
      model = model.slice(a.manufacturer.length).trim();
    }

    return {
      aircraftType: a.icao_type,
      manufacturer: a.manufacturer,
      model: model || undefined,
      registration: a.registration,
      airline: a.registered_owner,
      airlineIcao: a.registered_owner_operator_flag_code,
      country: a.registered_owner_country_name,
      photo: a.url_photo_thumbnail || a.url_photo,
    };
  });
}

/** Look up airline details by ICAO code (e.g. "DAL"). */
export async function getAirline(
  icao: string
): Promise<AdsbdbAirline | null> {
  const code = icao.trim().toUpperCase();
  if (!code) return null;
  return airlineCache.getOrCompute(code, async () => {
    if (SERVER_CONFIG.network.dryRun) return null;
    const url = new URL(
      `/v0/airline/${encodeURIComponent(code)}`,
      SERVER_CONFIG.adsbdb.baseUrl
    );
    const result = await fetchJson<AdsbdbAirlineResponse>(url);
    if (!result.ok || !result.data.response) return null;
    const r = result.data.response;
    const first = Array.isArray(r) ? r[0] : r;
    return first ?? null;
  });
}
