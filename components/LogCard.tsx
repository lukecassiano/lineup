"use client";

import { Star } from "lucide-react";
import type { Session } from "@/lib/types";

export default function LogCard({ s }: { s: Session }) {
  const stripe = s.rating >= 4 ? "var(--mustard)" : s.rating >= 3 ? "var(--teal)" : "var(--faint)";
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--line)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
      }}
    >
      <div style={{ width: 6, background: stripe, flexShrink: 0 }} />
      <div style={{ padding: "16px 18px", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "1.5px",
              color: "var(--faint)",
              fontWeight: 600,
            }}
          >
            {(s.t || "").toUpperCase()}
          </div>
          {s.crew && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 9px",
                borderRadius: 20,
                background: s.crewColor || "var(--ink)",
                color: "var(--cream)",
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {s.crew}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-fraunces), 'Fraunces', serif",
              fontWeight: 700,
              fontSize: 42,
              lineHeight: 0.85,
              letterSpacing: "-1.5px",
              color: "var(--ink)",
            }}
          >
            {s.ft}
            <span style={{ fontSize: 14, color: "var(--soft)", fontWeight: 500 }}> ft</span>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                fontSize: 17,
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              {s.spot}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                color: "var(--soft)",
                letterSpacing: 0.5,
                marginTop: 1,
                fontWeight: 500,
              }}
            >
              {s.wind.toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={12}
                fill={n <= s.rating ? stripe : "none"}
                color={n <= s.rating ? stripe : "var(--line2)"}
              />
            ))}
          </div>
        </div>
        {s.note && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontStyle: "italic",
              color: "var(--soft)",
              lineHeight: 1.5,
              borderTop: "1px dashed var(--line)",
              marginTop: 10,
              paddingTop: 10,
            }}
          >
            {s.note}
          </div>
        )}
      </div>
    </div>
  );
}
