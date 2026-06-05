# Lineup — PRD v0.1

**A community surf journal built around private crews.**

---

## TL;DR

Lineup is a mobile app where small groups of surf friends ("crews") share session logs, secret spot coordinates, and clips inside private group chats — with an optional public Community feed for content they want broader reach for. It is not a forecast tool. It is a journal + social layer for surfers who already share this stuff over text, but in a medium that wasn't built for it.

---

## Problem

Surfers already share spots, sessions, and clips with each other — but the tools they use weren't designed for the job.

- **iMessage / Snap / WhatsApp** lose context. Coords get pasted then buried. Logs aren't structured, so "remember that day at Trestles?" requires scrolling back two months.
- **Surfline-class apps** are forecast products. They tell you what the surf *will be*, not what it *was*. There's no journal layer, no group, no way to share a local spot with the people you actually surf with.
- **Instagram / TikTok** are the wrong privacy gradient. You don't want to broadcast a working coordinate of your local reef to 40,000 strangers.

There's a gap in the middle: a place built for a crew of 4–8 friends to share real intel — sessions, coordinates, clips — without it being either a chat blob or a public broadcast.

---

## Target user

**Primary (v1):** Active surfers, 18–35, surfing 1–3+ sessions/week in dense surf regions (US West Coast, US East Coast, Australia, Portugal, Indonesia). Already have a "crew" of 3–8 friends they group-text about surf. Care about a few local spots they don't want to publicize.

**Not primary:** beginners learning to surf (different needs, lower frequency), surf media consumers (already served by Surfline / Instagram), pure travelers.

---

## Core concept

The product is built around **three privacy tiers**, with a single decision point every time content is created:

| Tier | Visibility | Use case |
|---|---|---|
| **Private** | Only you | A personal journal entry |
| **Crew** | Members of a specific group chat | Real intel — secret spots, real conditions, real talk |
| **Community** | Public feed | Clips and posts you want broader reach for |

Every session log, every dropped pin, every clip flows through this picker. The crew tier is the product's center of gravity — it's where the real social and informational value lives.

### Crews

Crews are **flat group chats**. No roles, no hierarchy, no clan levels. You can be in multiple crews simultaneously. Each crew has a name, an emblem, a member list, and a shared thread. The thread holds three message types: text messages, session-log cards, and pinned-spot cards. Anyone can post anything; everyone sees everything inside the crew.

### Spots & the map

The map shows public breaks (Trestles, The Wedge, etc.) plus any spots that have been shared into crews you belong to. Crew-shared spots appear locked to outsiders. Users can drop a new pin anywhere on the map and choose its visibility — most of the time that means sharing it to a single crew, which broadcasts a "pinned a spot" card into that crew's thread.

### Community

A public feed of clips and short posts. Lower stakes, higher reach. Where you'd post a clip of a notable session you don't mind being seen. Likes, comments, share.

### Profile / collection mechanic

Lightweight personal gamification — sessions logged, weekly streak, spots discovered (collected/total), and a small set of earnable badges. The map filling in as you discover spots is the primary collection loop. **No crew-level XP or leaderboards** — gamification stays personal, not competitive across crews.

---

## v1 scope

### In

1. **Auth & onboarding** — phone/email, basic profile (handle, location).
2. **Crews**
   - Create a crew (name, emblem, members via invite link/handle)
   - Join an existing crew via invite
   - Crew thread: text messages, log cards, spot cards
   - Leave/mute a crew
3. **Session log**
   - Spot name, wave height, wind, rating (1–5), free-text note
   - Optional photo attachment
   - Visibility picker (Just me / Crew / Community)
4. **Map**
   - Discoverable public spots (seeded for major surf regions)
   - Crew-shared spots visible only to members
   - Drop new pin: name, type (Beach / Reef / Point), visibility
5. **Community feed**
   - Chronological feed of public posts and clips
   - Like, comment, share-link
   - Author profile pages
6. **Personal profile**
   - Stats: sessions, weekly streak, spots collected
   - Badges (earned via specific actions)
   - Crew memberships
7. **Notifications** — basic (new message in crew, mention, like on community post)

### Out (explicit non-goals for v1)

- **Surf forecasts.** This is Sandbar's territory. Lineup records what happened; it does not predict what will happen. Conditions data is user-entered journaling, not a forecast feature.
- **Live video / streaming.** Clips are uploaded after the fact.
- **Cross-crew features** (alliances, public crews, leaderboards between crews).
- **Marketplace or e-commerce** (gear, lessons, surf camps).
- **AI features** (auto-tagging conditions, auto-summarizing sessions). Possible v2.
- **Web app.** Mobile only at launch (iOS first, Android fast-follow).
- **Detailed moderation tooling** beyond report/block.

---

## Key product decisions (and the rationale)

- **Crews are flat group chats, not clans with roles.** A friend group of 6 doesn't want a Leader and Elders. Hierarchy is friction for the actual use case.
- **No forecast model.** A flywheel that depends on community-logged conditions training a forecast adds scope and changes the product's identity. Recording conditions is journaling, full stop.
- **Personal, not competitive, gamification.** Crew leaderboards would create perverse incentives (post more, post louder) that work against the "real intel inside a small group" thesis.
- **The visibility picker is the central UX moment.** Every create flow ends with it. Three clear options, one decision.

---

## Success metrics

### Activation (first 7 days)
- % of new users who join or create a crew with ≥2 other members → **target 50%+**
- % who log their first session → **target 60%+**

### Engagement
- Median sessions logged per active user per week → **target 1+**
- Median crew messages per active crew per week → **target 10+**

### Retention
- D7 / D30 retention of activated users → benchmark against social/journaling category
- 4-week crew retention (crew with ≥1 message per week for 4 consecutive weeks)

### Network shape
- Median crew size at 30 days → **target 4+**
- % of users in ≥1 active crew → **target 70%+**

---

## Risks & open questions

- **Network effect dependency.** A new user with no surf friends on the app gets little value. Need to solve cold start — likely invite-only seeded launch in 1–2 surf-dense cities (Long Beach, San Diego, or San Francisco).
- **"Why not just use iMessage?"** The product has to be meaningfully better than a group chat for the core flow. The structured log + map + visibility picker is the bet, but it has to feel that way in 30 seconds, not 3 weeks.
- **Spot privacy is a trust contract.** If a crew member screenshots a pinned coordinate and posts it publicly, the platform's promise is broken. Tech can mitigate (e.g., watermarking, no screenshot detection) but the core defense is social — small trusted crews, no public crew discovery.
- **Community feed moderation.** Even a small public surface needs basic moderation. Plan to launch with simple report/block, scale tooling with growth.
- **Geographic concentration.** Surf is regional. A launch in the wrong city dies; the right city compounds. Tight geo focus at launch.

---

## v2 candidates (not committed)

- Photo/video upload pipeline with EXIF stripping for privacy
- Tide & wind auto-fill (still not forecast — just current conditions auto-populated at log time)
- Crew "wall" — a permanent feed of a crew's best sessions, separate from the message thread
- Cross-posting from Sandbar (forecast snapshot → log entry)
- Surf travel guides built from anonymized aggregate journal data

---

*v0.1 · last updated June 2026*
