import type { Aircraft, BoundingBox, ProviderStatus } from "../types";
import { withTimeout, safeJson } from "../http";
import { normalizeAircraftLive } from "./normalize";

const DEFAULT_BASE = process.env.ADSB_FI_BASE || "https://opendata.adsb.fi";

interface PointsResponse {
  aircraft?: any[];
  ac?: any[];
}

export async function fetchFromAdsbFi(
  bbox: BoundingBox,
  signal?: AbortSignal,
): Promise<{ aircraft: Aircraft[]; status: ProviderStatus }> {
  const source = "adsb.fi" as const;
  const url =
    `${DEFAULT_BASE}/api/v2/lat/${bbox.minLat}/lon/${bbox.minLon}/dist/250` +
    `?icaoHex=&callsign=&reg=&type=&limit=5000`;
  try {
    const res = await withTimeout(
      fetch(url, { signal, cache: "no-store" }),
      9000,
      "adsb.fi",
    );
    const data = await safeJson<PointsResponse>(res);
    const ac = Array.isArray(data.aircraft ?? data.ac) ? (data.aircraft ?? data.ac)! : [];
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
