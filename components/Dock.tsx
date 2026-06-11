"use client";

import { useState } from "react";
import {
  type LucideProps,
  Home as HomeIcon,
  Users,
  Map as MapIcon,
  User,
  Plus,
  Waves,
  Crosshair,
  Camera,
} from "lucide-react";

export type DockView = "home" | "crews" | "map" | "feed" | "profile";

interface Props {
  view: DockView;
  onNav: (v: "home" | "crews" | "map" | "profile") => void;
  onLog: () => void;
  onDropPin: () => void;
  onNewCrew: () => void;
  onNewPost: () => void;
}

const DESTS: { id: "home" | "crews" | "map" | "profile"; label: string; icon: React.ComponentType<LucideProps> }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "crews", label: "Crews", icon: Users },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "profile", label: "You", icon: User },
];

export default function Dock({ view, onNav, onLog, onDropPin, onNewCrew, onNewPost }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndex = DESTS.findIndex((d) => d.id === view);

  const actions: { label: string; icon: React.ComponentType<LucideProps>; color: string; run: () => void }[] = [
    { label: "Log a session", icon: Waves, color: "var(--terra)", run: onLog },
    { label: "Drop a pin", icon: Crosshair, color: "var(--teal)", run: onDropPin },
    { label: "Start a crew", icon: Users, color: "var(--mustard)", run: onNewCrew },
    { label: "New post", icon: Camera, color: "var(--pink)", run: onNewPost },
  ];

  const close = () => setMenuOpen(false);
  const fire = (run: () => void) => {
    close();
    // let the fan-out collapse read before the next surface mounts
    setTimeout(run, 120);
  };

  return (
    <>
      {/* Scrim */}
      {menuOpen && (
        <div
          onClick={close}
          className="scrim-in"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            background: "rgba(42,31,21,.34)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Radial quick-actions, anchored above the (+) */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            right: 26,
            bottom: 104,
            zIndex: 21,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 13,
          }}
        >
          {actions.map((a, i) => (
            <button
              key={a.label}
              onClick={() => fire(a.run)}
              className="fan-in lu-press"
              style={{
                animationDelay: (actions.length - 1 - i) * 0.04 + "s",
                display: "flex",
                alignItems: "center",
                gap: 11,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "var(--ink)",
                  background: "var(--cream)",
                  padding: "8px 12px",
                  borderRadius: 100,
                  border: "1.5px solid var(--line)",
                  boxShadow: "0 6px 18px -6px rgba(42,31,21,.4)",
                  whiteSpace: "nowrap",
                }}
              >
                {a.label}
              </span>
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: a.color,
                  border: "2.5px solid var(--cream)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--cream)",
                  boxShadow: "0 8px 20px -5px rgba(42,31,21,.5)",
                  flexShrink: 0,
                }}
              >
                <a.icon size={20} strokeWidth={2.2} />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Dock capsule */}
      <div style={{ flexShrink: 0, padding: "6px 20px 26px", position: "relative", zIndex: 22 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--ink)",
            borderRadius: 100,
            padding: "8px 8px",
            boxShadow: "0 12px 36px -8px rgba(42,31,21,.5), 0 2px 8px rgba(42,31,21,.2)",
          }}
        >
          {/* Nav group with sliding indicator */}
          <div style={{ position: "relative", flex: 1, display: "flex" }}>
            {/* sliding mustard pill */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "25%",
                transform: `translateX(${activeIndex * 100}%)`,
                opacity: activeIndex < 0 ? 0 : 1,
                background: "var(--mustard)",
                borderRadius: 100,
                transition: "transform .42s cubic-bezier(.34,1.56,.64,1), opacity .2s",
                pointerEvents: "none",
              }}
            />
            {DESTS.map((d) => {
              const active = view === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onNav(d.id)}
                  className="lu-press"
                  style={{
                    position: "relative",
                    flex: 1,
                    minWidth: 0,
                    height: 46,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    color: active ? "var(--ink)" : "rgba(243,232,210,.5)",
                    transition: "color .25s",
                  }}
                  aria-label={d.label}
                  aria-current={active}
                >
                  <d.icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {d.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* (+) action trigger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lu-press"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: menuOpen ? "var(--cream)" : "var(--pink)",
              color: menuOpen ? "var(--ink)" : "var(--cream)",
              border: "3px solid var(--cream)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: menuOpen ? "none" : "0 6px 18px -3px rgba(230,51,109,.6)",
              transition: "background .2s, color .2s",
            }}
            aria-label={menuOpen ? "Close menu" : "Create"}
          >
            <Plus
              size={24}
              strokeWidth={2.6}
              style={{
                transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
}
