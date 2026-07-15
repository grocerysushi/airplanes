import { NextRequest, NextResponse } from "next/server";
import { fetchViewportAircraft } from "@/lib/providers/aggregator";
import { clampBbox } from "@/lib/geo";
import type { BoundingBox } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseBbox(req: NextRequest): BoundingBox {
  const sp = req.nextUrl.searchParams;
  const n = (k: string) => Number(sp.get(k));
  const minLat = n("minLat");
  const maxLat = n("maxLat");
  const minLon = n("minLon");
  const maxLon = n("maxLon");
  const all = [minLat, maxLat, minLon, maxLon];
  if (all.every(Number.isFinite)) {
    return clampBbox({ minLat, maxLat, minLon, maxLon });
  }
  return { minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 };
}

export async function GET(req: NextRequest) {
  const bbox = parseBbox(req);
  const { aircraft, statuses } = await fetchViewportAircraft(bbox);
  return NextResponse.json(
    {
      bbox,
      count: aircraft.size,
      statuses,
      aircraft: Array.from(aircraft.values()),
      fetchedAt: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
