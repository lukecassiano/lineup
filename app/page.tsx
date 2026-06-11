"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

import Home from "@/components/Home";
import Dock, { type DockView } from "@/components/Dock";
import CrewsList from "@/components/CrewsList";
import CrewThread from "@/components/CrewThread";
import MapView from "@/components/MapView";
import SpotSheet from "@/components/SpotSheet";
import NewPinSheet from "@/components/NewPinSheet";
import NewCrewSheet from "@/components/NewCrewSheet";
import PostComposer from "@/components/PostComposer";
import LogModal from "@/components/LogModal";
import Community from "@/components/Community";
import Profile, { buildBadges, type Badge } from "@/components/Profile";
import { BadgeSheet, BadgeUnlock } from "@/components/Badges";

import type { Crew, Spot, CommunityPost, Session } from "@/lib/types";
import {
  SEED_CREWS,
  SEED_COMMUNITY,
  SEED_SESSIONS,
  INITIAL_DISCOVERED,
  SPOTS,
} from "@/lib/seed";
import { CA_SPOTS } from "@/lib/spots";
import { storage, STATE_KEY } from "@/lib/storage";

type View = "home" | "crews" | "map" | "feed" | "profile";

const SAMPLE_CLIP = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const SEED_CREW_COUNT = SEED_CREWS.length;

export default function Home_Page() {
  const [view, setView] = useState<View>("home");
  const [activeCrew, setActiveCrew] = useState<Crew | null>(null);
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [logging, setLogging] = useState(false);
  const [composing, setComposing] = useState(false);
  const [creatingCrew, setCreatingCrew] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [draft, setDraft] = useState("");

  // Drop-pin flow
  const [dropMode, setDropMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);

  // App state (persisted)
  const [crews, setCrews] = useState<Crew[]>(SEED_CREWS);
  const [community, setCommunity] = useState<CommunityPost[]>(SEED_COMMUNITY);
  const [mySessions, setMySessions] = useState<Session[]>(SEED_SESSIONS);
  const [userPins, setUserPins] = useState<Spot[]>([]);
  const [discovered, setDiscovered] = useState<string[]>(INITIAL_DISCOVERED);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    (async () => {
      try {
        const s = await storage.get(STATE_KEY);
        if (s?.value) {
          const d = JSON.parse(s.value);
          if (d.mySessions) setMySessions(d.mySessions);
          if (d.crews) setCrews(d.crews);
          if (d.community) setCommunity(d.community);
          if (d.userPins) setUserPins(d.userPins);
          if (d.discovered) setDiscovered(d.discovered);
        }
      } catch {}
      setHydrated(true);
    })();
  }, []);

  const persist = (
    patch: Partial<{
      mySessions: Session[];
      crews: Crew[];
      community: CommunityPost[];
      userPins: Spot[];
      discovered: string[];
    }>
  ) => {
    const next = { mySessions, crews, community, userPins, discovered, ...patch };
    storage.set(STATE_KEY, JSON.stringify(next)).catch(() => {});
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const sessionCount = 23 + mySessions.length;
  const streak = 5 + Math.max(0, mySessions.length - SEED_SESSIONS.length);
  const collected = discovered.length;
  const total = SPOTS.length + userPins.length;
  const extraCrews = Math.max(0, crews.length - SEED_CREW_COUNT);
  const badges = buildBadges({ mySessions, userPins, sessionCount, collected, extraCrews });
  const firingSpot = CA_SPOTS.find((s) => s.cond === "firing") ?? CA_SPOTS[0];
  const currentCrew = activeCrew ? crews.find((c) => c.id === activeCrew.id) ?? null : null;

  // ── Badge unlock detection ────────────────────────────────────────────────────
  const earnedSig = badges.filter((b) => b.got).map((b) => b.id).sort().join(",");
  const earnedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (earnedRef.current === null) {
      earnedRef.current = earnedSig;
      return;
    }
    if (earnedSig !== earnedRef.current) {
      const prev = new Set(earnedRef.current.split(",").filter(Boolean));
      const newly = badges.filter((b) => b.got && !prev.has(b.id));
      earnedRef.current = earnedSig;
      if (newly.length) setUnlockedBadge(newly[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, earnedSig]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const sendMsg = (crewId: string) => {
    if (!draft.trim()) return;
    const nc = crews.map((c) =>
      c.id === crewId
        ? {
            ...c,
            thread: [
              ...c.thread,
              { id: "x" + Date.now(), type: "text" as const, who: "You", text: draft, t: "Now" },
            ],
          }
        : c
    );
    setCrews(nc);
    setDraft("");
    persist({ crews: nc });
  };

  const crewMeta = (visibility: string): { crew: string; color: string } => {
    if (visibility.startsWith("crew:")) {
      const c = crews.find((x) => x.id === visibility.split(":")[1]);
      return { crew: c?.name ?? "Crew", color: c?.color ?? "var(--ink)" };
    }
    if (visibility === "community") return { crew: "Community", color: "var(--pink)" };
    return { crew: "Just me", color: "var(--ink)" };
  };

  const addLog = ({
    spot,
    ft,
    wind,
    rating,
    note,
    visibility,
  }: {
    spot: string;
    ft: string;
    wind: string;
    rating: number;
    note: string;
    visibility: string;
  }) => {
    const meta = crewMeta(visibility);
    const entry: Session = {
      id: "m" + Date.now(),
      spot,
      ft,
      wind,
      rating,
      note,
      t: "Today",
      crew: meta.crew,
      crewColor: meta.color,
    };
    const ms = [entry, ...mySessions];
    let nc = crews;
    let ncm = community;

    if (visibility.startsWith("crew:")) {
      const cid = visibility.split(":")[1];
      nc = crews.map((c) =>
        c.id === cid
          ? {
              ...c,
              thread: [
                ...c.thread,
                { id: entry.id, type: "log" as const, who: "You", spot, ft, wind, rating, note, t: "Now" },
              ],
            }
          : c
      );
    } else if (visibility === "community") {
      ncm = [
        {
          id: entry.id,
          who: "you",
          clip: false,
          mood: rating >= 4 ? "firing" : rating >= 3 ? "fair" : "flat",
          cap: note || `${ft}ft at ${spot}`,
          likes: 0,
          comments: 0,
          liked: false,
          mine: true,
          t: "Just now",
          commentList: [],
        },
        ...community,
      ];
    }

    setMySessions(ms);
    setCrews(nc);
    setCommunity(ncm);
    persist({ mySessions: ms, crews: nc, community: ncm });
    setLogging(false);
  };

  const addPost = ({ cap, mood, clip }: { cap: string; mood: CommunityPost["mood"]; clip: boolean }) => {
    const post: CommunityPost = {
      id: "p" + Date.now(),
      who: "you",
      clip,
      mood,
      cap,
      likes: 0,
      comments: 0,
      liked: false,
      mine: true,
      t: "Just now",
      commentList: [],
      videoUrl: clip ? SAMPLE_CLIP : undefined,
    };
    const ncm = [post, ...community];
    setCommunity(ncm);
    persist({ community: ncm });
    setComposing(false);
    setView("feed");
  };

  const addComment = (postId: string, text: string) => {
    const ncm = community.map((p) =>
      p.id === postId
        ? {
            ...p,
            comments: (p.commentList?.length ?? p.comments) + 1,
            commentList: [...(p.commentList ?? []), { id: "k" + Date.now(), who: "you", text, t: "now" }],
          }
        : p
    );
    setCommunity(ncm);
    persist({ community: ncm });
  };

  const createCrew = ({ name, emblem, color }: { name: string; emblem: string; color: string }) => {
    const id = "crew-" + Date.now();
    const crew: Crew = {
      id,
      name,
      emblem,
      color,
      members: ["You"],
      thread: [
        { id: "ct" + Date.now(), type: "text", who: "You", text: `Founded ${name}. Let's find some waves. 🤙`, t: "Now" },
      ],
    };
    const nc = [...crews, crew];
    setCrews(nc);
    persist({ crews: nc });
    setCreatingCrew(false);
    setView("crews");
    setActiveCrew(crew);
  };

  // Open a spot sheet — reveal it on the map if still undiscovered (collection loop)
  const openSpot = (s: Spot) => {
    if (!discovered.includes(s.id) && !s.userDropped) {
      const dis = [...discovered, s.id];
      setDiscovered(dis);
      persist({ discovered: dis });
    }
    setActiveSpot(s);
  };

  const toggleLike = (id: string) => {
    const nc = community.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
    );
    setCommunity(nc);
    persist({ community: nc });
  };

  const confirmPin = ({ name, type, visibility }: { name: string; type: string; visibility: string }) => {
    const newId = "user-" + Date.now();
    let crewName: string | undefined;
    if (visibility.startsWith("crew:")) {
      crewName = crews.find((c) => c.id === visibility.split(":")[1])?.name;
    }
    const newSpot: Spot = {
      id: newId,
      name,
      type: type as Spot["type"],
      lat: pendingPin!.lat,
      lng: pendingPin!.lng,
      region: crewName ? `Crew · ${crewName}` : visibility === "community" ? "Public pin" : "Private pin",
      secret: visibility !== "community",
      cond: "fair",
      by: "You",
      crew: crewName,
      userDropped: true,
      visibility,
    };
    const up = [...userPins, newSpot];
    const dis = [...discovered, newId];
    setUserPins(up);
    setDiscovered(dis);

    let nc = crews;
    if (visibility.startsWith("crew:")) {
      const cid = visibility.split(":")[1];
      nc = crews.map((c) =>
        c.id === cid
          ? {
              ...c,
              thread: [
                ...c.thread,
                {
                  id: newId,
                  type: "spot" as const,
                  who: "You",
                  spot: name,
                  note: `dropped a new ${type.toLowerCase()} spot`,
                  t: "Now",
                },
              ],
            }
          : c
      );
      setCrews(nc);
    }
    persist({ userPins: up, discovered: dis, crews: nc });
    setDropMode(false);
    setPendingPin(null);
  };

  const go = (v: "home" | "crews" | "map" | "profile") => {
    setActiveCrew(null);
    setActiveSpot(null);
    setView(v);
  };

  const startDropFromDock = () => {
    setActiveCrew(null);
    setActiveSpot(null);
    setView("map");
    setDropMode(true);
  };

  const showMasthead = !activeCrew && !logging;
  const showDock = !activeCrew && !logging;

  if (!hydrated) return null; // avoid SSR flash

  return (
    <>
      {/* ── MOBILE LAYOUT (hidden md+) ── */}
      <div
        className="md:hidden"
        style={{
          width: "100%",
          maxWidth: 430,
          height: "100svh",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          background: "var(--cream)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Masthead */}
        {showMasthead && (
          <header
            style={{
              padding: "16px 20px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--cream)",
              flexShrink: 0,
              zIndex: 4,
            }}
          >
            <button
              onClick={() => go("home")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
                fontSize: 28,
                letterSpacing: "-0.5px",
                color: "var(--terra)",
                lineHeight: 0.9,
              }}
            >
              lineup.
            </button>
            <button
              onClick={() => go("profile")}
              className="lu-press"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--mustard)",
                color: "var(--ink)",
                border: "2.5px solid var(--ink)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
              }}
              aria-label="Your profile"
            >
              YO
            </button>
          </header>
        )}

        {/* View content */}
        <div
          key={view + (activeCrew?.id ?? "")}
          className="view-enter"
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", isolation: "isolate" }}
        >
          {view === "home" && !activeCrew && (
            <Home
              name="Luke"
              firingSpot={firingSpot}
              sessions={sessionCount}
              streak={streak}
              collected={collected}
              total={total}
              crews={crews}
              community={community}
              recent={mySessions}
              onOpenCrew={(c) => { setView("crews"); setActiveCrew(c); }}
              onOpenSpot={openSpot}
              onSeeFeed={() => setView("feed")}
              onSeeJournal={() => go("profile")}
            />
          )}

          {view === "crews" && !activeCrew && (
            <CrewsList crews={crews} onOpen={(c) => setActiveCrew(c)} onNew={() => setCreatingCrew(true)} />
          )}
          {view === "crews" && currentCrew && (
            <CrewThread
              crew={currentCrew}
              draft={draft}
              setDraft={setDraft}
              onSend={() => sendMsg(currentCrew.id)}
              onBack={() => setActiveCrew(null)}
            />
          )}

          {view === "map" && (
            <MapView
              discovered={discovered}
              userPins={userPins}
              dropMode={dropMode}
              pendingPin={pendingPin}
              onSpot={(s) => !dropMode && openSpot(s)}
              onStartDrop={() => setDropMode(true)}
              onCancelDrop={() => { setDropMode(false); setPendingPin(null); }}
              onPlacePin={(lat, lng) => setPendingPin({ lat, lng })}
            />
          )}

          {view === "feed" && (
            <Community posts={community} onLike={toggleLike} onAddComment={addComment} onCompose={() => setComposing(true)} />
          )}

          {view === "profile" && (
            <Profile
              streak={streak}
              sessions={sessionCount}
              crews={crews}
              collected={collected}
              total={total}
              badges={badges}
              sessionsList={mySessions}
              onCrewClick={(c) => { setActiveCrew(c); setView("crews"); }}
              onBadgeClick={(b) => setActiveBadge(b)}
            />
          )}
        </div>

        {/* Interactive dock */}
        {showDock && (
          <Dock
            view={view as DockView}
            onNav={go}
            onLog={() => setLogging(true)}
            onDropPin={startDropFromDock}
            onNewCrew={() => setCreatingCrew(true)}
            onNewPost={() => setComposing(true)}
          />
        )}

        {/* Overlay sheets */}
        {activeSpot && (
          <SpotSheet spot={activeSpot} onClose={() => setActiveSpot(null)} onLog={() => { setActiveSpot(null); setLogging(true); }} />
        )}
        {logging && <LogModal crews={crews} onClose={() => setLogging(false)} onSubmit={addLog} />}
        {dropMode && pendingPin && (
          <NewPinSheet crews={crews} onCancel={() => { setDropMode(false); setPendingPin(null); }} onConfirm={confirmPin} />
        )}
        {creatingCrew && <NewCrewSheet onCancel={() => setCreatingCrew(false)} onConfirm={createCrew} />}
        {composing && <PostComposer onCancel={() => setComposing(false)} onSubmit={addPost} />}
        {activeBadge && <BadgeSheet badge={activeBadge} onClose={() => setActiveBadge(null)} />}
        {unlockedBadge && <BadgeUnlock badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />}
      </div>

      {/* ── DESKTOP (shown md+) ── */}
      <div className="hidden md:flex md:flex-col" style={{ minHeight: "100vh", background: "var(--cream2)" }}>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "var(--cream)",
            borderBottom: "1.5px solid var(--line)",
            padding: "14px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -3, height: 3, background: "var(--mustard)" }} />
          <div
            style={{
              fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
              fontSize: 30,
              letterSpacing: "-1px",
              color: "var(--terra)",
              lineHeight: 0.85,
            }}
          >
            lineup.
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["Home", "Crews", "Map", "Feed", "You"].map((label, i) => (
              <button
                key={label}
                style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: i === 0 ? "var(--cream)" : "var(--soft)",
                  padding: "8px 14px",
                  borderRadius: 4,
                  background: i === 0 ? "var(--ink)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
          <a
            href="/dashboard"
            style={{
              background: "var(--pink)",
              color: "var(--cream)",
              border: "none",
              padding: "10px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 3px 10px -2px rgba(230,51,109,.4)",
              textDecoration: "none",
            }}
          >
            <Plus size={14} /> Dashboard
          </a>
        </header>
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 36px 80px", width: "100%" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--terra)",
              fontWeight: 700,
            }}
          >
            Desktop dashboard
          </div>
          <div
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 64,
              letterSpacing: "-2px",
              lineHeight: 1.02,
              color: "var(--ink)",
              marginTop: 8,
            }}
          >
            Coming up.
          </div>
          <p
            style={{
              fontFamily: "var(--font-newsreader), 'Newsreader', serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "var(--soft)",
              lineHeight: 1.5,
              marginTop: 16,
              maxWidth: 480,
            }}
          >
            The full dashboard is at{" "}
            <a href="/dashboard" style={{ color: "var(--terra)" }}>
              /dashboard
            </a>
            . Resize to mobile width to try the full app.
          </p>
        </main>
      </div>
    </>
  );
}
