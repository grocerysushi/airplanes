"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sliders, RotateCcw, RefreshCw, PlaneTakeoff, Mountain, Bell, Star, Check,
} from "lucide-react";
import type { AircraftFilters } from "@/lib/types";
import type { ColoringMode } from "@/components/map/coloring";
import { COLORING_MODES } from "@/components/map/coloring";

const DEFAULTS: AircraftFilters = {
  minAltitude: 0,
  maxAltitude: 50000,
  minGroundSpeed: 0,
  maxGroundSpeed: 700,
  airlines: [],
  aircraftTypes: [],
  onGround: null,
  military: null,
  emergency: null,
  sources: ["airplanes.live", "adsb.fi"],
  callsignQuery: "",
};

export interface FiltersPanelProps {
  open: boolean;
  onClose: () => void;
  filters: AircraftFilters;
  onChange: (f: AircraftFilters) => void;
  coloring: ColoringMode;
  onColoringChange: (c: ColoringMode) => void;
  paused: boolean;
  onPausedChange: (p: boolean) => void;
  onRefresh: () => void;
  lastUpdated: string | null;
}

export default function FiltersPanel(props: FiltersPanelProps) {
  const f = props.filters;
  const setF = (next: Partial<AircraftFilters>) => props.onChange({ ...f, ...next });

  const reset = () => props.onChange(DEFAULTS);

  return (
    <div
      className={`surface-card w-[380px] max-w-full p-4 animate-pop overflow-auto ${
        props.open ? "" : "hidden"
      }`}
      role="dialog"
      aria-label="Filters and settings"
    >
      <header className="flex items-center justify-between pb-2 mb-2 border-b border-border/80">
        <div className="flex items-center gap-2 font-extrabold">
          <Sliders className="w-4 h-4 text-text-secondary" /> Filters & Settings
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-danger"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </header>

      <Section title="Airplane marker color">
        <div className="grid grid-cols-2 gap-1.5">
          {COLORING_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => props.onColoringChange(m.id)}
              className={`px-3 py-2 text-sm rounded-xl border ${
                props.coloring === m.id
                  ? "bg-pastel-yellow/30 border-pastel-yellow/70 font-semibold"
                  : "bg-pastel-yellow/[0.04] border-border hover:bg-pastel-yellow/15"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title={`Altitude (ft) — ${f.minAltitude.toLocaleString()}–${f.maxAltitude.toLocaleString()}`}>
        <DualRange
          min={0}
          max={50000}
          step={1000}
          value={[f.minAltitude, f.maxAltitude]}
          onChange={([mn, mx]) => setF({ minAltitude: mn, maxAltitude: mx })}
        />
      </Section>

      <Section title={`Ground Speed (kt) — ${f.minGroundSpeed}–${f.maxGroundSpeed}`}>
        <DualRange
          min={0}
          max={700}
          step={10}
          value={[f.minGroundSpeed, f.maxGroundSpeed]}
          onChange={([mn, mx]) => setF({ minGroundSpeed: mn, maxGroundSpeed: mx })}
        />
      </Section>

      <Section title="Status">
        <ChipBool
          label="Emergency squawk only"
          icon={<Bell className="w-3.5 h-3.5" />}
          value={f.emergency === true}
          onChange={(v) => setF({ emergency: v ? true : null })}
        />
        <ChipBool
          label="Military callsigns"
          icon={<PlaneTakeoff className="w-3.5 h-3.5" />}
          value={f.military === true}
          onChange={(v) => setF({ military: v ? true : null })}
        />
        <ChipSelect
          label="Ground / Air"
          value={f.onGround === null ? "any" : f.onGround ? "ground" : "air"}
          options={[
            { id: "any", label: "Both" },
            { id: "air", label: "Air only" },
            { id: "ground", label: "Ground only" },
          ]}
          onChange={(v) => setF({ onGround: v === "any" ? null : v === "ground" })}
        />
      </Section>

      <Section title="Data sources">
        <div className="flex gap-2 flex-wrap">
          {(["airplanes.live", "adsb.fi"] as const).map((s) => {
            const active = f.sources.includes(s);
            return (
              <button
                key={s}
                onClick={() =>
                  setF({
                    sources: active ? f.sources.filter((x) => x !== s) : [...f.sources, s],
                  })
                }
                className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${
                  active
                    ? "bg-pastel-green/25 border-pastel-green/60 text-text-primary"
                    : "bg-pastel-green/[0.04] border-border text-text-secondary"
                }`}
              >
                {active ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Callsign / Registration contains">
        <input
          value={f.callsignQuery}
          onChange={(e) => setF({ callsignQuery: e.target.value })}
          placeholder="e.g. UAL, BAW, N10"
          className="w-full bg-pastel-yellow/[0.04] border border-border rounded-xl px-3 py-2 text-sm focus:border-pastel-yellow/70 outline-none"
        />
      </Section>

      <Section title="Live tracking">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-sm text-text-secondary">Updated {props.lastUpdated ? new Date(props.lastUpdated).toLocaleTimeString() : "—"}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={props.onRefresh}
              className="flex items-center gap-1.5 text-sm rounded-xl bg-pastel-green/20 border border-pastel-green/50 px-3 py-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={() => props.onPausedChange(!props.paused)}
              className={`text-sm rounded-xl px-3 py-1.5 border ${
                props.paused
                  ? "bg-pastel-coral/25 border-pastel-coral/70"
                  : "bg-pastel-blue/15 border-pastel-blue/40"
              }`}
            >
              {props.paused ? "Paused" : "Auto-refresh"}
            </button>
          </div>
        </div>
      </Section>

      <button onClick={props.onClose} className="mt-2 w-full text-sm text-text-secondary hover:text-text-primary">
        Close
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-3 border-b border-border/60 last:border-0">
      <h4 className="text-[11px] uppercase tracking-wider text-text-secondary pb-2">{title}</h4>
      {children}
    </section>
  );
}

function ChipBool({ label, icon, value, onChange }: { label: string; icon?: React.ReactNode; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`inline-flex m-1 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${
        value
          ? "bg-pastel-lavender/30 border-pastel-lavender/70"
          : "bg-pastel-lavender/[0.05] border-border text-text-secondary"
      }`}
      aria-pressed={value}
    >
      {icon} {label}
    </button>
  );
}

function ChipSelect<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="text-sm text-text-secondary mr-1 self-center">{label}:</span>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            value === o.id
              ? "bg-pastel-orange/25 border-pastel-orange/70 text-text-primary"
              : "bg-pastel-orange/[0.04] border-border text-text-secondary"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DualRange({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), hi - step);
          onChange([v, hi]);
        }}
        aria-label="Lower bound"
        className="w-full accent-pastel-coral"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), lo + step);
          onChange([lo, v]);
        }}
        aria-label="Upper bound"
        className="w-full accent-pastel-coral"
      />
    </div>
  );
}
