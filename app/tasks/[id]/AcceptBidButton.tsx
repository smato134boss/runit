"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AcceptBidButton({ bidId, taskId, runnerId }: { bidId: string; taskId: string; runnerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    const supabase = createClient();

    // Accept this bid
    await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId);

    // Reject all other bids for this task
    await supabase.from("bids").update({ status: "rejected" }).eq("task_id", taskId).neq("id", bidId);

    // Move task to in_progress
    await supabase.from("tasks").update({ status: "in_progress", runner_id: runnerId }).eq("id", taskId);

    router.refresh();
    setLoading(false);
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
      {loading ? "Accepting..." : "✓ Accept this offer"}
    </button>
  );
}
