"use client";

import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  MapPin,
  MoreHorizontal,
  Send,
  Navigation,
  Lock,
  Star,
} from "lucide-react";
import type { Crew, ThreadItem } from "@/lib/types";
import { initials, condColor } from "@/lib/utils";

interface Props {
  crew: Crew;
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
}

export default function CrewThread({
  crew,
  draft,
  setDraft,
  onSend,
  onBack,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [crew.thread.length]);

  return (
    <>
      {/* Crew thread header (replaces masthead) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          background: crew.color,
          color: "var(--cream)",
          borderBottom: "4px solid var(--mustard)",
          flexShrink: 0,
          zIndex: 4,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--cream)",
            padding: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--cream)",
            color: crew.color,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {crew.emblem}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-.3px",
            }}
          >
            {crew.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(243,232,210,.7)",
              letterSpacing: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {crew.members.slice(0, 4).join(" · ")}
            {crew.members.length > 4 ? " …" : ""}
          </div>
        </div>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid var(--cream)",
            background: "transparent",
            color: "var(--cream)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Thread scroll */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as never,
          padding: "14px 14px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "var(--cream2)",
        }}
      >
        {crew.thread.map((m) => (
          <ThreadItemView key={m.id} m={m} crewColor={crew.color} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px",
          borderTop: "1.5px solid var(--line)",
          background: "var(--cream)",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--line)",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--terra)",
            flexShrink: 0,
          }}
        >
          <MapPin size={17} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Write something…"
          style={{
            flex: 1,
            border: "1.5px solid var(--line)",
            borderRadius: 22,
            padding: "10px 16px",
            fontFamily: "var(--font-newsreader), 'Newsreader', serif",
            fontSize: 15,
            background: "var(--card)",
            outline: "none",
            color: "var(--ink)",
          }}
        />
        <button
          onClick={onSend}
          disabled={!draft.trim()}
          style={{
            background: draft.trim() ? "var(--pink)" : "var(--card)",
            border: draft.trim() ? "none" : "1.5px solid var(--line)",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: draft.trim() ? "var(--cream)" : "var(--faint)",
            flexShrink: 0,
            transition: "all .15s",
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </>
  );
}

function ThreadItemView({
  m,
  crewColor,
}: {
  m: ThreadItem;
  crewColor: string;
}) {
  const mine = m.who === "You";

  if (m.type === "text") {
    return (
      <div
        style={{
          alignSelf: mine ? "flex-end" : "flex-start",
          maxWidth: "78%",
        }}
      >
        {!mine && (
          <div
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9,
              color: "var(--soft)",
              marginBottom: 3,
              marginLeft: 6,
              letterSpacing: 0.5,
              fontWeight: 600,
            }}
          >
            {m.who}
          </div>
        )}
        <div
          style={{
            background: mine ? crewColor : "var(--card)",
            color: mine ? "var(--cream)" : "var(--ink)",
            border: mine ? "none" : "1.5px solid var(--line)",
            padding: "10px 14px",
            borderRadius: mine
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          {m.text}
        </div>
      </div>
    );
  }

  if (m.type === "spot") {
    return (
      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--line)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div style={{ height: 5, background: "var(--teal)" }} />
        <div style={{ padding: 14 }}>
          <div
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5,
              color: "var(--teal)",
              letterSpacing: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
            }}
          >
            <Navigation size={12} /> {m.who.toUpperCase()} PINNED A SPOT
          </div>
          <div
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-.3px",
              margin: "6px 0 3px",
            }}
          >
            {m.spot}
          </div>
          {m.note && (
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--soft)",
                lineHeight: 1.55,
              }}
            >
              {m.note}
            </div>
          )}
          <div
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9,
              color: "var(--faint)",
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
              letterSpacing: 1,
              fontWeight: 500,
            }}
          >
            <Lock size={10} /> COORDS · CREW ONLY
          </div>
        </div>
      </div>
    );
  }

  // type === "log"
  const ratingColor =
    m.rating >= 4 ? "var(--mustard)" : m.rating >= 3 ? "var(--teal)" : "var(--faint)";

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--line)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 5, background: ratingColor }} />
      <div
        style={{
          padding: "12px 14px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--terra)",
            color: "var(--cream)",
            display: "grid",
            placeItems: "center",
            fontFamily:
              "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 8.5,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials(m.who)}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{m.who}</span>
        <span style={{ color: "var(--faint)", fontSize: 12 }}>
          logged a session
        </span>
        <span
          style={{
            fontFamily:
              "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 9.5,
            color: "var(--faint)",
            marginLeft: "auto",
            fontWeight: 500,
          }}
        >
          {m.t}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          padding: "2px 14px 10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 0.85,
            letterSpacing: -1.5,
            color: "var(--ink)",
          }}
        >
          {m.ft}
          <span
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: "var(--soft)",
            }}
          >
            {" "}
            ft
          </span>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontSize: 16,
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            {m.spot}
          </div>
          <div
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 10,
              color: "var(--soft)",
              letterSpacing: 0.5,
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {m.wind.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={12}
                fill={n <= m.rating ? ratingColor : "none"}
                color={n <= m.rating ? ratingColor : "var(--line2)"}
              />
            ))}
          </div>
        </div>
      </div>
      {m.note && (
        <div
          style={{
            padding: "0 14px 14px",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--soft)",
            borderTop: "1px dashed var(--line)",
            paddingTop: 10,
          }}
        >
          {m.note}
        </div>
      )}
    </div>
  );
}
