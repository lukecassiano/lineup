# Lineup — Build Spec for Claude Code

You are building **Lineup**, a community surf journal mobile app with a companion desktop dashboard. This document is your full brief. Architecture, design system, and product decisions are specified here. Implementation choices (framework specifics, file organization, exact code patterns) are yours to make within these constraints.

Read this entire document before writing code.

---

## 1. TL;DR

Lineup is a mobile-first social app where small groups of surf friends ("crews") share private session logs, secret spot coordinates, and clips within group chats — with an optional public Community feed for content they want broader reach for.

It is **not a surf forecast tool**. Recording conditions in a session log is journaling, not prediction. The product's value is the social and informational layer for surfers who already share this stuff over text but in a medium that wasn't built for it.

Sandbar (a separate sibling product, agentic surf forecasting) handles forecasts. Lineup handles what happened, with whom, where.

---

## 2. Product context

### Problem

- iMessage / WhatsApp / Snap aren't structured for surf logs and spot coordinates. They lose context.
- Surfline-class apps forecast; they don't journal. No group layer, no crew sharing.
- Instagram is the wrong privacy gradient — you don't want a public broadcast of your local reef's coordinates.

The gap: a tool built for a 4–8-person crew of friends to share real intel — coordinates, conditions, clips — privately, with an optional public outlet.

### Target user (v1)

Active surfers, 18–35, surfing 1–3+ sessions per week in dense surf regions (US West Coast, US East Coast, Australia, Portugal, Indonesia). Already have a "crew" of 3–8 friends they group-text about surf. Care about a few local spots they don't want to publicize.

### Core thesis

The product is built around **three privacy tiers**, with a single decision point every time content is created:

| Tier | Visibility | Use case |
|---|---|---|
| **Private** | Only you | Personal journal entry |
| **Crew** | Members of a specific group chat | Real intel — secret spots, real conditions |
| **Community** | Public feed | Clips and posts for broader reach |

Every session log, every dropped pin, every clip flows through this picker. **The crew tier is the product's center of gravity.**

### Key product decisions (do not deviate from these)

- **Crews are flat group chats.** No roles. No "Leader" or "Elder." A crew is a flat membership of equals.
- **No surf forecasting.** Conditions data is user-entered for journaling, never to train a forecast model. That's Sandbar's domain.
- **Personal, not competitive, gamification.** Map collection, streak, badges — all personal. No crew leaderboards, no XP races between crews.
- **The visibility picker is the central UX moment.** Every create flow ends with it. Three clear options, one decision.

---

## 3. Features & Architecture

### Mobile app — five screens

1. **Crews** — list of group chats → tap to open thread
2. **Map** — break map with public + crew-secret pins → tap to drop new pin
3. **Log** (modal/FAB) — log a new session with conditions + visibility picker
4. **Community** — public feed of clips and posts
5. **Profile** — personal stats, badges, crew memberships

### Desktop — single-scroll dashboard

One scrolling editorial dashboard that mirrors the flow of a magazine-style website. Sections:

- Top nav (Home / Crews / Map / Feed / Journal)
- Hero greeting + "firing today" conditions card
- Stat row (Sessions / Streak / Spots collected)
- Two-column: crew activity feed (left, wider) + map preview & community trending (right rail)
- Journal section: recent session entries as a two-column grid
- Footer

### Core user flows

#### Flow 1: Log a session
1. User taps the pink FAB / "Log session" CTA
2. Full-screen modal opens with a pink header band
3. Fields: spot name, wave height (pills: 1-2/2-3/3/4-5/6+), wind (pills), rating (1-5 stars), optional note, optional photo
4. **Visibility picker** at bottom: Just me / [each crew the user is in] / Community
5. Save → routed to the correct destination

#### Flow 2: Drop a pin on the map
1. User opens map → taps "Drop a pin" FAB (bottom-right of map card)
2. Map enters drop-mode: translucent overlay, "Tap to drop a pin" instruction, cursor becomes crosshair
3. User taps anywhere on the map → pulsing pin animates onto that location
4. Bottom sheet rises: spot name input, type pills (Beach / Reef / Point), visibility picker
5. Confirm → spot added to map, persisted, and if shared to a crew, auto-posts a "[User] pinned [spot]" card into that crew's thread

#### Flow 3: Crew thread interaction
- Open a crew → see thread with three types of messages mixed inline:
  - Text messages (left/right bubbles, "my" bubbles in crew color)
  - Session-log cards (with rating-colored top stripe, big Fraunces numeral)
  - Pinned-spot cards (with `[User] PINNED A SPOT` kicker + spot details)
- Send a text message via input at the bottom
- Tap the map-pin icon to drop a pin into the chat directly

---

## 4. Data model

Suggested schemas (final structure is yours):

```ts
type User = {
  id: string;
  handle: string;
  displayName: string;
  location: string;
  avatar?: string;
  createdAt: Date;
};

type Crew = {
  id: string;
  name: string;
  emblem: string;          // single character/glyph: "◐", "≈", etc.
  color: "terra" | "teal" | "mustard" | "pink";  // brand color for this crew
  memberIds: string[];     // flat — no roles
  createdAt: Date;
};

type Spot = {
  id: string;
  name: string;
  type: "Beach" | "Reef" | "Point";
  x: number;               // lng-like, 0-100 in map coordinate space
  y: number;               // lat-like, 0-108 in map coordinate space
  // OR use real lat/lng if integrating with a real map provider
  secret: boolean;
  crewId?: string;         // if shared with a crew
  createdBy: string;       // userId
  isPublic?: boolean;      // for built-in spots like Trestles
};

type Session = {
  id: string;
  userId: string;
  spotId?: string;         // references a Spot if logged at a known one
  spotName: string;        // also store the literal name for portability
  ft: string;              // "1-2" | "2-3" | "3" | "4-5" | "6+"
  wind: "Glassy" | "Light onshore" | "Side-shore" | "Blown out";
  rating: 1 | 2 | 3 | 4 | 5;
  note?: string;
  photo?: string;
  visibility: "private" | { crewId: string } | "community";
  createdAt: Date;
};

type Message = {
  id: string;
  crewId: string;
  userId: string;
  kind: "text" | "log" | "spot";
  text?: string;           // for kind="text"
  sessionId?: string;      // for kind="log"
  spotId?: string;         // for kind="spot"
  createdAt: Date;
};

type CommunityPost = {
  id: string;
  userId: string;
  mediaType: "clip" | "photo" | "text";
  mediaUrl?: string;
  caption: string;
  mood?: "firing" | "fair" | "flat";
  createdAt: Date;
};

type Like = { userId: string; postId: string; createdAt: Date; };
type Comment = { id: string; userId: string; postId: string; text: string; createdAt: Date; };
```

Derived/computed:
- **Streak** — consecutive weeks the user has logged ≥1 session
- **Spots collected** — count of distinct spotIds the user has interacted with (logged at or dropped)
- **Badges** — Dawn Patrol (logged before 7am), Cartographer (dropped ≥1 pin), Storm Chaser (any log with rating ≥4), The Local (≥10 sessions at one spot)

---

## 5. Design system (mandatory — do not deviate)

This is the result of iteration. The aesthetic is **"70s California sun-faded catalog"** — confident, color-blocked, warm. Not magazine pastiche, not minimalist. Sibling to Sandbar's editorial cream-and-gradient identity but distinctly its own.

### Color palette

```css
:root {
  /* Surfaces */
  --cream:    #f3e8d2;  /* base background */
  --cream2:   #ede0c5;  /* slightly deeper paper */
  --card:     #f9efd9;  /* card surface */
  --paper:    #fbf4e3;  /* lightest paper */

  /* Brand & accents */
  --terra:      #c54f2d;  /* PRIMARY BRAND — wordmark, primary buttons */
  --terra-deep: #9d3a1c;
  --mustard:    #d9a847;  /* FIRING conditions, accent rules, top borders */
  --mustard-deep: #b08530;
  --teal:       #1d5366;  /* FAIR conditions, secondary actions, bottom nav */
  --teal-deep:  #0e3947;
  --pink:       #e6336d;  /* CREATE/ENERGY — FAB, likes, log modal header */

  /* Text */
  --ink:   #2a1f15;  /* warm near-black */
  --soft:  #7a6850;
  --faint: #a89880;
  --line:  #d4c4a3;
  --line2: #c5b48f;
}
```

### Color roles (rigid — each color has a job)

- **Terracotta** = brand, primary buttons ("Save entry", "Log session here"), wordmark, primary CTAs
- **Mustard** = the FIRING conditions color, decorative rules and borders, "PATCHES" earned states
- **Teal** = the FAIR conditions color, secondary actions, the bottom nav, "info" affordances
- **Pink** = the CREATE/ENERGY color — log session FAB, likes/hearts, log modal header, "energy" moments
- **Ink** = text, structure, "crew secret" pins, sender bubbles in chat, ink stamps

### Typography stack

```css
/* Wordmark only */
font-family: 'Bagel Fat One', sans-serif;   /* size 30-34px, --terra color */

/* Display / numerals / headlines / titles */
font-family: 'Fraunces', serif;             /* weights 500 / 700 */
/* Use heavy + italic for numerals like 4–5 ft @ 12s, big stats */

/* Body / notes / captions */
font-family: 'Newsreader', serif;           /* 400-500, italic for notes */

/* Data labels / kickers / timestamps / nav text */
font-family: 'JetBrains Mono', monospace;   /* 9-11px, letter-spaced 1.5-3px, often uppercase */
```

### Component patterns

#### Cards
- Background `var(--card)`, 1.5px `var(--line)` border, 6-8px border-radius
- Often have a 5-8px colored top stripe indicating semantic meaning:
  - Mustard stripe = firing condition
  - Teal stripe = fair condition
  - Terracotta or crew-color stripe = identity
  - Pink stripe = create/new
- Some cards have a thick left stripe instead (crew identity in lists)

#### Stamps (the signature visual unit)
A small rectangle with mono uppercase text, 3px border-radius, used for status labels:
- `FIRING` → mustard bg, ink text
- `FAIR` → teal bg, cream text
- `CREW · SECRET` → ink bg, cream text
- `NEW SPOT`, `NEW ENTRY` → pink bg, cream text
- `EARNED`, `EST. '26` → outlined or terracotta

#### Crew identity
Each crew has a brand color (`var(--terra)` or `var(--teal)` for the seed crews). That color appears as:
- A thick (5-10px) left stripe on the crew card in the list
- The background of the crew thread header
- The crew emblem tile
- "My" message bubbles inside the crew thread (so each crew thread feels distinct)
- The colored ring on the visibility picker option for that crew

#### Hero numerals
Big Fraunces 700 (sometimes italic) numerals are the visual anchor everywhere. Examples:
- `4–5` in 52px on a log card
- `3–4 ft @ 12s` with the number at 70px in the spot sheet
- Profile stats: `27` sessions, `5 🔥`, `4/6` spots — all 42-64px Fraunces

#### Visibility picker (used in log modal AND drop-pin sheet)
Each option is a button row with:
- A colored 34x34 square tile with the option's icon in cream
  - Just me = ink tile, Lock icon
  - Each crew = crew-color tile, Users icon
  - Community = pink tile, Waves icon
- Title in Fraunces 700
- Sub-label in mono small caps
- Right side: a circular check radio that fills with the option's color when selected
- Selected option: thicker colored border, lighter paper background, animated left stripe slides in

### Mobile-specific aesthetic moves

- **Masthead band**: full-width terracotta band, cream wordmark `lineup.` in Bagel Fat One, 4px mustard border at the bottom
- **Bottom nav**: full-width teal band, mustard 4px top border, mono uppercase tab labels, active state = mustard with a 5px mustard dot indicator above the label
- **FAB (center of nav)**: 54x54 pink circle with 3px cream border, plus icon, slightly elevated (-12px margin-top), pink glow shadow
- **Map**: terracotta land mass with dotted halftone texture, teal contour lines in the ocean, small compass rose in bottom-left, no decorative sun
- **Log modal header**: pink band (different from masthead — signals the "create" action context)

### Desktop-specific aesthetic moves

- **Header**: quiet cream-on-cream, terracotta wordmark left, mono nav links center/right, search field + bell + pink "Log session" CTA + avatar right; mustard 3px hairline below header
- **Hero**: 64px Fraunces italic greeting "Welcome back, [Name]." with the name in terracotta; right column = `FIRING TODAY` conditions card with huge numerals
- **Stat row**: three cards with colored left stripes (terracotta / pink / teal), 64px Fraunces numerals
- **Crew cards (dashboard)**: header band in crew color showing recent activity, body with 2-3 most recent thread items inline
- **Map preview**: square card with the same terracotta-land / teal-contour styling, with "Drop pin" floating button
- **Journal grid**: two-column session entries on desktop (single column on mobile)

---

## 6. Mobile structure detail

```
APP CONTAINER
├── MASTHEAD (terracotta, fixed top — hidden in crew thread + log modal)
│   ├── wordmark "lineup."
│   ├── masthead meta "A community surf journal · 1976"
│   └── avatar (right)
│
├── SCROLL AREA (changes per route)
│   ├── /crews            → CrewsList
│   ├── /crews/:id        → CrewThread (full-screen, replaces masthead with crew-color header)
│   ├── /map              → MapView (drop pin overlay state lives here)
│   ├── /community        → Community feed
│   └── /profile          → Profile
│
├── MODALS (overlay layer)
│   ├── LogModal          → pink header, full-screen
│   ├── NewPinSheet       → bottom sheet with pink stripe (after pin dropped)
│   └── SpotSheet         → bottom sheet with condition-colored stripe (on pin tap)
│
└── BOTTOM NAV (teal, fixed bottom — hidden in crew thread + log modal)
    ├── Crews (Users icon)
    ├── Map (Map icon)
    ├── FAB (+ button, pink, centered)
    ├── Feed (Waves icon)
    └── You (User icon — singular, distinct from Crews's plural)
```

### Iconography (lucide-react)

- Crews: `Users` (plural — a group)
- You: `User` (singular — yourself)
- Map: `Map`
- Feed: `Waves`
- FAB: `Plus`
- Drop pin: `Crosshair`
- Likes: `Heart` (red/pink filled when liked)
- Conditions: stars use `Star` in the appropriate condition color
- Badges: `Sunrise` (Dawn Patrol — literally about dawn), `Compass` (Cartographer), `Wind` (Storm Chaser), `MapPin` (The Local)

---

## 7. Desktop structure detail

```
DESKTOP DASHBOARD (max-width 1280-1440px, centered)
├── HEADER (sticky top, cream)
│   ├── wordmark "lineup." + nav links (Home / Crews / Map / Feed / Journal)
│   └── search + bell + Log CTA + avatar
│
└── MAIN (single scroll)
    ├── HERO (60/40 split)
    │   ├── Left: 64px Fraunces italic greeting
    │   └── Right: "Firing Today" conditions card
    ├── STAT ROW (3 cards × 64px Fraunces numerals)
    ├── ACTIVITY GRID (60/40 split)
    │   ├── Left: Crew activity (each crew = card with colored header + recent thread)
    │   └── Right rail: Map preview + Community Trending
    ├── JOURNAL GRID (2 columns of recent session entries)
    └── FOOTER (wordmark + tagline + minor links)
```

The desktop is one scroll, no tabs — like a magazine homepage. Nav links scroll-anchor or navigate to dedicated pages (your choice, but the home/dashboard view is the priority).

---

## 8. Implementation suggestions

You have latitude on stack. Suggestions, in order of fit:

### Frontend
- **Mobile**: React Native + Expo (cleanest path to iOS/Android with shared logic), OR a responsive Next.js PWA (faster to ship, no native)
- **Desktop**: Next.js + Tailwind CSS, mounted at `/dashboard` or as a separate `lineup-web` package
- **Shared**: a `lineup-core` package with types, design tokens, and shared business logic

### Backend
- **Supabase** is the best fit: postgres + auth + realtime (for crew chats) + storage (for clips/photos) + row-level security (for crew privacy). Crew chat = realtime subscription to a `messages` table filtered by `crewId`.
- Alternative: Firebase, but Supabase's relational model fits the data better.

### Auth
- Phone OTP or email magic link via Supabase Auth
- Profile creation after first auth: handle, display name, location

### Real-time
- Crew thread updates: Supabase realtime subscription on `messages` table
- Community feed: less critical, can be polled
- Notifications: basic push via Expo Notifications (mobile) + email digest (web fallback)

### Media
- Photos: client-side resize before upload; store in Supabase Storage
- Clips: store in Supabase Storage with HLS/MP4; later consider Mux for transcoding at scale
- Privacy: strip EXIF/GPS metadata from any photo upload, especially for crew-secret spots

### Maps
- For prototype: stylized SVG map (matches the aesthetic, what we built)
- For production: Mapbox GL with a custom style matching the catalog palette (terracotta land, teal contours, cream water) — Mapbox lets you ship a fully custom-styled map
- Pin coordinates stored as proper lat/lng; the stylized map is a visual layer over the standard tile system

### Persistence in MVP
- Even before backend integration, build with local persistence (AsyncStorage / IndexedDB / Supabase local) so the app works during dev
- Use the prototype's data shapes as fixtures for seeding

### State management
- React Query + Supabase for server state
- Zustand or React Context for client state (current view, modal open, drop-pin mode)
- Avoid Redux unless complexity demands it — this is not a Redux-sized app

---

## 9. Out of scope (do not build)

These are explicit non-goals for v1. If you find yourself reaching for any of these, stop and ask first.

- **Surf forecasts.** No predictive models. No "expected conditions Friday." Sandbar's job.
- **Live streaming or live video.** Clips are uploaded after the session.
- **Crew roles, ranks, XP, leaderboards.** Crews are flat group chats.
- **Cross-crew features** like alliances, public crew discovery, or crew search.
- **Marketplace / e-commerce.** No gear sales, lesson bookings, surf camp listings.
- **AI features.** No auto-tagging conditions from photos, no auto-summarizing sessions, no AI-generated content. Possible v2.
- **Web app for mobile-equivalent UX.** The desktop is a dashboard, not a mobile-on-web port.
- **Detailed moderation tooling** beyond report/block. Trust + small crews carry v1.
- **Multiple language support.** English only at launch.

---

## 10. Suggested build order

Ship in phases. Each phase should be functional end-to-end before moving to the next.

### Phase 1 — Skeleton (week 1)
- Project setup, design tokens, typography loaded
- Tab navigation shell (mobile) with empty screens
- Auth: sign up / sign in / basic profile
- One crew seeded for testing

### Phase 2 — The crew loop (weeks 2-3)
- Crews list with mock data
- Crew thread with text messaging (realtime via Supabase)
- Create new crew + invite flow
- Visibility-picker component (used in subsequent flows)

### Phase 3 — Sessions (week 4)
- Log session modal with full form
- Session card renders in crew thread, profile, community feed depending on visibility
- Persisted in DB

### Phase 4 — The map (weeks 5-6)
- Stylized map view with seeded spots
- Spot detail bottom sheet
- Drop-pin flow (FAB → drop mode → confirm sheet → persist)
- Crew-secret spot privacy enforcement via RLS

### Phase 5 — Community (week 7)
- Public feed with clips and posts
- Like + comment basic flows
- Media upload (start with photos; clips later)

### Phase 6 — Profile + gamification (week 8)
- Stats computation (streak, sessions, spots collected)
- Badges awarded on the right triggers
- Profile UI

### Phase 7 — Desktop dashboard (weeks 9-10)
- Web app with the dashboard layout
- All sections reading from the same backend
- Auth shared with mobile

### Phase 8 — Polish (week 11+)
- Animations and transitions
- Empty states
- Onboarding flow
- Push notifications
- Error states + offline handling

---

## 11. References

Treat these as guides, not specs:

- **The mobile prototype** (`lineup-catalog.jsx`) — the canonical reference for the mobile design, screens, and interactions
- **The desktop prototype** (`lineup-desktop.jsx`) — reference for the dashboard layout
- **The PRD** (`lineup-prd.md`) — product context and rationale
- **Sandbar** — the user's sibling product, distinct identity (cream / Fraunces / pink-lavender-blue gradient). Lineup must read as a sibling, not a clone — same studio, different surface. Maintain the catalog aesthetic; do not introduce Sandbar's gradient.

---

## 12. Voice and copy guidance

- Section headers use a "kicker + headline" pattern: small uppercase mono label above a Fraunces title (e.g., `THE BREAK MAP · CHARTED` / `Your lineup.`)
- Titles often end in a period ("Group chats.", "Your lineup.", "Patches.") — editorial, declarative
- Conditions use direct verbs and surf-native language: "Glass at dawn, empty lineup, offshore till 9"
- Crew thread messages are casual, real — not corporate
- Stamps are emphatic small caps: `FIRING`, `FAIR`, `CREW · SECRET`, `EARNED`
- Avoid generic SaaS phrasing ("Welcome to your dashboard"). Prefer specific, embodied language ("Welcome back, Luke. Three crewmates posted this week.")

---

## 13. What "done" looks like for v1

A user can:
1. Sign up, set a handle and location
2. Create a crew and invite friends via shareable link
3. Open their crew thread and send messages, share spots, share sessions
4. Open the map, see public + crew-secret spots, drop a new pin, share to crew
5. Log a session with conditions + note + visibility, route it to the right destination
6. Browse the public community feed, like and comment
7. See their stats and badges on their profile
8. Do all of the above on mobile (iOS) and the dashboard equivalent on web

Everything else is polish. Get to that loop, end-to-end, real-time, then iterate.

---

*Build with care. The product's whole bet is that a 4-8-person crew of surf friends will trust this place enough to share real coordinates and real conditions. That trust shows up in security (RLS, encrypted storage, EXIF stripping), in design (clear visibility picker, no accidental over-sharing), and in tone (real surf language, not surf-themed gloss).*
