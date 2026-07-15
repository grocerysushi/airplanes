import type { Aircraft, BoundingBox, ProviderStatus } from "../types";
import { withTimeout, safeJson, normalizeHex } from "../http";
import { normalizeAircraftLive } from "./normalize";

const DEFAULT_BASE = process.env.AIRPLANES_LIVE_BASE || "https://api.airplanes.live";

interface PointsResponse {
  ac?: any[];
  total?: number;
}

export async function fetchFromAirplanesLive(
  bbox: BoundingBox,
  signal?: AbortSignal,
): Promise<{ aircraft: Aircraft[]; status: ProviderStatus }> {
  const source = "airplanes.live" as const;
  const url =
    `${DEFAULT_BASE}/v2/point/${bbox.minLat}/${bbox.minLon}/${bbox.maxLat}/${bbox.maxLon}` +
    `?icaoHex=&callsign=&reg=&type=&limit=5000`;

  try {
    const res = await withTimeout(
      fetch(url, {
        signal,
        headers: { accept: "application/json" },
        cache: "no-store",
      }),
      9000,
      "airplanes.live",
    );
    const data = await safeJson<PointsResponse>(res);
    const ac = Array.isArray(data.ac) ? data.ac : [];
    const aircraft = ac
      .map((row) => normalizeAircraftLive(row, source))
      .filter((x): x is Aircraft => x !== null);
    return { aircraft, status: { source, ok: true, count: aircraft.length } };
  } catch (err: any) {
    return {
      aircraft: [],
      status: {
        source,
        ok: false,
        count: 0,
        error: err?.message || "unknown error",
      },
    };
  }
}

export async function fetchByHex(
  source: "airplanes.live" | "adsb.fi",
  hex: string,
  signal?: AbortSignal,
): Promise<Aircraft | null> {
  const url = `${source === "airplanes.live" ? DEFAULT_BASE : process.env.ADSB_FI_BASE || "https://opendata.adsb.fi"}/v2/icao/${normalizeHex(hex)}`;
  try {
    const res = await withTimeout(
      fetch(url, { signal, cache: "no-store" }),
      7000,
      `${source}:hex`,
    );
    const data = await safeJson<PointsResponse>(res);
    const first = Array.isArray(data.ac) ? data.ac[0] : null;
    return first ? normalizeAircraftLive(first, source) : null;
  } catch {
    return null;
  }
}
