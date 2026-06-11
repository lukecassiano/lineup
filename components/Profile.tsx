"use client";

import {
  type LucideProps,
  ChevronRight,
  Flame,
  Sunrise,
  Compass,
  Wind,
  MapPin,
  Users,
  Lock,
  Check,
} from "lucide-react";
import type { Crew, Session, Spot } from "@/lib/types";
import LogCard from "./LogCard";

export interface Badge {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
  got: boolean;
  color: string;
  desc: string;
  current: number;
  target: number;
}

interface Props {
  streak: number;
  sessions: number;
  crews: Crew[];
  collected: number;
  total: number;
  badges: Badge[];
  sessionsList: Session[];
  onCrewClick: (crew: Crew) => void;
  onBadgeClick: (badge: Badge) => void;
}

export function buildBadges(args: {
  mySessions: Session[];
  userPins: Spot[];
  sessionCount: number;
  collected: number;
  extraCrews: number;
}): Badge[] {
  const { mySessions, userPins, sessionCount, collected, extraCrews } = args;
  const goodSessions = mySessions.filter((s) => s.rating >= 4).length;
  return [
    {
      id: "dawn", name: "Dawn Patrol", icon: Sunrise, color: "var(--terra)",
      desc: "Log a session at first light.", current: 1, target: 1, got: true,
    },
    {
      id: "carto", name: "Cartographer", icon: Compass, color: "var(--teal)",
      desc: "Drop your first spot pin on the map.", current: Math.min(userPins.length, 1), target: 1, got: userPins.length > 0,
    },
    {
      id: "storm", name: "Storm Chaser", icon: Wind, color: "var(--mustard)",
      desc: "Log a session you rated 4 stars or better.", current: Math.min(goodSessions, 1), target: 1, got: goodSessions > 0,
    },
    {
      id: "collector", name: "Collector", icon: MapPin, color: "var(--pink)",
      desc: "Chart 18 spots across the coast.", current: collected, target: 18, got: collected >= 18,
    },
    {
      id: "local", name: "The Local", icon: Flame, color: "var(--terra)",
      desc: "Reach 30 logged sessions.", current: sessionCount, target: 30, got: sessionCount >= 30,
    },
    {
      id: "founder", name: "Crew Founder", icon: Users, color: "var(--teal)",
      desc: "Start a crew of your own.", current: Math.min(extraCrews, 1), target: 1, got: extraCrews > 0,
    },
  ];
}

export default function Profile({
  streak,
  sessions,
  crews,
  collected,
  total,
  badges,
  sessionsList,
  onCrewClick,
  onBadgeClick,
}: Props) {
  const earned = badges.filter((b) => b.got).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 120 }} className="scroll-hide">
      {/* ── Hero stat ── */}
      <div style={{ background: "var(--terra)", padding: "32px 24px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 20, bottom: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
          <div
            style={{
              width: 50, height: 50, borderRadius: "50%",
              background: "var(--mustard)", color: "var(--ink)",
              border: "3px solid rgba(255,255,255,.3)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 20, fontWeight: 700,
            }}
          >
            YO
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>
              You
            </div>
            <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(243,232,210,.65)", letterSpacing: 0.8, marginTop: 3 }}>
              @localswell · Long Beach, CA
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontWeight: 700, fontSize: 80, letterSpacing: -4, lineHeight: 0.82, color: "var(--cream)" }}>
          {sessions}
        </div>
        <div style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 20, color: "rgba(243,232,210,.75)", marginTop: 10 }}>
          sessions this year.
        </div>
      </div>

      {/* ── Mini stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px 16px 0" }}>
        <MiniStat value={<>{streak} <Flame size={20} color="var(--pink)" fill="var(--pink)" /></>} label="week streak" accent="var(--pink)" />
        <MiniStat value={<>{collected}<span style={{ fontSize: 18, color: "var(--faint)", fontWeight: 500 }}>/{total}</span></>} label="spots found" accent="var(--teal)" />
      </div>

      {/* ── Patches ── */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--mustard-deep)", fontWeight: 600, marginBottom: 4 }}>
              Earned
            </div>
            <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--ink)" }}>
              Patches.
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 10, color: "var(--faint)", letterSpacing: 1, fontWeight: 600 }}>
            {earned}/{badges.length}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {badges.map((b) => {
            const pct = Math.min(100, Math.round((b.current / b.target) * 100));
            return (
              <button
                key={b.id}
                onClick={() => onBadgeClick(b)}
                className="lu-press"
                style={{
                  background: "var(--card)", borderRadius: 14,
                  border: "1.5px solid var(--line)",
                  display: "flex", flexDirection: "column", gap: 10,
                  padding: "14px 14px",
                  overflow: "hidden", position: "relative", cursor: "pointer", textAlign: "left",
                }}
              >
                {b.got && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: b.color }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      display: "grid", placeItems: "center",
                      background: b.got ? b.color : "var(--paper)",
                      border: b.got ? `2px solid ${b.color}` : "1.5px solid var(--line)",
                      flexShrink: 0, marginLeft: b.got ? 4 : 0,
                      opacity: b.got ? 1 : 0.6,
                    }}
                  >
                    <b.icon size={18} color={b.got ? "var(--cream)" : "var(--faint)"} strokeWidth={2} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 13.5, fontWeight: 700, lineHeight: 1.1 }}>
                      {b.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontSize: 8.5, letterSpacing: 1, marginTop: 3, fontWeight: 700,
                        color: b.got ? b.color : "var(--faint)",
                        display: "inline-flex", alignItems: "center", gap: 3,
                      }}
                    >
                      {b.got ? <><Check size={10} /> EARNED</> : <><Lock size={9} /> {b.current}/{b.target}</>}
                    </div>
                  </div>
                </div>
                {!b.got && (
                  <div style={{ height: 4, background: "var(--paper)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: b.color, opacity: 0.7, borderRadius: 100, transition: "width .4s ease" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Field log ── */}
      <div style={{ padding: "0 20px 8px" }}>
        <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--mustard-deep)", fontWeight: 600, marginBottom: 4 }}>
          Field log · {sessionsList.length}
        </div>
        <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--ink)", marginBottom: 14 }}>
          Your journal.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {sessionsList.length === 0 && (
            <div style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 15, color: "var(--faint)" }}>
              Nothing logged yet.
            </div>
          )}
          {sessionsList.map((s) => (
            <LogCard key={s.id} s={s} />
          ))}
        </div>
      </div>

      {/* ── Your crews ── */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--teal)", fontWeight: 600, marginBottom: 4 }}>
          Group chats
        </div>
        <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--ink)", marginBottom: 14 }}>
          Your crews.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {crews.map((c) => (
            <button
              key={c.id}
              onClick={() => onCrewClick(c)}
              className="lu-press"
              style={{
                background: "var(--card)", border: "1.5px solid var(--line)",
                borderRadius: 14, display: "flex", alignItems: "center",
                overflow: "hidden", width: "100%", cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ width: 5, alignSelf: "stretch", background: c.color }} />
              <div style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <div
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: c.color, color: "var(--cream)",
                    display: "grid", placeItems: "center",
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 16, fontWeight: 700, flexShrink: 0,
                  }}
                >
                  {c.emblem}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--faint)", letterSpacing: 0.8, marginTop: 1, fontWeight: 500 }}>
                    {c.members.length} MEMBERS
                  </div>
                </div>
                <ChevronRight size={16} color="var(--faint)" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label, accent }: { value: React.ReactNode; label: string; accent: string }) {
  return (
    <div style={{ background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div
        style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontWeight: 700, fontSize: 40, letterSpacing: -1.5, lineHeight: 0.88, color: "var(--ink)",
          display: "flex", alignItems: "center", gap: 6, paddingLeft: 4, marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--faint)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, paddingLeft: 4 }}>
        {label}
      </div>
    </div>
  );
}
