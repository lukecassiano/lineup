# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint via next lint
npx tsc --noEmit # type-check only (no tests exist)
```

## Architecture

Lineup is a surfing social app prototype — Next.js 14 App Router, TypeScript, Tailwind CSS, localStorage persistence, **no backend, no auth**.

### Routing

There is **one route**: `app/page.tsx`. All mobile views (home, crews, map, feed, profile) are implemented as virtual routing via `useState<View>`. `app/dashboard/page.tsx` is just a `redirect("/")`.

Responsive layout is handled in `app/page.tsx` itself: on wide viewports it renders `<DesktopApp>`, on narrow viewports it renders the mobile view stack + `<Dock>` nav.

### State

All app state lives in `app/page.tsx` and is passed down as props. The `LineupApi` interface (exported from `components/DesktopApp.tsx`) is the prop contract between the page and the desktop layout.

State is persisted to localStorage on every mutation via `lib/storage.ts` (key: `"lineup-mvp:state"`). On mount, `app/page.tsx` hydrates from storage; `hydrated` flag prevents flashing seed data.

### Data layer

- `lib/seed.ts` — SEED_CREWS, SEED_COMMUNITY, SEED_SESSIONS, INITIAL_DISCOVERED, SPOTS (prototype spots including secret/crew pins)
- `lib/spots.ts` — CA_SPOTS: real California public surf spots with geographic coordinates (lat/lng), displayed on the Leaflet map
- `lib/types.ts` — all TypeScript types (Crew, ThreadItem union, Spot, CommunityPost, Session, AppState)
- `lib/utils.ts` — `initials()`, `condColor()`, `condLabel()`

The map (react-leaflet + Leaflet) renders both CA_SPOTS and user-dropped pins using real coordinates.

### Design system

All styling uses **inline styles** matching the prototype approach. Tailwind is only used for responsive utilities (`md:hidden`, `hidden md:flex`, etc.) — never for colors, spacing, or typography in components.

**CSS variables** (defined in `app/globals.css`) must be used for all colors — never hardcode hex:
- Surfaces: `--cream`, `--cream2`, `--card`, `--paper`
- Brand: `--terra`, `--teal`, `--pink`, `--mustard` (plus `-deep`/`-soft` variants)
- Text: `--ink`, `--soft`, `--faint`, `--line`, `--line2`

**Four Google Fonts** (loaded in `app/layout.tsx`, available as CSS variables):
- `var(--font-bagel)` — Bagel Fat One, terracotta, 30px desktop / 34px mobile (wordmark only)
- `var(--font-fraunces)` — Fraunces 700, 44–72px for big numerals (often italic)
- `var(--font-newsreader)` — body serif
- `var(--font-jetbrains)` — JetBrains Mono for stamps (9–9.5px, 1.5px letter-spacing, uppercase, 3px border-radius)

Card style: `background: var(--card)`, `border: 1.5px solid var(--line)`, `borderRadius: 6–8px`.

All components are `"use client"`. Icon prop type: `React.ComponentType<LucideProps>` (import `type LucideProps` from lucide-react).

### References

`references/` contains the original JSX prototype files (`lineup-catalog.jsx`, `lineup-desktop.jsx`) and spec docs. These are the source of truth for exact data and visual structure — consult them when the implementation needs to match a specific prototype layout.
