import type { Crew, Spot, CommunityPost, Session } from "./types";
import { CA_SPOTS } from "./spots";

// Crew-secret spots — locked to outsiders, visible only to members.
// Real-ish coordinates tucked along the coastline.
export const SECRET_SPOTS: Spot[] = [
  { id: "ghost",   name: "Ghost Reef",  type: "Reef",  lat: 33.5520, lng: -117.8620, region: "Crew · Dawn Patrol",  secret: true, cond: "firing", crew: "Dawn Patrol", by: "Maya R." },
  { id: "keyhole", name: "The Keyhole", type: "Reef",  lat: 33.4520, lng: -117.7180, region: "Crew · Dawn Patrol",  secret: true, cond: "fair",   crew: "Dawn Patrol", by: "You"    },
  { id: "pole9",   name: "Pole 9",      type: "Beach", lat: 33.6280, lng: -117.9340, region: "Crew · South Swell",  secret: true, cond: "fair",   crew: "South Swell", by: "Theo K." },
];

// All seeded spots = public CA breaks + crew secrets.
export const SPOTS: Spot[] = [...CA_SPOTS, ...SECRET_SPOTS];

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
  {
    id: "c1", who: "kaimana_h", clip: true, mood: "firing",
    cap: "double overhead bomb at a spot I'll never name 🤐", likes: 412, comments: 38, liked: false,
    t: "2h ago",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    commentList: [
      { id: "c1a", who: "saltlines", text: "the secrecy is half the stoke honestly", t: "1h" },
      { id: "c1b", who: "reefwitch", text: "that left was unreal 🤙", t: "54m" },
      { id: "c1c", who: "theo_k",    text: "drop the pin in the crew chat coward", t: "12m" },
    ],
  },
  {
    id: "c2", who: "saltlines", clip: false, mood: "fair",
    cap: "dawn glass. no one out. this is the whole point.", likes: 189, comments: 11, liked: false,
    t: "5h ago",
    commentList: [
      { id: "c2a", who: "tideandtype", text: "this is the whole point indeed", t: "4h" },
      { id: "c2b", who: "nina_s",      text: "what time did you paddle out??", t: "3h" },
    ],
  },
  {
    id: "c3", who: "reefwitch", clip: true, mood: "firing",
    cap: "got pitched so hard my leash snapped lmao worth it", likes: 902, comments: 74, liked: true,
    t: "8h ago",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    commentList: [
      { id: "c3a", who: "kaimana_h", text: "leashless exit, respect", t: "7h" },
      { id: "c3b", who: "beto",      text: "how's the board??", t: "6h" },
      { id: "c3c", who: "reefwitch", text: "@beto somehow fine. dinged the rail only", t: "5h" },
    ],
  },
  {
    id: "c4", who: "tideandtype", clip: false, mood: "flat",
    cap: "flat day. logged it anyway. a journal is a journal.", likes: 56, comments: 4, liked: false,
    t: "1d ago",
    commentList: [
      { id: "c4a", who: "saltlines", text: "real ones log the flat days", t: "23h" },
    ],
  },
];

// Example sessions so the journal/home feel lived-in on first load.
export const SEED_SESSIONS: Session[] = [
  { id: "seed-1", spot: "Lower Trestles", ft: "3–4", wind: "Glassy",        rating: 4, note: "Solid morning. Long rights, light crowd, ankle held up.",                    t: "Jun 1",  crew: "Dawn Patrol", crewColor: "var(--terra)" },
  { id: "seed-2", spot: "The Wedge",      ft: "5",   wind: "Side-shore",     rating: 5, note: "Heaviest day in months. Got cleaned up on a closeout but caught two bombs.", t: "May 29", crew: "Community",   crewColor: "var(--pink)"  },
  { id: "seed-3", spot: "Pole 9",         ft: "2–3", wind: "Light onshore",  rating: 3, note: "Fun longboard day. Glassy 'til 9, then onshore.",                          t: "May 27", crew: "South Swell", crewColor: "var(--teal)"  },
  { id: "seed-4", spot: "Blacks Beach",   ft: "2",   wind: "Glassy",         rating: 3, note: "Soft but consistent. Worked on cutbacks.",                                 t: "May 24", crew: "Just me",     crewColor: "var(--ink)"   },
];

// Spots the user already knows on day one. The rest reveal as you tap them on
// the map (the collection loop). Famous breaks + the crew secrets you're in on.
export const INITIAL_DISCOVERED = [
  "lowers", "trestles", "wedge", "malibu", "swamis",
  "steamer-lane", "ocean-beach", "mavericks", "rincon",
  "ghost", "keyhole", "pole9",
];
