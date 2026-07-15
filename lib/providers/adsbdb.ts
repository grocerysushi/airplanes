import type { AircraftMetadata } from "../types";
import { withTimeout, safeJson } from "../http";
import { cacheGet, cacheSet, numericTtl } from "../cache";
import { normalizeHex } from "../http";

const DEFAULT_BASE = process.env.ADSBDB_BASE || "https://api.adsbdb.com";

interface AdsbDbResponse {
  response?: {
    aircraft?: {
      hex?: string;
      registration?: string;
      manufacturer?: string;
      type?: string;
      model?: string;
      airline?: string;
      owner?: string;
      built_year?: number;
      engines?: number;
      category?: { name?: string };
    };
  };
}

export async function fetchMetadata(hex: string): Promise<AircraftMetadata | undefined> {
  const key = `meta:${normalizeHex(hex)}`;
  const hit = cacheGet<AircraftMetadata>(key);
  if (hit) return hit;
  try {
    const url = `${DEFAULT_BASE}/v0/aircraft/${normalizeHex(hex)}`;
    const res = await withTimeout(fetch(url, { cache: "no-store" }), 6000, "adsbdb");
    if (res.status === 404) {
      cacheSet(key, {}, 60 * 60 * 1000);
      return undefined;
    }
    const json = await safeJson<AdsbDbResponse>(res);
    const ac = json?.response?.aircraft;
    if (!ac) return undefined;
    const meta: AircraftMetadata = {
      hex: ac.hex ?? hex,
      registration: ac.registration,
      manufacturer: ac.manufacturer,
      type: ac.type,
      model: ac.model,
      airline: ac.airline ?? ac.owner,
      owner: ac.owner,
      builtYear: ac.built_year,
      engines: ac.engines,
    };
    cacheSet(key, meta, numericTtl());
    return meta;
  } catch {
    return undefined;
  }
}

export async function fetchRoute(hex: string): Promise<{ origin?: string; destination?: string } | null> {
  const key = `route:${normalizeHex(hex)}`;
  const hit = cacheGet<{ origin?: string; destination?: string }>(key);
  if (hit) return hit;
  try {
    const url = `${DEFAULT_BASE}/v0/aircraft/${normalizeHex(hex)}/route`;
    const res = await withTimeout(fetch(url, { cache: "no-store" }), 6000, "adsbdb-route");
    if (!res.ok) return null;
    const data = await safeJson<{ response?: { flightroute?: { origin?: { iata?: string }; destination?: { iata?: string } } } }>(res);
    const r = data?.response?.flightroute;
    if (!r) return null;
    const out = { origin: r.origin?.iata, destination: r.destination?.iata };
    cacheSet(key, out, numericTtl());
    return out;
  } catch {
    return null;
  }
}
