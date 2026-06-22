"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Bid = { id: string; amount: number; message: string | null; status: string };

export default function BidForm({ taskId, budget, existingBid }: { taskId: string; budget: number; existingBid: Bid | null }) {
  const router = useRouter();
  const [amount, setAmount] = useState(existingBid ? String(existingBid.amount) : String(budget));
  const [message, setMessage] = useState(existingBid?.message || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    if (existingBid) {
      const { error: err } = await supabase
        .from("bids")
        .update({ amount: parseFloat(amount), message: message || null })
        .eq("id", existingBid.id);
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.from("bids").insert({
        task_id: taskId,
        runner_id: user.id,
        amount: parseFloat(amount),
        message: message || null,
        status: "pending",
      });
      if (err) { setError(err.message); setLoading(false); return; }
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  };

  if (success || (existingBid && existingBid.status === "accepted")) {
    return (
      <div style={{ backgroundColor: "#F0FDF4", borderRadius: 16, padding: 28, border: "2px solid #BBF7D0", textAlign: "center", position: "sticky", top: 80 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#16A34A", marginBottom: 6 }}>
          {existingBid?.status === "accepted" ? "Your offer was accepted!" : "Offer sent!"}
        </p>
        <p style={{ fontSize: 13, color: "#78716C" }}>
          {existingBid?.status === "accepted"
            ? "The poster chose you. Get it done and get paid."
            : "The poster will review your offer and get back to you."}
        </p>
        {existingBid?.status !== "accepted" && (
          <div style={{ marginTop: 16, padding: 14, backgroundColor: "white", borderRadius: 10, border: "1px solid #BBF7D0" }}>
            <p style={{ fontSize: 13, color: "#78716C" }}>Your offer: <strong style={{ color: "#1C1917" }}>${parseFloat(amount).toFixed(0)} CAD</strong></p>
          </div>
        )}
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "2px solid #E7E5E4",
    fontSize: 15,
    color: "#1C1917",
    backgroundColor: "#FAFAF8",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: 20, padding: 28, border: "1px solid #E7E5E4", position: "sticky", top: 80 }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>
        {existingBid ? "Update your offer" : "Send your offer"}
      </p>
      <p style={{ fontSize: 13, color: "#78716C", marginBottom: 20 }}>
        Budget: <strong style={{ color: "#F97316" }}>${budget.toFixed(0)} CAD</strong> — you can offer more or less.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Your price (CAD) *
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#78716C", fontWeight: 600 }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              style={{ ...inputStyle, paddingLeft: 28 }}
              onFocus={e => e.target.style.borderColor = "#F97316"}
              onBlur={e => e.target.style.borderColor = "#E7E5E4"}
            />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[budget * 0.8, budget, budget * 1.1].map(v => (
              <button key={v} type="button" onClick={() => setAmount(v.toFixed(0))}
                style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", border: "1px solid #E7E5E4", borderRadius: 999, padding: "3px 10px", cursor: "pointer" }}>
                ${v.toFixed(0)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Message <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell the poster why you're the right person for this task..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "#F97316"}
            onBlur={e => e.target.style.borderColor = "#E7E5E4"}
          />
        </div>

        <button type="submit" disabled={loading || !amount}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            backgroundColor: loading || !amount ? "#FED7AA" : "#F97316",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: loading || !amount ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
          {loading ? "Sending..." : existingBid ? "Update offer" : "Send offer →"}
        </button>

        <p style={{ fontSize: 12, color: "#A8A29E", textAlign: "center" }}>
          A small fee (C$2–5) will be charged from your balance for sending an offer.
        </p>
      </form>
    </div>
  );
}
