import { SERVER_CONFIG } from "../server-config";
import type { Aircraft } from "../types";

/**
 * Type sketches of the airplanes.live API responses.
 * Reference: https://airplanes.live/docs
 *
 * Viewport query: GET /v2/point/{lat}/{lon}/{dist}  (dist in nautical miles)
 * Lookups:        GET /v2/icao/{hex}
 *                 GET /v2/reg/{registration}
 *                 GET /v2/callsign/{callsign}
 *                 GET /v2/squawk/{squawk}
 */
export interface AirplanesLiveAc {
  hex?: string;
  type?: string;
  flight?: string;
  r?: string; // registration
  t?: string; // ICAO type designator
  desc?: string; // manufacturer + model
  ownOp?: string; // owner / operator
  alt_baro?: number | "ground";
  alt_geom?: number;
  gs?: number; // ground speed kt
  track?: number; // true track deg
  baro_rate?: number;
  squawk?: string;
  category?: string;
  lat?: number;
  lon?: number;
  emergency?: string;
  nav_qnh?: number;
  version?: number;
  seen_pos?: number;
}

export interface AirplanesLiveResponse {
  ac: AirplanesLiveAc[];
  msg?: string;
  total?: number;
  now?: number;
  ctime?: number;
  ptime?: number;
}

const NAUTICAL_MILE_TO_KM = 1.852;

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "PastelRadar/1.0 (+https://pastel-radar.app)",
  };
  if (SERVER_CONFIG.airplanesLive.apiKey) {
    headers["x-api-key"] = SERVER_CONFIG.airplanesLive.apiKey;
  }
  return headers;
}

async function fetchJson<T>(
  url: URL,
  init?: RequestInit
): Promise<{ data: T; ok: true } | { ok: false; status: number }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      SERVER_CONFIG.network.timeoutMs
    );
    const res = await fetch(url, {
      ...init,
      headers: { ...buildHeaders(), ...(init?.headers ?? {}) },
      signal: controller.signal,
      // Never cache live data at the fetch layer; we manage caching ourselves.
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const data = (await res.json()) as T;
    return { data, ok: true };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** Convert a raw airplanes.live aircraft record to our normalized model. */
export function normalizeAirplaneLiveAc(
  ac: AirplanesLiveAc,
  now: number
): Aircraft | null {
  if (ac.lat == null || ac.lon == null || !ac.hex) return null;
  const hex = ac.hex.toLowerCase();
  const onGround = ac.alt_baro === "ground";
  const altitude =
    ac.alt_baro == null
      ? undefined
      : typeof ac.alt_baro === "number"
        ? ac.alt_baro
        : onGround
          ? 0
          : undefined;

  let manufacturer: string | undefined;
  let model: string | undefined;
  if (ac.desc) {
    const parts = ac.desc.trim().split(/\s+/);
    // Many records look like "BOEING 757-200" or "CESSNA 172 Skyhawk".
    if (parts.length > 1) {
      manufacturer = parts[0];
      model = parts.slice(1).join(" ");
    } else {
      model = ac.desc.trim();
    }
  }

  return {
    id: `airplanes.live:${hex}`,
    hex,
    callsign: ac.flight?.trim() || undefined,
    registration: ac.r?.trim() || undefined,
    latitude: ac.lat,
    longitude: ac.lon,
    altitude,
    groundSpeed: ac.gs,
    verticalRate: ac.baro_rate,
    heading: ac.track,
    squawk: ac.squawk,
    category: ac.category,
    aircraftType: ac.t,
    manufacturer,
    model,
    airline: ac.ownOp?.trim() || undefined,
    onGround,
    emergency:
      ac.emergency && ac.emergency !== "none" ? ac.emergency : undefined,
    source: "airplanes.live",
    lastUpdated: new Date(now).toISOString(),
  };
}

/** Fetch aircraft near a point, where distKm is the coverage radius in km. */
export async function fetchAircraftNear(
  lat: number,
  lon: number,
  distKm: number
): Promise<{ aircraft: Aircraft[]; ok: boolean; status: number }> {
  if (SERVER_CONFIG.network.dryRun) {
    return { aircraft: [], ok: true, status: 200 };
  }
  // Convert km -> nautical miles and clamp to the documented max (~250nm).
  const distNm = Math.min(250, Math.round(distKm / NAUTICAL_MILE_TO_KM));
  const url = new URL(
    `/v2/point/${lat.toFixed(4)}/${lon.toFixed(4)}/${distNm}`,
    SERVER_CONFIG.airplanesLive.baseUrl
  );
  const result = await fetchJson<AirplanesLiveResponse>(url);
  if (!result.ok) return { aircraft: [], ok: false, status: result.status };
  const now = result.data.now ?? Date.now();
  const aircraft = (result.data.ac ?? [])
    .map((ac) => normalizeAirplaneLiveAc(ac, now))
    .filter((a): a is Aircraft => a !== null);
  return { aircraft, ok: true, status: 200 };
}

/**
 * Look up aircraft by a generic query term across hex / registration / callsign.
 * Returns the first successful non-empty result set.
 */
export async function lookupAircraft(
  query: string
): Promise<{ aircraft: Aircraft[]; ok: boolean; status: number }> {
  if (SERVER_CONFIG.network.dryRun) {
    return { aircraft: [], ok: true, status: 200 };
  }
  const q = query.trim();
  if (!q) return { aircraft: [], ok: true, status: 200 };

  // Decide which lookup path to try based on the shape of the query.
  const candidates: string[] = [];
  const lower = q.toLowerCase();
  if (/^[0-9a-f]{6}$/.test(lower)) candidates.push(`/v2/icao/${lower}`);
  if (/^[a-z0-9]{2,}$/.test(q)) candidates.push(`/v2/reg/${encodeURIComponent(q)}`);
  candidates.push(`/v2/callsign/${encodeURIComponent(q)}`);

  for (const path of candidates) {
    const url = new URL(path, SERVER_CONFIG.airplanesLive.baseUrl);
    const result = await fetchJson<AirplanesLiveResponse>(url);
    if (!result.ok) continue;
    const now = result.data.now ?? Date.now();
    const aircraft = (result.data.ac ?? [])
      .map((ac) => normalizeAirplaneLiveAc(ac, now))
      .filter((a): a is Aircraft => a !== null);
    if (aircraft.length) return { aircraft, ok: true, status: 200 };
  }
  return { aircraft: [], ok: true, status: 200 };
}
