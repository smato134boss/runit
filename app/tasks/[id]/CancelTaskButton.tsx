"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CancelTaskButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancel = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("tasks").update({ status: "cancelled" }).eq("id", taskId);
    router.refresh();
  };

  if (confirming) {
    return (
      <div style={{ marginTop: 12, backgroundColor: "#FEF2F2", borderRadius: 10, padding: "12px 16px", border: "1px solid #FECACA" }}>
        <p style={{ fontSize: 13, color: "#DC2626", fontWeight: 600, marginBottom: 10 }}>Cancel this task?</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setConfirming(false)}
            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #E7E5E4", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#78716C", cursor: "pointer" }}>
            Keep it
          </button>
          <button onClick={cancel} disabled={loading}
            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", backgroundColor: "#DC2626", fontSize: 13, fontWeight: 700, color: "white", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Cancelling..." : "Yes, cancel"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 10, border: "1px solid #FECACA", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#DC2626", cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; }}>
      Cancel task
    </button>
  );
}
