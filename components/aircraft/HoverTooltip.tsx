"use client";

import { useEffect, useState } from "react";

export interface HoverTooltipProps {
  visible: boolean;
  text: string[];
  x: number;
  y: number;
}

export default function HoverTooltip({ visible, text, x, y }: HoverTooltipProps) {
  if (!visible || text.length === 0) return null;
  return (
    <div
      className="surface-card pointer-events-none px-3 py-2 text-xs fixed z-30 animate-pop"
      style={{ left: x + 14, top: y + 14 }}
      role="tooltip"
    >
      {text.map((t, i) => (
        <div key={i} className="text-text-primary font-semibold">
          {t}
        </div>
      ))}
    </div>
  );
}
