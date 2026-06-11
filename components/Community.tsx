"use client";

import { useRef, useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Send, Plus } from "lucide-react";
import type { CommunityPost, Condition } from "@/lib/types";
import { initials } from "@/lib/utils";

interface Props {
  posts: CommunityPost[];
  onLike: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCompose: () => void;
}

export default function Community({ posts, onLike, onAddComment, onCompose }: Props) {
  return (
    <div
      className="scroll-hide"
      style={{ flex: 1, overflowY: "auto", padding: "22px 0 120px" }}
    >
      <div style={{ padding: "0 18px", marginBottom: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--pink)",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            The community · public
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
            What&apos;s out there.
          </div>
        </div>
        <button
          onClick={onCompose}
          className="lu-press"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "var(--pink)",
            color: "var(--cream)",
            border: "none",
            borderRadius: 100,
            padding: "9px 14px",
            cursor: "pointer",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 12px -3px rgba(230,51,109,.5)",
            flexShrink: 0,
          }}
        >
          <Plus size={14} /> Post
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} onLike={onLike} onAddComment={onAddComment} />
        ))}
      </div>
    </div>
  );
}

function MoodStamp({ mood }: { mood: Condition }) {
  if (mood === "firing")
    return <Stamp bg="var(--mustard)" fg="var(--ink)">Firing</Stamp>;
  if (mood === "fair") return <Stamp bg="var(--teal)" fg="var(--cream)">Fair</Stamp>;
  return <Stamp bg="transparent" fg="var(--soft)" border>Flat</Stamp>;
}

function Stamp({ children, bg, fg, border }: { children: React.ReactNode; bg: string; fg: string; border?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
        fontSize: 9,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        background: bg,
        color: fg,
        padding: "4px 9px",
        borderRadius: 3,
        fontWeight: 700,
        border: border ? "1.5px solid var(--line)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function PostCard({
  post: p,
  index,
  onLike,
  onAddComment,
}: {
  post: CommunityPost;
  index: number;
  onLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const comments = p.commentList ?? [];
  const commentCount = p.commentList ? p.commentList.length : p.comments;

  const submit = () => {
    if (!draft.trim()) return;
    onAddComment(p.id, draft.trim());
    setDraft("");
    setShowComments(true);
  };

  return (
    <div className="rise" style={{ animationDelay: index * 0.05 + "s", padding: "0 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: p.mine ? "var(--mustard)" : index % 2 === 0 ? "var(--terra)" : "var(--teal)",
            color: p.mine ? "var(--ink)" : "var(--cream)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            border: p.mine ? "2px solid var(--ink)" : "none",
          }}
        >
          {initials(p.who)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>
            @{p.who}
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5,
              color: "var(--faint)",
              letterSpacing: 0.5,
              marginTop: 1,
              fontWeight: 500,
            }}
          >
            {p.t || "just now"}
          </div>
        </div>
        {p.mood !== "flat" && <MoodStamp mood={p.mood} />}
        <button
          className="lu-press"
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1.5px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {p.clip && <ClipPlayer mood={p.mood} videoUrl={p.videoUrl} />}

      <div
        style={{
          padding: p.clip ? "14px 2px 4px" : "0 2px 4px",
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--ink)",
        }}
      >
        {p.cap}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "6px 2px 0" }}>
        <button
          onClick={() => onLike(p.id)}
          className="lu-press"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: p.liked ? "var(--pink)" : "var(--soft)",
            padding: 0,
          }}
        >
          <Heart size={19} fill={p.liked ? "var(--pink)" : "none"} strokeWidth={2} />
          <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
            {p.likes}
          </span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="lu-press"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: showComments ? "var(--terra)" : "var(--soft)",
            padding: 0,
          }}
        >
          <MessageCircle size={18} strokeWidth={1.8} />
          <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
            {commentCount}
          </span>
        </button>
        <span style={{ marginLeft: "auto", color: "var(--soft)" }}>
          <Share2 size={17} strokeWidth={1.8} />
        </span>
      </div>

      {/* Comments */}
      {showComments && (
        <div
          className="view-enter"
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px dashed var(--line)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: c.who === "you" ? "var(--mustard)" : "var(--teal)",
                  color: c.who === "you" ? "var(--ink)" : "var(--cream)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
                  fontSize: 8.5,
                  fontWeight: 700,
                  flexShrink: 0,
                  border: c.who === "you" ? "1.5px solid var(--ink)" : "none",
                }}
              >
                {initials(c.who)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                  <span style={{ fontFamily: "var(--font-fraunces), 'Fraunces', serif", fontSize: 13, fontWeight: 700 }}>
                    @{c.who}
                  </span>
                  <span style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace", fontSize: 8.5, color: "var(--faint)" }}>
                    {c.t}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--soft)", lineHeight: 1.5, marginTop: 1 }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div
              style={{
                fontFamily: "var(--font-newsreader), 'Newsreader', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--faint)",
              }}
            >
              No comments yet — be the first.
            </div>
          )}

          {/* Add comment */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a comment…"
              style={{
                flex: 1,
                border: "1.5px solid var(--line)",
                borderRadius: 22,
                padding: "9px 14px",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                background: "var(--card)",
                outline: "none",
                color: "var(--ink)",
              }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="lu-press"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: draft.trim() ? "none" : "1.5px solid var(--line)",
                background: draft.trim() ? "var(--pink)" : "var(--card)",
                color: draft.trim() ? "var(--cream)" : "var(--faint)",
                display: "grid",
                placeItems: "center",
                cursor: draft.trim() ? "pointer" : "not-allowed",
                flexShrink: 0,
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipPlayer({ mood, videoUrl }: { mood: Condition; videoUrl?: string }) {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4/5",
        overflow: "hidden",
        borderRadius: 10,
        background: "linear-gradient(180deg,var(--teal-deep) 0%,var(--teal) 100%)",
        border: "2px solid var(--ink)",
      }}
    >
      {started && videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          controls
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "var(--ink)" }}
        />
      ) : (
        <button
          onClick={() => setStarted(true)}
          style={{ position: "absolute", inset: 0, width: "100%", border: "none", cursor: "pointer", background: "transparent", padding: 0 }}
          aria-label="Play clip"
        >
          <svg viewBox="0 0 100 125" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {[0, 1, 2, 3, 4].map((n) => (
              <path
                key={n}
                d={`M 0 ${50 + n * 12} Q 25 ${36 + n * 12} 50 ${52 + n * 12} T 100 ${44 + n * 12}`}
                fill="none"
                stroke="rgba(243,232,210,.4)"
                strokeWidth="0.7"
                style={started ? { animation: `pulse 1.6s ease infinite`, animationDelay: n * 0.2 + "s" } : {}}
              />
            ))}
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <span
              className="lu-press"
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "var(--cream)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,.4)",
                border: "3px solid var(--ink)",
              }}
            >
              <Play size={22} color="var(--ink)" fill="var(--ink)" style={{ marginLeft: 3 }} />
            </span>
          </span>
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 8.5,
              color: "var(--cream)",
              letterSpacing: 1,
              background: "rgba(42,31,21,.7)",
              padding: "3px 8px",
              borderRadius: 4,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {mood === "firing" ? "Firing" : "Clip"}
          </span>
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 9.5,
              color: "var(--cream)",
              letterSpacing: 1,
              background: "rgba(42,31,21,.7)",
              padding: "3px 8px",
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            0:14
          </span>
        </button>
      )}
    </div>
  );
}
