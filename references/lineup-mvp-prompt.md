# Lineup — 2.5-Hour MVP Prompt for Claude Code

**Goal: a working clickable web prototype by 7:30 PM today. Web only. Mocked backend. No auth.**

Use this prompt instead of the full build spec for this session. The full spec is for production; this is for a demo prototype.

---

## What you're building

A responsive Next.js web app demonstrating Lineup — a community surf journal with crews (group chats), a map, session logging, community feed, and personal profile.

You have three reference files in this repo:

1. `references/lineup-catalog.jsx` — **the mobile UI is essentially done.** Port it.
2. `references/lineup-desktop.jsx` — **the desktop dashboard is essentially done.** Port it.
3. `references/SPEC.md` — full product spec; consult Sections 5 (design system) and 9 (out of scope) only.

**Your job is mostly conversion, not invention.** The design is locked. Don't redesign anything. Don't deviate from the catalog palette or typography. Don't add features not present in the prototypes.

---

## Stack

- **Next.js 14+ (App Router)** with TypeScript
- **Tailwind CSS** — but use the design tokens from the prototype as CSS variables (the prototype already does this; port the `:root` CSS variable block verbatim into `globals.css`)
- **lucide-react** for icons (already in the prototypes)
- **localStorage** for all persistence — no backend
- **Google Fonts** loaded via `next/font`: Bagel Fat One, Fraunces, Newsreader, JetBrains Mono

No Supabase. No auth. No database. No real-time. Single mocked "You" user with seeded crews and community posts from the prototypes.

---

## File structure (suggested)

```
app/
  layout.tsx              # global fonts, base styles, color tokens
  globals.css             # CSS variables from prototype, base resets
  page.tsx                # responsive: mobile = Crews view, desktop = Dashboard
  crews/page.tsx          # mobile crews list
  crews/[id]/page.tsx     # mobile crew thread
  map/page.tsx            # mobile map view
  feed/page.tsx           # mobile community feed
  profile/page.tsx        # mobile profile
  dashboard/page.tsx      # desktop dashboard (the lineup-desktop.jsx port)
components/
  Masthead.tsx            # mobile top bar (terracotta band)
  BottomNav.tsx           # mobile bottom nav (teal band, FAB)
  DesktopHeader.tsx       # desktop top nav
  LogModal.tsx            # log session modal (used on both mobile + desktop)
  NewPinSheet.tsx         # drop-pin bottom sheet
  SpotSheet.tsx           # spot detail bottom sheet (mobile) / modal (desktop)
  CrewCard.tsx, LogCard.tsx, ClipThumb.tsx, etc.
lib/
  storage.ts              # localStorage wrapper with the same API as window.storage
  seed.ts                 # the seed data from the prototypes
  types.ts                # TypeScript types for Crew, Spot, Session, Message, etc.
```

---

## Responsive behavior

**One codebase, two layouts via breakpoints.**

- **Mobile (`< 768px`)**: the catalog UI from `lineup-catalog.jsx` — masthead band, tabbed bottom nav, single-column views, modal sheets
- **Desktop (`>= 768px`)**: the dashboard from `lineup-desktop.jsx` — top nav, multi-column dashboard, modal dialogs instead of bottom sheets

Use Tailwind's `md:` breakpoint or CSS media queries. Hide the mobile masthead/bottom-nav on desktop; hide the desktop header on mobile. The visit to `/` routes to mobile-Crews on narrow viewports and desktop-Dashboard on wide ones.

---

## Persistence

Replace the prototype's `window.storage` calls with a `lib/storage.ts` wrapper:

```ts
export const storage = {
  get: async (key: string) => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(key);
    return v ? { value: v } : null;
  },
  set: async (key: string, value: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
};
```

Use a single state key: `"lineup-mvp:state"` containing the full app state JSON.

State to persist:
- `mySessions` — sessions the user has logged
- `userPins` — spots the user has dropped
- `discovered` — set of spot IDs the user has interacted with
- `crews` — crew thread updates (when user sends a message or pins a spot)
- `community` — community feed (when user posts or likes)

Hydrate from localStorage on app mount. Wrap with `useEffect` to avoid SSR mismatch issues.

---

## Required interactions (all already in the prototypes — just keep them working)

1. **Crews list** → tap a crew → opens crew thread
2. **Crew thread** → send text messages (persist + appear immediately)
3. **Map** → tap spot pin → opens spot sheet; tap "Drop pin" → drop-mode → tap to place → new pin sheet → save → pin persists and a crew message is generated if shared to crew
4. **Log session FAB** → log modal → save → routed to private/crew/community based on visibility picker
5. **Community feed** → tap heart → like persists
6. **Profile** → derived stats from `mySessions` and `userPins`

Everything else (search field, notifications, share button, more menu) can be visual-only — no functionality required.

---

## Critical design fidelity

Match the prototypes exactly. Specifically don't drift on:

- **Wordmark**: `lineup.` in Bagel Fat One, terracotta, mobile masthead size 34px, desktop header size 30px
- **Palette**: use the CSS variables from the prototype's CSS string verbatim
- **Crew colors**: Dawn Patrol = terracotta, South Swell = teal — these are stored on the crew object
- **Condition colors**: firing = mustard, fair = teal, flat = faint — used as stripes, dot indicators, stamps
- **Stamps**: mono uppercase text on colored background, 3px border-radius
- **Big numerals**: Fraunces 700 with italic option, large sizes (44-72px) as the visual anchor
- **Cards**: 1.5px var(--line) border, 6-8px radius, often with a 5-8px colored top OR left stripe

If you find yourself styling something the prototype already styles, copy the prototype's styling. Don't make it "better."

---

## Out of scope for tonight (do NOT build)

- Authentication, sign-in, sign-up
- Multi-user functionality
- Real-time anything
- Photo or video upload (use the existing stylized placeholders)
- Push notifications
- Backend / database / API
- Search functionality (visual only)
- The "About / Privacy / Support" footer links
- Any feature not present in the prototypes

If something seems missing and you're tempted to add it, don't. Ship what's specified.

---

## Build order (suggested 2.5-hour pacing)

- **0:00 — 0:20** — Project init, fonts loaded, design tokens in globals.css, basic layout shell with responsive breakpoint
- **0:20 — 0:50** — Port `lineup-catalog.jsx` into mobile routes; mobile Crews + Crew Thread working
- **0:50 — 1:15** — Mobile Map view with drop-pin + spot sheets
- **1:15 — 1:35** — Mobile Log Modal + Community + Profile
- **1:35 — 2:00** — Port `lineup-desktop.jsx` into `/dashboard` route
- **2:00 — 2:20** — localStorage persistence wiring across all flows
- **2:20 — 2:30** — Bug pass, polish, deploy to Vercel if time permits

---

## Definition of done by 7:30

A user can open the app on phone or laptop and:
1. See their crews list, open a crew, send messages that persist
2. Open the map, tap spots, drop a new pin (private/crew/community), see it persist
3. Log a session via the FAB, pick visibility, see it land in the right place
4. Browse the community feed, like posts (persists)
5. See their stats on profile
6. On laptop, see the dashboard view with all the above sections rolled up

If all six work end-to-end and the design matches the prototypes, you shipped.

---

## One last note

The prototypes have a bunch of small interaction polish that matters: the pulse animation on a dropped pin, the rise animation on cards entering, the active state for selected pills/visibility options, the colored top/left stripes on cards based on context. Preserve these. They're 60 minutes of design work that you don't have to redo.

Go fast. Ship messy. Polish at 2:20.
