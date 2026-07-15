import type { SearchResults, Aircraft } from "./types";
import { searchAirports, AIRPORTS } from "./data/airports";

export async function searchAll(
  query: string,
  fetchAircraft: (q: string) => Promise<Aircraft[]>,
): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return { aircraft: [], flights: [], airports: [], cities: [] };

  const airports = searchAirports(q);
  const cities: SearchResults["cities"] = [];
  const seenCities = new Set<string>();
  for (const ap of airports) {
    const key = `${ap.city}|${ap.country}`;
    if (seenCities.has(key)) continue;
    seenCities.add(key);
    cities.push({
      name: ap.city,
      city: ap.city,
      country: ap.country,
      latitude: ap.latitude,
      longitude: ap.longitude,
    });
  }

  const a = await fetchAircraft(q).catch(() => []);

  // Heuristic split between aircraft/flights: those with a flights-like callsign vs raw hex.
  const flights: Aircraft[] = [];
  const aircraft: Aircraft[] = [];
  for (const ac of a) {
    if (ac.callsign && /^[A-Z]{2,3}\w{0,5}$/.test(ac.callsign)) flights.push(ac);
    else aircraft.push(ac);
  }

  return { aircraft, flights, airports, cities };
}

export function getAirportByCode(code: string): SearchResults["airports"][number] | undefined {
  const c = code.trim().toLowerCase();
  return AIRPORTS.find(
    (a) => a.icao.toLowerCase() === c || a.iata.toLowerCase() === c,
  );
}
