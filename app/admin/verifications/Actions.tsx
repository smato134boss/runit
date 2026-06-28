"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const approve = async () => {
    setLoading(true);
    await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "verify" }),
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 700 }}>✓ Approved</span>;

  return (
    <button onClick={approve} disabled={loading}
      style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "#16A34A", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
      {loading ? "..." : "✓ Approve"}
    </button>
  );
}

export function RejectButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const reject = async () => {
    setLoading(true);
    await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: "reject", reason }),
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  if (done) return <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 700 }}>✗ Rejected</span>;

  if (confirming) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)"
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E7E5E4", fontSize: 13 }} />
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setConfirming(false)}
            style={{ flex: 1, padding: "6px", borderRadius: 6, border: "1px solid #E7E5E4", backgroundColor: "white", fontSize: 12, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={reject} disabled={loading}
            style={{ flex: 1, padding: "6px", borderRadius: 6, backgroundColor: "#DC2626", color: "white", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
            {loading ? "..." : "Confirm reject"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "white", color: "#DC2626", fontSize: 13, fontWeight: 700, border: "1px solid #FECACA", cursor: "pointer" }}>
      ✗ Reject
    </button>
  );
}
