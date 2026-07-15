"use client";

import { create } from "zustand";
import type {
  Aircraft,
  AircraftDetails,
  Airport,
  BoundingBox,
  FavoriteAircraft,
  LiveStatus,
  ProviderId,
  UserSettings,
} from "./types";
import { aircraftLabel } from "./format";

/** Default settings persisted to localStorage. */
export const DEFAULT_SETTINGS: UserSettings = {
  colorMode: "default",
  refreshIntervalMs: 8000,
  showAirports: true,
  showLabels: false,
  reduceMotion: false,
  labelVisibilityThreshold: 8,
};

/** State persisted to localStorage under one key. */
interface PersistedState {
  settings: UserSettings;
  favorites: FavoriteAircraft[];
  followHex: string | null;
}

const STORAGE_KEY = "pastel-radar:v1";

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") {
    return { settings: DEFAULT_SETTINGS, favorites: [], followHex: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: DEFAULT_SETTINGS, favorites: [], followHex: null };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      favorites: parsed.favorites ?? [],
      followHex: parsed.followHex ?? null,
    };
  } catch {
    return { settings: DEFAULT_SETTINGS, favorites: [], followHex: null };
  }
}

function savePersisted(state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / serialization errors.
  }
}

export interface ToastMessage {
  id: number;
  kind: "info" | "warning" | "error" | "success";
  text: string;
}

export interface Filters {
  enabled: boolean;
  minAltitude: number | null;
  maxAltitude: number | null;
  minSpeed: number | null;
  maxSpeed: number | null;
  airlines: string[]; // included airline names
  types: string[]; // included aircraft types
  militaryOnly: boolean;
  emergencyOnly: boolean;
  airborneOnly: boolean;
  providers: ProviderId[];
  query: string; // callsign / registration text filter
}

export const DEFAULT_FILTERS: Filters = {
  enabled: false,
  minAltitude: null,
  maxAltitude: null,
  minSpeed: null,
  maxSpeed: null,
  airlines: [],
  types: [],
  militaryOnly: false,
  emergencyOnly: false,
  airborneOnly: false,
  providers: [],
  query: "",
};

interface RadarStore {
  // ---- Live data ----
  aircraft: Map<string, Aircraft>;
  status: LiveStatus;
  isLivePaused: boolean;
  isLoading: boolean;
  lastFetchStartedAt: number | null;

  // ---- Selection ----
  selectedHex: string | null;
  selectedDetails: AircraftDetails | null;
  selectedTrail: Array<{ lat: number; lon: number }>;
  selectedAirport: Airport | null;

  // ---- View ----
  viewport: BoundingBox | null;
  viewportCenter: { lat: number; lon: number } | null;

  // ---- Settings + persistence ----
  settings: UserSettings;
  favorites: FavoriteAircraft[];
  followHex: string | null;

  // ---- UI panels ----
  filters: Filters;
  filtersOpen: boolean;
  settingsOpen: boolean;
  searchOpen: boolean;
  mobileBottomSheetOpen: boolean;
  toasts: ToastMessage[];

  // ---- Actions ----
  setAircraft: (next: Aircraft[], status: LiveStatus) => void;
  setStatus: (status: LiveStatus) => void;
  setLivePaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setViewport: (bbox: BoundingBox) => void;
  setViewportCenter: (c: { lat: number; lon: number }) => void;

  selectHex: (hex: string | null) => void;
  setSelectedDetails: (d: AircraftDetails | null) => void;
  pushTrailPoint: (lat: number, lon: number) => void;
  selectAirport: (a: Airport | null) => void;

  updateSettings: (patch: Partial<UserSettings>) => void;
  toggleFavorite: (hex: string) => void;
  isFavorite: (hex: string) => boolean;
  setFollowHex: (hex: string | null) => void;

  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  setFiltersOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileBottomSheetOpen: (open: boolean) => void;

  pushToast: (kind: ToastMessage["kind"], text: string) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useRadarStore = create<RadarStore>((set, get) => {
  const persisted = loadPersisted();

  const persist = () => {
    const s = get();
    savePersisted({
      settings: s.settings,
      favorites: s.favorites,
      followHex: s.followHex,
    });
  };

  return {
    aircraft: new Map(),
    status: {
      source: "none",
      total: 0,
      lastUpdated: null,
      stale: false,
    },
    isLivePaused: false,
    isLoading: false,
    lastFetchStartedAt: null,

    selectedHex: null,
    selectedDetails: null,
    selectedTrail: [],
    selectedAirport: null,

    viewport: null,
    viewportCenter: null,

    settings: persisted.settings,
    favorites: persisted.favorites,
    followHex: persisted.followHex,

    filters: { ...DEFAULT_FILTERS },
    filtersOpen: false,
    settingsOpen: false,
    searchOpen: false,
    mobileBottomSheetOpen: false,
    toasts: [],

    setAircraft: (next, status) =>
      set((state) => {
        const map = new Map<string, Aircraft>();
        for (const a of next) map.set(a.hex, a);
        // Keep selected aircraft in the map even if it dropped out this cycle;
        // it will fade via the stale mechanism in the MapView.
        if (state.selectedHex && !map.has(state.selectedHex)) {
          const prev = state.aircraft.get(state.selectedHex);
          if (prev) map.set(state.selectedHex, prev);
        }
        return { aircraft: map, status };
      }),

    setStatus: (status) => set({ status }),
    setLivePaused: (paused) => set({ isLivePaused: paused }),
    setLoading: (loading) => set({ isLoading: loading }),
    setViewport: (bbox) => set({ viewport: bbox }),
    setViewportCenter: (c) => set({ viewportCenter: c }),

    selectHex: (hex) =>
      set({
        selectedHex: hex,
        selectedDetails: null,
        selectedTrail: [],
        selectedAirport: null,
      }),
    setSelectedDetails: (d) => set({ selectedDetails: d }),
    pushTrailPoint: (lat, lon) =>
      set((state) => {
        if (!state.selectedHex) return {};
        const trail = [...state.selectedTrail, { lat, lon }];
        // Cap trail length to avoid unbounded growth.
        if (trail.length > 120) trail.shift();
        return { selectedTrail: trail };
      }),
    selectAirport: (a) =>
      set({ selectedAirport: a, selectedHex: null, selectedDetails: null }),

    updateSettings: (patch) => {
      set((state) => ({ settings: { ...state.settings, ...patch } }));
      persist();
    },

    toggleFavorite: (hex) => {
      set((state) => {
        const exists = state.favorites.find((f) => f.hex === hex);
        let favorites: FavoriteAircraft[];
        if (exists) {
          favorites = state.favorites.filter((f) => f.hex !== hex);
        } else {
          const a = state.aircraft.get(hex);
          const label = a ? aircraftLabel(a) : hex.toUpperCase();
          favorites = [
            { hex, label, addedAt: Date.now() },
            ...state.favorites,
          ];
        }
        return { favorites };
      });
      persist();
    },

    isFavorite: (hex) => get().favorites.some((f) => f.hex === hex),

    setFollowHex: (hex) => {
      set({ followHex: hex });
      persist();
    },

    setFilters: (patch) =>
      set((state) => ({
        filters: { ...state.filters, ...patch, enabled: true },
      })),
    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
    setFiltersOpen: (open) => set({ filtersOpen: open }),
    setSettingsOpen: (open) => set({ settingsOpen: open }),
    setSearchOpen: (open) => set({ searchOpen: open }),
    setMobileBottomSheetOpen: (open) => set({ mobileBottomSheetOpen: open }),

    pushToast: (kind, text) => {
      const id = ++toastId;
      set((state) => ({ toasts: [...state.toasts, { id, kind, text }] }));
      // Auto-dismiss after 5s.
      setTimeout(() => get().dismissToast(id), 5000);
    },
    dismissToast: (id) =>
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  };
});

/** Apply the active filters to a list of aircraft. */
export function applyFilters(
  aircraft: Aircraft[],
  filters: Filters
): Aircraft[] {
  if (!filters.enabled) return aircraft;
  const q = filters.query.trim().toLowerCase();
  return aircraft.filter((a) => {
    if (
      filters.minAltitude != null &&
      (a.altitude ?? 0) < filters.minAltitude
    )
      return false;
    if (
      filters.maxAltitude != null &&
      (a.altitude ?? Number.POSITIVE_INFINITY) > filters.maxAltitude
    )
      return false;
    if (filters.minSpeed != null && (a.groundSpeed ?? 0) < filters.minSpeed)
      return false;
    if (
      filters.maxSpeed != null &&
      (a.groundSpeed ?? Number.POSITIVE_INFINITY) > filters.maxSpeed
    )
      return false;
    if (
      filters.airlines.length > 0 &&
      (!a.airline || !filters.airlines.includes(a.airline))
    )
      return false;
    if (
      filters.types.length > 0 &&
      (!a.aircraftType || !filters.types.includes(a.aircraftType))
    )
      return false;
    if (filters.militaryOnly) {
      const isMil = !!a.category && /[BE]/.test(a.category);
      if (!isMil) return false;
    }
    if (filters.emergencyOnly && !a.emergency) return false;
    if (filters.airborneOnly && a.onGround) return false;
    if (
      filters.providers.length > 0 &&
      !filters.providers.includes(a.source)
    )
      return false;
    if (q) {
      const hay = `${a.callsign ?? ""} ${a.registration ?? ""} ${a.hex}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
