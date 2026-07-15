"use client";

import { Plane, Radar, Wifi, WifiOff, AlertTriangle } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Pastel Radar">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-pastel-yellow/70 animate-ping" />
        <div className="relative grid place-items-center w-9 h-9 rounded-2xl bg-pastel-yellow border border-border text-text-primary shadow-soft">
          <Radar className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-text-primary tracking-tight">Pastel</span>
        <span className="text-text-secondary text-[11px] -mt-0.5">Radar</span>
      </div>
    </div>
  );
}

export function StatusPill({
  statuses,
  lastUpdated,
  isStale,
}: {
  statuses: { source: string; ok: boolean; count: number; error?: string }[];
  lastUpdated: string | null;
  isStale: boolean;
}) {
  const allOk = statuses.every((s) => s.ok);
  const anyOk = statuses.some((s) => s.ok);

  if (!anyOk) {
    return (
      <div className="chip bg-danger/15 text-danger border border-danger/30">
        <WifiOff className="w-3.5 h-3.5" /> Offline
      </div>
    );
  }

  if (isStale) {
    return (
      <div className="chip bg-pastel-orange/20 text-[#a05e22] border border-pastel-orange/40">
        <AlertTriangle className="w-3.5 h-3.5" /> Stale
      </div>
    );
  }

  return (
    <div className="chip bg-pastel-green/25 text-[#3b6953] border border-pastel-green/50">
      <Wifi className="w-3.5 h-3.5" /> Live
      <span className="text-[#3b6953]/70 font-medium">
        {lastUpdated ? `· ${new Date(lastUpdated).toLocaleTimeString()}` : ""}
      </span>
    </div>
  );
}

export function TinyPlane({ className = "" }: { className?: string }) {
  return <Plane className={className} />;
}
