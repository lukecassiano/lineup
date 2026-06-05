"use client";

import { useState } from "react";
import { type LucideProps, X, Check, Star, ArrowRight, ArrowLeft, Lock, Users, Waves } from "lucide-react";
import type { Crew } from "@/lib/types";

interface LogEntry {
  spot: string;
  ft: string;
  wind: string;
  rating: number;
  note: string;
  visibility: string;
}

interface Props {
  crews: Crew[];
  onClose: () => void;
  onSubmit: (entry: LogEntry) => void;
}

const TOTAL = 4;

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
  fontSize: 9.5,
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "var(--faint)",
  fontWeight: 600,
  marginBottom: 12,
};

export default function LogModal({ crews, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [spot, setSpot] = useState("");
  const [ft, setFt] = useState("3");
  const [wind, setWind] = useState("Glassy");
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");
  const [vis, setVis] = useState("crew:" + crews[0].id);

  const canNext = step === 1 ? spot.trim().length > 0 : true;

  const next = () => {
    if (step < TOTAL) {
      setStep((s) => s + 1);
    } else {
      onSubmit({ spot: spot.trim(), ft, wind, rating, note: note.trim(), visibility: vis });
    }
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
    else onClose();
  };

  return (
    <div
      className="sheet-enter"
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--cream)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: "16px 20px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <button onClick={back} style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1.5px solid var(--line)", background: "var(--card)",
          display: "grid", placeItems: "center",
          cursor: "pointer", color: "var(--ink)",
        }}>
          {step > 1 ? <ArrowLeft size={18} /> : <X size={18} />}
        </button>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === step ? 22 : 6,
              height: 6,
              borderRadius: 100,
              background: i + 1 <= step ? "var(--terra)" : "var(--line)",
              transition: "all .2s ease",
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
          fontSize: 10, color: "var(--faint)",
          letterSpacing: 1.5, fontWeight: 600,
        }}>
          {step} / {TOTAL}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "var(--line2)", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${(step / TOTAL) * 100}%`,
          background: "var(--terra)",
          transition: "width .3s ease",
        }} />
      </div>

      {/* ── Step content ── */}
      <div
        key={step}
        className="view-enter"
        style={{ flex: 1, padding: "36px 24px 16px", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {step === 1 && <StepWhere spot={spot} setSpot={setSpot} />}
        {step === 2 && <StepConditions ft={ft} setFt={setFt} wind={wind} setWind={setWind} />}
        {step === 3 && <StepRating rating={rating} setRating={setRating} />}
        {step === 4 && <StepNote note={note} setNote={setNote} vis={vis} setVis={setVis} crews={crews} />}
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: "12px 24px 32px", flexShrink: 0 }}>
        <button
          disabled={!canNext}
          onClick={next}
          style={{
            width: "100%", padding: "15px",
            borderRadius: 14, border: "none",
            background: canNext ? "var(--terra)" : "var(--line)",
            color: canNext ? "var(--cream)" : "var(--faint)",
            cursor: canNext ? "pointer" : "not-allowed",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            textTransform: "uppercase",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background .15s, color .15s",
          } as React.CSSProperties}
        >
          {step < TOTAL
            ? <><span>Continue</span><ArrowRight size={15} /></>
            : <><Check size={15} /><span>Save entry</span></>}
        </button>
      </div>
    </div>
  );
}

// ── Step 1: Where ─────────────────────────────────────────────────────────────

function StepWhere({ spot, setSpot }: { spot: string; setSpot: (v: string) => void }) {
  return (
    <>
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontSize: 38, fontWeight: 700, letterSpacing: "-1.5px",
        lineHeight: 1.05, color: "var(--ink)", marginBottom: 10,
      }}>
        Where did you<br />
        <span style={{ fontStyle: "italic", color: "var(--terra)" }}>surf today?</span>
      </div>
      <p style={{
        fontFamily: "var(--font-newsreader), 'Newsreader', serif",
        fontStyle: "italic", fontSize: 15, color: "var(--soft)",
        lineHeight: 1.5, marginBottom: 40,
      }}>
        Every session deserves a place in the log.
      </p>
      <input
        value={spot}
        onChange={(e) => setSpot(e.target.value)}
        placeholder="Spot name…"
        autoFocus
        style={{
          width: "100%", border: "none",
          borderBottom: "2px solid var(--line2)",
          padding: "10px 0 14px",
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          background: "transparent", outline: "none", color: "var(--ink)",
        }}
      />
    </>
  );
}

// ── Step 2: Conditions ────────────────────────────────────────────────────────

function StepConditions({ ft, setFt, wind, setWind }: {
  ft: string; setFt: (v: string) => void;
  wind: string; setWind: (v: string) => void;
}) {
  return (
    <>
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontSize: 38, fontWeight: 700, letterSpacing: "-1.5px",
        lineHeight: 1.05, color: "var(--ink)", marginBottom: 36,
      }}>
        How were the<br />
        <span style={{ fontStyle: "italic", color: "var(--teal)" }}>conditions?</span>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={labelStyle}>Wave height</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1–2", "2–3", "3", "4–5", "6+"].map((v) => (
            <TogglePill key={v} on={ft === v} onClick={() => setFt(v)}>{v} ft</TogglePill>
          ))}
        </div>
      </div>

      <div>
        <div style={labelStyle}>Surface</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Glassy", "Light onshore", "Side-shore", "Blown out"].map((v) => (
            <TogglePill key={v} on={wind === v} onClick={() => setWind(v)}>{v}</TogglePill>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Step 3: Rating ────────────────────────────────────────────────────────────

const RATING_LABELS = ["", "Terrible", "Bad", "Alright", "Great", "Perfect"];

function StepRating({ rating, setRating }: { rating: number; setRating: (v: number) => void }) {
  return (
    <>
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontSize: 38, fontWeight: 700, letterSpacing: "-1.5px",
        lineHeight: 1.05, color: "var(--ink)", marginBottom: 36,
      }}>
        How did<br />
        <span style={{ fontStyle: "italic", color: "var(--mustard)" }}>it feel?</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{
          fontFamily: "var(--font-fraunces), 'Fraunces', serif",
          fontWeight: 700, fontSize: 88, letterSpacing: -4, lineHeight: 0.85,
          color: "var(--ink)", textAlign: "center",
        }}>
          {rating}
          <span style={{ fontSize: 32, color: "var(--soft)", fontWeight: 500 }}>/5</span>
        </div>
        <div style={{
          fontFamily: "var(--font-newsreader), 'Newsreader', serif",
          fontSize: 20, fontStyle: "italic",
          color: rating >= 4 ? "var(--terra)" : rating >= 3 ? "var(--teal)" : "var(--faint)",
          transition: "color .15s",
        }}>
          {RATING_LABELS[rating]}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
            }}>
              <Star
                size={38}
                fill={n <= rating ? "var(--mustard)" : "none"}
                color={n <= rating ? "var(--mustard)" : "var(--line2)"}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Step 4: Note + Share ──────────────────────────────────────────────────────

function StepNote({ note, setNote, vis, setVis, crews }: {
  note: string; setNote: (v: string) => void;
  vis: string; setVis: (v: string) => void;
  crews: Crew[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }} className="scroll-hide">
      <div style={{
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontSize: 38, fontWeight: 700, letterSpacing: "-1.5px",
        lineHeight: 1.05, color: "var(--ink)", marginBottom: 28,
        flexShrink: 0,
      }}>
        Field<br />
        <span style={{ fontStyle: "italic", color: "var(--pink)" }}>note.</span>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Glass at dawn, empty lineup, offshore 'til 9…"
        style={{
          width: "100%", border: "none",
          borderBottom: "1.5px solid var(--line2)",
          padding: "0 0 12px",
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          background: "transparent", outline: "none",
          color: "var(--ink)", resize: "none", lineHeight: 1.65,
          marginBottom: 28, flexShrink: 0,
        }}
      />

      <div style={labelStyle}>Share with</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ShareChip on={vis === "private"} onClick={() => setVis("private")} color="var(--ink)" label="Just me" icon={Lock} />
        {crews.map((c) => (
          <ShareChip key={c.id} on={vis === "crew:" + c.id} onClick={() => setVis("crew:" + c.id)} color={c.color} label={c.name} icon={Users} />
        ))}
        <ShareChip on={vis === "community"} onClick={() => setVis("community")} color="var(--pink)" label="Community" icon={Waves} />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TogglePill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 16px", borderRadius: 100,
      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
      cursor: "pointer",
      border: `1.5px solid ${on ? "var(--terra)" : "var(--line)"}`,
      background: on ? "var(--terra)" : "var(--card)",
      color: on ? "var(--cream)" : "var(--ink)",
      transition: "all .12s",
    }}>
      {children}
    </button>
  );
}

function ShareChip({ on, onClick, color, label, icon: Icon }: {
  on: boolean; onClick: () => void;
  color: string; label: string;
  icon: React.ComponentType<LucideProps>;
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 100,
      border: `1.5px solid ${on ? color : "var(--line)"}`,
      background: on ? color : "var(--card)",
      color: on ? "var(--cream)" : "var(--soft)",
      cursor: "pointer", transition: "all .12s",
      fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 600,
      marginBottom: 8,
    }}>
      <Icon size={12} />
      {label}
    </button>
  );
}
