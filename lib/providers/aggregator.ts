import type { Aircraft, BoundingBox, ProviderStatus } from "../types";
import { fetchFromAirplanesLive } from "./airplanes-live";
import { fetchFromAdsbFi } from "./adsb-fi";
import { mergeAircraft } from "./normalize";

export interface FetchResult {
  aircraft: Map<string, Aircraft>;
  statuses: ProviderStatus[];
}

export async function fetchViewportAircraft(
  bbox: BoundingBox,
  signal?: AbortSignal,
): Promise<FetchResult> {
  const merged = new Map<string, Aircraft>();
  const sources: DataSource[] = ["airplanes.live", "adsb.fi"];

  const tasks: Promise<{ aircraft: Aircraft[]; status: ProviderStatus }>[] = [
    fetchFromAirplanesLive(bbox, signal),
    fetchFromAdsbFi(bbox, signal),
  ];

  const results = await Promise.allSettled(tasks);
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status !== "fulfilled") continue;
    for (const ac of r.value.aircraft) mergeAircraft(merged, ac);
  }

  const statuses: ProviderStatus[] = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value.status
      : { source: sources[i], ok: false, count: 0, error: r.reason?.message ?? "error" },
  );
  return { aircraft: merged, statuses };
}

export type DataSource = "airplanes.live" | "adsb.fi";
