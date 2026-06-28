import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RequestPayoutButton from "./RequestPayoutButton";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function EarningsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase.from("profiles").select("full_name, role, email").eq("id", user.id).single();
  if (profile?.role !== "runner") redirect(`/${locale}/dashboard`);

  const { data: pendingPayout } = await supabase
    .from("payouts").select("id, amount, status, created_at").eq("runner_id", user.id).eq("status", "requested").maybeSingle();

  const { data: bids } = await supabase
    .from("bids")
    .select("id, task_id, amount, created_at")
    .eq("runner_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const taskIds = (bids ?? []).map(b => b.task_id);

  const [{ data: tasks }, { data: payments }] = await Promise.all([
    taskIds.length ? supabase.from("tasks").select("id, title, category, from_city, to_city, status, created_at").in("id", taskIds) : { data: [] },
    taskIds.length ? supabase.from("payments").select("task_id, amount, fee, runner_payout, status").in("task_id", taskIds) : { data: [] },
  ]);

  const taskMap = Object.fromEntries((tasks ?? []).map(t => [t.id, t]));
  const paymentMap = Object.fromEntries((payments ?? []).map(p => [p.task_id, p]));
  const jobs = (bids ?? []).map(b => ({ bid: b, task: taskMap[b.task_id] ?? null, payment: paymentMap[b.task_id] ?? null })).filter(j => j.task);

  const totalReleased = jobs.filter(j => j.payment?.status === "released").reduce((sum, j) => sum + (j.payment?.runner_payout ?? 0), 0);
  const totalEscrow = jobs.filter(j => j.payment?.status === "paid").reduce((sum, j) => sum + (j.payment?.runner_payout ?? 0), 0);
  const completedCount = jobs.filter(j => j.task?.status === "completed").length;
  const activeCount = jobs.filter(j => j.task?.status === "in_progress").length;

  const t = {
    earnings: isFr ? "Revenus" : "Earnings",
    subtitle: isFr ? "Vos paiements et historique." : "Your payouts and payment history.",
    totalEarned: isFr ? "Total gagné" : "Total earned",
    totalEarnedSub: isFr ? "CAD versé" : "CAD released to you",
    inEscrow: isFr ? "En séquestre" : "In escrow",
    inEscrowSub: isFr ? "En attente de confirmation" : "Held until task confirmed",
    jobsDone: isFr ? "Tâches complétées" : "Jobs completed",
    activeNow: (n: number) => isFr ? `${n} active${n > 1 ? "s" : ""} maintenant` : `${n} active now`,
    feeNote: isFr ? "Runly prend une commission de plateforme de 15% sur chaque tâche complétée. Les montants affichés reflètent votre paiement net après déduction des frais." : "Runly charges a 15% platform fee on each completed task. Amounts shown reflect your net payout after fee deduction.",
    payHistory: isFr ? "Historique des paiements" : "Payment history",
    noEarnings: isFr ? "Aucun revenu encore" : "No earnings yet",
    noEarningsDesc: isFr ? "Complétez votre première tâche pour commencer à gagner." : "Complete your first task to start earning.",
    browseTasks: isFr ? "Parcourir les tâches →" : "Browse tasks →",
    dashboard: isFr ? "Tableau de bord" : "Dashboard",
    browseCTA: isFr ? "Parcourir les tâches" : "Browse tasks",
    myJobs: isFr ? "Mes emplois" : "My jobs",
    paidOut: isFr ? "Payé" : "Paid out",
    inEscrowLabel: isFr ? "En séquestre" : "In escrow",
    pending: isFr ? "En attente" : "Pending",
    ofOffer: isFr ? "sur l'offre de" : "of",
    offer: isFr ? "offre" : "offer",
  };

  const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    released: { label: t.paidOut,       bg: "#F0FDF4", color: "#16A34A" },
    paid:     { label: t.inEscrowLabel, bg: "#EFF6FF", color: "#2563EB" },
    pending:  { label: t.pending,       bg: "#FFF7ED", color: "#EA580C" },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.dashboard}</a>
          <a href={`/${locale}/tasks/browse`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.browseCTA}</a>
          <a href={`/${locale}/jobs`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.myJobs}</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>{t.earnings}</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>{t.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard label={t.totalEarned} value={`$${totalReleased.toFixed(2)}`} sub={t.totalEarnedSub} color="#F97316" bg="#FFF7ED" />
          <StatCard label={t.inEscrow} value={`$${totalEscrow.toFixed(2)}`} sub={t.inEscrowSub} color="#2563EB" bg="#EFF6FF" />
          <StatCard label={t.jobsDone} value={String(completedCount)} sub={t.activeNow(activeCount)} color="#16A34A" bg="#F0FDF4" />
        </div>

        <div style={{ backgroundColor: "white", borderRadius: 12, padding: "14px 20px", border: "1px solid #E7E5E4", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>{t.feeNote}</p>
        </div>

        {totalReleased > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>
                  {isFr ? "Solde disponible" : "Available balance"}
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>${totalReleased.toFixed(2)} CAD</p>
                <p style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>
                  {isFr ? "Via Interac e-Transfer · 2 jours ouvrables" : "Via Interac e-Transfer · 2 business days"}
                </p>
              </div>
              {pendingPayout ? (
                <div style={{ backgroundColor: "#FFFBEB", borderRadius: 12, padding: "12px 18px", border: "1px solid #FDE68A" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>
                    ⏳ {isFr ? "Virement en cours de traitement" : "Payout being processed"}
                  </p>
                  <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 2 }}>${pendingPayout.amount.toFixed(2)} CAD</p>
                </div>
              ) : (
                <RequestPayoutButton available={totalReleased} defaultEmail={profile?.email || user.email || ""} isFr={isFr} />
              )}
            </div>
          </div>
        )}

        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1C1917", marginBottom: 16 }}>{t.payHistory}</h2>

        {jobs.length === 0 ? (
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 60, border: "1px solid #E7E5E4", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{t.noEarnings}</h2>
            <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24 }}>{t.noEarningsDesc}</p>
            <a href={`/${locale}/tasks/browse`} style={{ backgroundColor: "#F97316", color: "white", padding: "12px 24px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              {t.browseTasks}
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map(({ bid, task, payment }) => {
              const payout = payment?.runner_payout ?? bid.amount * 0.85;
              const payStatus = payment?.status ?? "pending";
              const taskStatus = task.status;
              const statusConfig = statusMap[payStatus] ?? { label: payStatus, bg: "#F5F4F2", color: "#78716C" };

              return (
                <a key={bid.id} href={`/${locale}/tasks/${bid.task_id}`} style={{ textDecoration: "none" }}>
                  <div style={{ backgroundColor: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #E7E5E4", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>● {statusConfig.label}</span>
                        <span style={{ fontSize: 12, color: "#A8A29E" }}>{task.category}</span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", margin: "0 0 4px" }}>{task.title}</p>
                      <p style={{ fontSize: 13, color: "#78716C", margin: 0 }}>
                        📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}
                        <span style={{ marginLeft: 12 }}>{timeAgo(bid.created_at)}</span>
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: taskStatus === "completed" ? "#16A34A" : "#F97316" }}>${payout.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: "#A8A29E" }}>{t.ofOffer} ${bid.amount.toFixed(2)} {t.offer}</div>
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

function StatCard({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div style={{ backgroundColor: bg, borderRadius: 16, padding: "20px 24px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-1px", marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#78716C" }}>{sub}</p>
    </div>
  );
}
