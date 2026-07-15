// Coloring modes for aircraft markers.

import type { Aircraft } from "@/lib/types";

const COLORS = {
  base: "#A7B8C9",
  selected: "#EF8E7D",
  emergency: "#D96C6C",
  hovered: "#F4C95D",
  airline: {
    // Major airline colorways (IATA → pastel hue). Falls back to base.
    AA: "#78AFC8",
    DL: "#D96C6C",
    UA: "#78AFC8",
    BA: "#B8A7D9",
    LH: "#F4C95D",
    AF: "#B8A7D9",
    KL: "#78AFC8",
    EK: "#EF8E7D",
    QR: "#8E5C3A",
    SQ: "#F4C95D",
    CX: "#8CC7A1",
    QF: "#E6A15C",
    AC: "#8CC7A1",
    AS: "#78AFC8",
    B6: "#78AFC8",
    WN: "#E6A15C",
    F9: "#8CC7A1",
    NK: "#F4C95D",
    UAL: "#78AFC8",
    AAL: "#EF8E7D",
    DAL: "#D96C6C",
  } as Record<string, string>,
} as const;

export type ColoringMode = "altitude" | "category" | "airline" | "default";

export function colorForAircraft(
  ac: Aircraft,
  mode: ColoringMode,
  opts?: { isSelected?: boolean; isHovered?: boolean },
): string {
  if (opts?.isSelected) return COLORS.selected;
  if (opts?.isHovered) return COLORS.hovered;
  if (ac.emergency) return COLORS.emergency;

  switch (mode) {
    case "altitude": {
      const alt = ac.altitude ?? 0;
      if (alt < 10000) return "#8CC7A1";       // low — green
      if (alt < 25000) return "#F4C95D";       // mid — yellow
      if (alt < 38000) return "#78AFC8";       // cruise — blue
      return "#B8A7D9";                        // high — lavender
    }
    case "category": {
      switch (ac.category) {
        case "helicopter":
          return "#EF8E7D";
        case "tiltrotor":
          return "#E6A15C";
        case "balloon":
          return "#B8A7D9";
        case "drone":
          return "#77736A";
        case "seaplane":
          return "#78AFC8";
        case "gyrocopter":
          return "#8CC7A1";
        default:
          return "#A7B8C9";
      }
    }
    case "airline": {
      const code = (ac.callsign ?? "").slice(0, 3).toUpperCase();
      return code ? COLORS.airline[code] ?? "#A7B8C9" : "#A7B8C9";
    }
    default:
      return "#A7B8C9";
  }
}

export const COLORING_MODES: { id: ColoringMode; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "altitude", label: "Altitude" },
  { id: "category", label: "Category" },
  { id: "airline", label: "Airline" },
];
