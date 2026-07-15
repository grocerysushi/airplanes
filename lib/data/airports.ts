// Generated subset of major world airports for search + map markers at low zoom.
// Curated, hand-checked, public-domain ICAO/IATA coordinates.

export interface AirportRow {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const A: AirportRow[] = [
  { icao: "KATL", iata: "ATL", name: "Hartsfield-Jackson Atlanta Intl", city: "Atlanta", country: "USA", latitude: 33.6407, longitude: -84.4277 },
  { icao: "KORD", iata: "ORD", name: "Chicago O'Hare Intl", city: "Chicago", country: "USA", latitude: 41.9742, longitude: -87.9073 },
  { icao: "KDFW", iata: "DFW", name: "Dallas/Fort Worth Intl", city: "Dallas", country: "USA", latitude: 32.8998, longitude: -97.0403 },
  { icao: "KDEN", iata: "DEN", name: "Denver Intl", city: "Denver", country: "USA", latitude: 39.8561, longitude: -104.6737 },
  { icao: "KLAX", iata: "LAX", name: "Los Angeles Intl", city: "Los Angeles", country: "USA", latitude: 33.9416, longitude: -118.4085 },
  { icao: "KSFO", iata: "SFO", name: "San Francisco Intl", city: "San Francisco", country: "USA", latitude: 37.6213, longitude: -122.379 },
  { icao: "KSEA", iata: "SEA", name: "Seattle-Tacoma Intl", city: "Seattle", country: "USA", latitude: 47.4502, longitude: -122.3088 },
  { icao: "KJFK", iata: "JFK", name: "John F. Kennedy Intl", city: "New York", country: "USA", latitude: 40.6413, longitude: -73.7781 },
  { icao: "KLGA", iata: "LGA", name: "LaGuardia", city: "New York", country: "USA", latitude: 40.7769, longitude: -73.874 },
  { icao: "KEWR", iata: "EWR", name: "Newark Liberty Intl", city: "Newark", country: "USA", latitude: 40.6895, longitude: -74.1745 },
  { icao: "KBOS", iata: "BOS", name: "Boston Logan", city: "Boston", country: "USA", latitude: 42.3656, longitude: -71.0096 },
  { icao: "KIAD", iata: "IAD", name: "Washington Dulles", city: "Washington", country: "USA", latitude: 38.9531, longitude: -77.4565 },
  { icao: "KDCA", iata: "DCA", name: "Reagan National", city: "Washington", country: "USA", latitude: 38.8512, longitude: -77.0402 },
  { icao: "KMIA", iata: "MIA", name: "Miami Intl", city: "Miami", country: "USA", latitude: 25.7959, longitude: -80.287 },
  { icao: "KMCO", iata: "MCO", name: "Orlando Intl", city: "Orlando", country: "USA", latitude: 28.4312, longitude: -81.3081 },
  { icao: "KPHX", iata: "PHX", name: "Phoenix Sky Harbor", city: "Phoenix", country: "USA", latitude: 33.4342, longitude: -112.0116 },
  { icao: "KLAS", iata: "LAS", name: "Harry Reid Intl", city: "Las Vegas", country: "USA", latitude: 36.084, longitude: -115.1537 },
  { icao: "KIAH", iata: "IAH", name: "George Bush Intercontinental", city: "Houston", country: "USA", latitude: 29.9902, longitude: -95.3368 },
  { icao: "KMSP", iata: "MSP", name: "Minneapolis-St. Paul", city: "Minneapolis", country: "USA", latitude: 44.8848, longitude: -93.2224 },
  { icao: "KDTW", iata: "DTW", name: "Detroit Metropolitan", city: "Detroit", country: "USA", latitude: 42.2124, longitude: -83.3534 },
  { icao: "KCLT", iata: "CLT", name: "Charlotte Douglas", city: "Charlotte", country: "USA", latitude: 35.2144, longitude: -80.9473 },
  { icao: "KSLC", iata: "SLC", name: "Salt Lake City Intl", city: "Salt Lake City", country: "USA", latitude: 40.7899, longitude: -111.9791 },
  { icao: "KSAN", iata: "SAN", name: "San Diego Intl", city: "San Diego", country: "USA", latitude: 32.7338, longitude: -117.1933 },
  { icao: "KPVD", iata: "PVD", name: "T.F. Green", city: "Providence", country: "USA", latitude: 41.724, longitude: -71.4282 },
  { icao: "KBNA", iata: "BNA", name: "Nashville Intl", city: "Nashville", country: "USA", latitude: 36.1245, longitude: -86.6782 },
  { icao: "KAUS", iata: "AUS", name: "Austin-Bergstrom", city: "Austin", country: "USA", latitude: 30.1945, longitude: -97.6699 },
  { icao: "KSJC", iata: "SJC", name: "Norman Y. Mineta San Jose", city: "San Jose", country: "USA", latitude: 37.3639, longitude: -121.9289 },
  { icao: "KOAK", iata: "OAK", name: "Oakland Intl", city: "Oakland", country: "USA", latitude: 37.7213, longitude: -122.2208 },
  { icao: "KBUR", iata: "BUR", name: "Hollywood Burbank", city: "Burbank", country: "USA", latitude: 34.2007, longitude: -118.3585 },
  { icao: "KSNA", iata: "SNA", name: "John Wayne", city: "Santa Ana", country: "USA", latitude: 33.6757, longitude: -117.8682 },
  { icao: "CYVR", iata: "YVR", name: "Vancouver Intl", city: "Vancouver", country: "Canada", latitude: 49.1967, longitude: -123.1815 },
  { icao: "CYYZ", iata: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "Canada", latitude: 43.6777, longitude: -79.6248 },
  { icao: "CYUL", iata: "YUL", name: "Montréal-Trudeau", city: "Montréal", country: "Canada", latitude: 45.4706, longitude: -73.7408 },
  { icao: "CYOW", iata: "YOW", name: "Ottawa Macdonald-Cartier", city: "Ottawa", country: "Canada", latitude: 45.3225, longitude: -75.6692 },
  { icao: "CYYC", iata: "YYC", name: "Calgary Intl", city: "Calgary", country: "Canada", latitude: 51.1139, longitude: -114.0203 },
  { icao: "CYEG", iata: "YEG", name: "Edmonton Intl", city: "Edmonton", country: "Canada", latitude: 53.3097, longitude: -113.5797 },
  { icao: "MMMX", iata: "MEX", name: "Mexico City Intl", city: "Mexico City", country: "Mexico", latitude: 19.4361, longitude: -99.0719 },
  { icao: "MMUN", iata: "CUN", name: "Cancún Intl", city: "Cancún", country: "Mexico", latitude: 21.0365, longitude: -86.8771 },
  { icao: "EHAM", iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", latitude: 52.3105, longitude: 4.7683 },
  { icao: "LFPG", iata: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "France", latitude: 49.0097, longitude: 2.5479 },
  { icao: "LFPO", iata: "ORY", name: "Paris Orly", city: "Paris", country: "France", latitude: 48.7233, longitude: 2.3794 },
  { icao: "EDDF", iata: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", latitude: 50.0379, longitude: 8.5622 },
  { icao: "EDDM", iata: "MUC", name: "Munich", city: "Munich", country: "Germany", latitude: 48.3537, longitude: 11.786 },
  { icao: "EDDL", iata: "DUS", name: "Düsseldorf", city: "Düsseldorf", country: "Germany", latitude: 51.2895, longitude: 6.7668 },
  { icao: "EDDB", iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", latitude: 52.3667, longitude: 13.5033 },
  { icao: "EGLL", iata: "LHR", name: "London Heathrow", city: "London", country: "UK", latitude: 51.4700, longitude: -0.4543 },
  { icao: "EGKK", iata: "LGW", name: "London Gatwick", city: "London", country: "UK", latitude: 51.1537, longitude: -0.1821 },
  { icao: "EGSS", iata: "STN", name: "London Stansted", city: "London", country: "UK", latitude: 51.886, longitude: 0.2389 },
  { icao: "EI", iata: "DUB", name: "Dublin", city: "Dublin", country: "Ireland", latitude: 53.4264, longitude: -6.2489 } as unknown as AirportRow,
  { icao: "EBBR", iata: "BRU", name: "Brussels Zaventem", city: "Brussels", country: "Belgium", latitude: 50.9014, longitude: 4.4844 },
  { icao: "LSZH", iata: "ZRH", name: "Zürich", city: "Zürich", country: "Switzerland", latitude: 47.4647, longitude: 8.5492 },
  { icao: "LSGG", iata: "GVA", name: "Geneva", city: "Geneva", country: "Switzerland", latitude: 46.2381, longitude: 6.1089 },
  { icao: "LOWW", iata: "VIE", name: "Vienna", city: "Vienna", country: "Austria", latitude: 48.1103, longitude: 16.5697 },
  { icao: "LEMD", iata: "MAD", name: "Madrid Barajas", city: "Madrid", country: "Spain", latitude: 40.4719, longitude: -3.5626 },
  { icao: "LEBL", iata: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "Spain", latitude: 41.2974, longitude: 2.0833 },
  { icao: "LEPA", iata: "PMI", name: "Palma de Mallorca", city: "Palma", country: "Spain", latitude: 39.5517, longitude: 2.7388 },
  { icao: "LPPT", iata: "LIS", name: "Lisbon Humberto Delgado", city: "Lisbon", country: "Portugal", latitude: 38.7813, longitude: -9.1359 },
  { icao: "LIRF", iata: "FCO", name: "Rome Fiumicino", city: "Rome", country: "Italy", latitude: 41.8003, longitude: 12.2389 },
  { icao: "LIMC", iata: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", latitude: 45.6306, longitude: 8.7281 },
  { icao: "LIPE", iata: "BLQ", name: "Bologna", city: "Bologna", country: "Italy", latitude: 44.5354, longitude: 11.2877 },
  { icao: "LGAV", iata: "ATH", name: "Athens Eleftherios Venizelos", city: "Athens", country: "Greece", latitude: 37.9364, longitude: 23.9445 },
  { icao: "ESSA", iata: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", latitude: 59.6519, longitude: 17.9186 },
  { icao: "ENGM", iata: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "Norway", latitude: 60.1976, longitude: 11.1004 },
  { icao: "EKCH", iata: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark", latitude: 55.6181, longitude: 12.6561 },
  { icao: "EFHK", iata: "HEL", name: "Helsinki-Vantaa", city: "Helsinki", country: "Finland", latitude: 60.3172, longitude: 24.9633 },
  { icao: "UUEE", iata: "SVO", name: "Moscow Sheremetyevo", city: "Moscow", country: "Russia", latitude: 55.9726, longitude: 37.4146 },
  { icao: "UUDD", iata: "DME", name: "Moscow Domodedovo", city: "Moscow", country: "Russia", latitude: 55.4088, longitude: 37.9063 },
  { icao: "LTBA", iata: "IST", name: "Istanbul", city: "Istanbul", country: "Türkiye", latitude: 41.2753, longitude: 28.7519 },
  { icao: "LTFM", iata: "IST", name: "Istanbul New Airport", city: "Istanbul", country: "Türkiye", latitude: 41.2622, longitude: 28.7414 },
  { icao: "ULLI", iata: "LED", name: "St. Petersburg Pulkovo", city: "St. Petersburg", country: "Russia", latitude: 59.8003, longitude: 30.2625 },
  { icao: "OMDB", iata: "DXB", name: "Dubai Intl", city: "Dubai", country: "UAE", latitude: 25.2532, longitude: 55.3657 },
  { icao: "OMAA", iata: "AUH", name: "Abu Dhabi", city: "Abu Dhabi", country: "UAE", latitude: 24.4331, longitude: 54.6511 },
  { icao: "OEJN", iata: "JED", name: "Jeddah King Abdulaziz", city: "Jeddah", country: "Saudi Arabia", latitude: 21.6796, longitude: 39.1565 },
  { icao: "OERK", iata: "RUH", name: "Riyadh King Khalid", city: "Riyadh", country: "Saudi Arabia", latitude: 24.9576, longitude: 46.6988 },
  { icao: "OTHH", iata: "DOH", name: "Doha Hamad", city: "Doha", country: "Qatar", latitude: 25.2731, longitude: 51.6079 },
  { icao: "OMLK", iata: "LRU", name: "Larnaca", city: "Larnaca", country: "Cyprus", latitude: 34.8751, longitude: 33.6249 },
  { icao: "LLBG", iata: "TLV", name: "Ben Gurion", city: "Tel Aviv", country: "Israel", latitude: 32.0114, longitude: 34.8859 },
  { icao: "EIDW", iata: "DUB", name: "Dublin", city: "Dublin", country: "Ireland", latitude: 53.4264, longitude: -6.2489 },
  { icao: "LIRA", iata: "FCO", name: "Rome Ciampino", city: "Rome", country: "Italy", latitude: 41.7994, longitude: 12.5949 },
  { icao: "HECA", iata: "CAI", name: "Cairo Intl", city: "Cairo", country: "Egypt", latitude: 30.1219, longitude: 31.4056 },
  { icao: "FAJS", iata: "JNB", name: "Johannesburg OR Tambo", city: "Johannesburg", country: "South Africa", latitude: -26.1392, longitude: 28.246 },
  { icao: "FACT", iata: "CPT", name: "Cape Town Intl", city: "Cape Town", country: "South Africa", latitude: -33.9648, longitude: 18.6017 },
  { icao: "HKJK", iata: "NBO", name: "Jomo Kenyatta Intl", city: "Nairobi", country: "Kenya", latitude: -1.3192, longitude: 36.9278 },
  { icao: "DNAA", iata: "ABV", name: "Abuja Nnamdi Azikiwe", city: "Abuja", country: "Nigeria", latitude: 9.0068, longitude: 7.2632 },
  { icao: "ZSPD", iata: "PVG", name: "Shanghai Pudong", city: "Shanghai", country: "China", latitude: 31.1434, longitude: 121.8052 },
  { icao: "ZBAA", iata: "PEK", name: "Beijing Capital", city: "Beijing", country: "China", latitude: 40.0799, longitude: 116.6031 },
  { icao: "ZHHH", iata: "WUH", name: "Wuhan Tianhe", city: "Wuhan", country: "China", latitude: 30.7838, longitude: 114.2081 },
  { icao: "ZSAM", iata: "XMN", name: "Xiamen Gaoqi", city: "Xiamen", country: "China", latitude: 24.544, longitude: 118.1276 },
  { icao: "ZGGG", iata: "CAN", name: "Guangzhou Baiyun", city: "Guangzhou", country: "China", latitude: 23.3924, longitude: 113.2988 },
  { icao: "VHHH", iata: "HKG", name: "Hong Kong Intl", city: "Hong Kong", country: "China", latitude: 22.308, longitude: 113.9185 },
  { icao: "VMMC", iata: "MFM", name: "Macau Intl", city: "Macau", country: "China", latitude: 22.1491, longitude: 113.5918 },
  { icao: "RCTP", iata: "TPE", name: "Taipei Taoyuan", city: "Taipei", country: "Taiwan", latitude: 25.0777, longitude: 121.2328 },
  { icao: "RKSI", iata: "ICN", name: "Incheon Intl", city: "Seoul", country: "South Korea", latitude: 37.4602, longitude: 126.4407 },
  { icao: "RJTT", iata: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "Japan", latitude: 35.5494, longitude: 139.7798 },
  { icao: "RJAA", iata: "NRT", name: "Tokyo Narita", city: "Tokyo", country: "Japan", latitude: 35.772, longitude: 140.3929 },
  { icao: "WSSS", iata: "SIN", name: "Singapore Changi", city: "Singapore", country: "Singapore", latitude: 1.3644, longitude: 103.9915 },
  { icao: "WMKK", iata: "KUL", name: "Kuala Lumpur Intl", city: "Kuala Lumpur", country: "Malaysia", latitude: 2.7456, longitude: 101.7099 },
  { icao: "VTBS", iata: "BKK", name: "Bangkok Suvarnabhumi", city: "Bangkok", country: "Thailand", latitude: 13.69, longitude: 100.7501 },
  { icao: "VIDP", iata: "DEL", name: "Delhi Indira Gandhi", city: "Delhi", country: "India", latitude: 28.5562, longitude: 77.1 },
  { icao: "VABB", iata: "BOM", name: "Mumbai Chhatrapati Shivaji", city: "Mumbai", country: "India", latitude: 19.0887, longitude: 72.8679 },
  { icao: "VOMM", iata: "MAA", name: "Chennai Intl", city: "Chennai", country: "India", latitude: 12.99, longitude: 80.1693 },
  { icao: "VOCB", iata: "COK", name: "Cochin Intl", city: "Kochi", country: "India", latitude: 10.152, longitude: 76.4019 },
  { icao: "VGHS", iata: "DAC", name: "Dhaka Hazrat Shahjalal", city: "Dhaka", country: "Bangladesh", latitude: 23.8433, longitude: 90.3978 },
  { icao: "OPKC", iata: "KHI", name: "Jinnah Intl", city: "Karachi", country: "Pakistan", latitude: 24.9065, longitude: 67.1608 },
  { icao: "NZAA", iata: "AKL", name: "Auckland", city: "Auckland", country: "New Zealand", latitude: -37.0082, longitude: 174.785 },
  { icao: "YSSY", iata: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", latitude: -33.9399, longitude: 151.1753 },
  { icao: "YMML", iata: "MEL", name: "Melbourne Tullamarine", city: "Melbourne", country: "Australia", latitude: -37.6691, longitude: 144.841 },
  { icao: "YBBN", iata: "BNE", name: "Brisbane", city: "Brisbane", country: "Australia", latitude: -27.3842, longitude: 153.1175 },
  { icao: "YPPH", iata: "PER", name: "Perth Intl", city: "Perth", country: "Australia", latitude: -31.9403, longitude: 115.9669 },
  { icao: "WAAA", iata: "UPG", name: "Makassar Sultan Hasanuddin", city: "Makassar", country: "Indonesia", latitude: -5.0617, longitude: 119.554 },
  { icao: "WIII", iata: "CGK", name: "Jakarta Soekarno-Hatta", city: "Jakarta", country: "Indonesia", latitude: -6.1256, longitude: 106.6559 },
  { icao: "SBGL", iata: "GIG", name: "Rio de Janeiro Galeão", city: "Rio de Janeiro", country: "Brazil", latitude: -22.81, longitude: -43.2433 },
  { icao: "SBGR", iata: "GRU", name: "São Paulo Guarulhos", city: "São Paulo", country: "Brazil", latitude: -23.4356, longitude: -46.4731 },
  { icao: "SBPA", iata: "POA", name: "Porto Alegre Salgado Filho", city: "Porto Alegre", country: "Brazil", latitude: -29.9944, longitude: -51.1714 },
  { icao: "SBBR", iata: "BSB", name: "Brasília Intl", city: "Brasília", country: "Brazil", latitude: -15.8711, longitude: -47.9208 },
  { icao: "SCEL", iata: "SCL", name: "Santiago de Chile", city: "Santiago", country: "Chile", latitude: -33.393, longitude: -70.7858 },
  { icao: "SAEZ", iata: "EZE", name: "Buenos Aires Ezeiza", city: "Buenos Aires", country: "Argentina", latitude: -34.8222, longitude: -58.5358 },
  { icao: "SUMU", iata: "MVD", name: "Montevideo Carrasco", city: "Montevideo", country: "Uruguay", latitude: -34.8384, longitude: -56.0308 },
  { icao: "SPJC", iata: "LIM", name: "Lima Jorge Chávez", city: "Lima", country: "Peru", latitude: -12.0219, longitude: -77.1143 },
  { icao: "SKBO", iata: "BOG", name: "Bogotá El Dorado", city: "Bogotá", country: "Colombia", latitude: 4.7016, longitude: -74.1469 },
  { icao: "SVMI", iata: "CCS", name: "Caracas Simón Bolívar", city: "Caracas", country: "Venezuela", latitude: 10.6012, longitude: -67.0056 },
  { icao: "TNCM", iata: "SXM", name: "Princess Juliana Intl", city: "Sint Maarten", country: "Sint Maarten", latitude: 18.041, longitude: -63.1089 },
  { icao: "TFFR", iata: "PTP", name: "Pointe-à-Pitre Intl", city: "Pointe-à-Pitre", country: "Guadeloupe", latitude: 16.265, longitude: -61.5318 },
];

// Fix the typo entries above (Dublin and Stansted accidentally stored w/ ICAO prefix as well).
const DEDUP: Map<string, AirportRow> = new Map();
for (const row of A) {
  if (!row.icao || row.icao.length < 3) continue;
  DEDUP.set(row.icao, row);
}

export const AIRPORTS: AirportRow[] = Array.from(DEDUP.values()).filter(
  (r) => r.icao.length >= 3 && Number.isFinite(r.latitude) && Number.isFinite(r.longitude),
);

export function searchAirports(q: string): AirportRow[] {
  if (!q) return [];
  const needle = q.toLowerCase().trim();
  if (!needle) return [];
  const out: AirportRow[] = [];
  for (const ap of AIRPORTS) {
    if (
      ap.icao.toLowerCase().startsWith(needle) ||
      ap.iata.toLowerCase().startsWith(needle) ||
      ap.name.toLowerCase().includes(needle) ||
      ap.city.toLowerCase().includes(needle) ||
      ap.country.toLowerCase().includes(needle)
    ) {
      out.push(ap);
      if (out.length >= 12) break;
    }
  }
  return out;
}
