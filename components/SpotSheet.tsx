"use client";

import { Lock, Wind, Navigation, Plus, MapPin } from "lucide-react";
import type { Spot } from "@/lib/types";
import { condColor, condLabel } from "@/lib/utils";

interface Props {
  spot: Spot;
  onClose: () => void;
  onLog: () => void;
}

export default function SpotSheet({ spot, onClose, onLog }: Props) {
  const stripeColor = spot.secret ? "var(--ink)" : condColor(spot.cond);

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(42,31,21,.45)",
        zIndex: 30,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter"
        style={{
          width: "100%",
          background: "var(--cream)",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
        }}
      >
        {/* Condition stripe */}
        <div style={{ height: 6, background: stripeColor }} />

        <div style={{ padding: "16px 24px 36px" }}>
          {/* Drag handle */}
          <div style={{
            width: 36, height: 4, background: "var(--line2)",
            borderRadius: 100, margin: "0 auto 24px",
          }} />

          {/* Stamp + type */}
          <span style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 100, fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 5,
            ...(spot.secret
              ? { background: "var(--ink)", color: "var(--cream)" }
              : spot.cond === "firing"
                ? { background: "var(--mustard)", color: "var(--ink)" }
                : spot.cond === "fair"
                  ? { background: "var(--teal)", color: "var(--cream)" }
                  : { background: "transparent", color: "var(--ink)", border: "1.5px solid var(--line)" }),
          }}>
            {spot.secret ? `${spot.crew || "YOUR"} · SECRET` : condLabel(spot.cond)} · {spot.type}
          </span>

          {/* Region caption */}
          {spot.region && (
            <div style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5, letterSpacing: "1.5px", textTransform: "uppercase",
              color: "var(--soft)", fontWeight: 600,
              marginTop: 14, display: "flex", alignItems: "center", gap: 5,
            }}>
              <MapPin size={11} /> {spot.region}
            </div>
          )}

          {/* Spot name */}
          <div style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 40, fontWeight: 700, letterSpacing: "-1.5px",
            lineHeight: 0.95, color: "var(--ink)",
            marginTop: spot.region ? 6 : 14, marginBottom: 20,
          }}>
            {spot.name}
          </div>

          {spot.secret ? (
            <div style={{
              background: "var(--paper)", border: "1.5px solid var(--line2)",
              borderRadius: 14, padding: "16px 18px", marginBottom: 22,
            }}>
              <div style={{
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 10, color: "var(--ink)", letterSpacing: 1.5,
                display: "flex", alignItems: "center", gap: 6, fontWeight: 700,
                marginBottom: 8,
              }}>
                <Lock size={11} />
                {spot.crew ? `SHARED BY ${(spot.by || "").toUpperCase()}` : "PRIVATE PIN"}
              </div>
              <div style={{
                fontSize: 14, fontStyle: "italic", color: "var(--soft)", lineHeight: 1.55,
              }}>
                {spot.crew
                  ? <>Coordinates visible because you&apos;re in <b style={{ color: "var(--ink)", fontStyle: "normal" }}>{spot.crew}</b>. Outsiders see open water.</>
                  : <>Only you can see this spot. Share to a crew anytime.</>}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                <span style={{
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 76, fontWeight: 700, lineHeight: 0.82, letterSpacing: -3,
                  color: "var(--ink)",
                }}>
                  3–4
                </span>
                <span style={{
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 20, fontStyle: "italic", color: "var(--soft)",
                }}>
                  ft @ 12s
                </span>
              </div>
              <div style={{ display: "flex", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                {[
                  { icon: <Wind size={11} />, text: "Light W · 4mph" },
                  { icon: null, text: "12 logs this week" },
                ].map((chip) => (
                  <span key={chip.text} style={{
                    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 10, fontWeight: 500, padding: "5px 11px",
                    borderRadius: 100, background: "var(--paper)", border: "1.5px solid var(--line)",
                    display: "inline-flex", alignItems: "center", gap: 5, color: "var(--soft)",
                  }}>
                    {chip.icon}{chip.text}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={onLog} style={{
              flex: 1,
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
              fontWeight: 700, padding: "14px 16px", borderRadius: 100,
              border: "none", cursor: "pointer",
              background: "var(--terra)", color: "var(--cream)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}>
              <Plus size={15} /> Log session
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="lu-press"
              style={{
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
                fontWeight: 700, padding: "14px 16px", borderRadius: 100,
                border: "1.5px solid var(--line2)", cursor: "pointer",
                background: "transparent", color: "var(--ink)",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
              }}
              aria-label="Directions"
            >
              <Navigation size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
