import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function EarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "runner") redirect("/dashboard");

  // Get all accepted bids for this runner
  const { data: bids } = await supabase
    .from("bids")
    .select("id, task_id, amount, created_at")
    .eq("runner_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const taskIds = (bids ?? []).map(b => b.task_id);

  const [{ data: tasks }, { data: payments }] = await Promise.all([
    taskIds.length
      ? supabase.from("tasks").select("id, title, category, from_city, to_city, status, created_at").in("id", taskIds)
      : { data: [] },
    taskIds.length
      ? supabase.from("payments").select("task_id, amount, fee, runner_payout, status").in("task_id", taskIds)
      : { data: [] },
  ]);

  const taskMap = Object.fromEntries((tasks ?? []).map(t => [t.id, t]));
  const paymentMap = Object.fromEntries((payments ?? []).map(p => [p.task_id, p]));

  const jobs = (bids ?? [])
    .map(b => ({ bid: b, task: taskMap[b.task_id] ?? null, payment: paymentMap[b.task_id] ?? null }))
    .filter(j => j.task);

  const totalReleased = jobs
    .filter(j => j.payment?.status === "released")
    .reduce((sum, j) => sum + (j.payment?.runner_payout ?? 0), 0);

  const totalEscrow = jobs
    .filter(j => j.payment?.status === "paid")
    .reduce((sum, j) => sum + (j.payment?.runner_payout ?? 0), 0);

  const completedCount = jobs.filter(j => j.task?.status === "completed").length;
  const activeCount = jobs.filter(j => j.task?.status === "in_progress").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{
        backgroundColor: "white", borderBottom: "1px solid #E7E5E4",
        padding: "0 24px", height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Dashboard</a>
          <a href="/tasks/browse" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Browse tasks</a>
          <a href="/jobs" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>My jobs</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>
            Earnings
          </h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>Your payouts and payment history.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard
            label="Total earned"
            value={`$${totalReleased.toFixed(2)}`}
            sub="CAD released to you"
            color="#F97316"
            bg="#FFF7ED"
          />
          <StatCard
            label="In escrow"
            value={`$${totalEscrow.toFixed(2)}`}
            sub="Held until task confirmed"
            color="#2563EB"
            bg="#EFF6FF"
          />
          <StatCard
            label="Jobs completed"
            value={String(completedCount)}
            sub={`${activeCount} active now`}
            color="#16A34A"
            bg="#F0FDF4"
          />
        </div>

        {/* Platform fee note */}
        <div style={{
          backgroundColor: "white", borderRadius: 12, padding: "14px 20px",
          border: "1px solid #E7E5E4", marginBottom: 28,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
            Runly charges a <strong style={{ color: "#1C1917" }}>15% platform fee</strong> on each completed task.
            Amounts shown reflect your net payout after fee deduction.
          </p>
        </div>

        {/* History */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1C1917", marginBottom: 16 }}>Payment history</h2>

        {jobs.length === 0 ? (
          <div style={{
            backgroundColor: "white", borderRadius: 20, padding: 60,
            border: "1px solid #E7E5E4", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>No earnings yet</h2>
            <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24 }}>
              Complete your first task to start earning.
            </p>
            <a href="/tasks/browse" style={{
              backgroundColor: "#F97316", color: "white", padding: "12px 24px",
              borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-block",
            }}>
              Browse tasks →
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map(({ bid, task, payment }) => {
              const payout = payment?.runner_payout ?? bid.amount * 0.85;
              const payStatus = payment?.status ?? "pending";
              const taskStatus = task.status;

              const statusMap: Record<string, { label: string; bg: string; color: string }> = {
                released:  { label: "Paid out",   bg: "#F0FDF4", color: "#16A34A" },
                paid:      { label: "In escrow",  bg: "#EFF6FF", color: "#2563EB" },
                pending:   { label: "Pending",    bg: "#FFF7ED", color: "#EA580C" },
              };
              const statusConfig = statusMap[payStatus] ?? { label: payStatus, bg: "#F5F4F2", color: "#78716C" };

              return (
                <a key={bid.id} href={`/tasks/${bid.task_id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "white", borderRadius: 16, padding: "20px 24px",
                    border: "1px solid #E7E5E4", display: "flex",
                    alignItems: "center", justifyContent: "space-between", gap: 16,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{
                          backgroundColor: statusConfig.bg, color: statusConfig.color,
                          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                        }}>
                          ● {statusConfig.label}
                        </span>
                        <span style={{ fontSize: 12, color: "#A8A29E" }}>{task.category}</span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", margin: "0 0 4px" }}>
                        {task.title}
                      </p>
                      <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
                        📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}
                        <span style={{ marginLeft: 12 }}>{timeAgo(bid.created_at)}</span>
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: taskStatus === "completed" ? "#16A34A" : "#F97316" }}>
                        ${payout.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 12, color: "#A8A29E" }}>
                        of ${bid.amount.toFixed(2)} offer
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, bg }: {
  label: string; value: string; sub: string; color: string; bg: string;
}) {
  return (
    <div style={{ backgroundColor: bg, borderRadius: 16, padding: "20px 24px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-1px", marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: "#78716C" }}>{sub}</p>
    </div>
  );
}
