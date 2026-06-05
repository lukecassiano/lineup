import type { Crew, Spot, CommunityPost } from "./types";

export const SPOTS: Spot[] = [
  { id: "trestles", name: "Trestles",    type: "Point", x: 60, y: 20, secret: false, cond: "fair"   },
  { id: "wedge",    name: "The Wedge",   type: "Beach", x: 72, y: 44, secret: false, cond: "firing" },
  { id: "blacks",   name: "Blacks",      type: "Beach", x: 50, y: 68, secret: false, cond: "flat"   },
  { id: "ghost",    name: "Ghost Reef",  type: "Reef",  x: 40, y: 32, secret: true,  cond: "fair",   crew: "Dawn Patrol", by: "Maya R." },
  { id: "keyhole",  name: "The Keyhole", type: "Reef",  x: 34, y: 54, secret: true,  cond: "fair",   crew: "Dawn Patrol", by: "You" },
  { id: "pole9",    name: "Pole 9",      type: "Beach", x: 56, y: 86, secret: true,  cond: "fair",   crew: "South Swell", by: "Theo K." },
];

export const SEED_CREWS: Crew[] = [
  {
    id: "dawn",
    name: "Dawn Patrol",
    emblem: "◐",
    color: "var(--terra)",
    members: ["You", "Maya R.", "Theo K.", "Sol", "Wren"],
    thread: [
      { id: "t1", type: "log",  who: "Maya R.", spot: "Ghost Reef", ft: "4–5", wind: "Glassy",       rating: 5, note: "Empty lineup at first light. Best session in months.", t: "6:42a" },
      { id: "t2", type: "text", who: "Theo K.", text: "no wayyy you didn't tell anyone 😤",                                                                                     t: "7:10a" },
      { id: "t3", type: "text", who: "Maya R.", text: "you were asleep brother",                                                                                                t: "7:11a" },
      { id: "t4", type: "spot", who: "Sol",     spot: "The Keyhole", note: "low tide only — sketchy paddle out but worth it",                                                   t: "Yest." },
    ],
  },
  {
    id: "south",
    name: "South Swell",
    emblem: "≈",
    color: "var(--teal)",
    members: ["You", "Theo K.", "Nina", "Cass", "Beto", "Jun"],
    thread: [
      { id: "s1", type: "text", who: "Nina", text: "south swell filling in friday, who's in", t: "2:03p" },
      { id: "s2", type: "log",  who: "Beto", spot: "Pole 9", ft: "3", wind: "Light onshore", rating: 3, note: "fun but crowded by 8", t: "Mon" },
    ],
  },
];

export const SEED_COMMUNITY: CommunityPost[] = [
  { id: "c1", who: "kaimana_h",  clip: true,  mood: "firing", cap: "double overhead bomb at a spot I'll never name 🤐",             likes: 412, comments: 38, liked: false },
  { id: "c2", who: "saltlines",  clip: false, mood: "fair",   cap: "dawn glass. no one out. this is the whole point.",               likes: 189, comments: 11, liked: false },
  { id: "c3", who: "reefwitch",  clip: true,  mood: "firing", cap: "got pitched so hard my leash snapped lmao worth it",             likes: 902, comments: 74, liked: true  },
  { id: "c4", who: "tideandtype",clip: false, mood: "flat",   cap: "flat day. logged it anyway. a journal is a journal.",            likes: 56,  comments: 4,  liked: false },
];

export const INITIAL_DISCOVERED = ["trestles", "wedge", "ghost", "keyhole"];
