// Map of mainland Portugal + the truck's route. Shared by the 3D map and the gallery overlay.

/** World position of the map centre (straight out of the warehouse door). */
export const MAP_ORIGIN: [number, number, number] = [62, 0, -44];
const K = 6; // world units per degree of latitude
const LON_SCALE = Math.cos((39.5 * Math.PI) / 180);

/** lon/lat → map-local x/z (north = -z). */
export const project = (lon: number, lat: number): [number, number] => [
  (lon + 8) * K * LON_SCALE,
  -(lat - 39.5) * K,
];

// shortcut: hand-simplified outline (~50 pts), good enough for a stylised low-poly map
export const OUTLINE: [number, number][] = [
  [-8.87, 41.87], [-8.65, 42.03], [-8.2, 42.15], [-8.08, 42.0], [-7.9, 41.86], [-7.4, 41.84],
  [-7.15, 41.98], [-6.85, 41.95], [-6.55, 41.67], [-6.19, 41.58], [-6.45, 41.25], [-6.8, 41.03],
  [-6.93, 40.75], [-6.8, 40.33], [-7.02, 40.2], [-6.9, 39.88], [-7.02, 39.67], [-7.54, 39.66],
  [-7.25, 39.45], [-7.15, 39.15], [-7.03, 38.88], [-7.2, 38.6], [-7.28, 38.4], [-6.95, 38.2],
  [-7.1, 38.03], [-7.3, 37.9], [-7.5, 37.55], [-7.42, 37.18], [-7.7, 37.07], [-7.95, 36.97],
  [-8.3, 37.08], [-8.68, 37.08], [-8.99, 37.02], [-8.85, 37.35], [-8.8, 37.75], [-8.88, 37.98],
  [-8.78, 38.2], [-8.95, 38.48], [-9.2, 38.42], [-9.15, 38.68], [-9.3, 38.68], [-9.49, 38.78],
  [-9.42, 39.0], [-9.4, 39.37], [-9.12, 39.6], [-8.97, 39.9], [-8.88, 40.2], [-8.75, 40.6],
  [-8.67, 41.0], [-8.68, 41.3], [-8.8, 41.6],
];

/** Route waypoints (lon, lat). `stop` marks the ones with a gallery. */
export const ROUTE: { lon: number; lat: number; stop?: number }[] = [
  { lon: -8.42, lat: 41.55 }, // warehouse (Braga)
  { lon: -8.61, lat: 41.15, stop: 0 }, // Porto
  { lon: -8.55, lat: 40.65 },
  { lon: -8.43, lat: 40.21, stop: 1 }, // Coimbra
  { lon: -8.8, lat: 39.6 },
  { lon: -9.14, lat: 38.72, stop: 2 }, // Lisboa
  { lon: -8.7, lat: 38.2 },
  { lon: -8.4, lat: 37.6 },
  { lon: -8.25, lat: 37.09, stop: 3 }, // Algarve
];

const photo = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const STOPS = [
  {
    accent: "#ff2e88",
    images: [photo("1670028514318-0ac718c0590d"), photo("1602369944529-c237ca143d09"), photo("1657208431551-cbf415b8ef26")],
  },
  {
    accent: "#2ee6ff",
    images: [photo("1540575467063-178a50c2df87"), photo("1582192730841-2a682d7375f9"), photo("1505373877841-8d25f7d46678")],
  },
  {
    accent: "#ffb02e",
    images: [photo("1574155088851-0c770818ba40"), photo("1577648875929-894904f7b051"), photo("1610901056511-31de499995f0")],
  },
  {
    accent: "#ff2e88",
    images: [photo("1607861884586-c7cfaed16290"), photo("1723832348105-2e69f948135a"), photo("1526092817387-8f07b2904e48")],
  },
];
