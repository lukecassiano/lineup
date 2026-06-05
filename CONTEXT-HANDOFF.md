# Lineup — Context Handoff

## What this is
A 2.5-hour MVP demo prototype — Next.js 14 App Router, TypeScript, Tailwind CSS, localStorage persistence, no backend, no auth.

## Current state
**All mobile views are implemented. Desktop dashboard is ~80% done (was interrupted mid-build).**

Dev server is running on `http://localhost:3000`. Start it with `npm run dev` from `c:\Users\lukec\projects\lineup`.

## What's built and working

### Foundation
- `app/globals.css` — all 19 `:root` CSS tokens verbatim from prototype, keyframes (rise, pulse, pinpulse)
- `app/layout.tsx` — 4 Google Fonts via next/font/google: Bagel Fat One (`--font-bagel`), Fraunces (`--font-fraunces`), Newsreader (`--font-newsreader`), JetBrains Mono (`--font-jetbrains`)
- `lib/types.ts` — TypeScript types: Crew, ThreadItem (text/log/spot union), Spot, CommunityPost, Session, AppState
- `lib/seed.ts` — SPOTS, SEED_CREWS, SEED_COMMUNITY, INITIAL_DISCOVERED (exact data from prototype)
- `lib/storage.ts` — localStorage wrapper + STATE_KEY = `"lineup-mvp:state"`
- `lib/utils.ts` — initials(), condColor(), condLabel()

### Mobile components (all complete, in `components/`)
- `CrewsList.tsx` — crews list with colored left stripes, emblem, preview, member avatars
- `CrewThread.tsx` — thread header in crew color, text/log/spot message types, send input
- `MapView.tsx` — SVG travel-poster map, spot pins, drop-mode overlay, pending pin pulse animation, drop-fab
- `SpotSheet.tsx` — bottom sheet, condition-colored stripe, secret vs public content, log CTA
- `NewPinSheet.tsx` — bottom sheet after pin drop, name input, type pills, visibility picker
- `LogModal.tsx` — full-screen pink-header modal, all fields, visibility picker, save CTA
- `Community.tsx` — feed with clip thumbs (play toggle), like/comment/share, mood stamps
- `Profile.tsx` — stats (sessions/streak/spots), patches grid, crews list; exports buildBadges()

### Main app (`app/page.tsx`)
- All state in one component: view, activeCrew, activeSpot, logging, dropMode, pendingPin, crews, community, mySessions, userPins, discovered
- **localStorage persistence**: hydrates on mount, persists on every state mutation
- All 6 required interactions wired: crew list → thread → send, map → spot sheet → log, drop pin → new pin sheet → save → crew message, log FAB → modal → save → route by visibility, community likes, profile stats
- Masthead hidden in crew thread and log modal
- Bottom nav hidden in crew thread and log modal
- Desktop placeholder with link to `/dashboard`

## What's NOT done yet
1. **`app/dashboard/page.tsx`** — the desktop dashboard (port of `references/lineup-desktop.jsx`). Directory was created at `app/dashboard/` but the file doesn't exist yet.

## What the desktop dashboard needs
Port `references/lineup-desktop.jsx` exactly. Structure:
- **Sticky header**: wordmark left, mono nav links (Home/Crews/Map/Feed/Journal), search + bell + pink "Log session" CTA + avatar right, mustard 3px hairline below
- **Hero section**: 64px Fraunces italic greeting "Welcome back, Luke." with name in terracotta; right column = FIRING TODAY card (The Wedge, 4–5ft, big numerals)
- **Stat row**: 3 cards with colored left stripes, 64px Fraunces numerals — 27 sessions (terra), 5🔥 streak (pink), 4/6 spots (teal)
- **Two-column activity grid** (60/40):
  - Left: crew activity cards (colored header band, 2-3 recent thread items inline)
  - Right rail: map preview (same SVG art, drop-pin FAB) + community trending (3 posts compact)
- **Journal grid**: 2-column of MY_LOGS (4 entries, left stripe = rating color, 44px Fraunces numeral, italic spot name, note)
- **Footer**: wordmark left, tagline center, minor links right

Use seed data from `lib/seed.ts` (SEED_CREWS, SEED_COMMUNITY, SPOTS) — NOT the inline data in the desktop prototype.
Add a spot sheet modal (dialog, not bottom sheet) when a map pin is tapped.
Add a log modal via the "Log session" CTA — reuse the `LogModal` component from `components/LogModal.tsx`.
The page should be `"use client"` with useState for activeSpot and logging.

## Design rules (do not deviate)
- Wordmark: Bagel Fat One, terracotta, 30px desktop / 34px mobile
- All color via CSS variables (`var(--terra)`, `var(--teal)`, etc.) — never hardcode hex
- Font references: `var(--font-bagel)`, `var(--font-fraunces)`, `var(--font-newsreader)`, `var(--font-jetbrains)`
- Cards: `background: var(--card)`, `border: 1.5px solid var(--line)`, `borderRadius: 6-8px`
- Stamps: JetBrains Mono, 9-9.5px, 1.5px letter-spacing, uppercase, 3px border-radius
- Dawn Patrol = `var(--terra)`, South Swell = `var(--teal)`
- Big numerals: Fraunces 700, 44-72px, often italic

## File structure
```
c:\Users\lukec\projects\lineup\
  app/
    globals.css        ✅
    layout.tsx         ✅
    page.tsx           ✅ (mobile app + desktop placeholder)
    dashboard/
      page.tsx         ❌ NEEDS TO BE BUILT
  components/
    CrewsList.tsx      ✅
    CrewThread.tsx     ✅
    MapView.tsx        ✅
    SpotSheet.tsx      ✅
    NewPinSheet.tsx    ✅
    LogModal.tsx       ✅
    Community.tsx      ✅
    Profile.tsx        ✅
  lib/
    types.ts           ✅
    seed.ts            ✅
    storage.ts         ✅
    utils.ts           ✅
  references/
    lineup-catalog.jsx    (mobile prototype — already ported)
    lineup-desktop.jsx    (desktop prototype — needs to be ported to dashboard)
    lineup-build-spec.md
    lineup-mvp-prompt.md
```

## Key decisions made
- Virtual routing (useState) for mobile views — no Next.js route per tab
- Inline styles throughout (matches prototype approach) — Tailwind only for responsive utilities (md:hidden etc.)
- `"use client"` on all components
- Icon prop type: `React.ComponentType<LucideProps>` (import `type LucideProps` from lucide-react)
- `axes: ['opsz']` removed from next/font — caused errors with specific weight arrays
- TypeScript is clean (npx tsc --noEmit passes with 0 errors)

## Immediate next task
Build `app/dashboard/page.tsx` — port `references/lineup-desktop.jsx` into a proper Next.js page using the shared lib/ files. The desktop file has all the JSX structure; just convert inline CSS strings to style objects, swap seed data imports, and reuse LogModal + SpotSheet components.
