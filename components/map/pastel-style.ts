// Soft, paper-like minimal vector map style for MapLibre.
// Pastel land, warm off-white canvas, no labels in the deep style, simple country lines.

import type { StyleSpecification } from "maplibre-gl";

const LAND = "#EAE4D8";
const WATER = "#C8E4EA";
const STROKE = "#D8D2C7";
const COASTLINE = "#BCB8A8";
const COUNTRY = "#D3CCBC";
const PARK = "#D7E3C9";

export const pastelMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    world: {
      type: "geojson",
      data: "https://demotiles.maplibre.org/tiles/0/0/0.json" as unknown as any,
    },
    openmaptiles: {
      type: "vector",
      url: "https://demotiles.maplibre.org/style.json",
    },
  } as any,
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#F5F1E8" },
    },
    {
      id: "ocean",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: { "fill-color": WATER },
    },
    {
      id: "land",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "land",
      paint: { "fill-color": LAND },
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": PARK, "fill-opacity": 0.85 },
    },
    {
      id: "country-boundaries",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["==", ["get", "admin_level"], 2],
      paint: { "line-color": COUNTRY, "line-width": 0.6, "line-opacity": 0.85 },
    },
    {
      id: "state-boundaries",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["==", ["get", "admin_level"], 4],
      paint: { "line-color": STROKE, "line-width": 0.4, "line-opacity": 0.8 },
    },
    {
      id: "lake",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["==", ["get", "pmap:kind"], "lake"],
      paint: { "fill-color": "#B6D6DE" },
    },
    {
      id: "river",
      type: "line",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["in", ["get", "pmap:kind"], ["literal", ["river", "stream"]]],
      paint: { "line-color": "#B6D6DE", "line-width": 0.6 },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      paint: { "line-color": "#B6D6DE", "line-width": 0.5 },
    },
    {
      id: "road-minor",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", ["get", "pmap:level"], ["literal", [1, 2]]],
      paint: { "line-color": "#EFE8D8", "line-width": 0.4 },
    },
    {
      id: "road-major",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", ["get", "pmap:level"], ["literal", [3, 4]]],
      paint: { "line-color": "#F4C95D", "line-width": 0.6, "line-opacity": 0.85 },
    },
    {
      id: "road-motorway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["==", ["get", "pmap:level"], 5],
      paint: { "line-color": "#EF8E7D", "line-width": 1.1, "line-opacity": 0.9 },
    },
    {
      id: "place-country",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", ["get", "pmap:kind"], "country"],
      paint: {
        "text-color": "#77736A",
        "text-halo-color": "#FFFDF7",
        "text-halo-width": 1.2,
      },
      layout: {
        "text-field": ["get", "name:en"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 1.5, 9, 5, 12],
        "text-letter-spacing": 0.16,
      },
      minzoom: 1.5,
      maxzoom: 6,
    },
    {
      id: "place-city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["in", ["get", "pmap:kind"], ["literal", ["city", "town"]]],
      paint: {
        "text-color": "#34332F",
        "text-halo-color": "#FFFDF7",
        "text-halo-width": 1,
      },
      layout: {
        "text-field": ["get", "name:en"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 11, 9, 14],
      },
      minzoom: 4,
    },
  ],
};
