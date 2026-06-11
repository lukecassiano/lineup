"use client";

import { X, Check, Lock } from "lucide-react";
import type { Badge } from "./Profile";

export function BadgeSheet({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const pct = Math.min(100, Math.round((badge.current / badge.target) * 100));
  return (
    <div
      onClick={onClose}
      className="scrim-in"
      style={{ position: "absolute", inset: 0, background: "rgba(42,31,21,.5)", zIndex: 50, display: "flex", alignItems: "flex-end" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter"
        style={{ width: "100%", background: "var(--cream)", borderRadius: "22px 22px 0 0", overflow: "hidden" }}
      >
        <div style={{ height: 6, background: badge.color }} />
        <div style={{ padding: "16px 24px 32px" }}>
          <div style={{ width: 36, height: 4, background: "var(--line2)", borderRadius: 100, margin: "0 auto 22px" }} />

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -8 }}>
            <button
              onClick={onClose}
              className="lu-press"
              style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink)", display: "grid", placeItems: "center", cursor: "pointer" }}
            >
              <X size={17} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div
              className={badge.got ? "unlock-pop" : undefined}
              style={{
                width: 88, height: 88, borderRadius: "50%",
                background: badge.got ? badge.color : "var(--paper)",
                border: badge.got ? `3px solid ${badge.color}` : "2px dashed var(--line2)",
                display: "grid", placeItems: "center",
                marginBottom: 16,
                boxShadow: badge.got ? `0 12px 30px -8px ${badge.color}` : "none",
              }}
            >
              <badge.icon size={40} color={badge.got ? "var(--cream)" : "var(--faint)"} strokeWidth={2} />
            </div>

            <div
              style={{
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700,
                color: badge.got ? badge.color : "var(--faint)",
                display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8,
              }}
            >
              {badge.got ? <><Check size={12} /> Earned</> : <><Lock size={11} /> Locked</>}
            </div>

            <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 30, fontWeight: 700, letterSpacing: "-1px", color: "var(--ink)" }}>
              {badge.name}
            </div>
            <p style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 16, color: "var(--soft)", lineHeight: 1.5, marginTop: 8, maxWidth: 280 }}>
              {badge.desc}
            </p>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--faint)", fontWeight: 600 }}>
                Progress
              </span>
              <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: "1px", color: badge.color, fontWeight: 700 }}>
                {Math.min(badge.current, badge.target)} / {badge.target}
              </span>
            </div>
            <div style={{ height: 8, background: "var(--paper)", border: "1.5px solid var(--line)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: badge.color, borderRadius: 100, transition: "width .5s cubic-bezier(.34,1.56,.64,1)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CONFETTI = [
  { c: "var(--mustard)", l: "18%", d: "0s" },
  { c: "var(--teal)", l: "32%", d: ".08s" },
  { c: "var(--pink)", l: "50%", d: ".02s" },
  { c: "var(--terra)", l: "66%", d: ".12s" },
  { c: "var(--mustard)", l: "80%", d: ".05s" },
  { c: "var(--teal)", l: "42%", d: ".16s" },
  { c: "var(--pink)", l: "60%", d: ".1s" },
];

export function BadgeUnlock({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="scrim-in"
      style={{ position: "absolute", inset: 0, background: "rgba(42,31,21,.6)", zIndex: 60, display: "grid", placeItems: "center", padding: 28 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop"
        style={{
          position: "relative",
          width: "100%", maxWidth: 320,
          background: "var(--cream)", borderRadius: 22,
          border: "1.5px solid var(--line)", overflow: "hidden",
          padding: "34px 26px 26px", textAlign: "center",
        }}
      >
        {/* confetti */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {CONFETTI.map((p, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: -8,
                left: p.l,
                width: 7,
                height: 11,
                borderRadius: 2,
                background: p.c,
                animation: `confettiFall 1s ease-in ${p.d} forwards`,
              }}
            />
          ))}
        </div>

        <div style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: badge.color, fontWeight: 700, marginBottom: 18 }}>
          Patch earned
        </div>

        <div
          className="unlock-pop"
          style={{
            width: 96, height: 96, borderRadius: "50%",
            background: badge.color, margin: "0 auto 18px",
            display: "grid", placeItems: "center",
            border: "3px solid var(--cream)",
            boxShadow: `0 14px 36px -8px ${badge.color}`,
          }}
        >
          <badge.icon size={44} color="var(--cream)" strokeWidth={2} />
        </div>

        <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontStyle: "italic", fontSize: 30, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)" }}>
          {badge.name}
        </div>
        <p style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif", fontStyle: "italic", fontSize: 15.5, color: "var(--soft)", lineHeight: 1.5, marginTop: 8 }}>
          {badge.desc}
        </p>

        <button
          onClick={onClose}
          className="lu-press"
          style={{
            marginTop: 22, width: "100%",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700,
            padding: "14px 16px", borderRadius: 100, border: "none", cursor: "pointer",
            background: "var(--ink)", color: "var(--cream)",
          }}
        >
          Nice.
        </button>
      </div>
    </div>
  );
}
