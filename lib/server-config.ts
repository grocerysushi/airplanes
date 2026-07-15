/**
 * Server-only configuration. Importing this module from client code will fail
 * the build (it is only referenced from app/api routes and lib/providers).
 */

export const SERVER_CONFIG = {
  airplanesLive: {
    /** Optional API key (Airplanes.live supports unauthenticated requests too). */
    apiKey: process.env.AIRPLANES_LIVE_API_KEY ?? "",
    baseUrl:
      process.env.AIRPLANES_LIVE_BASE_URL ?? "https://api.airplanes.live",
    /** Max aircraft per request from this provider. */
    maxResults: Number(process.env.AIRPLANES_LIVE_MAX_RESULTS ?? 250),
  },
  adsbFi: {
    baseUrl: process.env.ADSB_FI_BASE_URL ?? "https://api.adsb.fi",
    enabled: process.env.ADSB_FI_ENABLED !== "false",
  },
  adsbdb: {
    baseUrl: process.env.ADSBDB_BASE_URL ?? "https://api.adsbdb.com",
    apiKey: process.env.ADSBDB_API_KEY ?? "",
    enabled: process.env.ADSBDB_ENABLED !== "false",
  },
  network: {
    /** Per-request timeout in ms. */
    timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 8000),
    /** Bypass server-side provider calls and return empty results (dev safety). */
    dryRun: process.env.PROVIDER_DRY_RUN === "true",
  },
  /** When true, prefer adsb.fi over airplanes.live for viewport queries. */
  preferAdsbFi: process.env.PREFER_ADSB_FI === "true",
  /** Treat data older than this many seconds as stale. */
  staleAfterSeconds: Number(process.env.STALE_AFTER_SECONDS ?? 45),
} as const;

/** Order in which viewport providers are attempted. */
export function viewportProviderOrder(): ("airplanes.live" | "adsb.fi")[] {
  return SERVER_CONFIG.preferAdsbFi
    ? ["adsb.fi", "airplanes.live"]
    : ["airplanes.live", "adsb.fi"];
}
