"use client";

import { type LucideProps, ChevronRight, Flame, Sunrise, Compass, Wind, MapPin } from "lucide-react";
import type { Crew, Session, Spot } from "@/lib/types";

interface Props {
  streak: number;
  sessions: number;
  crews: Crew[];
  collected: number;
  total: number;
  badges: Badge[];
  onCrewClick: (crew: Crew) => void;
}

interface Badge {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
  got: boolean;
  color: string;
}

export function buildBadges(
  mySessions: Session[],
  userPins: Spot[],
  sessionCount: number
): Badge[] {
  return [
    { id: "dawn",  name: "Dawn Patrol",  icon: Sunrise, got: true,                                  color: "var(--terra)"   },
    { id: "carto", name: "Cartographer", icon: Compass, got: userPins.length > 0,                   color: "var(--teal)"    },
    { id: "storm", name: "Storm Chaser", icon: Wind,    got: mySessions.some((s) => s.rating >= 4), color: "var(--mustard)" },
    { id: "local", name: "The Local",    icon: MapPin,  got: sessionCount > 25,                     color: "var(--pink)"    },
  ];
}

export default function Profile({ streak, sessions, crews, collected, total, badges, onCrewClick }: Props) {
  const earned = badges.filter((b) => b.got).length;

  return (
    <div style={{ flex: 1, overflowY: "auto" }} className="scroll-hide">

      {/* ── Hero stat ── */}
      <div style={{
        background: "var(--terra)", padding: "36px 24px 32px",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circle */}
        <div style={{
          position: "absolute", right: -40, top: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,.06)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 20, bottom: -60,
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(255,255,255,.04)",
          pointerEvents: "none",
        }} />

        {/* avatar + handle row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 50, height: 50, borderRadius: "50%",
            background: "var(--mustard)", color: "var(--ink)",
            border: "3px solid rgba(255,255,255,.3)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 20, fontWeight: 700,
          }}>
            YO
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 18, fontWeight: 700, color: "var(--cream)", lineHeight: 1,
            }}>
              You
            </div>
            <div style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5, color: "rgba(243,232,210,.65)",
              letterSpacing: 0.8, marginTop: 3,
            }}>
              @localswell · Long Beach, CA
            </div>
          </div>
        </div>

        {/* Big stat */}
        <div style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontWeight: 700, fontSize: 80, letterSpacing: -4,
          lineHeight: 0.82, color: "var(--cream)",
        }}>
          {sessions}
        </div>
        <div style={{
          fontFamily: "var(--font-newsreader), 'Newsreader', serif",
          fontStyle: "italic", fontSize: 20,
          color: "rgba(243,232,210,.75)", marginTop: 10,
        }}>
          sessions this year.
        </div>
      </div>

      {/* ── Mini stats row ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 12, padding: "16px 16px 0",
      }}>
        <MiniStat
          value={<>{streak} <Flame size={20} color="var(--pink)" fill="var(--pink)" /></>}
          label="week streak"
          accent="var(--pink)"
        />
        <MiniStat
          value={<>{collected}<span style={{ fontSize: 18, color: "var(--faint)", fontWeight: 500 }}>/{total}</span></>}
          label="spots found"
          accent="var(--teal)"
        />
      </div>

      {/* ── Patches ── */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase",
              color: "var(--mustard-deep)", fontWeight: 600, marginBottom: 4,
            }}>
              Earned
            </div>
            <div style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--ink)",
            }}>
              Patches.
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 10, color: "var(--faint)", letterSpacing: 1, fontWeight: 600,
          }}>
            {earned}/{badges.length}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {badges.map((b) => (
            <div key={b.id} style={{
              background: "var(--card)", borderRadius: 14,
              border: "1.5px solid var(--line)",
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 14px",
              opacity: b.got ? 1 : 0.45,
              overflow: "hidden", position: "relative",
            }}>
              {b.got && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: 4, background: b.color,
                }} />
              )}
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                display: "grid", placeItems: "center",
                background: b.got ? b.color : "var(--paper)",
                border: b.got ? `2px solid ${b.color}` : "1.5px solid var(--line)",
                flexShrink: 0,
                marginLeft: b.got ? 4 : 0,
              }}>
                <b.icon size={17} color={b.got ? "var(--cream)" : "var(--faint)"} strokeWidth={2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 13, fontWeight: 700, lineHeight: 1.1,
                }}>
                  {b.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 9, color: "var(--faint)", letterSpacing: 1, marginTop: 3, fontWeight: 600,
                }}>
                  {b.got ? "EARNED" : "LOCKED"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Your crews ── */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase",
          color: "var(--teal)", fontWeight: 600, marginBottom: 4,
        }}>
          Group chats
        </div>
        <div style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--ink)",
          marginBottom: 14,
        }}>
          Your crews.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {crews.map((c) => (
            <button key={c.id} onClick={() => onCrewClick(c)} style={{
              background: "var(--card)", border: "1.5px solid var(--line)",
              borderRadius: 14, display: "flex", alignItems: "center",
              overflow: "hidden", width: "100%", cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ width: 5, alignSelf: "stretch", background: c.color }} />
              <div style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: c.color, color: "var(--cream)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 16, fontWeight: 700, flexShrink: 0,
                }}>
                  {c.emblem}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                    fontSize: 15, fontWeight: 700,
                  }}>
                    {c.name}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9.5, color: "var(--faint)", letterSpacing: 0.8, marginTop: 1, fontWeight: 500,
                  }}>
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
    <div style={{
      background: "var(--card)", border: "1.5px solid var(--line)",
      borderRadius: 14, padding: "16px 18px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontWeight: 700, fontSize: 40, letterSpacing: -1.5,
        lineHeight: 0.88, color: "var(--ink)",
        display: "flex", alignItems: "center", gap: 6,
        paddingLeft: 4, marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 9.5, color: "var(--faint)", letterSpacing: 1.5,
        textTransform: "uppercase", fontWeight: 600, paddingLeft: 4,
      }}>
        {label}
      </div>
    </div>
  );
}
