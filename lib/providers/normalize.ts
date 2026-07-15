import type { Aircraft, AircraftCategory, DataSource } from "../types";
import { normalizeHex } from "../http";

const CATEGORY_MAP: Record<string, AircraftCategory> = {
  A0: "unknown",
  A1: "landplane",
  A2: "landplane",
  A3: "landplane",
  A4: "landplane",
  A5: "landplane",
  A6: "landplane",
  A7: "helicopter",
  B1: "landplane",
  B2: "landplane",
  B3: "landplane",
  B4: "landplane",
  B5: "landplane",
  B6: "helicopter",
  B7: "helicopter",
  C0: "landplane",
  C1: "landplane",
  C2: "landplane",
  C3: "landplane",
  C4: "gyrocopter",
  C5: "landplane",
  C6: "landplane",
  C7: "tiltrotor",
  D1: "balloon",
  D2: "balloon",
  D3: "balloon",
  D4: "gyrocopter",
  D5: "gyrocopter",
  D6: "drone",
  D7: "drone",
};

export function mapCategory(c?: string, emergency?: boolean): AircraftCategory | undefined {
  if (!c) return undefined;
  if (emergency && c === "A1") return "landplane";
  return CATEGORY_MAP[c];
}

export function normalizeAircraftLive(raw: any, source: DataSource): Aircraft | null {
  if (!raw || typeof raw !== "object") return null;
  const hex = normalizeHex(String(raw.hex ?? raw.icao ?? ""));
  if (!hex || hex.length < 6) return null;
  const lat = Number(raw.lat ?? raw.latitude);
  const lon = Number(raw.lon ?? raw.long ?? raw.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  const cs = (raw.call ?? raw.callsign ?? raw.flight ?? "") as string;
  const reg = (raw.reg ?? raw.registration ?? raw.tail ?? "") as string;

  const t = (raw.t ?? raw.type ?? raw.aircraftType ?? "") as string;
  return {
    id: `${source}:${hex}`,
    hex,
    callsign: typeof cs === "string" ? cs.trim().toUpperCase().replace(/\s+/g, "") || undefined : undefined,
    registration: typeof reg === "string" ? reg.trim().toUpperCase() || undefined : undefined,
    latitude: lat,
    longitude: lon,
    altitude: num(raw.alt_baro ?? raw.alt ?? raw.altitude),
    groundSpeed: num(raw.gs ?? raw.spd ?? raw.groundSpeed ?? raw.speed),
    verticalRate: num(raw.baro_rate ?? raw.vr ?? raw.verticalRate ?? raw.vrate),
    heading: num(raw.track ?? raw.heading ?? raw.bearing),
    squawk: typeof (raw.squawk ?? raw.sqk) === "string" ? String(raw.squawk ?? raw.sqk) : undefined,
    category: mapCategory(raw.category ?? raw.cat, raw.emergency === true || raw.squawk === "7700"),
    aircraftType: t ? String(t).trim() : undefined,
    onGround: raw.alt_baro === 0 || raw.altitude === 0 || raw.ground === true || raw.onGround === true,
    emergency: raw.emergency === true || raw.squawk === "7700",
    source,
    lastUpdated: new Date().toISOString(),
  };
}

function num(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function mergeAircraft(existing: Map<string, Aircraft>, next: Aircraft): void {
  const key = next.id;
  const prev = existing.get(key);
  existing.set(key, {
    ...prev,
    ...next,
    manufacturer: next.manufacturer ?? prev?.manufacturer,
    model: next.model ?? prev?.model,
    airline: next.airline ?? prev?.airline,
    origin: next.origin ?? prev?.origin,
    destination: next.destination ?? prev?.destination,
  });
}
