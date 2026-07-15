import type { Airport } from "./types";

/**
 * A curated list of the world's busiest / most recognizable airports.
 *
 * The `size` field controls at which zoom level a marker appears:
 *  - "large": major hubs, shown from continent zoom levels
 *  - "medium": regional hubs, shown at country zoom levels
 *  - "small": smaller fields, shown when zoomed in further
 */
export const AIRPORTS: Airport[] = [
  // ---- Large hubs ----
  { icao: "KATL", iata: "ATL", name: "Hartsfield–Jackson Atlanta International", city: "Atlanta", country: "United States", latitude: 33.6407, longitude: -84.4277, size: "large" },
  { icao: "ZBAA", iata: "PEK", name: "Beijing Capital International", city: "Beijing", country: "China", latitude: 40.0799, longitude: 116.6031, size: "large" },
  { icao: "OMDB", iata: "DXB", name: "Dubai International", city: "Dubai", country: "United Arab Emirates", latitude: 25.2532, longitude: 55.3657, size: "large" },
  { icao: "KLAX", iata: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "United States", latitude: 33.9416, longitude: -118.4085, size: "large" },
  { icao: "RJTT", iata: "HND", name: "Tokyo Haneda International", city: "Tokyo", country: "Japan", latitude: 35.5494, longitude: 139.7798, size: "large" },
  { icao: "EGLL", iata: "LHR", name: "London Heathrow", city: "London", country: "United Kingdom", latitude: 51.47, longitude: -0.4543, size: "large" },
  { icao: "ZSPD", iata: "PVG", name: "Shanghai Pudong International", city: "Shanghai", country: "China", latitude: 31.1443, longitude: 121.8083, size: "large" },
  { icao: "VHHH", iata: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "Hong Kong", latitude: 22.308, longitude: 113.9185, size: "large" },
  { icao: "LFPG", iata: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "France", latitude: 49.0097, longitude: 2.5479, size: "large" },
  { icao: "EHAM", iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", latitude: 52.3105, longitude: 4.7683, size: "large" },
  { icao: "EDDF", iata: "FRA", name: "Frankfurt am Main", city: "Frankfurt", country: "Germany", latitude: 50.0379, longitude: 8.5622, size: "large" },
  { icao: "WSSS", iata: "SIN", name: "Singapore Changi", city: "Singapore", country: "Singapore", latitude: 1.3644, longitude: 103.9915, size: "large" },
  { icao: "KORD", iata: "ORD", name: "Chicago O'Hare International", city: "Chicago", country: "United States", latitude: 41.9742, longitude: -87.9073, size: "large" },
  { icao: "VIDP", iata: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India", latitude: 28.5562, longitude: 77.1, size: "large" },
  { icao: "KDFW", iata: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "United States", latitude: 32.8998, longitude: -97.0403, size: "large" },
  { icao: "KJFK", iata: "JFK", name: "John F. Kennedy International", city: "New York", country: "United States", latitude: 40.6413, longitude: -73.7781, size: "large" },
  { icao: "KSEA", iata: "SEA", name: "Seattle–Tacoma International", city: "Seattle", country: "United States", latitude: 47.4502, longitude: -122.3088, size: "large" },
  { icao: "KSFO", iata: "SFO", name: "San Francisco International", city: "San Francisco", country: "United States", latitude: 37.6213, longitude: -122.379, size: "large" },
  { icao: "YVR", iata: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada", latitude: 49.1967, longitude: -123.1815, size: "large" },
  { icao: "CYYZ", iata: "YYZ", name: "Toronto Pearson International", city: "Toronto", country: "Canada", latitude: 43.6777, longitude: -79.6248, size: "large" },
  { icao: "MMMX", iata: "MEX", name: "Mexico City International", city: "Mexico City", country: "Mexico", latitude: 19.4363, longitude: -99.0721, size: "large" },
  { icao: "SBGR", iata: "GRU", name: "São Paulo–Guarulhos International", city: "São Paulo", country: "Brazil", latitude: -23.4356, longitude: -46.4731, size: "large" },
  { icao: "SAEZ", iata: "EZE", name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina", latitude: -34.8222, longitude: -58.5358, size: "large" },
  { icao: "LEMD", iata: "MAD", name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain", latitude: 40.4983, longitude: -3.5676, size: "large" },
  { icao: "LIRF", iata: "FCO", name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "Italy", latitude: 41.8003, longitude: 12.2389, size: "large" },
  { icao: "EDDM", iata: "MUC", name: "Munich International", city: "Munich", country: "Germany", latitude: 48.3538, longitude: 11.7861, size: "large" },
  { icao: "UUEE", iata: "SVO", name: "Sheremetyevo International", city: "Moscow", country: "Russia", latitude: 55.9726, longitude: 37.4146, size: "large" },
  { icao: "LTFM", iata: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", latitude: 41.2753, longitude: 28.7519, size: "large" },
  { icao: "RKSI", iata: "ICN", name: "Incheon International", city: "Seoul", country: "South Korea", latitude: 37.4602, longitude: 126.4407, size: "large" },
  { icao: "RJAA", iata: "NRT", name: "Narita International", city: "Tokyo", country: "Japan", latitude: 35.7647, longitude: 140.3863, size: "large" },
  { icao: "WMKK", iata: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia", latitude: 2.7456, longitude: 101.7099, size: "large" },
  { icao: "VTBS", iata: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand", latitude: 13.6900, longitude: 100.7501, size: "large" },
  { icao: "YSSY", iata: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", latitude: -33.9399, longitude: 151.1753, size: "large" },
  { icao: "YMML", iata: "MEL", name: "Melbourne Tullamarine", city: "Melbourne", country: "Australia", latitude: -37.669, longitude: 144.8410, size: "large" },
  { icao: "NZAA", iata: "AKL", name: "Auckland International", city: "Auckland", country: "New Zealand", latitude: -37.0082, longitude: 174.7850, size: "large" },
  { icao: "FAOR", iata: "JNB", name: "OR Tambo International", city: "Johannesburg", country: "South Africa", latitude: -26.1392, longitude: 28.2460, size: "large" },
  { icao: "HECA", iata: "CAI", name: "Cairo International", city: "Cairo", country: "Egypt", latitude: 30.1219, longitude: 31.4056, size: "large" },
  { icao: "OTHH", iata: "DOH", name: "Hamad International", city: "Doha", country: "Qatar", latitude: 25.2731, longitude: 51.6080, size: "large" },
  { icao: "OERK", iata: "RUH", name: "King Khalid International", city: "Riyadh", country: "Saudi Arabia", latitude: 24.9576, longitude: 46.6988, size: "large" },
  { icao: "BGTL", iata: "THU", name: "Thule Air Base", city: "Qaanaaq", country: "Greenland", latitude: 76.5339, longitude: -68.7031, size: "medium" },

  // ---- Medium regional hubs ----
  { icao: "KBOS", iata: "BOS", name: "Boston Logan International", city: "Boston", country: "United States", latitude: 42.3656, longitude: -71.0096, size: "medium" },
  { icao: "KMIA", iata: "MIA", name: "Miami International", city: "Miami", country: "United States", latitude: 25.7959, longitude: -80.2870, size: "medium" },
  { icao: "KDEN", iata: "DEN", name: "Denver International", city: "Denver", country: "United States", latitude: 39.8561, longitude: -104.6737, size: "medium" },
  { icao: "KSAN", iata: "SAN", name: "San Diego International", city: "San Diego", country: "United States", latitude: 32.7338, longitude: -117.1933, size: "medium" },
  { icao: "KLAS", iata: "LAS", name: "Harry Reid International", city: "Las Vegas", country: "United States", latitude: 36.0840, longitude: -115.1537, size: "medium" },
  { icao: "KPHX", iata: "PHX", name: "Phoenix Sky Harbor International", city: "Phoenix", country: "United States", latitude: 33.4342, longitude: -112.0116, size: "medium" },
  { icao: "KMCO", iata: "MCO", name: "Orlando International", city: "Orlando", country: "United States", latitude: 28.4312, longitude: -81.3081, size: "medium" },
  { icao: "KIAH", iata: "IAH", name: "George Bush Intercontinental", city: "Houston", country: "United States", latitude: 29.9844, longitude: -95.3414, size: "medium" },
  { icao: "KMSP", iata: "MSP", name: "Minneapolis–Saint Paul International", city: "Minneapolis", country: "United States", latitude: 44.8848, longitude: -93.2223, size: "medium" },
  { icao: "KDTW", iata: "DTW", name: "Detroit Metropolitan", city: "Detroit", country: "United States", latitude: 42.2162, longitude: -83.3554, size: "medium" },
  { icao: "KPHL", iata: "PHL", name: "Philadelphia International", city: "Philadelphia", country: "United States", latitude: 39.8744, longitude: -75.2424, size: "medium" },
  { icao: "KEWR", iata: "EWR", name: "Newark Liberty International", city: "Newark", country: "United States", latitude: 40.6925, longitude: -74.1687, size: "medium" },
  { icao: "KCLT", iata: "CLT", name: "Charlotte Douglas International", city: "Charlotte", country: "United States", latitude: 35.2140, longitude: -80.9431, size: "medium" },
  { icao: "KMEM", iata: "MEM", name: "Memphis International", city: "Memphis", country: "United States", latitude: 35.0424, longitude: -89.9767, size: "medium" },
  { icao: "KSEA", iata: "SEA", name: "Seattle–Tacoma International", city: "Seattle", country: "United States", latitude: 47.4502, longitude: -122.3088, size: "medium" },
  { icao: "KBWI", iata: "BWI", name: "Baltimore/Washington International", city: "Baltimore", country: "United States", latitude: 39.1754, longitude: -76.6684, size: "medium" },
  { icao: "KIAD", iata: "IAD", name: "Washington Dulles International", city: "Washington", country: "United States", latitude: 38.9531, longitude: -77.4565, size: "medium" },
  { icao: "CYUL", iata: "YUL", name: "Montréal–Trudeau International", city: "Montréal", country: "Canada", latitude: 45.4706, longitude: -73.7408, size: "medium" },
  { icao: "CYVR", iata: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada", latitude: 49.1939, longitude: -123.1840, size: "medium" },
  { icao: "EGKK", iata: "LGW", name: "London Gatwick", city: "London", country: "United Kingdom", latitude: 51.1481, longitude: -0.1903, size: "medium" },
  { icao: "EGSS", iata: "STN", name: "London Stansted", city: "London", country: "United Kingdom", latitude: 51.8860, longitude: 0.2389, size: "medium" },
  { icao: "EGCC", iata: "MAN", name: "Manchester Airport", city: "Manchester", country: "United Kingdom", latitude: 53.3537, longitude: -2.2750, size: "medium" },
  { icao: "LFPO", iata: "ORY", name: "Paris–Orly", city: "Paris", country: "France", latitude: 48.7233, longitude: 2.3795, size: "medium" },
  { icao: "EHLE", iata: "LIS", name: "Lisbon Airport", city: "Lisbon", country: "Portugal", latitude: 38.7813, longitude: -9.1359, size: "medium" },
  { icao: "LEBL", iata: "BCN", name: "Barcelona–El Prat", city: "Barcelona", country: "Spain", latitude: 41.2974, longitude: 2.0833, size: "medium" },
  { icao: "LEMD", iata: "MAD", name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain", latitude: 40.4983, longitude: -3.5676, size: "medium" },
  { icao: "LIRP", iata: "CIA", name: "Rome Ciampino", city: "Rome", country: "Italy", latitude: 41.7994, longitude: 12.5949, size: "medium" },
  { icao: "LIMC", iata: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", latitude: 45.6306, longitude: 8.7281, size: "medium" },
  { icao: "LSZH", iata: "ZRH", name: "Zürich Airport", city: "Zürich", country: "Switzerland", latitude: 47.4647, longitude: 8.5492, size: "medium" },
  { icao: "LSGG", iata: "GVA", name: "Geneva Airport", city: "Geneva", country: "Switzerland", latitude: 46.2381, longitude: 6.1090, size: "medium" },
  { icao: "LOWW", iata: "VIE", name: "Vienna International", city: "Vienna", country: "Austria", latitude: 48.1103, longitude: 16.5697, size: "medium" },
  { icao: "LKPR", iata: "PRG", name: "Václav Havel Airport Prague", city: "Prague", country: "Czech Republic", latitude: 50.1008, longitude: 14.2600, size: "medium" },
  { icao: "EPWA", iata: "WAW", name: "Warsaw Chopin", city: "Warsaw", country: "Poland", latitude: 52.1657, longitude: 20.9671, size: "medium" },
  { icao: "ESPA", iata: "LLA", name: "Luleå Airport", city: "Luleå", country: "Sweden", latitude: 65.5436, longitude: 22.0817, size: "medium" },
  { icao: "ESSA", iata: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", latitude: 59.6519, longitude: 17.9186, size: "medium" },
  { icao: "ENGM", iata: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "Norway", latitude: 60.1939, longitude: 11.1004, size: "medium" },
  { icao: "EKCH", iata: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", latitude: 55.6181, longitude: 12.6562, size: "medium" },
  { icao: "EFHK", iata: "HEL", name: "Helsinki Airport", city: "Helsinki", country: "Finland", latitude: 60.3172, longitude: 24.9633, size: "medium" },
  { icao: "UBBB", iata: "GYD", name: "Heydar Aliyev International", city: "Baku", country: "Azerbaijan", latitude: 40.4675, longitude: 50.0467, size: "medium" },
  { icao: "UTTT", iata: "TAS", name: "Tashkent International", city: "Tashkent", country: "Uzbekistan", latitude: 41.2579, longitude: 69.2812, size: "medium" },
  { icao: "OIIE", iata: "IKA", name: "Tehran Imam Khomeini International", city: "Tehran", country: "Iran", latitude: 35.4161, longitude: 51.1522, size: "medium" },
  { icao: "OKBK", iata: "KWI", name: "Kuwait International", city: "Kuwait City", country: "Kuwait", latitude: 29.2266, longitude: 47.9689, size: "medium" },
  { icao: "OMAA", iata: "AUH", name: "Abu Dhabi International", city: "Abu Dhabi", country: "United Arab Emirates", latitude: 24.4330, longitude: 54.6511, size: "medium" },
  { icao: "VABB", iata: "BOM", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "India", latitude: 19.0896, longitude: 72.8656, size: "medium" },
  { icao: "VOMM", iata: "MAA", name: "Chennai International", city: "Chennai", country: "India", latitude: 12.9941, longitude: 80.1709, size: "medium" },
  { icao: "VOBL", iata: "BLR", name: "Kempegowda International", city: "Bengaluru", country: "India", latitude: 13.1986, longitude: 77.7066, size: "medium" },
  { icao: "VTSP", iata: "CNX", name: "Chiang Mai International", city: "Chiang Mai", country: "Thailand", latitude: 18.7669, longitude: 98.9627, size: "medium" },
  { icao: "WIII", iata: "CGK", name: "Soekarno–Hatta International", city: "Jakarta", country: "Indonesia", latitude: -6.1256, longitude: 106.6559, size: "medium" },
  { icao: "WADD", iata: "DPS", name: "Ngurah Rai International", city: "Denpasar", country: "Indonesia", latitude: -8.7482, longitude: 115.1673, size: "medium" },
  { icao: "RPLL", iata: "MNL", name: "Ninoy Aquino International", city: "Manila", country: "Philippines", latitude: 14.5086, longitude: 121.0194, size: "medium" },
  { icao: "VVTS", iata: "SGN", name: "Tan Son Nhat International", city: "Ho Chi Minh City", country: "Vietnam", latitude: 10.8189, longitude: 106.6519, size: "medium" },
  { icao: "ZGGG", iata: "CAN", name: "Guangzhou Baiyun International", city: "Guangzhou", country: "China", latitude: 23.3924, longitude: 113.2988, size: "medium" },
  { icao: "ZSSS", iata: "SHA", name: "Shanghai Hongqiao International", city: "Shanghai", country: "China", latitude: 31.1979, longitude: 121.3363, size: "medium" },
  { icao: "RCTP", iata: "TPE", name: "Taoyuan International", city: "Taipei", country: "Taiwan", latitude: 25.0777, longitude: 121.2328, size: "medium" },
  { icao: "WBKK", iata: "BKI", name: "Kota Kinabalu International", city: "Kota Kinabalu", country: "Malaysia", latitude: 5.9372, longitude: 116.0511, size: "medium" },
  { icao: "YPPH", iata: "PER", name: "Perth Airport", city: "Perth", country: "Australia", latitude: -31.9385, longitude: 115.9672, size: "medium" },
  { icao: "YBBN", iata: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australia", latitude: -27.3942, longitude: 153.1218, size: "medium" },
  { icao: "NZCH", iata: "CHC", name: "Christchurch International", city: "Christchurch", country: "New Zealand", latitude: -43.4894, longitude: 172.5322, size: "medium" },
  { icao: "SCFA", iata: "ANF", name: "Cerro Moreno International", city: "Antofagasta", country: "Chile", latitude: -23.4445, longitude: -70.4451, size: "medium" },
  { icao: "SKBO", iata: "BOG", name: "El Dorado International", city: "Bogotá", country: "Colombia", latitude: 4.7016, longitude: -74.1469, size: "medium" },
  { icao: "SPZO", iata: "CUZ", name: "Alejandro Velasco Astete International", city: "Cusco", country: "Peru", latitude: -13.5357, longitude: -71.9388, size: "medium" },
  { icao: "MPTO", iata: "PTY", name: "Tocumen International", city: "Panama City", country: "Panama", latitude: 9.0714, longitude: -79.3835, size: "medium" },
  { icao: "MUCC", iata: "CCC", name: "Jardines del Rey", city: "Cayo Coco", country: "Cuba", latitude: 22.4953, longitude: -78.1186, size: "medium" },
  { icao: "TNCA", iata: "AUA", name: "Queen Beatrix International", city: "Oranjestad", country: "Aruba", latitude: 12.5014, longitude: -70.0152, size: "medium" },
  { icao: "FAJS", iata: "JNB", name: "OR Tambo International", city: "Johannesburg", country: "South Africa", latitude: -26.1392, longitude: 28.2460, size: "medium" },
  { icao: "FACT", iata: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa", latitude: -33.9715, longitude: 18.6021, size: "medium" },
  { icao: "HKJK", iata: "NBO", name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya", latitude: -1.3192, longitude: 36.9278, size: "medium" },
  { icao: "DNMM", iata: "LOS", name: "Murtala Muhammed International", city: "Lagos", country: "Nigeria", latitude: 6.5774, longitude: 3.3211, size: "medium" },
  { icao: "GMAD", iata: "AGA", name: "Al Massira Airport", city: "Agadir", country: "Morocco", latitude: 30.3811, longitude: -9.5461, size: "medium" },
  { icao: "GMMN", iata: "CMN", name: "Mohammed V International", city: "Casablanca", country: "Morocco", latitude: 33.3675, longitude: -7.5898, size: "medium" },

  // ---- Smaller / notable fields ----
  { icao: "KEKO", iata: "EKO", name: "Elko Regional", city: "Elko", country: "United States", latitude: 40.8242, longitude: -115.7922, size: "small" },
  { icao: "PHTO", iata: "ITO", name: "Hilo International", city: "Hilo", country: "United States", latitude: 19.7214, longitude: -155.0485, size: "small" },
  { icao: "PHNL", iata: "HNL", name: "Daniel K. Inouye International", city: "Honolulu", country: "United States", latitude: 21.3187, longitude: -157.9225, size: "small" },
  { icao: "PAFA", iata: "FAI", name: "Fairbanks International", city: "Fairbanks", country: "United States", latitude: 64.8151, longitude: -147.8560, size: "small" },
  { icao: "PANC", iata: "ANC", name: "Ted Stevens Anchorage International", city: "Anchorage", country: "United States", latitude: 61.1744, longitude: -149.9961, size: "small" },
  { icao: "BGSF", iata: "SFJ", name: "Kangerlussuaq Airport", city: "Kangerlussuaq", country: "Greenland", latitude: 67.0122, longitude: -50.7116, size: "small" },
  { icao: "BIRK", iata: "RKV", name: "Reykjavík Airport", city: "Reykjavík", country: "Iceland", latitude: 64.1300, longitude: -21.9406, size: "small" },
  { icao: "KEFL", iata: "KEF", name: "Keflavík International", city: "Reykjavík", country: "Iceland", latitude: 63.9850, longitude: -22.6056, size: "small" },
  { icao: "NTAA", iata: "PPT", name: "Faa'a International", city: "Papeete", country: "French Polynesia", latitude: -17.5537, longitude: -149.6072, size: "small" },
  { icao: "NCRG", iata: "RAR", name: "Rarotonga International", city: "Avarua", country: "Cook Islands", latitude: -21.2026, longitude: -159.8062, size: "small" },
  { icao: "NLWW", iata: "VLI", name: "Bauerfield International", city: "Port Vila", country: "Vanuatu", latitude: -17.6993, longitude: 168.3198, size: "small" },
  { icao: "AYWK", iata: "WWK", name: "Wewak International", city: "Wewak", country: "Papua New Guinea", latitude: -3.5838, longitude: 143.6693, size: "small" },
  { icao: "AYPY", iata: "POM", name: "Jacksons International", city: "Port Moresby", country: "Papua New Guinea", latitude: -9.4434, longitude: 147.2200, size: "small" },
  { icao: "FTTJ", iata: "NDJ", name: "N'Djamena International", city: "N'Djamena", country: "Chad", latitude: 12.8372, longitude: 15.0342, size: "small" },
  { icao: "FKKD", iata: "DLA", name: "Douala International", city: "Douala", country: "Cameroon", latitude: 4.0061, longitude: 9.7195, size: "small" },
  { icao: "SBGL", iata: "GIG", name: "Rio de Janeiro/Galeão", city: "Rio de Janeiro", country: "Brazil", latitude: -22.8099, longitude: -43.2505, size: "small" },
];

/** Normalize airport records: de-duplicate by ICAO, keeping the largest size. */
export function normalizeAirports(list: Airport[]): Airport[] {
  const byIcao = new Map<string, Airport>();
  const sizeRank: Record<Airport["size"], number> = {
    large: 3,
    medium: 2,
    small: 1,
  };
  for (const a of list) {
    const existing = byIcao.get(a.icao);
    if (!existing || sizeRank[a.size] > sizeRank[existing.size]) {
      byIcao.set(a.icao, a);
    }
  }
  return [...byIcao.values()];
}

/** Airports ready for the map and search. */
export const AIRPORTS_NORMALIZED = normalizeAirports(AIRPORTS);

/** Search airports by free text; matches code, name, city, or country. */
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: Airport[] = [];
  const contains: Airport[] = [];
  for (const a of AIRPORTS_NORMALIZED) {
    const haystack = [
      a.icao,
      a.iata ?? "",
      a.name,
      a.city,
      a.country,
    ]
      .join(" ")
      .toLowerCase();
    if (haystack.includes(q)) {
      // Prefer code-prefix matches for snappier results.
      if (
        a.icao.toLowerCase().startsWith(q) ||
        (a.iata && a.iata.toLowerCase().startsWith(q)) ||
        a.city.toLowerCase().startsWith(q)
      ) {
        starts.push(a);
      } else {
        contains.push(a);
      }
    }
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
