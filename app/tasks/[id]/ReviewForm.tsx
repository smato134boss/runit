"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({
  taskId,
  revieweeId,
  revieweeName,
}: {
  taskId: string;
  revieweeId: string;
  revieweeName: string;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  if (done) {
    return (
      <div style={{
        backgroundColor: "#F0FDF4", borderRadius: 16, padding: 24,
        border: "1px solid #BBF7D0", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#15803D", margin: 0 }}>
          Review submitted!
        </p>
      </div>
    );
  }

  async function submit() {
    if (!rating) return;
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, revieweeId, rating, comment }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  const active = hovered || rating;

  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>
        Leave a review
      </p>
      <p style={{ fontSize: 14, color: "#44403C", marginBottom: 16 }}>
        How was your experience with <strong>{revieweeName}</strong>?
      </p>

      {/* Star picker */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            onClick={() => setRating(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            style={{
              fontSize: 32, background: "none", border: "none",
              cursor: "pointer", padding: 0, lineHeight: 1,
              color: i <= active ? "#F97316" : "#E7E5E4",
              transition: "color 0.1s",
            }}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span style={{ fontSize: 13, color: "#78716C", alignSelf: "center", marginLeft: 6 }}>
            {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        maxLength={500}
        rows={3}
        style={{
          width: "100%", border: "1.5px solid #E7E5E4", borderRadius: 10,
          padding: "10px 14px", fontSize: 14, color: "#1C1917",
          resize: "vertical", fontFamily: "inherit", outline: "none",
          boxSizing: "border-box", backgroundColor: "#FAFAF8", marginBottom: 14,
        }}
      />

      <button
        onClick={submit}
        disabled={!rating || loading}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 999,
          backgroundColor: !rating || loading ? "#FED7AA" : "#F97316",
          color: "white", fontSize: 14, fontWeight: 700,
          border: "none", cursor: !rating || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}
