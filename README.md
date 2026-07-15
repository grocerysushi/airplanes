# Pastel Radar ✈️

A polished, production-ready live global aircraft-tracking web app with a soft
pastel visual language inspired by *Mini Motorways*. Built on real ADS-B feeds.

> Visual style only — no copyrighted artwork, logos, icons, or map assets are
> copied from the referenced game. All branding, UI, and styling is original.

![Pastel Radar](https://img.shields.io/badge/stack-Next.js%2014%20%2B%20MapLibre%20%2B%20TS-blue)

## Features

- **Live aircraft positions** fetched on the current map viewport
- **Three data sources** integrated with graceful fallback
  - **Airplanes.live** (primary ADS-B source)
  - **ADSB.fi** (secondary ADS-B source, used for fallback or supplement)
  - **ADSBDB** (aircraft metadata + origin/destination enrichment)
- **Flat 2D world map** in MapLibre GL, with a custom minimalist pastel style
- **Cluster + symbol layers** for buttery-smooth rendering of thousands of aircraft
- **Heading-rotated aircraft icons** that scale with zoom
- **Selection**: click any aircraft for a friendly, rounded detail panel
  with Follow, Copy, Favorite, and Share actions
- **Search** by callsign, registration, ICAO hex, IATA, ICAO, airport, or city
- **Geolocation** + "Locate Me" button
- **Filters** for altitude range, ground speed, emergency squawk, military callsigns,
  ground/air, callsign/registration substring, data source
- **Coloring modes**: default, by altitude, by aircraft category, by airline
- **Live status pill**, auto-refresh, paused state, manual refresh
- **Provider fallback logic**: if one upstream fails, the other source keeps the map populated
- **Favorites** persisted in localStorage
- **Friendly error toasts** instead of full-screen failures
- **Responsive**: full-screen on mobile, side panels on desktop
- **Accessibility**: keyboard controls, focus rings, ARIA labels, reduced-motion support
- **Routes** viewable at `/?aircraft=<hex>` (deep linking)
- **API health** surfaced in real time

## Tech

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS**
- **MapLibre GL JS**
- **Lucide icons**
- **Zustand** available for advanced state if you want to extend it

## Project layout

```text
app/
  api/
    aircraft/             # GET ?bbox= → merged live aircraft
    aircraft-details/     # GET ?id=hex → enriched detail incl. ADSBDB meta
    search/               # GET ?q=  → normalized search results
  aircraft/[identifier]/  # Friendly deep-link page
  page.tsx                # Home / live map
  layout.tsx
  globals.css
components/
  map/                    # MapLibre style + FlightMap + icons + coloring
  aircraft/               # Detail panel + deep-link client
  search/                 # Search bar + grouped result list
  filters/                # Filters / Settings panel
  layout/                 # Logo + status pill
  ui/                     # Toast notifications
lib/
  providers/              # airplanes-live, adsb-fi, adsbdb, aggregator, normalizer
  data/airports.ts        # Built-in airport directory
  cache.ts                # In-memory TTL cache for metadata/detail
  geo.ts                  # Geo helpers and formatters
  http.ts                 # Timeout + safe-JSON helpers
  search.ts
  types.ts                # Aircraft / Airport / Filters interfaces
  use-favorites.ts
  use-settings.ts
  use-geolocation.ts
```

## Setup

You need **Node 18+** (Node 20+ recommended).

```bash
npm install
cp .env.example .env.local   # optional — defaults are fine
npm run dev                  # http://localhost:3000
```

### Environment variables

All three APIs are public and **require no authentication**. The optional `.env`
values let you tune refresh cadence, metadata TTL, and override endpoints:

| variable | purpose | default |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_NAME` | UI title | Pastel Radar |
| `NEXT_PUBLIC_REFRESH_INTERVAL_MS` | how often to refetch live data | `8000` |
| `METADATA_TTL_MS` | TTL for ADSBDB metadata cache | `21600000` (6h) |
| `NEXT_DEFAULT_RADIUS_NM` | fallback radius when no bbox | `250` |
| `AIRPLANES_LIVE_BASE` | override base | `https://api.airplanes.live` |
| `ADSB_FI_BASE` | override base | `https://opendata.adsb.fi` |
| `ADSBDB_BASE` | override base | `https://api.adsbdb.com` |

## Provider fallback behavior

- The aggregator calls both `airplanes.live` and `adsb.fi` in parallel.
- Each response is normalized into the shared `Aircraft` interface.
- IDs are namespaced (`airplanes.live:<hex>` vs `adsb.fi:<hex>`) so a duplicate
  hex from each source remains a single logical aircraft visually.
- If one source fails (timeout, HTTP error), the other still feeds the map and
  a non-blocking "Backup source active" toast surfaces.
- ADSBDB metadata is fetched lazily on aircraft selection and cached in memory
  for `METADATA_TTL_MS` (default 6h) to avoid duplicate requests.

## Known provider limitations

- **ADSB.fi / Airplanes.live** are global ADS-B aggregators. Coverage is best in
  North America and Europe; remote oceans and the Antarctic are sparse.
- These endpoints are rate-limited and unauthenticated. We apply an 8–9s timeout
  per provider to avoid piling up requests.
- The endpoints' bbox endpoints use *lat/lon boxes* — they will collapse to a
  radius query when the box is too large (we use ADSB.fi's radius fallback
  when serving our map too).
- **ADSBDB** registration lookup occasionally returns 404; we cache that result
  briefly to avoid repeated lookups.

## Deploy

Deploys cleanly to **Vercel** (zero config) or any standard Node host.

```bash
npm run build
npm run start
```

A `vercel.json` is included — it pins the deployment to Vercel's `iad1`
(Washington DC) region and sets safe security headers on API and app routes.

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `tsc --noEmit`, and
`next build` on every push/PR to `main` to catch regressions before deploy.

## License

MIT.
