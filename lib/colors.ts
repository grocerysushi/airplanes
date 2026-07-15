import type { Aircraft, ColorMode } from "./types";
import { categoryGroup } from "./geo";

/**
 * Central palette mapping. Keeps marker colors consistent with the design
 * tokens in app/globals.css.
 */
export const PALETTE = {
  yellow: "#F4C95D",
  coral: "#EF8E7D",
  green: "#8CC7A1",
  blue: "#78AFC8",
  lavender: "#B8A7D9",
  orange: "#E6A15C",
  danger: "#D96C6C",
  ink: "#34332F",
  border: "#D8D2C7",
  water: "#C8E4EA",
  land: "#EAE4D8",
  background: "#F5F1E8",
  surface: "#FFFDF7",
} as const;

/** Default aircraft color (muted blue). */
export const DEFAULT_AIRCRAFT_COLOR = "#9DBED1";

/** Color for the selected aircraft. */
export const SELECTED_COLOR = "#EF8E7D";

/** Color ramp for altitude-based coloring (low → high). */
const ALTITUDE_STOPS: Array<[number, string]> = [
  [0, "#8CC7A1"], // ground/low — green
  [5000, "#F4C95D"], // yellow
  [15000, "#E6A15C"], // orange
  [30000, "#EF8E7D"], // coral
  [40000, "#B8A7D9"], // lavender (high cruise)
];

/** Pick a color from the altitude ramp. */
function altitudeColor(altitude: number | undefined): string {
  if (altitude == null) return DEFAULT_AIRCRAFT_COLOR;
  if (altitude <= 0) return ALTITUDE_STOPS[0][1];
  for (let i = ALTITUDE_STOPS.length - 1; i >= 0; i--) {
    if (altitude >= ALTITUDE_STOPS[i][0]) return ALTITUDE_STOPS[i][1];
  }
  return DEFAULT_AIRCRAFT_COLOR;
}

/** Per-category pastel colors. */
const CATEGORY_COLORS: Record<string, string> = {
  light: PALETTE.yellow,
  small: PALETTE.green,
  large: PALETTE.blue,
  heavy: PALETTE.lavender,
  rotor: PALETTE.orange,
  glider: PALETTE.green,
  uav: PALETTE.coral,
  "ground-vehicle": PALETTE.border,
  tower: PALETTE.ink,
  unknown: DEFAULT_AIRCRAFT_COLOR,
};

/** Deterministic airline color by hashing the operator name. */
function airlineColor(airline: string | undefined): string {
  if (!airline) return DEFAULT_AIRCRAFT_COLOR;
  const options = [
    PALETTE.yellow,
    PALETTE.coral,
    PALETTE.green,
    PALETTE.blue,
    PALETTE.lavender,
    PALETTE.orange,
  ];
  let hash = 0;
  for (let i = 0; i < airline.length; i++) {
    hash = (hash * 31 + airline.charCodeAt(i)) >>> 0;
  }
  return options[hash % options.length];
}

/** Resolve the marker color for an aircraft given the active color mode. */
export function aircraftColor(
  aircraft: Aircraft,
  mode: ColorMode,
  selected: boolean
): string {
  if (selected) return SELECTED_COLOR;
  switch (mode) {
    case "altitude":
      return altitudeColor(aircraft.altitude);
    case "category":
      return CATEGORY_COLORS[categoryGroup(aircraft.category)] ??
        DEFAULT_AIRCRAFT_COLOR;
    case "airline":
      return airlineColor(aircraft.airline);
    case "default":
    default:
      return DEFAULT_AIRCRAFT_COLOR;
  }
}

/** Pastel chip color for a category group (UI badges). */
export function categoryChipColor(group: string): { bg: string; fg: string } {
  const map: Record<string, string> = {
    light: PALETTE.yellow,
    small: PALETTE.green,
    large: PALETTE.blue,
    heavy: PALETTE.lavender,
    rotor: PALETTE.orange,
    glider: PALETTE.green,
    uav: PALETTE.coral,
  };
  const c = map[group] ?? DEFAULT_AIRCRAFT_COLOR;
  return { bg: `${c}33`, fg: PALETTE.ink };
}
