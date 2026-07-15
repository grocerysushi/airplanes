import type {
  Aircraft,
  AircraftDetails,
  BoundingBox,
  LiveStatus,
  ProviderId,
} from "./types";
import { bboxRadiusKm, bboxContains } from "./geo";
import {
  fetchAircraftNear,
  lookupAircraft as lookupAirplanesLive,
} from "./providers/airplanes-live";
import {
  fetchAircraftInBbox,
  lookupAircraft as lookupAdsbFi,
} from "./providers/adsb-fi";
import { getAircraftMetadata, getAirline } from "./providers/adsbdb";
import { SERVER_CONFIG, viewportProviderOrder } from "./server-config";

/** Whether an aircraft point lies inside a bounding box (handles dateline wrap). */
export function aircraftInBbox(a: Aircraft, b: BoundingBox): boolean {
  const inner: BoundingBox = {
    north: a.latitude,
    south: a.latitude,
    east: a.longitude,
    west: a.longitude,
  };
  return bboxContains(b, inner);
}

/** Merge aircraft lists, de-duplicating by ICAO hex; prefer earlier providers. */
export function mergeAircraft(lists: Aircraft[][]): Aircraft[] {
  const seen = new Map<string, Aircraft>();
  for (const list of lists) {
    for (const a of list) {
      const key = a.hex;
      if (!seen.has(key)) seen.set(key, a);
    }
  }
  return [...seen.values()];
}

/** Filter aircraft to a bounding box. */
export function clipToBbox(aircraft: Aircraft[], bbox: BoundingBox): Aircraft[] {
  return aircraft.filter((a) => aircraftInBbox(a, bbox));
}

function statusFromResult(
  source: ProviderId,
  total: number,
  ok: boolean,
  status: number
): { ok: true; status: LiveStatus } | { ok: false; status: LiveStatus } {
  if (ok) {
    return {
      ok: true,
      status: {
        source,
        total,
        lastUpdated: new Date().toISOString(),
        stale: false,
      },
    };
  }
  const error =
    status === 429
      ? "rate-limited"
      : status === 0
        ? "network"
        : "provider-unavailable";
  return {
    ok: false,
    status: { source: "none", total: 0, lastUpdated: null, stale: true, error },
  };
}

/**
 * Fetch live aircraft for the given viewport, trying providers in configured
 * order and falling back transparently. Returns merged results clipped to bbox.
 */
export async function fetchViewportAircraft(
  bbox: BoundingBox
): Promise<{ aircraft: Aircraft[]; status: LiveStatus }> {
  const order = viewportProviderOrder();
  const radius = bboxRadiusKm(bbox);
  const centerLat = (bbox.north + bbox.south) / 2;
  const centerLon = (bbox.east + bbox.west) / 2;
  const collected: Aircraft[][] = [];
  let lastStatus: LiveStatus = {
    source: "none",
    total: 0,
    lastUpdated: null,
    stale: true,
    error: "provider-unavailable",
  };

  for (const provider of order) {
    if (provider === "airplanes.live") {
      const { aircraft, ok, status } = await fetchAircraftNear(
        centerLat,
        centerLon,
        radius
      );
      const s = statusFromResult(provider, aircraft.length, ok, status);
      lastStatus = s.status;
      if (s.ok) {
        collected.push(aircraft);
        // Stop after the first healthy provider to avoid double-quering.
        break;
      }
    } else if (provider === "adsb.fi") {
      const { aircraft, ok, status } = await fetchAircraftInBbox(
        bbox.south,
        bbox.west,
        bbox.north,
        bbox.east
      );
      const s = statusFromResult(provider, aircraft.length, ok, status);
      lastStatus = s.status;
      if (s.ok) {
        collected.push(aircraft);
        break;
      }
    }
  }

  if (collected.length === 0) {
    return { aircraft: [], status: lastStatus };
  }

  const merged = clipToBbox(mergeAircraft(collected), bbox);
  return {
    aircraft: merged,
    status: {
      source: lastStatus.source,
      total: merged.length,
      lastUpdated: lastStatus.lastUpdated,
      stale: false,
    },
  };
}

/** Look up a single aircraft by free-text query, with provider fallback. */
export async function findAircraft(
  query: string
): Promise<{ aircraft: Aircraft[]; status: LiveStatus }> {
  const order = viewportProviderOrder();
  for (const provider of order) {
    if (provider === "airplanes.live") {
      const { aircraft, ok, status } = await lookupAirplanesLive(query);
      const s = statusFromResult(provider, aircraft.length, ok, status);
      if (s.ok && aircraft.length)
        return { aircraft, status: s.status };
    } else if (provider === "adsb.fi") {
      const { aircraft, ok, status } = await lookupAdsbFi(query);
      const s = statusFromResult(provider, aircraft.length, ok, status);
      if (s.ok && aircraft.length)
        return { aircraft, status: s.status };
    }
  }
  return {
    aircraft: [],
    status: {
      source: "none",
      total: 0,
      lastUpdated: null,
      stale: true,
      error: null,
    },
  };
}

/** Enrich an aircraft with ADSBDB metadata, returning a details object. */
export async function enrichAircraft(a: Aircraft): Promise<AircraftDetails> {
  // Try registration first, then hex, since ADSBDB accepts either.
  const key = a.registration || a.hex;
  const meta = key ? await getAircraftMetadata(key) : null;

  let airlineIata = meta?.airlineIcao
    ? (await getAirline(meta.airlineIcao))?.iata
    : undefined;

  const details: AircraftDetails = {
    ...a,
    aircraftType: meta?.aircraftType ?? a.aircraftType,
    manufacturer: meta?.manufacturer ?? a.manufacturer,
    model: meta?.model ?? a.model,
    registration: meta?.registration ?? a.registration,
    airline: meta?.airline ?? a.airline,
    airlineIcao: meta?.airlineIcao,
    airlineIata,
    country: meta?.country,
    photo: meta?.photo,
  };
  return details;
}

/** Mark the freshness flag on a previously-fetched status. */
export function markStale(
  status: LiveStatus,
  maxAgeSeconds = SERVER_CONFIG.staleAfterSeconds
): LiveStatus {
  if (!status.lastUpdated) return { ...status, stale: true };
  const ageMs = Date.now() - new Date(status.lastUpdated).getTime();
  return { ...status, stale: ageMs > maxAgeSeconds * 1000 };
}
