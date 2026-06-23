"use client";

import { useState } from "react";

export default function AcceptBidButton({ bidId, taskId, runnerId, amount }: { bidId: string; taskId: string; runnerId: string; amount: number }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidId, taskId }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  };

  return (
    <button onClick={handleAccept} disabled={loading}
      style={{
        marginTop: 10,
        padding: "8px 18px",
        borderRadius: 999,
        backgroundColor: loading ? "#FED7AA" : "#F97316",
        color: "white",
        fontSize: 13,
        fontWeight: 700,
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.15s",
      }}>
      {loading ? "Redirecting to payment..." : `✓ Accept & Pay C$${amount.toFixed(0)}`}
    </button>
  );
}
