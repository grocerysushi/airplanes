import type { BoundingBox, CategoryGroup } from "./types";

/** Clamp a value into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Whether two bounding boxes overlap at all. */
export function bboxOverlaps(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.south <= b.north &&
    a.north >= b.south &&
    a.west <= b.east &&
    a.east >= b.west
  );
}

/** Whether bbox `inner` is fully contained within bbox `outer`. */
export function bboxContains(outer: BoundingBox, inner: BoundingBox): boolean {
  return (
    inner.south >= outer.south &&
    inner.north <= outer.north &&
    inner.west >= outer.west &&
    inner.east <= outer.east
  );
}

/** Merge two bounding boxes into their union. */
export function bboxUnion(a: BoundingBox, b: BoundingBox): BoundingBox {
  return {
    north: Math.max(a.north, b.north),
    south: Math.min(a.south, b.south),
    east: Math.max(a.east, b.east),
    west: Math.min(a.west, b.west),
  };
}

/**
 * Great-circle distance between two lat/lon points, in kilometers.
 * Uses the haversine formula.
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Center point of a bounding box. */
export function bboxCenter(b: BoundingBox): {
  lat: number;
  lon: number;
} {
  return { lat: (b.north + b.south) / 2, lon: (b.east + b.west) / 2 };
}

/**
 * Approximate half-diagonal radius (km) of a bounding box.
 * Useful for sizing the airplanes.live point query radius.
 */
export function bboxRadiusKm(b: BoundingBox): number {
  const c = bboxCenter(b);
  return Math.max(
    haversineKm(c.lat, c.lon, b.north, b.west),
    haversineKm(c.lat, c.lon, b.north, b.east),
    haversineKm(c.lat, c.lon, b.south, b.west),
    haversineKm(c.lat, c.lon, b.south, b.east)
  );
}

/** Normalize a longitude to the [-180, 180] range. */
export function wrapLon(lon: number): number {
  let l = lon;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;
  return l;
}

/**
 * Interpolate between two positions over time, useful for smooth marker
 * movement between server updates. `t` in [0, 1].
 */
export function lerpPosition(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  t: number
): { lat: number; lon: number } {
  const tt = clamp(t, 0, 1);
  return {
    lat: from.lat + (to.lat - from.lat) * tt,
    lon: from.lon + (to.lon - from.lon) * tt,
  };
}

/** Shortest angular difference between two headings in degrees, in [-180,180]. */
export function angleDelta(a: number, b: number): number {
  let d = ((b - a + 540) % 360) - 180;
  return d;
}

/** Linear interpolation of two angles taking the shortest arc. */
export function lerpAngle(a: number, b: number, t: number): number {
  return (a + angleDelta(a, b) * clamp(t, 0, 1) + 360) % 360;
}

/** Map an ADS-B emitter category code to a coarse group. */
export function categoryGroup(category?: string): CategoryGroup {
  if (!category) return "unknown";
  const c = category.toUpperCase();
  if (c.startsWith("A1")) return "light";
  if (c.startsWith("A2")) return "small";
  if (c.startsWith("A3")) return "large";
  if (c.startsWith("A4")) return "large"; // high vortex large
  if (c.startsWith("A5")) return "heavy";
  if (c.startsWith("A6")) return "heavy"; // high vortex heavy
  if (c.startsWith("A7")) return "rotor";
  if (c.startsWith("B")) return "glider";
  if (c.startsWith("C")) return "uav";
  if (c.startsWith("D")) return "uav";
  if (c.startsWith("E")) return "uav";
  if (c.startsWith("F")) return "uav";
  if (c.startsWith("G1")) return "ground-vehicle";
  if (c.startsWith("G2")) return "ground-vehicle";
  if (c.startsWith("G3")) return "ground-vehicle";
  if (c.startsWith("G4")) return "ground-vehicle";
  if (c.startsWith("G5")) return "ground-vehicle";
  if (c.startsWith("G6")) return "ground-vehicle";
  if (c.startsWith("G7")) return "tower";
  return "unknown";
}

/** Human-readable label for a category group. */
export function categoryLabel(group: CategoryGroup): string {
  switch (group) {
    case "light":
      return "Light aircraft";
    case "small":
      return "Small";
    case "large":
      return "Large";
    case "heavy":
      return "Heavy";
    case "rotor":
      return "Helicopter";
    case "glider":
      return "Glider / balloon";
    case "uav":
      return "UAV / drone";
    case "ground-vehicle":
      return "Ground vehicle";
    case "tower":
      return "Fixed installation";
    default:
      return "Unknown";
  }
}

/** Standard emergency (hijack / radio / general) squawk codes. */
export const EMERGENCY_SQUAWKS = new Set(["7500", "7600", "7700"]);

/** Whether a squawk string is an emergency code. */
export function isEmergencySquawk(squawk?: string): boolean {
  return !!squawk && EMERGENCY_SQUAWKS.has(squawk);
}
