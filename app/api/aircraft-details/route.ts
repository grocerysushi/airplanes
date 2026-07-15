import { NextRequest, NextResponse } from "next/server";
import { fetchByHex } from "@/lib/providers/airplanes-live";
import { fetchFromAdsbFi } from "@/lib/providers/adsb-fi";
import { fetchMetadata, fetchRoute } from "@/lib/providers/adsbdb";
import { numericTtl, cacheGet, cacheSet } from "@/lib/cache";
import { normalizeHex } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const hex = normalizeHex(id);
  if (!hex) {
    return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
  }

  const cached = cacheGet<any>(`detail:${hex}`);
  if (cached) return NextResponse.json(cached, { headers: { "cache-control": "no-store" } });

  const ctx = makeContext();
  let ac = await fetchByHex("airplanes.live", hex, ctx.signal);
  if (!ac) {
    const r = await fetchFromAdsbFi({ minLat: -85, maxLat: 85, minLon: -180, maxLon: 180 }, ctx.signal);
    ac = r.aircraft.find((a) => a.hex === hex) ?? null;
  }

  if (!ac) {
    return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });
  }

  const [metadata, route] = await Promise.all([fetchMetadata(hex), fetchRoute(hex)]);
  const enriched = {
    ...ac,
    manufacturer: metadata?.manufacturer,
    model: metadata?.model ?? metadata?.type,
    aircraftType: metadata?.type ?? ac.aircraftType,
    airline: metadata?.airline ?? ac.airline,
    origin: route?.origin ?? ac.origin,
    destination: route?.destination ?? ac.destination,
  };

  const payload = {
    aircraft: enriched,
    metadata,
    fetchedAt: new Date().toISOString(),
  };
  cacheSet(`detail:${hex}`, payload, numericTtl() / 12);
  return NextResponse.json(payload, { headers: { "cache-control": "no-store" } });
}

function makeContext() {
  const controller = new AbortController();
  return { signal: controller.signal, cancel: () => controller.abort() };
}
