"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Wind,
  Flame,
  ArrowUpRight,
  ChevronRight,
  Play,
  Heart,
  MessageCircle,
} from "lucide-react";

import MapView from "./MapView";
import Community from "./Community";
import Profile, { type Badge } from "./Profile";
import CrewsList from "./CrewsList";
import CrewThread from "./CrewThread";
import LogCard from "./LogCard";
import LogModal from "./LogModal";
import SpotSheet from "./SpotSheet";
import NewPinSheet from "./NewPinSheet";
import NewCrewSheet from "./NewCrewSheet";
import PostComposer from "./PostComposer";
import { BadgeSheet } from "./Badges";

import type { Crew, Spot, CommunityPost, Session, ThreadItem } from "@/lib/types";
import { initials } from "@/lib/utils";

export interface LineupApi {
  crews: Crew[];
  community: CommunityPost[];
  mySessions: Session[];
  userPins: Spot[];
  discovered: string[];
  badges: Badge[];
  sessionCount: number;
  streak: number;
  collected: number;
  total: number;
  firingSpot: Spot;
  commitMsg: (crewId: string, text: string) => void;
  commitLog: (e: { spot: string; ft: string; wind: string; rating: number; note: string; visibility: string }) => void;
  commitPost: (e: { cap: string; mood: CommunityPost["mood"]; clip: boolean }) => void;
  commitComment: (postId: string, text: string) => void;
  commitLike: (id: string) => void;
  commitCrew: (e: { name: string; emblem: string; color: string }) => Crew;
  commitPin: (e: { name: string; type: string; visibility: string; lat: number; lng: number }) => void;
  discover: (s: Spot) => void;
}

type Section = "home" | "crews" | "map" | "feed" | "you";
const NAV: { id: Section; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "crews", label: "Crews" },
  { id: "map", label: "Map" },
  { id: "feed", label: "Feed" },
  { id: "you", label: "You" },
];

// ── style helpers ──────────────────────────────────────────────────────────────
const disp = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontWeight: 700, ...extra });
const mono = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", ...extra });
const kicker: React.CSSProperties = { ...mono({ fontSize: 10, letterSpacing: "2.5px", fontWeight: 600 }), textTransform: "uppercase", color: "var(--faint)" };
const cardBase: React.CSSProperties = { background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 10, position: "relative" };

export default function DesktopApp({ api }: { api: LineupApi }) {
  const [section, setSection] = useState<Section>("home");
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [logging, setLogging] = useState(false);
  const [composing, setComposing] = useState(false);
  const [creatingCrew, setCreatingCrew] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [dropMode, setDropMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);

  const selectedCrew = api.crews.find((c) => c.id === selectedCrewId) ?? null;

  const openSpot = (s: Spot) => { api.discover(s); setActiveSpot(s); };
  const openCrew = (c: Crew) => { setSection("crews"); setSelectedCrewId(c.id); };

  return (
    <div
      className="hidden md:flex md:flex-col"
      style={{ height: "100vh", overflow: "hidden", position: "relative", background: "var(--cream2)" }}
    >
      {/* ── Header ── */}
      <header
        style={{
          flexShrink: 0,
          background: "var(--cream)",
          borderBottom: "1.5px solid var(--line)",
          padding: "14px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -3, height: 3, background: "var(--mustard)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <button
            onClick={() => setSection("home")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif", fontSize: 30, letterSpacing: "-1px", color: "var(--terra)", lineHeight: 0.85 }}
          >
            lineup.
          </button>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className="lu-press"
                style={{
                  ...mono({ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px" }),
                  textTransform: "uppercase",
                  color: section === n.id ? "var(--cream)" : "var(--soft)",
                  padding: "8px 14px",
                  borderRadius: 4,
                  background: section === n.id ? "var(--ink)" : "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 6, color: "var(--faint)", minWidth: 200 }}>
            <Search size={15} />
            <span style={mono({ fontSize: 11, letterSpacing: 0.5, color: "var(--faint)" })}>Search spots, crews…</span>
          </div>
          <button className="lu-press" style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <Bell size={16} />
          </button>
          <button onClick={() => setLogging(true)} className="lu-press" style={{ background: "var(--pink)", color: "var(--cream)", border: "none", padding: "11px 16px", borderRadius: 6, cursor: "pointer", ...mono({ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px" }), textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 7, boxShadow: "0 3px 10px -2px rgba(230,51,109,.4)" }}>
            <Plus size={14} /> Log session
          </button>
          <button onClick={() => setSection("you")} className="lu-press" style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--mustard)", color: "var(--ink)", border: "2px solid var(--ink)", display: "grid", placeItems: "center", cursor: "pointer", ...mono({ fontSize: 12, fontWeight: 700 }) }}>
            YO
          </button>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="scroll-hide" style={{ flex: 1, overflowY: "auto" }}>
        {section === "home" && (
          <DesktopHome api={api} onOpenSpot={openSpot} onOpenCrew={openCrew} onMap={() => setSection("map")} onFeed={() => setSection("feed")} onYou={() => setSection("you")} onLog={() => setLogging(true)} />
        )}

        {section === "crews" && (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 36px 48px", width: "100%" }}>
            <SectionTitle kicker={`Group chats · ${api.crews.length}`} title="Your crews." />
            <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, marginTop: 24, alignItems: "start" }}>
              <div style={{ ...cardBase, overflow: "hidden", maxHeight: "72vh", display: "flex", flexDirection: "column" }}>
                <CrewsList crews={api.crews} onOpen={(c) => setSelectedCrewId(c.id)} onNew={() => setCreatingCrew(true)} />
              </div>
              <div style={{ ...cardBase, overflow: "hidden", height: "72vh", display: "flex", flexDirection: "column" }}>
                {selectedCrew ? (
                  <CrewThread crew={selectedCrew} draft={draft} setDraft={setDraft} onSend={() => { if (draft.trim()) { api.commitMsg(selectedCrew.id, draft.trim()); setDraft(""); } }} onBack={() => setSelectedCrewId(null)} />
                ) : (
                  <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 40 }}>
                    <div>
                      <div style={disp({ fontSize: 30, fontStyle: "italic", letterSpacing: "-1px", color: "var(--soft)" })}>Pick a crew.</div>
                      <div style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 16, color: "var(--faint)", marginTop: 8 }}>
                        Select a group chat to open the thread.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {section === "map" && (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 36px 48px", width: "100%" }}>
            <SectionTitle kicker="The break map · charted" title="Your lineup." />
            <div style={{ ...cardBase, overflow: "hidden", height: "74vh", display: "flex", marginTop: 24 }}>
              <MapView
                discovered={api.discovered}
                userPins={api.userPins}
                dropMode={dropMode}
                pendingPin={pendingPin}
                onSpot={(s) => !dropMode && openSpot(s)}
                onStartDrop={() => setDropMode(true)}
                onCancelDrop={() => { setDropMode(false); setPendingPin(null); }}
                onPlacePin={(lat, lng) => setPendingPin({ lat, lng })}
              />
            </div>
          </div>
        )}

        {section === "feed" && (
          <div style={{ maxWidth: 620, margin: "0 auto", padding: "8px 0 48px", width: "100%" }}>
            <Community posts={api.community} onLike={api.commitLike} onAddComment={api.commitComment} onCompose={() => setComposing(true)} />
          </div>
        )}

        {section === "you" && (
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 48px", width: "100%" }}>
            <Profile
              streak={api.streak}
              sessions={api.sessionCount}
              crews={api.crews}
              collected={api.collected}
              total={api.total}
              badges={api.badges}
              sessionsList={api.mySessions}
              onCrewClick={openCrew}
              onBadgeClick={(b) => setActiveBadge(b)}
            />
          </div>
        )}
      </div>

      {/* ── Overlays (phone-frame modals) ── */}
      {activeSpot && (
        <FrameModal onClose={() => setActiveSpot(null)}>
          <SpotSheet spot={activeSpot} onClose={() => setActiveSpot(null)} onLog={() => { setActiveSpot(null); setLogging(true); }} />
        </FrameModal>
      )}
      {logging && (
        <FrameModal onClose={() => setLogging(false)}>
          <LogModal crews={api.crews} onClose={() => setLogging(false)} onSubmit={(e) => { api.commitLog(e); setLogging(false); }} />
        </FrameModal>
      )}
      {dropMode && pendingPin && (
        <FrameModal onClose={() => { setDropMode(false); setPendingPin(null); }}>
          <NewPinSheet crews={api.crews} onCancel={() => { setDropMode(false); setPendingPin(null); }} onConfirm={(e) => { api.commitPin({ ...e, lat: pendingPin.lat, lng: pendingPin.lng }); setDropMode(false); setPendingPin(null); }} />
        </FrameModal>
      )}
      {creatingCrew && (
        <FrameModal onClose={() => setCreatingCrew(false)}>
          <NewCrewSheet onCancel={() => setCreatingCrew(false)} onConfirm={(e) => { const c = api.commitCrew(e); setCreatingCrew(false); openCrew(c); }} />
        </FrameModal>
      )}
      {composing && (
        <FrameModal onClose={() => setComposing(false)}>
          <PostComposer onCancel={() => setComposing(false)} onSubmit={(e) => { api.commitPost(e); setComposing(false); setSection("feed"); }} />
        </FrameModal>
      )}
      {activeBadge && (
        <FrameModal onClose={() => setActiveBadge(null)}>
          <BadgeSheet badge={activeBadge} onClose={() => setActiveBadge(null)} />
        </FrameModal>
      )}
    </div>
  );
}

// ── Desktop home dashboard ──────────────────────────────────────────────────────
function DesktopHome({
  api,
  onOpenSpot,
  onOpenCrew,
  onMap,
  onFeed,
  onYou,
  onLog,
}: {
  api: LineupApi;
  onOpenSpot: (s: Spot) => void;
  onOpenCrew: (c: Crew) => void;
  onMap: () => void;
  onFeed: () => void;
  onYou: () => void;
  onLog: () => void;
}) {
  const trending = [...api.community].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const crewPosts = api.crews.reduce((n, c) => n + c.thread.length, 0);

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 36px 80px", width: "100%" }}>
      {/* Hero */}
      <section style={{ marginBottom: 52, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "flex-end" }}>
        <div className="rise">
          <div style={{ ...kicker, marginBottom: 14 }}>Dashboard</div>
          <h1 style={{ ...disp({ fontSize: 64, letterSpacing: "-2.5px", lineHeight: 0.9 }), margin: 0, fontStyle: "italic", fontWeight: 500, color: "var(--ink)" }}>
            Welcome back, <span style={{ color: "var(--terra)" }}>Luke.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontSize: 18, fontStyle: "italic", color: "var(--soft)", lineHeight: 1.5, marginTop: 18, maxWidth: 480 }}>
            {crewPosts} crew updates this week. {api.firingSpot.name} is firing, and your map is filling in.
          </p>
        </div>

        <button onClick={() => onOpenSpot(api.firingSpot)} className="rise lu-press" style={{ ...cardBase, padding: "24px 26px", animationDelay: ".05s", overflow: "hidden", textAlign: "left", cursor: "pointer", borderRadius: 12 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "var(--mustard)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, marginTop: 8 }}>
            <span style={{ ...mono({ fontSize: 9.5, letterSpacing: "1.5px", fontWeight: 700 }), textTransform: "uppercase", background: "var(--mustard)", color: "var(--ink)", padding: "4px 10px", borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terra)" }} /> Firing today
            </span>
            <span style={mono({ fontSize: 10, color: "var(--faint)", letterSpacing: 1.5 })}>{api.firingSpot.region}</span>
          </div>
          <div style={disp({ fontSize: 24, letterSpacing: "-.4px", marginBottom: 6 })}>{api.firingSpot.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <span style={disp({ fontSize: 72, letterSpacing: -3, lineHeight: 0.85, color: "var(--ink)" })}>4–5</span>
            <span style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 20, color: "var(--soft)" }}>ft @ 11s</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <Chip><Wind size={11} /> Light W · 4mph</Chip>
            <Chip>12 logs this week</Chip>
          </div>
        </button>
      </section>

      {/* Stat row */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 60 }}>
        <StatBlock label="Sessions" value={String(api.sessionCount)} sub="this year" accent="var(--terra)" />
        <StatBlock label="Streak" value={<>{api.streak} <Flame size={36} color="var(--pink)" fill="var(--pink)" /></>} sub="weeks in a row" accent="var(--pink)" />
        <StatBlock label="Spots collected" value={<>{api.collected}<span style={disp({ fontSize: 38, fontWeight: 500, color: "var(--faint)" })}>/{api.total}</span></>} sub="discovered" accent="var(--teal)" />
      </section>

      {/* Two-col activity */}
      <section style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, marginBottom: 60 }}>
        {/* crew activity */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ ...kicker, marginBottom: 8 }}>Group chats · {api.crews.length}</div>
              <div style={disp({ fontSize: 36, letterSpacing: "-1px", lineHeight: 1 })}>Crew activity.</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {api.crews.map((c) => (
              <div key={c.id} style={{ ...cardBase, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: c.color, color: "var(--cream)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 5, background: "var(--cream)", color: c.color, display: "grid", placeItems: "center", ...disp({ fontSize: 18 }) }}>{c.emblem}</div>
                  <div style={{ flex: 1 }}>
                    <div style={disp({ fontSize: 17 })}>{c.name}</div>
                    <div style={mono({ fontSize: 9.5, letterSpacing: 1, opacity: 0.8 })}>{c.members.length} MEMBERS · {c.thread.length} MSGS</div>
                  </div>
                  <button onClick={() => onOpenCrew(c)} className="lu-press" style={{ background: "rgba(243,232,210,.18)", border: "1px solid rgba(243,232,210,.4)", color: "var(--cream)", padding: "6px 12px", borderRadius: 4, cursor: "pointer", ...mono({ fontSize: 10, fontWeight: 700, letterSpacing: 1 }), textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Open <ChevronRight size={12} />
                  </button>
                </div>
                <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {c.thread.slice(-3).map((item, i) => (
                    <ActivityRow key={item.id} item={item} i={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* map preview */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ ...kicker, marginBottom: 6, color: "var(--teal)" }}>Charted</div>
                <div style={disp({ fontSize: 28, letterSpacing: "-1px" })}>The map.</div>
              </div>
              <GhostBtn onClick={onMap}>Open →</GhostBtn>
            </div>
            <div style={{ ...cardBase, height: 300, overflow: "hidden", display: "flex", position: "relative" }}>
              <MapView discovered={api.discovered} userPins={api.userPins} dropMode={false} pendingPin={null} onSpot={() => {}} onStartDrop={onMap} onCancelDrop={() => {}} onPlacePin={() => {}} />
              <button onClick={onMap} aria-label="Open map" style={{ position: "absolute", inset: 0, zIndex: 700, background: "transparent", border: "none", cursor: "pointer" }} />
            </div>
          </div>

          {/* trending */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ ...kicker, marginBottom: 6, color: "var(--pink)" }}>Public · this week</div>
                <div style={disp({ fontSize: 28, letterSpacing: "-1px" })}>Trending.</div>
              </div>
              <GhostBtn onClick={onFeed}>See all →</GhostBtn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {trending.map((p, i) => (
                <button key={p.id} onClick={onFeed} className="lu-press" style={{ ...cardBase, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", textAlign: "left", cursor: "pointer", width: "100%" }}>
                  {p.clip ? (
                    <div style={{ width: 60, height: 60, borderRadius: 5, background: "linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)", border: "1.5px solid var(--ink)", flex: "none", display: "grid", placeItems: "center" }}>
                      <Play size={18} fill="var(--cream)" color="var(--cream)" style={{ marginLeft: 2 }} />
                    </div>
                  ) : (
                    <div style={{ width: 60, height: 60, borderRadius: 5, background: i % 2 === 0 ? "var(--terra)" : "var(--teal)", color: "var(--cream)", flex: "none", display: "grid", placeItems: "center", ...mono({ fontSize: 14, fontWeight: 700 }) }}>
                      {initials(p.who)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={disp({ fontSize: 13 })}>@{p.who}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--soft)", fontStyle: "italic", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{p.cap}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: p.liked ? "var(--pink)" : "var(--faint)" }}>
                        <Heart size={12} fill={p.liked ? "var(--pink)" : "none"} />
                        <span style={mono({ fontSize: 10, fontWeight: 600 })}>{p.likes}</span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--faint)" }}>
                        <MessageCircle size={12} />
                        <span style={mono({ fontSize: 10, fontWeight: 600 })}>{p.commentList?.length ?? p.comments}</span>
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ ...kicker, marginBottom: 8, color: "var(--mustard-deep)" }}>Field log · {api.mySessions.length}</div>
            <div style={disp({ fontSize: 36, letterSpacing: "-1px" })}>Your journal.</div>
          </div>
          <GhostBtn onClick={onYou}>All entries →</GhostBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {api.mySessions.slice(0, 4).map((s) => (
            <LogCard key={s.id} s={s} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ActivityRow({ item, i }: { item: ThreadItem; i: number }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: i % 2 === 0 ? "var(--terra)" : "var(--teal)", color: "var(--cream)", flex: "none", display: "grid", placeItems: "center", ...mono({ fontSize: 8, fontWeight: 700 }) }}>
        {initials(item.who)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{item.who}</span>
          {item.type === "spot" && <span style={{ ...mono({ fontSize: 8, fontWeight: 700, letterSpacing: 1 }), textTransform: "uppercase", background: "var(--teal)", color: "var(--cream)", padding: "2px 5px", borderRadius: 3 }}>Pinned</span>}
          {item.type === "log" && <span style={{ ...mono({ fontSize: 8, fontWeight: 700, letterSpacing: 1 }), textTransform: "uppercase", background: "var(--mustard)", color: "var(--ink)", padding: "2px 5px", borderRadius: 3 }}>Logged</span>}
          <span style={mono({ fontSize: 9, color: "var(--faint)", marginLeft: "auto" })}>{item.t}</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--soft)", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
          {item.type === "text" ? item.text : item.type === "log" ? `${item.ft}ft at ${item.spot} — ${item.wind}` : `dropped a pin: ${item.spot}`}
        </div>
      </div>
    </div>
  );
}

function FrameModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} className="scrim-in" style={{ position: "absolute", inset: 0, zIndex: 80, background: "rgba(42,31,21,.55)", display: "grid", placeItems: "center", padding: 24 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop"
        style={{ position: "relative", width: 430, height: "min(800px, 90vh)", borderRadius: 26, overflow: "hidden", boxShadow: "0 40px 90px -24px rgba(42,31,21,.7)", border: "6px solid var(--ink)", background: "var(--cream)" }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ kicker: k, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div style={{ ...kicker, marginBottom: 8, color: "var(--terra)" }}>{k}</div>
      <div style={disp({ fontSize: 44, letterSpacing: "-1.5px", lineHeight: 1 })}>{title}</div>
    </div>
  );
}

function StatBlock({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub: string; accent: string }) {
  return (
    <div className="rise" style={{ ...cardBase, padding: "24px 26px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: accent }} />
      <div style={{ ...mono({ fontSize: 10, letterSpacing: "2px", fontWeight: 600 }), textTransform: "uppercase", color: "var(--faint)", marginBottom: 14, paddingLeft: 5 }}>{label}</div>
      <div style={{ ...disp({ fontSize: 64, letterSpacing: "-2.5px", lineHeight: 0.85 }), display: "flex", alignItems: "center", gap: 8, paddingLeft: 5 }}>{value}</div>
      <div style={{ ...mono({ fontSize: 10, letterSpacing: 1.5, fontWeight: 600 }), color: "var(--faint)", marginTop: 10, paddingLeft: 5, textTransform: "uppercase" }}>{sub}</div>
    </div>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="lu-press" style={{ ...mono({ fontSize: 11, letterSpacing: "1.5px", fontWeight: 700 }), textTransform: "uppercase", padding: "11px 16px", borderRadius: 6, background: "transparent", border: "1.5px solid var(--ink)", color: "var(--ink)", cursor: "pointer" }}>
      {children}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ ...mono({ fontSize: 10, fontWeight: 500 }), padding: "5px 10px", borderRadius: 20, background: "var(--paper)", border: "1.5px solid var(--line)", display: "inline-flex", alignItems: "center", gap: 5, color: "var(--soft)" }}>
      {children}
    </span>
  );
}
