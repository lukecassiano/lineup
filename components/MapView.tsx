"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Lock, Crosshair, X, Layers, Compass } from "lucide-react";
import type { Spot } from "@/lib/types";
import { SPOTS } from "@/lib/seed";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/lib/spots";

const MapCanvas = dynamic(() => import("./map/MapCanvas"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface Props {
  discovered: string[];
  userPins: Spot[];
  dropMode: boolean;
  pendingPin: { lat: number; lng: number } | null;
  onSpot: (spot: Spot) => void;
  onStartDrop: () => void;
  onCancelDrop: () => void;
  onPlacePin: (lat: number, lng: number) => void;
}

export default function MapView({
  discovered,
  userPins,
  dropMode,
  pendingPin,
  onSpot,
  onStartDrop,
  onCancelDrop,
  onPlacePin,
}: Props) {
  const [legendOpen, setLegendOpen] = useState(false);
  const allSpots = [...SPOTS, ...userPins];
  const total = allSpots.length;
  const known = allSpots.filter((s) => discovered.includes(s.id) || s.userDropped).length;

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--cream)" }}>
      <div className={dropMode ? "lu-map-drop" : undefined} style={{ position: "absolute", inset: 0 }}>
        <MapCanvas
          spots={allSpots}
          discovered={discovered}
          dropMode={dropMode}
          pendingPin={pendingPin}
          center={MAP_DEFAULT_CENTER}
          zoom={MAP_DEFAULT_ZOOM}
          onSpot={onSpot}
          onPlacePin={onPlacePin}
        />
      </div>

      {/* ── Floating title chip (top-left) ── */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          zIndex: 500,
          background: "rgba(243,232,210,.92)",
          backdropFilter: "blur(8px)",
          border: "1.5px solid var(--line)",
          borderRadius: 14,
          padding: "9px 13px",
          boxShadow: "0 6px 20px -8px rgba(42,31,21,.4)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 8.5,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--terra)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Compass size={11} /> The break map
        </div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.6px",
            lineHeight: 1,
            color: "var(--ink)",
            marginTop: 3,
          }}
        >
          Your lineup.
        </div>
      </div>

      {/* ── Charted counter (top-right) ── */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          zIndex: 500,
          background: "var(--ink)",
          borderRadius: 12,
          padding: "8px 12px",
          boxShadow: "0 6px 20px -8px rgba(42,31,21,.6)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 19,
            fontWeight: 700,
            color: "var(--cream)",
            lineHeight: 1,
          }}
        >
          {known}
          <span style={{ fontSize: 12, color: "rgba(243,232,210,.5)", fontWeight: 500 }}>/{total}</span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 7.5,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--mustard)",
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          charted
        </div>
      </div>

      {/* ── Attribution (bottom-left, faint) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 10,
          zIndex: 500,
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 7.5,
          letterSpacing: 0.5,
          color: "rgba(122,104,80,.7)",
          pointerEvents: "none",
        }}
      >
        © OpenStreetMap · CARTO
      </div>

      {/* ── Legend (collapsible, bottom-left) ── */}
      <div style={{ position: "absolute", bottom: 22, left: 16, zIndex: 500 }}>
        {legendOpen && (
          <div
            className="rise"
            style={{
              background: "rgba(243,232,210,.94)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid var(--line)",
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 8px 24px -8px rgba(42,31,21,.4)",
            }}
          >
            {[
              { c: "var(--mustard)", t: "Firing" },
              { c: "var(--teal)", t: "Fair" },
              { c: "var(--faint)", t: "Undiscovered" },
              { c: "var(--ink)", t: "Crew secret", lock: true },
            ].map((l) => (
              <span
                key={l.t}
                style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--soft)",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: l.c,
                    border: "2px solid var(--cream)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {l.lock && <Lock size={6} color="var(--cream)" />}
                </span>
                {l.t}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={() => setLegendOpen((v) => !v)}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--cream)",
            border: "1.5px solid var(--line)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: legendOpen ? "var(--terra)" : "var(--soft)",
            boxShadow: "0 6px 18px -6px rgba(42,31,21,.45)",
            transition: "color .15s",
          }}
          aria-label="Toggle legend"
        >
          <Layers size={18} strokeWidth={2} />
        </button>
      </div>

      {/* ── Drop-mode banner ── */}
      {dropMode && (
        <div
          className="rise"
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "9px 9px 9px 16px",
            borderRadius: 100,
            boxShadow: "0 10px 28px -8px rgba(42,31,21,.7)",
          }}
        >
          <Crosshair size={14} className="lu-spin-slow" />
          <span
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Tap the map to drop a pin
          </span>
          <button
            onClick={onCancelDrop}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1.5px solid rgba(243,232,210,.4)",
              background: "transparent",
              color: "var(--cream)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Cancel drop"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Drop-pin FAB (bottom-right) ── */}
      {!dropMode && (
        <button
          onClick={onStartDrop}
          className="lu-press"
          style={{
            position: "absolute",
            bottom: 22,
            right: 16,
            zIndex: 500,
            background: "var(--pink)",
            color: "var(--cream)",
            border: "2.5px solid var(--cream)",
            borderRadius: 30,
            padding: "11px 17px 11px 14px",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            cursor: "pointer",
            boxShadow: "0 8px 22px -4px rgba(230,51,109,.6)",
          }}
        >
          <Crosshair size={15} strokeWidth={2.5} /> Drop a pin
        </button>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--paper)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "var(--faint)",
          fontWeight: 600,
        }}
        className="lu-pulse-text"
      >
        Charting the coast…
      </div>
    </div>
  );
}
