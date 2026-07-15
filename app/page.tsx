"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Logo, StatusPill } from "@/components/layout/Branding";
import SearchBar from "@/components/search/SearchBar";
import FiltersPanel from "@/components/filters/FiltersPanel";
import AircraftDetailPanel from "@/components/aircraft/AircraftDetailPanel";
import MapControls from "@/components/map/MapControls";
import HoverTooltip from "@/components/aircraft/HoverTooltip";
import ErrorToast from "@/components/ui/Toast";
import { useFavorites } from "@/lib/use-favorites";
import { usePersistedSettings } from "@/lib/use-settings";
import { clampBbox, pointInBbox } from "@/lib/geo";
import type {
  Aircraft,
  AircraftDetailResponse,
  AircraftFilters,
  ProviderStatus,
} from "@/lib/types";
import type { ColoringMode } from "@/components/map/coloring";
import { isLikelyMilitary } from "@/lib/geo";

const FlightMap = dynamic(() => import("@/components/map/FlightMap"), { ssr: false });

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

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) || 8000;

export default function Page() {
  const [aircraft, setAircraft] = useState<Map<string, Aircraft>>(new Map());
  const [statuses, setStatuses] = useState<ProviderStatus[]>([]);
  const [bbox, setBbox] = useState({ minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 });
  const [selectedHex, setSelectedHex] = useState<string | null>(null);
  const [hoveredHex, setHoveredHex] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; text: string[] }>({ x: 0, y: 0, text: [] });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState<AircraftDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [filters, setFilters] = useState<AircraftFilters>(DEFAULTS);
  const [coloring, setColoring] = useState<ColoringMode>("default");
  const [following, setFollowing] = useState(false);
  const [followingHex, setFollowingHex] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string; tone: "warning" | "error" | "info" }[]>([]);
  const [isStale, setIsStale] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const stRef = useRef(stToText(setToasts));

  const { isFavorite, toggle: toggleFav } = useFavorites();
  const { settings, setSettings, ready: settingsReady } = usePersistedSettings();

  // Persisted settings load (coloring only)
  useEffect(() => {
    if (settingsReady && settings.coloring) setColoring(settings.coloring as ColoringMode);
  }, [settingsReady, settings.coloring]);

  // URL aircraft param support
  useEffect(() => {
    const url = new URL(window.location.href);
    const hex = url.searchParams.get("aircraft");
    if (hex) setSelectedHex(hex.toLowerCase());
  }, []);

  // Visible aircraft based on filters
  const visibleAircraft = useMemo(() => {
    const out: Aircraft[] = [];
    aircraft.forEach((ac) => {
      if (!pointInBbox(ac.latitude, ac.longitude, bbox)) return;
      const alt = ac.altitude ?? 0;
      if (alt < filters.minAltitude || alt > filters.maxAltitude) return;
      const sp = ac.groundSpeed ?? 0;
      if (sp < filters.minGroundSpeed || sp > filters.maxGroundSpeed) return;
      if (filters.emergency === true && !ac.emergency) return;
      if (filters.military === true && !isLikelyMilitary(ac.callsign)) return;
      if (filters.onGround !== null) {
        if (filters.onGround && !ac.onGround) return;
        if (!filters.onGround && ac.onGround) return;
      }
      if (!filters.sources.includes(ac.source)) return;
      if (filters.callsignQuery) {
        const q = filters.callsignQuery.toLowerCase();
        const a = (ac.callsign ?? "").toLowerCase();
        const r = (ac.registration ?? "").toLowerCase();
        if (!a.includes(q) && !r.includes(q) && !ac.hex.includes(q)) return;
      }
      out.push(ac);
    });
    return out;
  }, [aircraft, bbox, filters]);

  const visibleMap = useMemo(() => {
    const m = new Map<string, Aircraft>();
    for (const a of visibleAircraft) m.set(a.id, a);
    return m;
  }, [visibleAircraft]);

  // Fetch from /api/aircraft
  const controllerRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef<Promise<any> | null>(null);
  const fetchAircraft = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    try {
      const url = `/api/aircraft?minLat=${bbox.minLat}&maxLat=${bbox.maxLat}&minLon=${bbox.minLon}&maxLon=${bbox.maxLon}`;
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setStatuses(data.statuses ?? []);
      const next = new Map<string, Aircraft>();
      for (const ac of data.aircraft as Aircraft[]) next.set(ac.id, ac);
      setAircraft(next);
      setLastUpdated(data.fetchedAt ?? new Date().toISOString());
      const anyOk = (data.statuses ?? []).some((s: ProviderStatus) => s.ok);
      if (!anyOk) {
        stRef.current?.({ text: "All live data sources are currently offline.", tone: "error" });
      } else {
        const errors = (data.statuses ?? []).filter((s: ProviderStatus) => !s.ok);
        if (errors.length === 1) {
          stRef.current?.({ text: `Backup source active — ${errors[0].source} unavailable.`, tone: "warning" });
        }
      }
      setRefreshTick((t) => t + 1);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        stRef.current?.({ text: "Network error fetching live data.", tone: "error" });
      }
    }
  }, [bbox.minLat, bbox.maxLat, bbox.minLon, bbox.maxLon]);

  // Fire on bbox change and on timer (and not while paused)
  const lastTickRef = useRef(0);
  useEffect(() => {
    fetchAircraft();
    lastTickRef.current = Date.now();
  }, [bbox, fetchAircraft]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      fetchAircraft();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [paused, fetchAircraft]);

  // Stale detection
  useEffect(() => {
    const id = setInterval(() => {
      if (!lastUpdated) return;
      const age = (Date.now() - new Date(lastUpdated).getTime()) / 1000;
      setIsStale(age > REFRESH_MS / 1000 * 2.5);
    }, 4000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  // Aircraft detail fetch on selection
  useEffect(() => {
    if (!selectedHex) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    (async () => {
      try {
        const r = await fetch(`/api/aircraft-details?id=${encodeURIComponent(selectedHex)}`);
        if (r.ok) {
          const data = (await r.json()) as AircraftDetailResponse;
          if (!cancelled) setDetail(data);
        } else if (r.status === 404) {
          setDetail({ aircraft: liveOrFallback(selectedHex, aircraft), fetchedAt: new Date().toISOString() });
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedHex, refreshTick]);

  const onSelect = useCallback((hex: string | null) => setSelectedHex(hex), []);
  const onHover = useCallback(
    (hex: string | null, payload?: { lng: number; lat: number }) => {
      const safeHex = hex ?? "";
      setHoveredHex(safeHex);
      const ac = hex ? aircraft.get(`${hex}`) ?? Array.from(aircraft.values()).find((a) => a.hex === hex) : null;
      if (ac) {
        setTooltipPos({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          text: [ac.callsign ?? ac.registration ?? safeHex.toUpperCase(), formatLine(ac)],
        });
      } else {
        setTooltipPos({ x: 0, y: 0, text: [""] });
      }
    },
    [aircraft],
  );

  // Track mouse pos for tooltip
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setTooltipPos((t) => ({ ...t, x: e.clientX, y: e.clientY }));
    };
    if (hoveredHex) window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [hoveredHex]);

  const handleFiltersChange = (next: AircraftFilters) => {
    setFilters(next);
    setSettings({ filters: next });
  };

  const handleColoringChange = (c: ColoringMode) => {
    setColoring(c);
    setSettings({ coloring: c });
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <FlightMap
        aircraft={visibleMap}
        statuses={statuses}
        selectedHex={selectedHex}
        hoveredHex={hoveredHex}
        coloring={coloring}
        filters={filters}
        onSelect={(h) => {
          onSelect(h);
          if (h) setFollowingHex(h);
        }}
        onHover={onHover}
        onMoveEnd={(b) => {
          const next = clampBbox(b);
          setBbox((cur) =>
            cur.minLat === next.minLat &&
            cur.maxLat === next.maxLat &&
            cur.minLon === next.minLon &&
            cur.maxLon === next.maxLon
              ? cur
              : next,
          );
        }}
        followHex={following ? followingHex : null}
      />

      {/* Top-left: logo + status + search */}
      <div className="absolute top-3 left-3 right-3 md:right-auto flex items-start gap-3 z-20 pointer-events-none">
        <div className="surface-card px-3 py-2 flex items-center gap-2 pointer-events-auto">
          <Logo />
          <span className="hidden md:block mx-1 h-6 w-px bg-border" />
          <div className="hidden md:block">
            <StatusPill statuses={statuses} lastUpdated={lastUpdated} isStale={isStale} />
          </div>
        </div>
        <div className="pointer-events-auto">
          <SearchBar
            onSelectAircraft={(h) => setSelectedHex(h.toLowerCase())}
            onSelectAirport={(icao) => window.dispatchEvent(new CustomEvent("airport:focus", { detail: icao }))}
            onSelectCity={(c) => window.dispatchEvent(new CustomEvent("city:focus", { detail: c }))}
          />
        </div>
      </div>

      {/* Right controls (filters + detail panel) */}
      <div className="absolute top-3 right-3 flex gap-3 z-20">
        <div className="flex flex-col gap-2 items-end">
          <MapControls
            onLocateMe={() => window.dispatchEvent(new CustomEvent("map:locate-me"))}
            onOpenFilters={() => setFiltersOpen(true)}
            inFlightCount={visibleAircraft.length}
            visibleCount={visibleAircraft.length}
          />
        </div>
      </div>

      {/* Mobile-friendly bottom panel for filter toggle */}
      <div className="md:hidden absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="surface-card px-3 py-2 text-sm font-semibold"
        >
          Filters
        </button>
        <StatusPill statuses={statuses} lastUpdated={lastUpdated} isStale={isStale} />
      </div>

      {filtersOpen && (
        <div className="absolute top-20 right-3 z-30 max-h-[80vh]">
          <FiltersPanel
            open
            onClose={() => setFiltersOpen(false)}
            filters={filters}
            onChange={handleFiltersChange}
            coloring={coloring}
            onColoringChange={handleColoringChange}
            paused={paused}
            onPausedChange={setPaused}
            onRefresh={() => fetchAircraft()}
            lastUpdated={lastUpdated}
          />
        </div>
      )}

      {selectedHex && (
        <div className="hidden md:block absolute top-20 right-[80px] z-30 max-h-[80vh]">
          <AircraftDetailPanel
            hex={selectedHex}
            aircraftMap={aircraft}
            initial={detail}
            loading={detailLoading}
            onClose={() => {
              setSelectedHex(null);
              setFollowingHex(null);
              setFollowing(false);
            }}
            onFollow={(h) => {
              if (!h) {
                setFollowing(false);
                setFollowingHex(null);
                return;
              }
              setFollowing(true);
              setFollowingHex(h);
            }}
            following={following && followingHex === selectedHex}
            isFavorite={isFavorite(selectedHex)}
            onToggleFavorite={toggleFav}
          />
        </div>
      )}

      <HoverTooltip visible={!!hoveredHex} x={tooltipPos.x} y={tooltipPos.y} text={tooltipPos.text} />

      <ErrorToast messages={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </main>
  );
}

function stToText(setToasts: React.Dispatch<React.SetStateAction<any[]>>) {
  let idCounter = 0;
  return (msg: { text: string; tone: "warning" | "error" | "info" }) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, ...msg }]);
  };
}

function liveOrFallback(hex: string, map: Map<string, Aircraft>): Aircraft {
  const found = map.get(`${hex}`) ?? Array.from(map.values()).find((a) => a.hex === hex);
  if (found) return found;
  return {
    id: `live-fallback:${hex}`,
    hex,
    latitude: 0,
    longitude: 0,
    source: "airplanes.live",
    lastUpdated: new Date().toISOString(),
  };
}

function formatLine(ac: Aircraft): string {
  const parts: string[] = [];
  if (ac.aircraftType) parts.push(ac.aircraftType);
  if (ac.altitude !== undefined) parts.push(`${Math.round(ac.altitude)} ft`);
  if (ac.groundSpeed !== undefined) parts.push(`${Math.round(ac.groundSpeed)} kt`);
  return parts.join(" · ");
}
