// Pastel, paper-like minimal vector map style for MapLibre.
// Built atop the canonical OpenMapTiles schema served by OpenFreeMap (free, no
// key required). All paint properties are tuned to a flat Mini Motorways-inspired
// off-white palette.

import type { StyleSpecification } from "maplibre-gl";

const LAND = "#EAE4D8";          // warm pale land
const WATER = "#C8E4EA";         // pale blue water
const BACKGROUND = "#F5F1E8";    // warm canvas
const PARK = "#D7E3C9";          // pale green parks
const STREET_FILL = "#FBE3B5";   // amber minor roads
const STREET_CASING = "#F4C95D"; // yellow major roads
const MOTORWAY = "#EF8E7D";      // coral motorways
const BORDER_ADMIN = "#C3B9A0";  // soft taupe country borders
const BORDER_STATE = "#D8D2C7";  // very soft internal borders
const BUILDING = "#E2DCC8";      // very pale taupe buildings

const OPEN_FREE_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export const pastelMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    ne2_shaded: {
      type: "raster",
      tiles: ["https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 6,
      attribution: "© OpenFreeMap, Natural Earth, OpenStreetMap contributors",
    },
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
    // Raster fallback that always paints something visible — even if the
    // vector tiles are slow or blocked. Slightly desaturated via raster-saturation
    // to read as on-brand pastel.
    "osm-fallback": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap France (CC-BY-SA)",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": BACKGROUND },
    },
    {
      id: "ne-shaded-relief",
      type: "raster",
      source: "ne2_shaded",
      paint: { "raster-opacity": 0.18, "raster-saturation": -0.4 },
      maxzoom: 6,
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": PARK, "fill-opacity": 0.85 },
    },
    {
      id: "landuse-wood",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: { "fill-color": "#DDE9CD", "fill-opacity": 0.7 },
    },
    {
      id: "landuse-residential",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["==", ["get", "class"], "residential"],
      paint: { "fill-color": LAND, "fill-opacity": 0.45 },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
      paint: { "fill-color": WATER },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      paint: { "line-color": WATER, "line-width": 0.6, "line-opacity": 0.95 },
    },
    {
      id: "land-boundary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", ["get", "admin_level"], 2],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
      ],
      paint: { "line-color": BORDER_ADMIN, "line-width": 0.8, "line-opacity": 0.9 },
    },
    {
      id: "state-boundary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        [">=", ["get", "admin_level"], 3],
        ["<=", ["get", "admin_level"], 6],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
      ],
      paint: { "line-color": BORDER_STATE, "line-width": 0.4, "line-opacity": 0.7 },
    },
    {
      id: "highway-path",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
        ["==", ["get", "class"], "path"],
      ],
      paint: { "line-color": "#D8D2C7", "line-width": 0.4 },
    },
    {
      id: "highway-minor",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
        ["match", ["get", "class"], ["minor", "service", "track"], true, false],
      ],
      paint: { "line-color": "#EFE8D8", "line-width": 0.5 },
    },
    {
      id: "highway-major-casing",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
        ["match", ["get", "class"], ["primary", "secondary", "tertiary", "trunk"], true, false],
      ],
      paint: { "line-color": STREET_CASING, "line-width": 1.0, "line-opacity": 0.9 },
    },
    {
      id: "highway-motorway-casing",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
        ["==", ["get", "class"], "motorway"],
      ],
      paint: { "line-color": MOTORWAY, "line-width": 1.6, "line-opacity": 0.95 },
    },
    {
      id: "rail",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: [
        "all",
        ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false],
        ["==", ["get", "class"], "rail"],
      ],
      paint: { "line-color": "#C6BBA2", "line-width": 0.4, "line-dasharray": [2, 2] },
    },
    {
      id: "aeroway-runway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "aeroway",
      filter: [
        "match",
        ["geometry-type"],
        ["LineString", "MultiLineString"],
        true,
        false,
      ],
      paint: { "line-color": "#D7CFBE", "line-width": 0.7 },
    },
    {
      id: "building",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 12,
      paint: { "fill-color": BUILDING, "fill-opacity": 0.6 },
    },
    {
      id: "osm-fallback",
      type: "raster",
      source: "osm-fallback",
      paint: {
        "raster-opacity": 0.45,
        "raster-saturation": -0.6,
        "raster-contrast": -0.15,
      },
      layout: { visibility: "visible" },
    },
    {
      id: "country-label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", ["get", "class"], "country"],
      minzoom: 1.5,
      maxzoom: 6,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 1.5, 9, 5, 12],
        "text-letter-spacing": 0.18,
      },
      paint: {
        "text-color": "#77736A",
        "text-halo-color": "#FFFDF7",
        "text-halo-width": 1.4,
      },
    },
    {
      id: "city-label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["in", ["get", "class"], ["literal", ["city", "town"]]],
      minzoom: 4,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 11, 9, 14],
      },
      paint: {
        "text-color": "#34332F",
        "text-halo-color": "#FFFDF7",
        "text-halo-width": 1.2,
      },
    },
  ],
};

export const POSITRON_STYLE_URL = OPEN_FREE_MAP_STYLE_URL;
