"use client";

import { useState } from "react";
import { X, Check, Users } from "lucide-react";

interface Props {
  onCancel: () => void;
  onConfirm: (args: { name: string; emblem: string; color: string }) => void;
}

const EMBLEMS = ["◐", "≈", "▲", "✦", "◈", "☼", "~", "⚡", "✸"];
const COLORS = [
  { v: "var(--terra)", n: "Terra" },
  { v: "var(--teal)", n: "Teal" },
  { v: "var(--mustard)", n: "Mustard" },
  { v: "var(--pink)", n: "Pink" },
  { v: "var(--ink)", n: "Ink" },
];

export default function NewCrewSheet({ onCancel, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [emblem, setEmblem] = useState(EMBLEMS[0]);
  const [color, setColor] = useState(COLORS[0].v);

  const label: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
    fontSize: 9.5,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "var(--teal)",
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
        <div style={{ height: 8, background: color, transition: "background .2s" }} />
        <div style={{ padding: "16px 22px 26px" }}>
          <div style={{ width: 40, height: 4, background: "var(--line2)", borderRadius: 4, margin: "0 auto 18px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
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
                  background: color,
                  color: "var(--cream)",
                  padding: "4px 9px",
                  borderRadius: 3,
                  fontWeight: 700,
                  transition: "background .2s",
                }}
              >
                <Users size={10} /> New crew
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
                Start a crew.
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

          {/* Live preview + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 15,
                background: color,
                color: "var(--cream)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 26,
                fontWeight: 700,
                flexShrink: 0,
                transition: "background .2s",
                boxShadow: "0 6px 16px -6px rgba(42,31,21,.4)",
              }}
            >
              {emblem}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Crew name…"
              autoFocus
              style={{
                flex: 1,
                border: "none",
                borderBottom: "2px solid var(--line2)",
                padding: "8px 0 10px",
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 22,
                fontWeight: 700,
                background: "transparent",
                outline: "none",
                color: "var(--ink)",
              }}
            />
          </div>

          {/* Emblem */}
          <div style={{ marginBottom: 18 }}>
            <div style={label}>Emblem</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {EMBLEMS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmblem(e)}
                  className="lu-press"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    cursor: "pointer",
                    border: `1.5px solid ${emblem === e ? color : "var(--line)"}`,
                    background: emblem === e ? "var(--paper)" : "var(--card)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    transition: "all .12s",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: 24 }}>
            <div style={label}>Color</div>
            <div style={{ display: "flex", gap: 10 }}>
              {COLORS.map((c) => (
                <button
                  key={c.v}
                  onClick={() => setColor(c.v)}
                  aria-label={c.n}
                  className="lu-press"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: c.v,
                    border: color === c.v ? "3px solid var(--ink)" : "3px solid transparent",
                    boxShadow: color === c.v ? "0 0 0 2px var(--cream) inset" : "none",
                    cursor: "pointer",
                    transition: "all .12s",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onCancel}
              className="lu-press"
              style={{
                flexShrink: 0,
                padding: "14px 18px",
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                borderRadius: 100,
                border: "1.5px solid var(--ink)",
                background: "transparent",
                color: "var(--ink)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              disabled={!name.trim()}
              onClick={() => onConfirm({ name: name.trim(), emblem, color })}
              className="lu-press"
              style={{
                flex: 1,
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "14px 16px",
                borderRadius: 100,
                border: "none",
                cursor: name.trim() ? "pointer" : "not-allowed",
                background: name.trim() ? color : "var(--line)",
                color: name.trim() ? "var(--cream)" : "var(--faint)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "all .15s",
              }}
            >
              <Check size={15} /> Create crew
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
