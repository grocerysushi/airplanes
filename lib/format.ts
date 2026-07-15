import type { Aircraft, AircraftDetails } from "./types";
import { categoryGroup, categoryLabel, isEmergencySquawk } from "./geo";

/** A single labeled row for detail panels. */
export interface DetailRow {
  label: string;
  value: string;
}

const NOT_AVAILABLE = "Not available";

/** Format an altitude in feet. */
export function formatAltitude(feet?: number): string {
  if (feet == null) return NOT_AVAILABLE;
  if (feet === 0) return "On ground";
  return `${Math.round(feet).toLocaleString()} ft`;
}

/** Format ground speed in knots. */
export function formatSpeed(kt?: number): string {
  if (kt == null) return NOT_AVAILABLE;
  return `${Math.round(kt)} kt`;
}

/** Format a vertical rate in ft/min with a direction. */
export function formatVerticalRate(fpm?: number): string {
  if (fpm == null) return NOT_AVAILABLE;
  if (fpm === 0) return "Level";
  const dir = fpm > 0 ? "↑" : "↓";
  return `${dir} ${Math.abs(Math.round(fpm)).toLocaleString()} ft/min`;
}

/** Format a heading in degrees plus a cardinal compass point. */
export function formatHeading(deg?: number): string {
  if (deg == null) return NOT_AVAILABLE;
  const cardinals = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const idx = Math.round(deg / 22.5) % 16;
  return `${Math.round(deg)}° ${cardinals[idx]}`;
}

/** Format coordinates as a single readable string. */
export function formatCoords(lat?: number, lon?: number): string {
  if (lat == null || lon == null) return NOT_AVAILABLE;
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${ns}, ${Math.abs(lon).toFixed(4)}°${ew}`;
}

/** Format a relative time like "12s ago". */
export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return NOT_AVAILABLE;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return NOT_AVAILABLE;
  const diff = Math.max(0, Date.now() - t);
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

/** A human label for an aircraft, preferring callsign then registration. */
export function aircraftLabel(a: Aircraft): string {
  return a.callsign?.trim() || a.registration || a.hex.toUpperCase();
}

/** A secondary label (model or hex) for an aircraft. */
export function aircraftSublabel(a: Aircraft): string {
  return (
    a.model ||
    a.aircraftType ||
    `${a.hex.toUpperCase()} · ${categoryLabel(categoryGroup(a.category))}`
  );
}

/** Build the rows for the detail panel from an aircraft record. */
export function detailRows(a: AircraftDetails): DetailRow[] {
  const rows: DetailRow[] = [
    { label: "Callsign", value: a.callsign?.trim() || NOT_AVAILABLE },
    { label: "Registration", value: a.registration || NOT_AVAILABLE },
    { label: "ICAO hex", value: a.hex.toUpperCase() },
    {
      label: "Airline",
      value: a.airline || NOT_AVAILABLE,
    },
    { label: "Manufacturer", value: a.manufacturer || NOT_AVAILABLE },
    { label: "Model", value: a.model || a.aircraftType || NOT_AVAILABLE },
    {
      label: "Route",
      value:
        a.origin || a.destination
          ? `${a.origin || "???"} → ${a.destination || "???"}`
          : NOT_AVAILABLE,
    },
    { label: "Altitude", value: formatAltitude(a.altitude) },
    { label: "Ground speed", value: formatSpeed(a.groundSpeed) },
    { label: "Heading", value: formatHeading(a.heading) },
    { label: "Vertical rate", value: formatVerticalRate(a.verticalRate) },
    {
      label: "Squawk",
      value: a.squawk
        ? isEmergencySquawk(a.squawk)
          ? `${a.squawk} ⚠ EMERGENCY`
          : a.squawk
        : NOT_AVAILABLE,
    },
    {
      label: "Category",
      value: categoryLabel(categoryGroup(a.category)),
    },
    { label: "Last update", value: formatRelativeTime(a.lastUpdated) },
    { label: "Data source", value: a.source },
    { label: "Coordinates", value: formatCoords(a.latitude, a.longitude) },
  ];
  return rows;
}

/** Debounce a function by `wait` ms. */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
