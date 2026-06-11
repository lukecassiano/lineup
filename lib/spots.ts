import type { Spot } from "./types";

// ── Real California public breaks ──────────────────────────────────────────────
// Coordinates are real (approximate peak locations). These are public spots —
// everyone can see them. Crew-secret + user-dropped pins live in seed.ts / state.

export const CA_SPOTS: Spot[] = [
  // ── South ───────────────────────────────────────────────────────────────────
  { id: "trestles",     name: "Upper Trestles",     type: "Point", lat: 33.3853, lng: -117.5933, region: "San Clemente, CA", secret: false, cond: "fair"   },
  { id: "lowers",       name: "Lower Trestles",     type: "Point", lat: 33.3817, lng: -117.5896, region: "San Clemente, CA", secret: false, cond: "firing" },
  { id: "san-onofre",   name: "San Onofre",         type: "Beach", lat: 33.3720, lng: -117.5660, region: "San Clemente, CA", secret: false, cond: "fair"   },
  { id: "salt-creek",   name: "Salt Creek",         type: "Beach", lat: 33.4790, lng: -117.7280, region: "Dana Point, CA",   secret: false, cond: "fair"   },
  { id: "doheny",       name: "Doheny",             type: "Beach", lat: 33.4607, lng: -117.6860, region: "Dana Point, CA",   secret: false, cond: "flat"   },
  { id: "wedge",        name: "The Wedge",          type: "Beach", lat: 33.5933, lng: -117.8817, region: "Newport Beach, CA",secret: false, cond: "firing" },
  { id: "hb-pier",      name: "Huntington Pier",    type: "Beach", lat: 33.6553, lng: -118.0050, region: "Huntington Beach, CA", secret: false, cond: "fair" },
  { id: "el-porto",     name: "El Porto",           type: "Beach", lat: 33.9000, lng: -118.4310, region: "Manhattan Beach, CA",  secret: false, cond: "fair" },
  { id: "mb-pier",      name: "Manhattan Pier",     type: "Beach", lat: 33.8847, lng: -118.4109, region: "Manhattan Beach, CA",  secret: false, cond: "flat" },
  { id: "hermosa",      name: "Hermosa Beach",      type: "Beach", lat: 33.8622, lng: -118.4011, region: "Hermosa Beach, CA",    secret: false, cond: "flat" },
  { id: "malibu",       name: "Malibu Surfrider",   type: "Point", lat: 34.0353, lng: -118.6790, region: "Malibu, CA",       secret: false, cond: "firing" },
  // ── San Diego ─────────────────────────────────────────────────────────────────
  { id: "swamis",       name: "Swami's",            type: "Reef",  lat: 33.0345, lng: -117.2920, region: "Encinitas, CA",    secret: false, cond: "firing" },
  { id: "blacks",       name: "Blacks Beach",       type: "Beach", lat: 32.8800, lng: -117.2520, region: "La Jolla, CA",     secret: false, cond: "fair"   },
  { id: "la-jolla",     name: "La Jolla Shores",    type: "Beach", lat: 32.8570, lng: -117.2570, region: "La Jolla, CA",     secret: false, cond: "fair"   },
  { id: "sunset-cliffs",name: "Sunset Cliffs",      type: "Reef",  lat: 32.7160, lng: -117.2540, region: "San Diego, CA",    secret: false, cond: "fair"   },
  // ── Central ───────────────────────────────────────────────────────────────────
  { id: "rincon",       name: "Rincon",             type: "Point", lat: 34.3722, lng: -119.4760, region: "Carpinteria, CA",  secret: false, cond: "firing" },
  { id: "cstreet",      name: "C Street",           type: "Point", lat: 34.2750, lng: -119.2950, region: "Ventura, CA",      secret: false, cond: "fair"   },
  { id: "sandspit",     name: "Sandspit",           type: "Point", lat: 34.4040, lng: -119.6910, region: "Santa Barbara, CA",secret: false, cond: "flat"   },
  { id: "steamer-lane", name: "Steamer Lane",       type: "Reef",  lat: 36.9514, lng: -122.0263, region: "Santa Cruz, CA",   secret: false, cond: "firing" },
  { id: "pleasure-pt",  name: "Pleasure Point",     type: "Reef",  lat: 36.9560, lng: -121.9690, region: "Santa Cruz, CA",   secret: false, cond: "fair"   },
  // ── North ─────────────────────────────────────────────────────────────────────
  { id: "ocean-beach",  name: "Ocean Beach",        type: "Beach", lat: 37.7590, lng: -122.5110, region: "San Francisco, CA",secret: false, cond: "fair"   },
  { id: "linda-mar",    name: "Linda Mar",          type: "Beach", lat: 37.5930, lng: -122.5050, region: "Pacifica, CA",     secret: false, cond: "fair"   },
  { id: "mavericks",    name: "Mavericks",          type: "Reef",  lat: 37.4942, lng: -122.4997, region: "Half Moon Bay, CA",secret: false, cond: "firing" },
  { id: "bolinas",      name: "Bolinas",            type: "Beach", lat: 37.9090, lng: -122.6860, region: "Bolinas, CA",      secret: false, cond: "flat"   },
  { id: "stinson",      name: "Stinson Beach",      type: "Beach", lat: 37.9000, lng: -122.6440, region: "Stinson Beach, CA",secret: false, cond: "fair"   },
];

// Default map view: Orange County coastline
export const MAP_DEFAULT_CENTER: [number, number] = [33.6, -117.9];
export const MAP_DEFAULT_ZOOM = 9;
