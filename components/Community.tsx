"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Play } from "lucide-react";
import type { CommunityPost } from "@/lib/types";
import { initials } from "@/lib/utils";

interface Props {
  posts: CommunityPost[];
  onLike: (id: string) => void;
}

export default function Community({ posts, onLike }: Props) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch" as never,
        padding: "22px 0 26px",
      }}
    >
      <div style={{ padding: "0 18px", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 9.5,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "var(--pink)",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          The community · public
        </div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-1px",
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          What&apos;s out there.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {posts.map((p, i) => (
          <div
            key={p.id}
            className="rise"
            style={{ animationDelay: i * 0.05 + "s", padding: "0 18px" }}
          >
            {/* Post header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 11,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: i % 2 === 0 ? "var(--terra)" : "var(--teal)",
                  color: "var(--cream)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily:
                    "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {initials(p.who)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  @{p.who}
                </div>
                <div
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: "var(--faint)",
                    letterSpacing: 0.5,
                    marginTop: 1,
                    fontWeight: 500,
                  }}
                >
                  2h ago
                </div>
              </div>
              {p.mood === "firing" && (
                <span
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    background: "var(--mustard)",
                    color: "var(--ink)",
                    padding: "4px 9px",
                    borderRadius: 3,
                    fontWeight: 700,
                  }}
                >
                  FIRING
                </span>
              )}
              {p.mood === "fair" && (
                <span
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    background: "var(--teal)",
                    color: "var(--cream)",
                    padding: "4px 9px",
                    borderRadius: 3,
                    fontWeight: 700,
                  }}
                >
                  FAIR
                </span>
              )}
              <button
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1.5px solid var(--line)",
                  background: "var(--card)",
                  color: "var(--ink)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                <MoreHorizontal size={14} />
              </button>
            </div>

            {p.clip && <ClipThumb mood={p.mood} />}

            <div
              style={{
                padding: p.clip ? "14px 2px 4px" : "0 2px 4px",
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--ink)",
              }}
            >
              {p.cap}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "6px 2px 0",
              }}
            >
              <button
                onClick={() => onLike(p.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: p.liked ? "var(--pink)" : "var(--soft)",
                  padding: 0,
                }}
              >
                <Heart
                  size={19}
                  fill={p.liked ? "var(--pink)" : "none"}
                  strokeWidth={2}
                />
                <span
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {p.likes}
                </span>
              </button>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--soft)",
                }}
              >
                <MessageCircle size={18} strokeWidth={1.8} />
                <span
                  style={{
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {p.comments}
                </span>
              </span>
              <span style={{ marginLeft: "auto", color: "var(--soft)" }}>
                <Share2 size={17} strokeWidth={1.8} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipThumb({ mood }: { mood: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      onClick={() => setPlaying((v) => !v)}
      style={{
        position: "relative",
        aspectRatio: "4/5",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: 8,
        background:
          "linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",
        border: "2px solid var(--ink)",
      }}
    >
      <svg
        viewBox="0 0 100 125"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {[0, 1, 2, 3, 4].map((n) => (
          <path
            key={n}
            d={`M 0 ${50 + n * 12} Q 25 ${36 + n * 12} 50 ${52 + n * 12} T 100 ${44 + n * 12}`}
            fill="none"
            stroke="rgba(243,232,210,.4)"
            strokeWidth="0.7"
            style={
              playing
                ? {
                    animation: `pulse 1.6s ease infinite`,
                    animationDelay: n * 0.2 + "s",
                  }
                : {}
            }
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--cream)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,.4)",
            border: "3px solid var(--ink)",
          }}
        >
          {playing ? (
            <span
              style={{
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9,
                color: "var(--ink)",
                fontWeight: 700,
              }}
            >
              LIVE
            </span>
          ) : (
            <Play
              size={22}
              color="var(--ink)"
              fill="var(--ink)"
              style={{ marginLeft: 3 }}
            />
          )}
        </div>
      </div>
      <span
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 9.5,
          color: "var(--cream)",
          letterSpacing: 1,
          background: "rgba(42,31,21,.7)",
          padding: "3px 8px",
          borderRadius: 4,
          fontWeight: 600,
        }}
      >
        0:14
      </span>
    </div>
  );
}
