"use client";

import { useState, useEffect } from "react";
import { type LucideProps, Map as MapIcon, Users, User, Waves, Plus } from "lucide-react";

import CrewsList from "@/components/CrewsList";
import CrewThread from "@/components/CrewThread";
import MapView from "@/components/MapView";
import SpotSheet from "@/components/SpotSheet";
import NewPinSheet from "@/components/NewPinSheet";
import LogModal from "@/components/LogModal";
import Community from "@/components/Community";
import Profile, { buildBadges } from "@/components/Profile";

import type { Crew, Spot, CommunityPost, Session } from "@/lib/types";
import { SEED_CREWS, SEED_COMMUNITY, INITIAL_DISCOVERED } from "@/lib/seed";
import { storage, STATE_KEY } from "@/lib/storage";

type View = "crews" | "map" | "community" | "profile";

function PillBtn({
  icon: Icon,
  active,
  onClick,
}: {
  icon: React.ComponentType<LucideProps>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 48,
        borderRadius: 100,
        background: active ? "rgba(243,232,210,.14)" : "none",
        border: "none",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        color: active ? "var(--mustard)" : "rgba(243,232,210,.38)",
        transition: "all .15s",
      }}
    >
      <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
    </button>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("crews");
  const [activeCrew, setActiveCrew] = useState<Crew | null>(null);
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [logging, setLogging] = useState(false);
  const [draft, setDraft] = useState("");

  // Drop-pin flow
  const [dropMode, setDropMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);

  // App state (persisted)
  const [crews, setCrews] = useState<Crew[]>(SEED_CREWS);
  const [community, setCommunity] = useState<CommunityPost[]>(SEED_COMMUNITY);
  const [mySessions, setMySessions] = useState<Session[]>([]);
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

  const persist = (patch: Partial<{
    mySessions: Session[];
    crews: Crew[];
    community: CommunityPost[];
    userPins: Spot[];
    discovered: string[];
  }>) => {
    const next = { mySessions, crews, community, userPins, discovered, ...patch };
    storage.set(STATE_KEY, JSON.stringify(next)).catch(() => {});
  };

  // ── Actions ──────────────────────────────────────────────────────────

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
    const entry: Session = { id: "m" + Date.now(), spot, ft, wind, rating, note, t: "Now" };
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
      const cid = visibility.split(":")[1];
      crewName = crews.find((c) => c.id === cid)?.name;
    }
    const newSpot: Spot = {
      id: newId,
      name,
      type: type as Spot["type"],
      x: pendingPin!.x,
      y: pendingPin!.y,
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

  const go = (v: View) => {
    setActiveCrew(null);
    setActiveSpot(null);
    setView(v);
  };

  const streak = 4 + mySessions.length;
  const sessionCount = 27 + mySessions.length;
  const badges = buildBadges(mySessions, userPins, sessionCount);
  const currentCrew = activeCrew ? crews.find((c) => c.id === activeCrew.id) ?? null : null;

  const showMasthead = !activeCrew && !logging;
  const showBottomNav = !activeCrew && !logging;

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
        {/* Masthead — minimal */}
        {showMasthead && (
          <header
            style={{
              padding: "16px 20px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--cream)",
              flexShrink: 0,
              zIndex: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
                fontSize: 28,
                letterSpacing: "-0.5px",
                color: "var(--terra)",
                lineHeight: 0.9,
              }}
            >
              lineup.
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--mustard)",
                color: "var(--ink)",
                border: "2.5px solid var(--ink)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              YO
            </div>
          </header>
        )}

        {/* View content — animated on tab/crew change */}
        <div
          key={view + (activeCrew?.id ?? "")}
          className="view-enter"
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          {view === "crews" && !activeCrew && (
            <CrewsList crews={crews} onOpen={(c) => setActiveCrew(c)} />
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
              onSpot={(s) => !dropMode && setActiveSpot(s)}
              onStartDrop={() => setDropMode(true)}
              onCancelDrop={() => { setDropMode(false); setPendingPin(null); }}
              onPlacePin={(x, y) => setPendingPin({ x, y })}
            />
          )}
          {view === "community" && (
            <Community posts={community} onLike={toggleLike} />
          )}
          {view === "profile" && (
            <Profile
              streak={streak}
              sessions={sessionCount}
              crews={crews}
              collected={discovered.length}
              total={6 + userPins.length}
              badges={badges}
              onCrewClick={(c) => { setActiveCrew(c); setView("crews"); }}
            />
          )}
        </div>

        {/* Floating pill nav */}
        {showBottomNav && (
          <div
            style={{
              flexShrink: 0,
              padding: "6px 20px 28px",
              background: "var(--cream)",
              zIndex: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--ink)",
                borderRadius: 100,
                padding: "6px",
                boxShadow: "0 8px 32px rgba(42,31,21,.22), 0 2px 8px rgba(42,31,21,.12)",
                gap: 2,
              }}
            >
              <PillBtn icon={Users}   active={view === "crews"}     onClick={() => go("crews")} />
              <PillBtn icon={MapIcon} active={view === "map"}       onClick={() => go("map")} />
              <button
                onClick={() => setLogging(true)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--pink)",
                  color: "var(--cream)",
                  border: "3px solid var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(230,51,109,.5)",
                }}
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
              <PillBtn icon={Waves}   active={view === "community"} onClick={() => go("community")} />
              <PillBtn icon={User}    active={view === "profile"}   onClick={() => go("profile")} />
            </div>
          </div>
        )}

        {/* Overlay sheets — position: absolute covers full container */}
        {activeSpot && (
          <SpotSheet
            spot={activeSpot}
            onClose={() => setActiveSpot(null)}
            onLog={() => { setActiveSpot(null); setLogging(true); }}
          />
        )}
        {logging && (
          <LogModal
            crews={crews}
            onClose={() => setLogging(false)}
            onSubmit={addLog}
          />
        )}
        {dropMode && pendingPin && (
          <NewPinSheet
            crews={crews}
            onCancel={() => { setDropMode(false); setPendingPin(null); }}
            onConfirm={confirmPin}
          />
        )}
      </div>

      {/* ── DESKTOP CTA (shown md+, until /dashboard is built) ── */}
      <div
        className="hidden md:flex md:flex-col"
        style={{ minHeight: "100vh", background: "var(--cream2)" }}
      >
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
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -3,
              height: 3,
              background: "var(--mustard)",
            }}
          />
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
            {["Home", "Crews", "Map", "Feed", "Journal"].map((label, i) => (
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <Plus size={14} />
              Dashboard
            </a>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--mustard)",
                color: "var(--ink)",
                border: "2px solid var(--line)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              YO
            </div>
          </div>
        </header>
        <main
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "48px 36px 80px",
            width: "100%",
          }}
        >
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
