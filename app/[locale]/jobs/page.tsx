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

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_progress: { bg: "#FFF7ED", color: "#EA580C", label: "In progress" },
  completed:   { bg: "#F0FDF4", color: "#16A34A", label: "Completed" },
  cancelled:   { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled" },
  open:        { bg: "#F0FDF4", color: "#16A34A", label: "Open" },
};

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: bids } = await supabase
    .from("bids")
    .select("id, task_id, amount, status, created_at")
    .eq("runner_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const taskIds = (bids ?? []).map(b => b.task_id);
  const { data: tasks } = taskIds.length
    ? await supabase.from("tasks").select("id, title, category, from_city, to_city, budget, deadline, status, created_at").in("id", taskIds)
    : { data: [] };

  const taskMap = Object.fromEntries((tasks ?? []).map(t => [t.id, t]));
  const jobs = (bids ?? []).map(b => ({ ...b, task: taskMap[b.task_id] ?? null })).filter(b => b.task);

  const t = {
    myJobs: isFr ? "Mes emplois" : "My jobs",
    subtitle: isFr ? "Les tâches que vous effectuez ou avez complétées." : "Tasks you're currently running or have completed.",
    noJobs: isFr ? "Aucun emploi actif" : "No active jobs yet",
    noJobsDesc: isFr ? "Parcourez les tâches et envoyez votre première offre." : "Browse tasks and send your first offer.",
    browseTasks: isFr ? "Parcourir les tâches →" : "Browse tasks →",
    dashboard: isFr ? "Tableau de bord" : "Dashboard",
    browseCTA: isFr ? "Parcourir les tâches" : "Browse tasks",
    yourOffer: isFr ? "votre offre" : "your offer",
    chatOpen: isFr ? "💬 Chat ouvert" : "💬 Chat open",
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
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>{t.myJobs}</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>{t.subtitle}</p>
        </div>

        {jobs.length === 0 ? (
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 60, border: "1px solid #E7E5E4", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏃</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{t.noJobs}</h2>
            <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24 }}>{t.noJobsDesc}</p>
            <a href={`/${locale}/tasks/browse`}
              style={{ backgroundColor: "#F97316", color: "white", padding: "12px 24px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              {t.browseTasks}
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {jobs.map(bid => {
              const task = bid.task;
              const st = STATUS_STYLE[task.status] || STATUS_STYLE.in_progress;
              const deadline = task.deadline ? new Date(task.deadline) : null;

              return (
                <a key={bid.id} href={`/${locale}/tasks/${task.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "2px solid #E7E5E4", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ backgroundColor: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>● {st.label}</span>
                          <span style={{ fontSize: 12, color: "#A8A29E" }}>{task.category}</span>
                          <span style={{ fontSize: 12, color: "#A8A29E" }}>{timeAgo(task.created_at)}</span>
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{task.title}</h3>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "#78716C" }}>📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}</span>
                          {deadline && (
                            <span style={{ fontSize: 13, color: deadline < new Date() && task.status !== "completed" ? "#DC2626" : "#78716C" }}>
                              ⏰ {deadline.toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#F97316", marginBottom: 4 }}>${bid.amount.toFixed(0)}</div>
                        <div style={{ fontSize: 12, color: "#78716C" }}>{t.yourOffer}</div>
                        {task.status === "in_progress" && <div style={{ marginTop: 8, fontSize: 12, color: "#F97316", fontWeight: 600 }}>{t.chatOpen}</div>}
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
