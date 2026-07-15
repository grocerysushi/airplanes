"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Loader2, Plane, Building2, MapPin, PlaneLanding } from "lucide-react";
import type { SearchResults } from "@/lib/types";

export interface SearchBarProps {
  onSelectAircraft?: (hex: string) => void;
  onSelectAirport?: (icao: string) => void;
  onSelectCity?: (city: { name: string; latitude: number; longitude: number }) => void;
  compact?: boolean;
}

export default function SearchBar(props: SearchBarProps) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!q) {
      setResults(null);
      return;
    }
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (res.ok) setResults(await res.json());
        else setResults(null);
      } catch (e) {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      if (debRef.current) clearTimeout(debRef.current);
    };
  }, [q]);

  const grouped = useMemo(() => {
    return {
      flights: results?.flights ?? [],
      aircraft: results?.aircraft ?? [],
      airports: results?.airports ?? [],
      cities: results?.cities ?? [],
    };
  }, [results]);

  const total = grouped.flights.length + grouped.aircraft.length + grouped.airports.length + grouped.cities.length;

  return (
    <div className={`relative ${props.compact ? "w-full" : "w-[360px] max-w-[80vw]"}`}>
      <div className="surface-card flex items-center gap-2 pl-3 pr-2 py-2">
        <Search className="w-4 h-4 text-text-secondary shrink-0" />
        <input
          aria-label="Search flights, aircraft, airports"
          role="combobox"
          aria-expanded={open}
          className="bg-transparent flex-1 outline-none text-sm placeholder:text-text-secondary/80"
          placeholder="Search flight, registration, airport…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
        />
        {loading && <Loader2 className="w-4 h-4 text-text-secondary animate-spin shrink-0" />}
      </div>

      {open && q && (
        <div
          className="surface-card mt-2 max-h-[70vh] overflow-auto p-2 animate-pop z-30"
          role="listbox"
        >
          {total === 0 && !loading && (
            <div className="text-sm text-text-secondary px-3 py-2">No matches.</div>
          )}

          {grouped.flights.length > 0 && (
            <Section title="Flights" icon={<PlaneLanding className="w-3.5 h-3.5" />}>
              {grouped.flights.map((ac) => (
                <Row
                  key={ac.id}
                  label={ac.callsign ?? ac.hex.toUpperCase()}
                  secondary={[ac.registration, ac.aircraftType, ac.origin && ac.destination ? `${ac.origin} → ${ac.destination}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                  onClick={() => {
                    props.onSelectAircraft?.(ac.hex);
                    setOpen(false);
                    setQ("");
                  }}
                />
              ))}
            </Section>
          )}

          {grouped.aircraft.length > 0 && (
            <Section title="Aircraft" icon={<Plane className="w-3.5 h-3.5" />}>
              {grouped.aircraft.map((ac) => (
                <Row
                  key={ac.id}
                  label={ac.registration ?? ac.hex.toUpperCase()}
                  secondary={[ac.callsign, ac.aircraftType].filter(Boolean).join(" · ") || ac.hex.toUpperCase()}
                  onClick={() => {
                    props.onSelectAircraft?.(ac.hex);
                    setOpen(false);
                    setQ("");
                  }}
                />
              ))}
            </Section>
          )}

          {grouped.airports.length > 0 && (
            <Section title="Airports" icon={<Building2 className="w-3.5 h-3.5" />}>
              {grouped.airports.map((ap, i) => (
                <Row
                  key={`${ap.icao}-${i}`}
                  label={`${ap.iata} · ${ap.icao}`}
                  secondary={`${ap.name} — ${ap.city}, ${ap.country}`}
                  onClick={() => {
                    props.onSelectAirport?.(ap.icao ?? "");
                    setOpen(false);
                    setQ("");
                  }}
                />
              ))}
            </Section>
          )}

          {grouped.cities.length > 0 && (
            <Section title="Cities" icon={<MapPin className="w-3.5 h-3.5" />}>
              {grouped.cities.map((c, i) => (
                <Row
                  key={`${c.city}-${i}`}
                  label={c.city}
                  secondary={c.country}
                  onClick={() => {
                    props.onSelectCity?.({ name: c.city, latitude: c.latitude, longitude: c.longitude });
                    setOpen(false);
                    setQ("");
                  }}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-text-secondary px-3 pb-1 flex items-center gap-1.5">
        {icon} {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({
  label,
  secondary,
  onClick,
}: {
  label: string;
  secondary?: string;
  onClick?: () => void;
}) {
  return (
    <button
      role="option"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="text-left px-3 py-2 rounded-xl hover:bg-pastel-yellow/15 focus:bg-pastel-yellow/20 transition-colors"
    >
      <div className="text-sm font-semibold text-text-primary">{label}</div>
      {secondary && <div className="text-[11px] text-text-secondary">{secondary}</div>}
    </button>
  );
}
