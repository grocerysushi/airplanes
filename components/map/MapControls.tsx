"use client";

import { Crosshair, MapPin, Settings2, Plane } from "lucide-react";

export interface MapControlsProps {
  onLocateMe: () => void;
  onOpenFilters: () => void;
  inFlightCount: number;
  visibleCount: number;
}

export default function MapControls(props: MapControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button icon={<Crosshair />} label="Locate me" onClick={props.onLocateMe} />
      <Button icon={<MapPin />} label="Reset view" onClick={() => window.dispatchEvent(new CustomEvent("map:reset-view"))} />
      <Button icon={<Settings2 />} label="Filters" onClick={props.onOpenFilters} />
      <div className="surface-card px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Plane className="w-3.5 h-3.5" /> Visible
        </div>
        <div className="text-base font-extrabold text-text-primary">{props.visibleCount.toLocaleString()}</div>
        <div className="text-[10px] text-text-secondary">In-flight total: {props.inFlightCount.toLocaleString()}</div>
      </div>
    </div>
  );
}

function Button({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="surface-card w-11 h-11 grid place-items-center text-text-primary hover:bg-pastel-yellow/15"
    >
      {icon}
    </button>
  );
}
