"use client";

import { useState } from "react";
import { type LucideProps, X, Check, Crosshair, Lock, Users, Waves } from "lucide-react";
import type { Crew } from "@/lib/types";

interface Props {
  crews: Crew[];
  onCancel: () => void;
  onConfirm: (args: { name: string; type: string; visibility: string }) => void;
}

export default function NewPinSheet({ crews, onCancel, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Beach");
  const [vis, setVis] = useState("crew:" + crews[0].id);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(42,31,21,.55)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rise"
        style={{
          width: "100%",
          background: "var(--cream)",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          border: "1.5px solid var(--line)",
          borderBottom: "none",
        }}
      >
        <div style={{ height: 8, background: "var(--pink)" }} />
        <div style={{ padding: "18px 22px 24px" }}>
          <div
            style={{
              width: 40,
              height: 4,
              background: "var(--line2)",
              borderRadius: 4,
              margin: "0 auto 18px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily:
                    "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  background: "var(--pink)",
                  color: "var(--cream)",
                  padding: "4px 9px",
                  borderRadius: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 700,
                }}
              >
                <Crosshair size={10} /> NEW SPOT
              </span>
              <div
                style={{
                  fontFamily: "var(--font-fraunces), 'Fraunces', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                  color: "var(--ink)",
                  marginTop: 10,
                }}
              >
                Name this spot.
              </div>
            </div>
            <button
              onClick={onCancel}
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

          {/* Spot name input */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--teal)",
                fontWeight: 600,
                marginBottom: 9,
              }}
            >
              Spot name
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's it called?"
              autoFocus
              style={{
                width: "100%",
                border: "1.5px solid var(--line)",
                borderRadius: 6,
                padding: "13px 15px",
                fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                fontStyle: "italic",
                fontSize: 17,
                background: "var(--card)",
                outline: "none",
                color: "var(--ink)",
              }}
            />
          </div>

          {/* Type pills */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--teal)",
                fontWeight: 600,
                marginBottom: 9,
              }}
            >
              Type
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Beach", "Reef", "Point"].map((v) => (
                <button
                  key={v}
                  onClick={() => setType(v)}
                  style={{
                    flex: 1,
                    padding: "10px 13px",
                    borderRadius: 5,
                    fontFamily:
                      "var(--font-jetbrains), 'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    cursor: "pointer",
                    border: `1.5px solid ${type === v ? "var(--terra)" : "var(--line)"}`,
                    background: type === v ? "var(--terra)" : "var(--card)",
                    color: type === v ? "var(--cream)" : "var(--ink)",
                    transition: "all .12s",
                  }}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility picker */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--teal)",
                fontWeight: 600,
                marginBottom: 9,
              }}
            >
              Share with
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <VisOption
                on={vis === "private"}
                onClick={() => setVis("private")}
                icon={Lock}
                title="Just me"
                sub="Private — only you see this pin"
                color="var(--ink)"
              />
              {crews.map((c) => (
                <VisOption
                  key={c.id}
                  on={vis === "crew:" + c.id}
                  onClick={() => setVis("crew:" + c.id)}
                  icon={Users}
                  title={c.name}
                  sub={`Shared with ${c.members.length} crew members`}
                  color={c.color}
                />
              ))}
              <VisOption
                on={vis === "community"}
                onClick={() => setVis("community")}
                icon={Waves}
                title="Community"
                sub="Public — anyone can see"
                color="var(--pink)"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onCancel}
              style={{
                flexShrink: 0,
                padding: "13px 18px",
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                borderRadius: 6,
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
              onClick={() =>
                onConfirm({ name: name.trim(), type, visibility: vis })
              }
              style={{
                flex: 1,
                fontFamily:
                  "var(--font-jetbrains), 'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "13px 16px",
                borderRadius: 6,
                border: "none",
                cursor: name.trim() ? "pointer" : "not-allowed",
                background: name.trim() ? "var(--terra)" : "var(--line)",
                color: name.trim() ? "var(--cream)" : "var(--faint)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "all .12s",
              }}
            >
              <Check size={15} /> Drop pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisOption({
  on,
  onClick,
  icon: Icon,
  title,
  sub,
  color,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ComponentType<LucideProps>;
  title: string;
  sub: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 13px",
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        border: `1.5px solid ${on ? color : "var(--line)"}`,
        background: on ? "var(--paper)" : "var(--card)",
        position: "relative",
        overflow: "hidden",
        transition: "all .12s",
      }}
    >
      {on && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: color,
          }}
        />
      )}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          background: color,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          marginLeft: on ? 5 : 0,
          transition: "margin .12s",
        }}
      >
        <Icon size={16} color="var(--cream)" />
      </div>
      <span style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-fraunces), 'Fraunces', serif",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 9.5,
            color: "var(--soft)",
            fontWeight: 500,
          }}
        >
          {sub}
        </div>
      </span>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${on ? color : "var(--line2)"}`,
          background: on ? color : "transparent",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {on && <Check size={11} color="var(--cream)" strokeWidth={3} />}
      </span>
    </button>
  );
}
