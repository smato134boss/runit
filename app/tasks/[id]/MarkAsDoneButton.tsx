"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MarkAsDoneButton({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  if (!confirmed) {
    return (
      <button onClick={() => setConfirmed(true)}
        style={{
          marginTop: 12, width: "100%", padding: "12px 0", borderRadius: 999,
          backgroundColor: "#16A34A", color: "white", fontSize: 14,
          fontWeight: 700, border: "none", cursor: "pointer",
        }}>
        ✓ Mark as done
      </button>
    );
  }

  return (
    <div style={{ marginTop: 12, backgroundColor: "#F0FDF4", borderRadius: 12, padding: 16, border: "1px solid #BBF7D0" }}>
      <p style={{ fontSize: 13, color: "#15803D", fontWeight: 600, marginBottom: 12 }}>
        Confirm the task is completed and release payment to runner?
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={loading} onClick={async () => {
          setLoading(true);
          const supabase = createClient();
          await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId);
          await supabase.from("payments").update({ status: "released" }).eq("task_id", taskId);
          router.refresh();
        }}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 999,
            backgroundColor: loading ? "#BBF7D0" : "#16A34A",
            color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer",
          }}>
          {loading ? "Processing..." : "Yes, release payment"}
        </button>
        <button onClick={() => setConfirmed(false)}
          style={{
            padding: "10px 16px", borderRadius: 999, border: "1px solid #E7E5E4",
            background: "white", fontSize: 13, color: "#78716C", cursor: "pointer",
          }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
