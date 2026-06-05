"use client";

import { useRef } from "react";
import { Lock, Crosshair } from "lucide-react";
import type { Spot } from "@/lib/types";
import { SPOTS } from "@/lib/seed";
import { condColor } from "@/lib/utils";

interface Props {
  discovered: string[];
  userPins: Spot[];
  dropMode: boolean;
  pendingPin: { x: number; y: number } | null;
  onSpot: (spot: Spot) => void;
  onStartDrop: () => void;
  onCancelDrop: () => void;
  onPlacePin: (x: number, y: number) => void;
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
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!dropMode) return;
    const rect = mapRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 108;
    if (x < 2 || x > 98 || y < 2 || y > 106) return;
    onPlacePin(x, y);
  };

  const allSpots = [...SPOTS, ...userPins];

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch" as never,
        padding: "22px 18px 26px",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 9.5,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "var(--terra)",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          The break map · charted
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
          Your lineup.
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--soft)",
            marginTop: 6,
            fontStyle: "italic",
            lineHeight: 1.4,
          }}
        >
          Public breaks for everyone — crew spots locked to your group.
        </div>
      </div>

      {/* Map card */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1.08",
          overflow: "hidden",
          padding: 0,
          background: "var(--paper)",
          border: "1.5px solid var(--line)",
          borderRadius: 6,
          cursor: dropMode ? "crosshair" : "default",
        }}
      >
        {/* SVG map art */}
        <svg
          viewBox="0 0 100 108"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {[14, 24, 34, 44, 54].map((o, i) => (
            <path
              key={i}
              d={`M ${o} 0 Q ${o + 12} 36 ${o - 4} 66 T ${o + 6} 108`}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="0.5"
              opacity={0.32 - i * 0.05}
            />
          ))}
          <path
            d="M 64 0 Q 58 18 67 36 Q 77 50 62 68 Q 50 84 64 98 L 64 108 L 100 108 L 100 0 Z"
            fill="var(--terra)"
            stroke="var(--terra-deep)"
            strokeWidth="0.5"
          />
          <text
            x="82"
            y="56"
            fontFamily="JetBrains Mono"
            fontSize="3"
            fill="var(--cream)"
            letterSpacing="1.5"
            fontWeight="700"
            transform="rotate(90 82 56)"
          >
            PACIFIC COAST
          </text>
          <g transform="translate(8 95)">
            <circle r="3.5" fill="none" stroke="var(--soft)" strokeWidth="0.4" />
            <path d="M 0 -3 L .8 0 L 0 3 L -.8 0 Z" fill="var(--terra)" />
            <text
              x="0"
              y="-4.5"
              fontFamily="JetBrains Mono"
              fontSize="2"
              fill="var(--soft)"
              textAnchor="middle"
              fontWeight="700"
            >
              N
            </text>
          </g>
        </svg>

        {/* Spot pins */}
        {allSpots.map((s) => {
          const known = discovered.includes(s.id);
          const firing = s.cond === "firing" && !s.secret;
          const c = s.secret ? "var(--ink)" : condColor(s.cond);
          return (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                onSpot(s);
              }}
              style={{
                position: "absolute",
                left: s.x + "%",
                top: s.y / 1.08 + "%",
                transform: "translate(-50%,-50%)",
                background: "none",
                border: "none",
                cursor: dropMode ? "crosshair" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                pointerEvents: dropMode ? "none" : "auto",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: known ? c : "transparent",
                  border: `2.5px solid ${c}`,
                  boxShadow: firing
                    ? "0 0 0 4px rgba(217,168,71,.25)"
                    : s.secret
                    ? "0 0 0 3px rgba(42,31,21,.1)"
                    : "none",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {s.secret && <Lock size={7} color="var(--cream)" />}
                {firing && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--cream)",
                    }}
                  />
                )}
              </span>
              <span
                style={{
                  fontFamily:
                    "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: "var(--ink)",
                  background: "var(--cream)",
                  padding: "2px 5px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                  opacity: known ? 1 : 0.4,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  border: "1px solid var(--line)",
                }}
              >
                {known ? s.name : "???"}
              </span>
            </button>
          );
        })}

        {/* Pending pin pulse */}
        {pendingPin && (
          <span
            style={{
              position: "absolute",
              left: pendingPin.x + "%",
              top: pendingPin.y / 1.08 + "%",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "var(--pink)",
              border: "3px solid var(--cream)",
              animation: "pinpulse 1.4s ease infinite",
              zIndex: 7,
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Drop-mode overlay */}
        {dropMode && !pendingPin && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(42,31,21,.32)",
              zIndex: 6,
              cursor: "crosshair",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 14,
            }}
          >
            <span
              style={{
                background: "var(--ink)",
                color: "var(--cream)",
                padding: "7px 14px",
                borderRadius: 3,
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                border: "1.5px solid var(--cream)",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Crosshair size={12} /> Tap to drop a pin
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelDrop();
              }}
              style={{
                background: "var(--cream)",
                color: "var(--ink)",
                border: "1.5px solid var(--ink)",
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                padding: "7px 14px",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Drop pin FAB */}
        {!dropMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartDrop();
            }}
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              background: "var(--pink)",
              color: "var(--cream)",
              border: "2.5px solid var(--cream)",
              borderRadius: 30,
              padding: "9px 14px 9px 11px",
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              boxShadow: "0 5px 14px -3px rgba(230,51,109,.55)",
              zIndex: 5,
            }}
          >
            <Crosshair size={13} strokeWidth={2.5} /> Drop a pin
          </button>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          marginTop: 14,
        }}
      >
        {[
          { c: "var(--mustard)", t: "Firing" },
          { c: "var(--teal)", t: "Fair" },
          { c: "var(--faint)", t: "Flat" },
          { c: "var(--ink)", t: "Crew secret", lock: true },
        ].map((l) => (
          <span
            key={l.t}
            style={{
              fontFamily:
                "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              padding: "4px 9px",
              borderRadius: 20,
              background: "var(--paper)",
              border: "1.5px solid var(--line)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--soft)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: l.c,
                display: "grid",
                placeItems: "center",
              }}
            >
              {l.lock && <Lock size={5} color="var(--cream)" />}
            </span>
            {l.t}
          </span>
        ))}
      </div>
    </div>
  );
}
