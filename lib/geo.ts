import type { BoundingBox } from "./types";

export function bboxFromMapBounds(
  bounds: { getNorth(): number; getSouth(): number; getEast(): number; getWest(): number } | BoundingBox,
): BoundingBox {
  if ("getNorth" in bounds) {
    return {
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLon: bounds.getWest(),
      maxLon: bounds.getEast(),
    };
  }
  return bounds;
}

export function bboxArea(b: BoundingBox): number {
  return Math.abs(b.maxLat - b.minLat) * Math.abs(b.maxLon - b.minLon);
}

export function pointInBbox(lat: number, lon: number, b: BoundingBox): boolean {
  if (lat < b.minLat || lat > b.maxLat) return false;
  const lonMin = b.minLon;
  const lonMax = b.maxLon;
  if (lonMin <= lonMax) return lon >= lonMin && lon <= lonMax;
  // bbox crosses antimeridian
  return lon >= lonMin || lon <= lonMax;
}

export function haversineNm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3440.065;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function clampBbox(b: BoundingBox): BoundingBox {
  return {
    minLat: Math.max(-85, Math.min(85, b.minLat)),
    maxLat: Math.max(-85, Math.min(85, b.maxLat)),
    minLon: Math.max(-180, Math.min(180, b.minLon)),
    maxLon: Math.max(-180, Math.min(180, b.maxLon)),
  };
}

export function formatBearing(deg?: number): string {
  if (deg === undefined || deg === null) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(((deg % 360) / 45)) % 8;
  return `${Math.round(deg)}° ${dirs[i]}`;
}

export function formatAltitude(alt?: number): string {
  if (alt === undefined || alt === null) return "—";
  return `${Math.round(alt).toLocaleString()} ft`;
}

export function formatSpeed(kt?: number): string {
  if (kt === undefined || kt === null) return "—";
  return `${Math.round(kt)} kt`;
}

export function formatVerticalRate(vr?: number): string {
  if (vr === undefined || vr === null) return "—";
  const sign = vr > 0 ? "▲" : vr < 0 ? "▼" : "•";
  return `${sign} ${Math.abs(Math.round(vr)).toLocaleString()} ft/min`;
}

export function formatRelativeTime(iso?: string): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const delta = (Date.now() - t) / 1000;
  if (delta < 5) return "just now";
  if (delta < 60) return `${Math.round(delta)}s ago`;
  if (delta < 3600) return `${Math.round(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.round(delta / 3600)}h ago`;
  return new Date(iso).toLocaleString();
}

export function isEmergencySquawk(code?: string): boolean {
  if (!code) return false;
  return ["7500", "7600", "7700"].includes(code);
}

export function isLikelyMilitary(callsign?: string): boolean {
  if (!callsign) return false;
  const c = callsign.trim().toUpperCase();
  if (c.startsWith("RCH") || c.startsWith("BLUE") || c.startsWith("CNV")) return true;
  const milPrefixes = ["RCH", "RFR", "REACH", "IAM", "JGD"];
  return milPrefixes.some((p) => c.startsWith(p));
}
