"use client";

import { useState } from "react";
import {
  Search, Bell, Plus, Wind, Flame, Lock,
  Heart, MessageCircle, Play, Navigation, X, Star, Crosshair,
} from "lucide-react";
import { SPOTS, SEED_CREWS, SEED_COMMUNITY } from "@/lib/seed";
import { condColor, condLabel, initials } from "@/lib/utils";
import type { Spot } from "@/lib/types";
import LogModal from "@/components/LogModal";

// ── Local journal data ────────────────────────────────────────────────────────
const MY_LOGS = [
  { id: 1, date: "Jun 1",  spot: "Trestles",  ft: "3–4", wind: "Glassy",       rating: 4, note: "Solid morning. Long rights, light crowd, ankle held up.",                     crew: "Dawn Patrol", crewColor: "var(--terra)" },
  { id: 2, date: "May 29", spot: "The Wedge", ft: "5",   wind: "Side-shore",    rating: 5, note: "Heaviest day in months. Got cleaned up on a closeout but caught two bombs.",  crew: "Community",   crewColor: "var(--pink)"  },
  { id: 3, date: "May 27", spot: "Pole 9",    ft: "2–3", wind: "Light onshore", rating: 3, note: "Fun longboard day. Glassy 'til 9, then onshore.",                            crew: "South Swell", crewColor: "var(--teal)"  },
  { id: 4, date: "May 24", spot: "Blacks",    ft: "2",   wind: "Glassy",        rating: 3, note: "Soft but consistent. Worked on cutbacks.",                                   crew: "Just me",     crewColor: "var(--ink)"   },
];

type NavView = "home" | "crews" | "map" | "feed" | "journal";

// ── Shared style helpers ──────────────────────────────────────────────────────
const disp = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
  fontWeight: 700,
  ...extra,
});
const mono = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
  ...extra,
});
const kickerBase: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: "2.5px",
  textTransform: "uppercase",
  color: "var(--faint)",
  fontWeight: 600,
};
const stamp = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
  fontSize: 9.5,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  fontWeight: 700,
  background: "var(--mustard)",
  color: "var(--ink)",
  padding: "4px 10px",
  borderRadius: 3,
  display: "inline-flex",
  alignItems: "center",
  ...extra,
});
const cardBase: React.CSSProperties = {
  background: "var(--card)",
  border: "1.5px solid var(--line)",
  borderRadius: 8,
  position: "relative",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [nav, setNav] = useState<NavView>("home");
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [logging, setLogging] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream2)" }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--cream)",
        borderBottom: "1.5px solid var(--line)",
        padding: "14px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, background: "var(--mustard)" }} />

        {/* wordmark + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{
            fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
            fontSize: 30, letterSpacing: "-1px", color: "var(--terra)", lineHeight: 0.85,
          }}>
            lineup.
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {(["home", "crews", "map", "feed", "journal"] as NavView[]).map((v) => (
              <button key={v} onClick={() => setNav(v)} style={{
                ...mono({ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px" }),
                textTransform: "uppercase",
                color: nav === v ? "var(--cream)" : "var(--soft)",
                padding: "8px 14px", borderRadius: 4,
                background: nav === v ? "var(--ink)" : "none",
                border: "none", cursor: "pointer",
                transition: "all .12s",
              }}>
                {v}
              </button>
            ))}
          </nav>
        </div>

        {/* actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 14px",
            background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 6,
            color: "var(--faint)", minWidth: 200,
          }}>
            <Search size={15} />
            <span style={mono({ fontSize: 11, letterSpacing: 0.5, color: "var(--faint)" })}>
              Search spots, crews…
            </span>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1.5px solid var(--line)", background: "var(--card)",
            color: "var(--ink)", display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Bell size={16} />
          </button>
          <button onClick={() => setLogging(true)} style={{
            background: "var(--pink)", color: "var(--cream)", border: "none",
            padding: "11px 16px", borderRadius: 6, cursor: "pointer",
            ...mono({ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px" }),
            textTransform: "uppercase",
            display: "inline-flex", alignItems: "center", gap: 7,
            boxShadow: "0 3px 10px -2px rgba(230,51,109,.4)",
          }}>
            <Plus size={14} /> Log session
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--mustard)", color: "var(--ink)", border: "2px solid var(--ink)",
            display: "grid", placeItems: "center",
            ...mono({ fontSize: 12, fontWeight: 700 }),
          }}>
            YO
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 36px 80px" }}>

        {/* ── HERO ── */}
        <section style={{ marginBottom: 56, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "flex-end" }}>
          <div className="rise">
            <div style={{ ...kickerBase, marginBottom: 14 }}>Dashboard · Wednesday, June 3</div>
            <h1 style={{ ...disp({ fontSize: 64, letterSpacing: "-2.5px", lineHeight: 0.9 }), margin: 0, color: "var(--ink)" }}>
              Welcome back,<br />
              <span style={{ fontStyle: "italic", color: "var(--terra)" }}>Luke.</span>
            </h1>
            <p style={{
              fontFamily: "var(--font-newsreader), 'Newsreader', serif",
              fontSize: 18, fontStyle: "italic", color: "var(--soft)", lineHeight: 1.5,
              marginTop: 18, maxWidth: 480,
            }}>
              Three crewmates posted this week. The Wedge is firing, and you&apos;ve got a spot waiting at Ghost Reef.
            </p>
          </div>

          {/* Conditions card */}
          <div className="rise" style={{ ...cardBase, padding: "24px 26px", animationDelay: ".05s", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "var(--mustard)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, marginTop: 8 }}>
              <span style={stamp()}>FIRING TODAY</span>
              <span style={mono({ fontSize: 10, color: "var(--faint)", letterSpacing: 1.5 })}>NEAR YOU · 12MI</span>
            </div>
            <div style={disp({ fontSize: 24, letterSpacing: "-.4px", marginBottom: 6 })}>The Wedge</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
              <span style={disp({ fontSize: 72, letterSpacing: -3, lineHeight: 0.85, color: "var(--ink)" })}>4–5</span>
              <span style={{
                fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                fontStyle: "italic", fontSize: 20, color: "var(--soft)",
              }}>ft @ 11s</span>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Chip><Wind size={11} /> Light W · 4mph</Chip>
              <Chip>12 logs this week</Chip>
            </div>
          </div>
        </section>

        {/* ── STAT ROW ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 64 }}>
          <StatBlock label="Sessions" value="27" sub="this year" accent="var(--terra)" />
          <StatBlock
            label="Streak"
            value={<>5 <Flame size={36} color="var(--pink)" fill="var(--pink)" /></>}
            sub="weeks in a row"
            accent="var(--pink)"
          />
          <StatBlock
            label="Spots collected"
            value={<>4<span style={disp({ fontSize: 38, fontWeight: 500, color: "var(--faint)" })}>/6</span></>}
            sub="discovered"
            accent="var(--teal)"
          />
        </section>

        {/* ── TWO-COL ACTIVITY ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, marginBottom: 64 }}>

          {/* LEFT: crew activity */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ ...kickerBase, marginBottom: 8 }}>Group chats · 2 crews</div>
                <div style={disp({ fontSize: 36, letterSpacing: "-1px", lineHeight: 1 })}>Crew activity.</div>
              </div>
              <GhostBtn>See all →</GhostBtn>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SEED_CREWS.map((c) => (
                <div key={c.id} style={{ ...cardBase, overflow: "hidden" }}>
                  {/* color band */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: c.color, color: "var(--cream)" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 5,
                      background: "var(--cream)", color: c.color,
                      display: "grid", placeItems: "center",
                      ...disp({ fontSize: 18 }),
                    }}>
                      {c.emblem}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={disp({ fontSize: 17 })}>{c.name}</div>
                      <div style={mono({ fontSize: 9.5, letterSpacing: 1, opacity: 0.8 })}>
                        {c.members.length} MEMBERS · {c.thread.length} MSGS
                      </div>
                    </div>
                    <button style={{
                      background: "rgba(243,232,210,.18)", border: "1px solid rgba(243,232,210,.4)",
                      color: "var(--cream)", padding: "6px 12px", borderRadius: 4,
                      cursor: "pointer",
                      ...mono({ fontSize: 10, fontWeight: 700, letterSpacing: 1 }),
                      textTransform: "uppercase",
                    }}>
                      OPEN →
                    </button>
                  </div>
                  {/* thread items */}
                  <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {c.thread.slice(-3).map((item, i) => (
                      <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: i % 2 === 0 ? "var(--terra)" : "var(--teal)",
                          color: "var(--cream)", flex: "none",
                          display: "grid", placeItems: "center",
                          ...mono({ fontSize: 8, fontWeight: 700 }),
                        }}>
                          {initials(item.who)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{item.who}</span>
                            {item.type === "spot" && (
                              <span style={stamp({ fontSize: 8, background: "var(--teal)", color: "var(--cream)", padding: "2px 5px" })}>PINNED</span>
                            )}
                            {item.type === "log" && (
                              <span style={stamp({ fontSize: 8, padding: "2px 5px" })}>LOGGED</span>
                            )}
                            <span style={mono({ fontSize: 9, color: "var(--faint)", marginLeft: "auto" })}>{item.t}</span>
                          </div>
                          <div style={{ fontSize: 14, color: "var(--soft)", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                            {item.type === "text"
                              ? item.text
                              : item.type === "log"
                                ? `${item.ft}ft at ${item.spot} — ${item.wind}`
                                : `dropped a pin: ${item.spot}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* MAP PREVIEW */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ ...kickerBase, marginBottom: 6, color: "var(--teal)" }}>Charted</div>
                  <div style={disp({ fontSize: 28, letterSpacing: "-1px" })}>The map.</div>
                </div>
                <GhostBtn style={{ padding: "8px 12px", fontSize: 10 }}>Open →</GhostBtn>
              </div>
              <div style={{ ...cardBase, aspectRatio: "1 / 1", overflow: "hidden", padding: 0, background: "var(--paper)" }}>
                {/* SVG terrain */}
                <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  {[14, 24, 34, 44, 54].map((o, i) => (
                    <path key={i} d={`M ${o} 0 Q ${o + 12} 33 ${o - 4} 60 T ${o + 6} 100`} fill="none" stroke="var(--teal)" strokeWidth="0.5" opacity={0.32 - i * 0.05} />
                  ))}
                  <path d="M 64 0 Q 58 16 67 33 Q 77 47 62 62 Q 50 78 64 92 L 64 100 L 100 100 L 100 0 Z" fill="var(--terra)" stroke="var(--terra-deep)" strokeWidth="0.5" />
                  <g transform="translate(8 88)">
                    <circle r="3" fill="none" stroke="var(--soft)" strokeWidth="0.4" />
                    <path d="M 0 -2.6 L .7 0 L 0 2.6 L -.7 0 Z" fill="var(--terra)" />
                    <text x="0" y="-4" fontFamily="JetBrains Mono" fontSize="1.8" fill="var(--soft)" textAnchor="middle" fontWeight="700">N</text>
                  </g>
                </svg>
                {/* Spot pins */}
                {SPOTS.map((s) => {
                  const firing = s.cond === "firing" && !s.secret;
                  const pinColor = s.secret ? "var(--ink)" : condColor(s.cond);
                  return (
                    <button key={s.id} onClick={() => setActiveSpot(s)} style={{
                      position: "absolute", left: s.x + "%", top: s.y + "%",
                      transform: "translate(-50%,-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    }}>
                      <span style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: pinColor, border: `2px solid ${pinColor}`,
                        boxShadow: firing ? "0 0 0 3px rgba(217,168,71,.3)" : s.secret ? "0 0 0 2px rgba(42,31,21,.1)" : "none",
                        display: "grid", placeItems: "center",
                      }}>
                        {s.secret && <Lock size={6} color="var(--cream)" />}
                        {firing && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cream)" }} />}
                      </span>
                      <span style={mono({ fontSize: 7, color: "var(--ink)", background: "var(--cream)", padding: "1px 4px", borderRadius: 2, whiteSpace: "nowrap", fontWeight: 700, border: "1px solid var(--line)" })}>
                        {s.name}
                      </span>
                    </button>
                  );
                })}
                {/* Drop pin FAB */}
                <button style={{
                  position: "absolute", bottom: 12, right: 12,
                  background: "var(--pink)", color: "var(--cream)",
                  border: "2px solid var(--cream)", borderRadius: 24,
                  padding: "8px 12px", cursor: "pointer",
                  ...mono({ fontSize: 9.5, fontWeight: 700, letterSpacing: 1 }),
                  textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", gap: 5,
                  boxShadow: "0 4px 10px -2px rgba(230,51,109,.4)",
                }}>
                  <Crosshair size={12} /> Drop pin
                </button>
              </div>
            </div>

            {/* COMMUNITY HIGHLIGHTS */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ ...kickerBase, marginBottom: 6, color: "var(--pink)" }}>Public · this week</div>
                  <div style={disp({ fontSize: 28, letterSpacing: "-1px" })}>Trending.</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SEED_COMMUNITY.slice(0, 3).map((p) => (
                  <div key={p.id} style={{ ...cardBase, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                    {p.clip ? (
                      <div style={{
                        width: 60, height: 60, borderRadius: 5,
                        background: "linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",
                        border: "1.5px solid var(--ink)", flex: "none",
                        display: "grid", placeItems: "center",
                      }}>
                        <Play size={18} fill="var(--cream)" color="var(--cream)" style={{ marginLeft: 2 }} />
                      </div>
                    ) : (
                      <div style={{
                        width: 60, height: 60, borderRadius: 5,
                        background: "var(--paper)", border: "1.5px dashed var(--line)", flex: "none",
                        display: "grid", placeItems: "center",
                      }}>
                        <MessageCircle size={20} color="var(--faint)" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={disp({ fontSize: 13 })}>@{p.who}</span>
                        {p.mood === "firing" && <span style={stamp({ fontSize: 7.5, padding: "2px 5px" })}>FIRING</span>}
                      </div>
                      <div style={{
                        fontSize: 13, color: "var(--soft)", fontStyle: "italic", lineHeight: 1.4,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      } as React.CSSProperties}>
                        {p.cap}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: p.liked ? "var(--pink)" : "var(--faint)" }}>
                          <Heart size={12} fill={p.liked ? "var(--pink)" : "none"} />
                          <span style={mono({ fontSize: 10, fontWeight: 600 })}>{p.likes}</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--faint)" }}>
                          <MessageCircle size={12} />
                          <span style={mono({ fontSize: 10, fontWeight: 600 })}>{p.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── JOURNAL ── */}
        <section>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ ...kickerBase, marginBottom: 8, color: "var(--mustard-deep)" }}>Field log · 4 most recent</div>
              <div style={disp({ fontSize: 36, letterSpacing: "-1px" })}>Your journal.</div>
            </div>
            <GhostBtn>All entries →</GhostBtn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {MY_LOGS.map((l) => {
              const stripe = l.rating >= 4 ? "var(--mustard)" : l.rating >= 3 ? "var(--teal)" : "var(--faint)";
              return (
                <div key={l.id} style={{ ...cardBase, overflow: "hidden", display: "flex" }}>
                  <div style={{ width: 6, background: stripe }} />
                  <div style={{ padding: "18px 20px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={mono({ fontSize: 10, letterSpacing: 1.5, color: "var(--faint)", fontWeight: 600 })}>
                        {l.date.toUpperCase()}
                      </div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 9px", borderRadius: 20,
                        background: l.crewColor, color: "var(--cream)",
                        ...mono({ fontSize: 8.5, fontWeight: 700, letterSpacing: 1 }),
                        textTransform: "uppercase",
                      }}>
                        {l.crew.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                      <span style={disp({ fontSize: 44, lineHeight: 0.85, letterSpacing: -1.5 })}>
                        {l.ft}<span style={{ fontSize: 15, color: "var(--soft)", fontWeight: 500 }}> ft</span>
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={disp({ fontSize: 18, fontStyle: "italic" })}>{l.spot}</div>
                        <div style={mono({ fontSize: 9.5, color: "var(--soft)", letterSpacing: 0.5, marginTop: 1, fontWeight: 500 })}>
                          {l.wind.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={13} fill={n <= l.rating ? stripe : "none"} color={n <= l.rating ? stripe : "var(--line2)"} />
                        ))}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 14, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5,
                      borderTop: "1px dashed var(--line)", marginTop: 10, paddingTop: 10,
                    }}>
                      {l.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop: 80, paddingTop: 36,
          borderTop: "1.5px solid var(--line)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{
            fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
            fontSize: 22, letterSpacing: "-1px", color: "var(--terra)", lineHeight: 0.85,
          }}>
            lineup.
          </div>
          <div style={mono({ fontSize: 10, color: "var(--faint)", letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600 })}>
            A community surf journal · est. &apos;26 · long beach, ca
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["About", "Privacy", "Support"].map((label) => (
              <span key={label} style={{ ...mono({ fontSize: 10, color: "var(--soft)", letterSpacing: 1.5, fontWeight: 600 }), cursor: "pointer" }}>
                {label.toUpperCase()}
              </span>
            ))}
          </div>
        </footer>
      </main>

      {/* ── SPOT SHEET DIALOG ── */}
      {activeSpot && (
        <div onClick={() => setActiveSpot(null)} style={{
          position: "fixed", inset: 0,
          background: "rgba(42,31,21,.5)",
          zIndex: 50, display: "grid", placeItems: "center",
        }}>
          <div onClick={(e) => e.stopPropagation()} className="rise" style={{
            background: "var(--cream)", borderRadius: 10, overflow: "hidden",
            width: 480, maxWidth: "90vw",
            border: "1.5px solid var(--line)",
          }}>
            <div style={{ height: 8, background: activeSpot.secret ? "var(--ink)" : condColor(activeSpot.cond) }} />
            <div style={{ padding: "24px 26px 26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <span style={stamp(activeSpot.secret ? { background: "var(--ink)", color: "var(--cream)" } : {})}>
                    {activeSpot.secret
                      ? `${activeSpot.crew} · SECRET`
                      : `${condLabel(activeSpot.cond)} · ${activeSpot.type}`}
                  </span>
                  <div style={disp({ fontSize: 36, marginTop: 10, letterSpacing: -1 })}>{activeSpot.name}</div>
                </div>
                <button onClick={() => setActiveSpot(null)} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "1.5px solid var(--line)", background: "var(--card)",
                  color: "var(--ink)", display: "grid", placeItems: "center", cursor: "pointer",
                }}>
                  <X size={16} />
                </button>
              </div>

              {activeSpot.secret ? (
                <div style={{ ...cardBase, padding: 14, margin: "16px 0", background: "var(--paper)", border: "1.5px solid var(--ink)" }}>
                  <div style={{ ...mono({ fontSize: 10, color: "var(--ink)", letterSpacing: 1.5, fontWeight: 700 }), display: "flex", alignItems: "center", gap: 6 }}>
                    <Lock size={11} /> SHARED BY {(activeSpot.by || "").toUpperCase()}
                  </div>
                  <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--soft)", marginTop: 7, lineHeight: 1.5 }}>
                    Coordinates visible because you&apos;re in{" "}
                    <b style={{ color: "var(--ink)", fontStyle: "normal", fontWeight: 700 }}>{activeSpot.crew}</b>.
                    Outsiders see open water.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "18px 0 10px" }}>
                    <span style={disp({ fontSize: 64, lineHeight: 0.85, letterSpacing: -2 })}>3–4</span>
                    <span style={{
                      fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                      fontStyle: "italic", fontSize: 18, color: "var(--soft)",
                    }}>ft @ 12s</span>
                  </div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <Chip><Wind size={11} /> Light W · 4mph</Chip>
                    <Chip>12 logs this week</Chip>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={() => { setActiveSpot(null); setLogging(true); }} style={{
                  flex: 1,
                  background: "var(--terra)", color: "var(--cream)", border: "none",
                  padding: "11px 16px", borderRadius: 6, cursor: "pointer",
                  ...mono({ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px" }),
                  textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}>
                  <Plus size={13} /> Log a session
                </button>
                <button style={{
                  background: "transparent", border: "1.5px solid var(--ink)", color: "var(--ink)",
                  padding: "11px 16px", borderRadius: 6, cursor: "pointer",
                  ...mono({ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px" }),
                  textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}>
                  <Navigation size={13} /> Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOG MODAL ── */}
      {logging && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
          <LogModal
            crews={SEED_CREWS}
            onClose={() => setLogging(false)}
            onSubmit={() => setLogging(false)}
          />
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBlock({ label, value, sub, accent }: {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rise" style={{
      background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 8,
      padding: "24px 26px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: accent }} />
      <div style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "2px", textTransform: "uppercase",
        color: "var(--faint)", fontWeight: 600,
        marginBottom: 14, paddingLeft: 5,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontWeight: 700, fontSize: 64, letterSpacing: "-2.5px", lineHeight: 0.85,
        display: "flex", alignItems: "center", gap: 8, paddingLeft: 5,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 10, color: "var(--faint)", letterSpacing: 1.5,
        marginTop: 10, fontWeight: 600, paddingLeft: 5,
        textTransform: "uppercase",
      }}>
        {sub}
      </div>
    </div>
  );
}

function GhostBtn({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button style={{
      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
      fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700,
      padding: "11px 16px", borderRadius: 6,
      background: "transparent", border: "1.5px solid var(--ink)", color: "var(--ink)",
      cursor: "pointer",
      ...style,
    }}>
      {children}
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
      fontSize: 10, fontWeight: 500,
      padding: "5px 10px", borderRadius: 20,
      background: "var(--paper)", border: "1.5px solid var(--line)",
      display: "inline-flex", alignItems: "center", gap: 5, color: "var(--soft)",
    }}>
      {children}
    </span>
  );
}
