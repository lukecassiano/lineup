"use client";

import { useState } from "react";
import { X, Check, Film, Image as ImageIcon } from "lucide-react";
import type { Condition } from "@/lib/types";

interface Props {
  onCancel: () => void;
  onSubmit: (args: { cap: string; mood: Condition; clip: boolean }) => void;
}

const MOODS: { v: Condition; label: string; color: string; textOnColor: string }[] = [
  { v: "firing", label: "Firing", color: "var(--mustard)", textOnColor: "var(--ink)" },
  { v: "fair", label: "Fair", color: "var(--teal)", textOnColor: "var(--cream)" },
  { v: "flat", label: "Flat", color: "var(--faint)", textOnColor: "var(--cream)" },
];

export default function PostComposer({ onCancel, onSubmit }: Props) {
  const [cap, setCap] = useState("");
  const [mood, setMood] = useState<Condition>("firing");
  const [clip, setClip] = useState(false);

  const label: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
    fontSize: 9.5,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "var(--pink)",
    fontWeight: 600,
    marginBottom: 9,
  };

  return (
    <div
      onClick={onCancel}
      className="scrim-in"
      style={{ position: "absolute", inset: 0, background: "rgba(42,31,21,.5)", zIndex: 50, display: "flex", alignItems: "flex-end" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter"
        style={{ width: "100%", background: "var(--cream)", borderRadius: "22px 22px 0 0", overflow: "hidden" }}
      >
        <div style={{ height: 8, background: "var(--pink)" }} />
        <div style={{ padding: "16px 22px 26px" }}>
          <div style={{ width: 40, height: 4, background: "var(--line2)", borderRadius: 4, margin: "0 auto 18px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  background: "var(--pink)",
                  color: "var(--cream)",
                  padding: "4px 9px",
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                <Film size={10} /> New post
              </span>
              <div
                style={{
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                  marginTop: 10,
                }}
              >
                Share it.
              </div>
            </div>
            <button
              onClick={onCancel}
              className="lu-press"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1.5px solid var(--line)",
                background: "var(--card)",
                color: "var(--ink)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            rows={3}
            autoFocus
            placeholder="What went down out there?"
            style={{
              width: "100%",
              border: "none",
              borderBottom: "1.5px solid var(--line2)",
              padding: "0 0 12px",
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              background: "transparent",
              outline: "none",
              color: "var(--ink)",
              resize: "none",
              lineHeight: 1.6,
              marginBottom: 22,
            }}
          />

          {/* Attach clip */}
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Attach</div>
            <button
              onClick={() => setClip((v) => !v)}
              className="lu-press"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                borderRadius: 12,
                cursor: "pointer",
                border: `1.5px solid ${clip ? "var(--teal)" : "var(--line)"}`,
                background: clip ? "var(--paper)" : "var(--card)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: clip ? "var(--teal)" : "var(--paper)",
                  border: clip ? "none" : "1.5px dashed var(--line2)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: clip ? "var(--cream)" : "var(--faint)",
                }}
              >
                {clip ? <Film size={18} /> : <ImageIcon size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>
                  {clip ? "Clip attached" : "Add a clip"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: "var(--soft)",
                    fontWeight: 500,
                  }}
                >
                  {clip ? "A 0:14 sample reel will be posted" : "Posts a short surf clip placeholder"}
                </div>
              </div>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${clip ? "var(--teal)" : "var(--line2)"}`,
                  background: clip ? "var(--teal)" : "transparent",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {clip && <Check size={11} color="var(--cream)" strokeWidth={3} />}
              </span>
            </button>
          </div>

          {/* Mood */}
          <div style={{ marginBottom: 24 }}>
            <div style={label}>Mood</div>
            <div style={{ display: "flex", gap: 8 }}>
              {MOODS.map((m) => {
                const on = mood === m.v;
                return (
                  <button
                    key={m.v}
                    onClick={() => setMood(m.v)}
                    className="lu-press"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 100,
                      cursor: "pointer",
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      border: `1.5px solid ${on ? m.color : "var(--line)"}`,
                      background: on ? m.color : "var(--card)",
                      color: on ? m.textOnColor : "var(--soft)",
                      transition: "all .12s",
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            disabled={!cap.trim()}
            onClick={() => onSubmit({ cap: cap.trim(), mood, clip })}
            className="lu-press"
            style={{
              width: "100%",
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "15px 16px",
              borderRadius: 100,
              border: "none",
              cursor: cap.trim() ? "pointer" : "not-allowed",
              background: cap.trim() ? "var(--pink)" : "var(--line)",
              color: cap.trim() ? "var(--cream)" : "var(--faint)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              transition: "all .15s",
            }}
          >
            <Check size={15} /> Post to community
          </button>
        </div>
      </div>
    </div>
  );
}
