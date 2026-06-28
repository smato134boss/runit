"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkSentButton({ payoutId, runnerId, amount, runnerEmail, runnerName }: {
  payoutId: string; runnerId: string; amount: number; runnerEmail: string; runnerName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const markSent = async () => {
    setLoading(true);
    await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId, runnerId, amount, runnerEmail, runnerName }),
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 700 }}>✓ Marked as sent</span>;

  return (
    <button onClick={markSent} disabled={loading}
      style={{ padding: "10px 20px", borderRadius: 10, backgroundColor: "#16A34A", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
      {loading ? "..." : "✓ Mark as sent"}
    </button>
  );
}
