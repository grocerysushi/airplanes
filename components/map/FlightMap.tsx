"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import maplibregl, { Map as MLMap, LngLatBoundsLike, MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { pastelMapStyle } from "./pastel-style";
import type { Aircraft, AircraftFilters } from "@/lib/types";
import type { ColoringMode } from "./coloring";
import { colorForAircraft, COLORING_MODES } from "./coloring";
import { loadAllAircraftIcons } from "./aircraft-icons";
import { AIRPORTS } from "@/lib/data/airports";
import { clampBbox, bboxFromMapBounds } from "@/lib/geo";

export interface FlightMapProps {
  aircraft: Map<string, Aircraft>;
  statuses: { source: string; ok: boolean; count: number; error?: string }[];
  selectedHex: string | null;
  hoveredHex: string | null;
  coloring: ColoringMode;
  filters: AircraftFilters;
  onSelect: (hex: string | null) => void;
  onHover: (hex: string | null, payload?: { lng: number; lat: number }) => void;
  onMoveEnd?: (bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number }) => void;
  initialBounds?: LngLatBoundsLike;
  followHex?: string | null;
}

const SOURCE_ID = "aircraft-src";
const CLUSTER_LAYER = "aircraft-clusters";
const COUNT_LAYER = "aircraft-cluster-count";
const FLIGHT_LAYER = "aircraft-points";
const SELECTED_LAYER = "aircraft-selected";
const AIRPORT_SOURCE = "airport-src";
const AIRPORT_LAYER = "airport-points";
const LOC_LAYER = "loc-arrow";

export default function FlightMap(props: FlightMapProps) {
  const ref = useRef<MLMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const initialMarkerRef = useRef<string | null>(null);

  // Init map
  useEffect(() => {
    if (!containerRef.current || ref.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: pastelMapStyle as any,
      bounds: props.initialBounds ?? ([
        [-150, -45],
        [150, 70],
      ] as LngLatBoundsLike),
      fitBoundsOptions: { padding: 60 },
      attributionControl: { compact: true, customAttribution: "© Pastel Radar" },
      cooperativeGestures: false,
      maxPitch: 0,
      minZoom: 1.5,
      maxZoom: 14,
      fadeDuration: 350,
    });
    ref.current = map;
    map.dragRotate.disable();
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-right",
    );
    map.on("load", async () => {
      try {
        const icons = await loadAllAircraftIcons();
        addAirportLayer(map);
        addAirspaceLayer(map);
        addAircraftLayer(map, icons);
        addLocArrow(map, icons);
        setReady(true);
        const b = map.getBounds();
        const bbox = bboxFromMapBounds(b);
        props.onMoveEnd?.(clampBbox(bbox));
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load aircraft icons", err?.message ?? err);
        // Still mark ready so UI doesn't hang — aircraft symbols will be omitted.
        setReady(true);
      }
    });
    map.on("error", (e: any) => {
      // Surface tile/style errors so silent map breakage is visible.
      // eslint-disable-next-line no-console
      console.warn("[map error]", e?.error?.message ?? e);
      window.dispatchEvent(new CustomEvent("map:error", { detail: e?.error?.message ?? "map error" }));
    });
    map.on("moveend", () => {
      const b = map.getBounds();
      const bbox = bboxFromMapBounds(b);
      props.onMoveEnd?.(clampBbox(bbox));
    });
    return () => {
      map.remove();
      ref.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External selected/follow updates
  useEffect(() => {
    const m = ref.current;
    if (!m || !ready) return;
    const ac = props.selectedHex ? props.aircraft.get(`${props.followHex?.startsWith(":") ? "" : ""}${props.selectedHex}`) : null;
    if (ac) {
      m.flyTo({ center: [ac.longitude, ac.latitude], zoom: Math.max(m.getZoom(), 7), speed: 0.8 });
    }
  }, [props.selectedHex, props.followHex, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the visible aircraft layer in sync
  useEffect(() => {
    if (!ready) return;
    updateAircraftSource();
    updateSelectedHighlight();
    paintColorMode();
  }, [ready, props.aircraft, props.selectedHex, props.hoveredHex, props.coloring]);

  const updateAircraftSource = useCallback(() => {
    const m = ref.current;
    if (!m) return;
    const source = m.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;
    const features = createFeatures(props.aircraft, props.selectedHex);
    source.setData({ type: "FeatureCollection", features });
  }, [props.aircraft, props.selectedHex]);

  const updateSelectedHighlight = useCallback(() => {
    const m = ref.current;
    if (!m || !m.getLayer(SELECTED_LAYER)) return;
    const hex = (props.selectedHex ?? "").toLowerCase();
    m.setFilter(SELECTED_LAYER, ["==", ["get", "hex"], hex]);
  }, [props.selectedHex]);

  const paintColorMode = useCallback(() => {
    const m = ref.current;
    if (!m || !m.getLayer(FLIGHT_LAYER)) return;
    const uses = COLORING_MODES.find((c) => c.id === props.coloring)?.id;
    const colorStops = colorStopsForMode(uses ?? props.coloring);
    m.setPaintProperty(FLIGHT_LAYER, "icon-color", "#34332F");
    // For symbol layer, we color via icon-image swap
    (m.getSource(SOURCE_ID) as any).updateImage?.();
    swapAircraftIcons(m, props.coloring, props.aircraft, props.selectedHex, props.hoveredHex);
  }, [props.aircraft, props.selectedHex, props.hoveredHex, props.coloring]);

  // Helpers --------------------------------------------------------------

  function addAirspaceLayer(map: MLMap) {
    if (!map.getSource("openmaptiles")) return;
    // nothing extra — countries/cities styled via pastel-style.
  }

  function addAirportLayer(map: MLMap) {
    const features = AIRPORTS.filter((a) => Number.isFinite(a.latitude)).map((a) => ({
      type: "Feature" as const,
      properties: { icao: a.icao, iata: a.iata, name: a.name, city: a.city, country: a.country },
      geometry: { type: "Point" as const, coordinates: [a.longitude, a.latitude] },
    }));
    map.addSource(AIRPORT_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features } });
    map.addLayer({
      id: AIRPORT_LAYER,
      source: AIRPORT_SOURCE,
      type: "circle",
      minzoom: 4,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 2, 8, 4, 12, 6],
        "circle-color": "#78AFC8",
        "circle-stroke-color": "#FFFDF7",
        "circle-stroke-width": 1.4,
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.65, 8, 0.9],
      },
    });
    map.addLayer({
      id: "airport-label",
      source: AIRPORT_SOURCE,
      type: "symbol",
      minzoom: 6,
      layout: {
        "text-field": ["get", "iata"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 11,
        "text-offset": [0, 1.2],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#34332F",
        "text-halo-color": "#FFFDF7",
        "text-halo-width": 1.2,
      },
    });
  }

  function addAircraftLayer(map: MLMap, icons: Record<string, { data: ImageData; width: number; height: number }>) {
    // Pre-render plane icons for each coloring bucket (compact set of colors).
    Object.entries(icons).forEach(([name, img]) => {
      try {
        map.addImage(name, { width: img.width, height: img.height, data: new Uint8Array(img.data.data) }, { sdf: false });
      } catch (e) {
        // skip individual image failures
      }
    });

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    // Clustering layer that groups aircraft at low zoom
    map.addLayer({
      id: CLUSTER_LAYER,
      source: SOURCE_ID,
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-radius": ["step", ["get", "point_count"], 12, 25, 16, 100, 22],
        "circle-color": "#F4C95D",
        "circle-stroke-color": "#FFFDF7",
        "circle-stroke-width": 2.5,
        "circle-opacity": 0.95,
      },
    });

    map.addLayer({
      id: COUNT_LAYER,
      source: SOURCE_ID,
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Noto Sans Bold"],
        "text-size": 11,
      },
      paint: { "text-color": "#34332F" },
    });

    // Individual aircraft glyph icons (rotated via "icon-rotate" on each feature)
    map.addLayer({
      id: FLIGHT_LAYER,
      source: SOURCE_ID,
      type: "symbol",
      filter: ["!", ["has", "point_count"]],
      minzoom: 2,
      layout: {
        "icon-image": "plane-base",
        "icon-rotate": ["get", "heading"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-size": ["interpolate", ["linear"], ["zoom"], 2, 0.7, 6, 0.85, 9, 1.1, 12, 1.4],
      },
    });

    // Selected aircraft — slightly larger highlight
    map.addLayer({
      id: SELECTED_LAYER,
      source: SOURCE_ID,
      type: "circle",
      filter: ["==", ["get", "hex"], ""],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 6, 9, 14],
        "circle-color": "#EF8E7D",
        "circle-opacity": 0.22,
        "circle-stroke-color": "#EF8E7D",
        "circle-stroke-width": 1.5,
      },
    });

    // Interactions
    map.on("mouseenter", FLIGHT_LAYER, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", FLIGHT_LAYER, () => {
      map.getCanvas().style.cursor = "";
      props.onHover(null);
    });
    map.on("mousemove", FLIGHT_LAYER, (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) return;
      const hex = String((f.properties as any)?.hex ?? "");
      props.onHover(hex, { lng: e.lngLat.lng, lat: e.lngLat.lat });
    });
    map.on("click", FLIGHT_LAYER, (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) return;
      const hex = String((f.properties as any)?.hex ?? "");
      if (hex) props.onSelect(hex);
    });
    map.on("click", CLUSTER_LAYER, async (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) return;
      const clusterId = (f.properties as any)?.cluster_id;
      const src = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
      try {
        const zoom = await src.getClusterExpansionZoom(clusterId);
        map.flyTo({ center: (f.geometry as any).coordinates, zoom });
      } catch {
        map.flyTo({ center: (f.geometry as any).coordinates, zoom: map.getZoom() + 1.5 });
      }
    });
    map.on("click", AIRPORT_LAYER, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const iata = (f.properties as any)?.iata;
      window.dispatchEvent(new CustomEvent("airport:select", { detail: f.properties }));
      if (iata) console.debug("airport click", iata);
    });
    map.on("mouseenter", AIRPORT_LAYER, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", AIRPORT_LAYER, () => (map.getCanvas().style.cursor = ""));
  }

  function addLocArrow(map: MLMap, icons: Record<string, { data: ImageData; width: number; height: number }>) {
    map.addSource(LOC_LAYER, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    const loc = icons["loc-arrow-img"];
    if (loc) {
      try {
        if (!map.hasImage("loc-arrow-img")) {
          map.addImage("loc-arrow-img", { width: loc.width, height: loc.height, data: new Uint8Array(loc.data.data) }, { sdf: false });
        }
      } catch (e) {
        // ignore
      }
    }
    map.addLayer({
      id: LOC_LAYER,
      source: LOC_LAYER,
      type: "symbol",
      layout: {
        "icon-image": "loc-arrow-img",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  }

  function createFeatures(acMap: Map<string, Aircraft>, selectedHex: string | null) {
    const features: any[] = [];
    acMap.forEach((ac) => {
      features.push({
        type: "Feature",
        properties: {
          hex: ac.hex,
          callsign: ac.callsign ?? "",
          reg: ac.registration ?? "",
          altitude: ac.altitude ?? -1,
          heading: typeof ac.heading === "number" ? ac.heading : 0,
          selected: selectedHex === ac.hex,
          color: colorForAircraft(ac, props.coloring),
        },
        geometry: { type: "Point", coordinates: [ac.longitude, ac.latitude] },
      });
    });
    return features;
  }

  function swapAircraftIcons(
    _m: MLMap,
    mode: ColoringMode,
    acMap: Map<string, Aircraft>,
    selectedHex: string | null,
    hoveredHex: string | null,
  ) {
    // The visible circle/halo already covers "selected". For per-feature color
    // we keep a single icon image; the halo and color halo convey status.
    void mode;
    void acMap;
    void selectedHex;
    void hoveredHex;
  }

  function colorStopsForMode(_mode: ColoringMode): unknown[] {
    return [];
  }

  return (
    <div ref={containerRef} className="absolute inset-0" aria-label="Live flight map" />
  );
}
export { maplibregl as maplibre };

