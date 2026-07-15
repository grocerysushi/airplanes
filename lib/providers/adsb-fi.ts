import { SERVER_CONFIG } from "../server-config";
import type { Aircraft } from "../types";

/**
 * adsb.fi provider client.
 * Reference: https://api.adsb.fi/v2/
 *
 * Viewport query: GET /v2/bbox/{south},{west},{north},{east}
 * Lookups:        GET /v2/icao/{hex}
 *                 GET /v2/reg/{registration}
 *                 GET /v2/callsign/{callsign}
 */
export interface AdsbFiAc {
  hex?: string;
  type?: string;
  flight?: string;
  r?: string; // registration
  t?: string; // ICAO type designator
  desc?: string;
  alt_baro?: number | "ground";
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  category?: string;
  lat?: number;
  lon?: number;
  emergency?: string;
  nav_qnh?: number;
  dbFlags?: number;
  ownOp?: string;
}

export interface AdsbFiResponse {
  ac: AdsbFiAc[];
  total?: number;
  now?: number;
  msg?: string;
  ctime?: number;
  ptime?: number;
}

async function fetchJson<T>(
  url: URL,
  init?: RequestInit
): Promise<{ data: T; ok: true } | { ok: false; status: number }> {
  if (!SERVER_CONFIG.adsbFi.enabled) {
    return { ok: false, status: 503 };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      SERVER_CONFIG.network.timeoutMs
    );
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent": "PastelRadar/1.0 (+https://pastel-radar.app)",
        ...(init?.headers ?? {}),
      },
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

/** Normalize a raw adsb.fi aircraft record. */
export function normalizeAdsbFiAc(
  ac: AdsbFiAc,
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
    if (parts.length > 1) {
      manufacturer = parts[0];
      model = parts.slice(1).join(" ");
    } else {
      model = ac.desc.trim();
    }
  }

  return {
    id: `adsb.fi:${hex}`,
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
    source: "adsb.fi",
    lastUpdated: new Date(now).toISOString(),
  };
}

/** Fetch all aircraft within a bounding box. */
export async function fetchAircraftInBbox(
  south: number,
  west: number,
  north: number,
  east: number
): Promise<{ aircraft: Aircraft[]; ok: boolean; status: number }> {
  if (SERVER_CONFIG.network.dryRun) {
    return { aircraft: [], ok: true, status: 200 };
  }
  const url = new URL(
    `/v2/bbox/${south.toFixed(4)},${west.toFixed(4)},${north.toFixed(4)},${east.toFixed(4)}`,
    SERVER_CONFIG.adsbFi.baseUrl
  );
  const result = await fetchJson<AdsbFiResponse>(url);
  if (!result.ok) return { aircraft: [], ok: false, status: result.status };
  const now = result.data.now ?? Date.now();
  const aircraft = (result.data.ac ?? [])
    .map((ac) => normalizeAdsbFiAc(ac, now))
    .filter((a): a is Aircraft => a !== null);
  return { aircraft, ok: true, status: 200 };
}

/** Look up aircraft by hex / registration / callsign. */
export async function lookupAircraft(
  query: string
): Promise<{ aircraft: Aircraft[]; ok: boolean; status: number }> {
  if (SERVER_CONFIG.network.dryRun) {
    return { aircraft: [], ok: true, status: 200 };
  }
  const q = query.trim();
  if (!q) return { aircraft: [], ok: true, status: 200 };

  const candidates: string[] = [];
  const lower = q.toLowerCase();
  if (/^[0-9a-f]{6}$/.test(lower)) candidates.push(`/v2/icao/${lower}`);
  if (/^[a-z0-9]{2,}$/i.test(q))
    candidates.push(`/v2/reg/${encodeURIComponent(q)}`);
  candidates.push(`/v2/callsign/${encodeURIComponent(q)}`);

  for (const path of candidates) {
    const url = new URL(path, SERVER_CONFIG.adsbFi.baseUrl);
    const result = await fetchJson<AdsbFiResponse>(url);
    if (!result.ok) continue;
    const now = result.data.now ?? Date.now();
    const aircraft = (result.data.ac ?? [])
      .map((ac) => normalizeAdsbFiAc(ac, now))
      .filter((a): a is Aircraft => a !== null);
    if (aircraft.length) return { aircraft, ok: true, status: 200 };
  }
  return { aircraft: [], ok: true, status: 200 };
}
