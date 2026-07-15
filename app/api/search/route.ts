import { NextRequest, NextResponse } from "next/server";
import { fetchFromAirplanesLive } from "@/lib/providers/airplanes-live";
import { searchAll } from "@/lib/search";
import { normalizeAircraftLive } from "@/lib/providers/normalize";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (!q) {
    return NextResponse.json(
      { aircraft: [], flights: [], airports: [], cities: [], q },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const results = await searchAll(q, async (qq) => {
    // Search by callsign across a generous bbox; airplanes.live has a hex/callsign route too.
    const controller = new AbortController();
    const ctrl: typeof controller = controller;
    void ctrl;
    const air = await fetchFromAirplanesLive(
      { minLat: -75, maxLat: 75, minLon: -170, maxLon: 170 },
      controller.signal,
    );

    const needle = qq.trim().toLowerCase();
    const matches = air.aircraft.filter((a) => {
      if (!needle) return false;
      if (a.hex.toLowerCase().startsWith(needle)) return true;
      if (a.callsign && a.callsign.toLowerCase().includes(needle)) return true;
      if (a.registration && a.registration.toLowerCase().includes(needle)) return true;
      return false;
    });

    if (matches.length) return matches.slice(0, 25);

    // Try hex fetch if it looks like a hex
    if (/^[0-9a-f]{6,8}$/.test(qq.trim())) {
      const hex = qq.trim();
      const r = await fetch(`${process.env.AIRPLANES_LIVE_BASE ?? "https://api.airplanes.live"}/v2/icao/${hex}`, { signal: controller.signal });
      if (r.ok) {
        const data = await r.json();
        const first = Array.isArray(data?.ac) ? data.ac[0] : null;
        const n = first ? normalizeAircraftLive(first, "airplanes.live") : null;
        return n ? [n] : [];
      }
    }
    return [];
  });

  return NextResponse.json({ q, ...results }, { headers: { "cache-control": "no-store" } });
}
