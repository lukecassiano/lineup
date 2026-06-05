"use client";

import { Plus, Users } from "lucide-react";
import type { Crew, ThreadItem } from "@/lib/types";
import { initials } from "@/lib/utils";

interface Props {
  crews: Crew[];
  onOpen: (crew: Crew) => void;
}

function getPreview(item: ThreadItem): string {
  if (item.type === "text") return item.text;
  if (item.type === "log") return `${item.ft}ft at ${item.spot} — ${item.wind.toLowerCase()}`;
  return `pinned ${item.spot}`;
}

export default function CrewsList({ crews, onOpen }: Props) {
  return (
    <div
      style={{ flex: 1, overflowY: "auto", padding: "4px 22px 24px" }}
      className="scroll-hide"
    >
      {/* Section heading */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase",
          color: "var(--terra)", fontWeight: 600, marginBottom: 6,
        }}>
          Group chats · {crews.length} crews
        </div>
        <div style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontSize: 34, fontWeight: 700, letterSpacing: "-1px",
          lineHeight: 0.95, color: "var(--ink)",
        }}>
          Your crews.
        </div>
      </div>

      {/* Crew items */}
      {crews.map((c, idx) => {
        const latest = c.thread[c.thread.length - 1];
        return (
          <div key={c.id}>
            <button
              onClick={() => onOpen(c)}
              style={{
                width: "100%", background: "none", border: "none",
                cursor: "pointer", textAlign: "left", padding: 0,
                marginBottom: 28,
              }}
            >
              {/* Top row: emblem + name + unread count */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: c.color, color: "var(--cream)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 22, fontWeight: 700, flexShrink: 0,
                }}>
                  {c.emblem}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                    fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px",
                    color: "var(--ink)", lineHeight: 1, marginBottom: 5,
                  }}>
                    {c.name}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9.5, color: "var(--faint)",
                    letterSpacing: 0.8, fontWeight: 500,
                  }}>
                    <Users size={10} />
                    {c.members.slice(0, 3).join(", ")}{c.members.length > 3 ? ` +${c.members.length - 3}` : ""}
                  </div>
                </div>
                <div style={{
                  background: c.color, color: "var(--cream)",
                  borderRadius: 100, padding: "3px 10px",
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                  flexShrink: 0, marginTop: 4,
                }}>
                  {c.thread.length}
                </div>
              </div>

              {/* Latest message as pull quote */}
              {latest && (
                <div style={{ paddingLeft: 60 }}>
                  <div style={{
                    fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                    fontStyle: "italic", fontSize: 15, color: "var(--soft)",
                    lineHeight: 1.5, marginBottom: 8,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}>
                    &ldquo;{getPreview(latest)}&rdquo;
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: c.color, color: "var(--cream)",
                      display: "grid", placeItems: "center",
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      fontSize: 7, fontWeight: 700,
                    }}>
                      {initials(latest.who)}
                    </div>
                    <span style={{
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      fontSize: 9.5, color: "var(--faint)", letterSpacing: 0.5,
                    }}>
                      {latest.who} · {latest.t}
                    </span>
                  </div>
                </div>
              )}
            </button>

            {idx < crews.length - 1 && (
              <div style={{
                height: 1, background: "var(--line)",
                marginBottom: 28, opacity: 0.5,
              }} />
            )}
          </div>
        );
      })}

      {/* New crew ghost CTA */}
      <button style={{
        width: "100%", padding: "16px 18px",
        borderRadius: 14,
        border: "1.5px dashed var(--line2)",
        background: "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
        marginTop: 8,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          border: "1.5px dashed var(--line2)",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Plus size={16} color="var(--faint)" />
        </div>
        <span style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontSize: 16, fontWeight: 700, color: "var(--faint)", fontStyle: "italic",
        }}>
          Start a new crew
        </span>
      </button>
    </div>
  );
}
