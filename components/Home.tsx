"use client";

import {
  ChevronRight,
  Wind,
  Flame,
  Play,
  MessageCircle,
  Heart,
  Navigation,
  Star,
  ArrowUpRight,
} from "lucide-react";
import type { Crew, Spot, CommunityPost, Session, ThreadItem } from "@/lib/types";
import { initials } from "@/lib/utils";
import LogCard from "./LogCard";

interface Props {
  name: string;
  firingSpot: Spot;
  sessions: number;
  streak: number;
  collected: number;
  total: number;
  crews: Crew[];
  community: CommunityPost[];
  recent: Session[];
  onOpenCrew: (c: Crew) => void;
  onOpenSpot: (s: Spot) => void;
  onSeeFeed: () => void;
  onSeeJournal: () => void;
}

function Kicker({ children, color = "var(--terra)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 9.5,
        letterSpacing: "2.5px",
        textTransform: "uppercase",
        color,
        fontWeight: 600,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function SeeAll({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lu-press"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "var(--terra)",
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: 0,
      }}
    >
      See all <ArrowUpRight size={13} />
    </button>
  );
}

function threadPreview(item: ThreadItem): string {
  if (item.type === "text") return item.text;
  if (item.type === "log") return `Logged ${item.ft}ft at ${item.spot} — ${item.wind.toLowerCase()}`;
  return `Pinned a spot: ${item.spot}`;
}

export default function Home({
  name,
  firingSpot,
  sessions,
  streak,
  collected,
  total,
  crews,
  community,
  recent,
  onOpenCrew,
  onOpenSpot,
  onSeeFeed,
  onSeeJournal,
}: Props) {
  const trending = [...community].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const crewPosts = crews.reduce((n, c) => n + c.thread.length, 0);

  return (
    <div className="scroll-hide" style={{ flex: 1, overflowY: "auto", padding: "4px 20px 120px" }}>
      {/* ── 1 · Greeting ── */}
      <div className="view-enter" style={{ marginBottom: 26 }}>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: "-1px",
            lineHeight: 1.05,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Welcome back, <span style={{ color: "var(--terra)" }}>{name}.</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-newsreader), 'Newsreader', serif",
            fontStyle: "italic",
            fontSize: 15.5,
            color: "var(--soft)",
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          {crewPosts} crew updates this week. {firingSpot.name} is firing.
        </p>
      </div>

      {/* ── 2 · Firing today ── */}
      <button
        onClick={() => onOpenSpot(firingSpot)}
        className="pop lu-press"
        style={{
          width: "100%",
          textAlign: "left",
          background: "var(--card)",
          border: "1.5px solid var(--line)",
          borderRadius: 14,
          position: "relative",
          overflow: "hidden",
          padding: 0,
          cursor: "pointer",
          marginBottom: 28,
        }}
      >
        <div style={{ height: 6, background: "var(--mustard)" }} />
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                background: "var(--mustard)",
                color: "var(--ink)",
                padding: "4px 10px",
                borderRadius: 100,
              }}
            >
              <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terra)" }} />
              Firing today
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                color: "var(--faint)",
                letterSpacing: 1,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {firingSpot.region}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}
          >
            {firingSpot.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-3px",
                lineHeight: 0.82,
                color: "var(--ink)",
              }}
            >
              4–5
            </span>
            <span
              style={{
                fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                fontStyle: "italic",
                fontSize: 19,
                color: "var(--soft)",
              }}
            >
              ft @ 11s
            </span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {[
              { icon: <Wind size={11} />, t: "Light W · 4mph" },
              { icon: null, t: "12 logs this week" },
            ].map((c) => (
              <span
                key={c.t}
                style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  padding: "5px 11px",
                  borderRadius: 100,
                  background: "var(--paper)",
                  border: "1.5px solid var(--line)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "var(--soft)",
                }}
              >
                {c.icon}
                {c.t}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* ── 3 · Stat row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 30 }}>
        <Stat value={String(sessions)} label="Sessions" accent="var(--terra)" />
        <Stat value={<>{streak}<Flame size={16} color="var(--pink)" fill="var(--pink)" /></>} label="Streak" accent="var(--pink)" />
        <Stat
          value={<>{collected}<span style={{ fontSize: 15, color: "var(--faint)", fontWeight: 500 }}>/{total}</span></>}
          label="Spots"
          accent="var(--teal)"
        />
      </div>

      {/* ── 4 · Crew activity ── */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <Kicker>Group chats · {crews.length}</Kicker>
            <div
              style={{
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              Crew activity.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {crews.map((c) => (
            <div
              key={c.id}
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--line)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => onOpenCrew(c)}
                className="lu-press"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: c.color,
                  color: "var(--cream)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "var(--cream)",
                    color: c.color,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.emblem}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 16, fontWeight: 700 }}>
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      fontSize: 8.5,
                      letterSpacing: 1,
                      opacity: 0.85,
                      fontWeight: 600,
                    }}
                  >
                    {c.members.length} MEMBERS · {c.thread.length} MSGS
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    background: "rgba(243,232,210,.18)",
                    border: "1px solid rgba(243,232,210,.4)",
                    padding: "5px 9px",
                    borderRadius: 100,
                  }}
                >
                  Open <ChevronRight size={11} />
                </span>
              </button>
              <div style={{ padding: "10px 14px 12px", display: "flex", flexDirection: "column", gap: 9 }}>
                {c.thread.slice(-2).map((item, i) => (
                  <div key={item.id} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? "var(--terra)" : "var(--teal)",
                        color: "var(--cream)",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontSize: 8,
                        fontWeight: 700,
                      }}
                    >
                      {initials(item.who)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{item.who}</span>
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                            fontSize: 8.5,
                            color: "var(--faint)",
                            marginLeft: "auto",
                            fontWeight: 500,
                          }}
                        >
                          {item.t}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--soft)",
                          fontStyle: "italic",
                          lineHeight: 1.4,
                          marginTop: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {threadPreview(item)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5 · Trending in community ── */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <Kicker color="var(--pink)">Public · this week</Kicker>
            <div
              style={{
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              Trending.
            </div>
          </div>
          <SeeAll onClick={onSeeFeed} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {trending.map((p, i) => (
            <button
              key={p.id}
              onClick={onSeeFeed}
              className="lu-press"
              style={{
                width: "100%",
                textAlign: "left",
                background: "var(--card)",
                border: "1.5px solid var(--line)",
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {p.clip ? (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: "linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",
                    border: "1.5px solid var(--ink)",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Play size={17} fill="var(--cream)" color="var(--cream)" style={{ marginLeft: 2 }} />
                </div>
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: i % 2 === 0 ? "var(--terra)" : "var(--teal)",
                    color: "var(--cream)",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {initials(p.who)}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 13.5, fontWeight: 700 }}>
                    @{p.who}
                  </span>
                  {p.mood === "firing" && (
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                        fontSize: 7.5,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        background: "var(--mustard)",
                        color: "var(--ink)",
                        padding: "2px 5px",
                        borderRadius: 3,
                        fontWeight: 700,
                      }}
                    >
                      Firing
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--soft)",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}
                >
                  {p.cap}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: p.liked ? "var(--pink)" : "var(--faint)" }}>
                    <Heart size={12} fill={p.liked ? "var(--pink)" : "none"} />
                    <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600 }}>
                      {p.likes}
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--faint)" }}>
                    <MessageCircle size={12} />
                    <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600 }}>
                      {p.commentList?.length ?? p.comments}
                    </span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 6 · Recent journal ── */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <Kicker color="var(--mustard-deep)">Field log</Kicker>
            <div
              style={{
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              Your journal.
            </div>
          </div>
          <SeeAll onClick={onSeeJournal} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recent.length === 0 && (
            <div
              style={{
                border: "1.5px dashed var(--line2)",
                borderRadius: 12,
                padding: "22px 18px",
                textAlign: "center",
                fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "var(--faint)",
              }}
            >
              No sessions logged yet. Tap <Navigation size={13} style={{ verticalAlign: "middle" }} /> to start your log.
            </div>
          )}
          {recent.slice(0, 2).map((s) => (
            <LogCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, accent }: { value: React.ReactNode; label: string; accent: string }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--line)",
        borderRadius: 12,
        padding: "14px 12px 12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div
        style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-1.5px",
          lineHeight: 0.85,
          display: "flex",
          alignItems: "center",
          gap: 3,
          paddingLeft: 5,
          color: "var(--ink)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 8.5,
          color: "var(--faint)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          fontWeight: 600,
          marginTop: 8,
          paddingLeft: 5,
        }}
      >
        {label}
      </div>
    </div>
  );
}
