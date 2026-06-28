import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: "#F0FDF4", color: "#16A34A", label: "Open" },
  in_progress: { bg: "#FFF7ED", color: "#EA580C", label: "In progress" },
  completed:   { bg: "#F5F4F2", color: "#78716C", label: "Completed" },
  cancelled:   { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled" },
};

export default async function MyTasksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, bids(count)")
    .eq("poster_id", user.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, city")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name?.split(" ")[0] || (isFr ? "vous" : "there");

  const t = {
    myTasks: isFr ? "Mes tâches" : "My tasks",
    posted: (n: number) => isFr ? `${n} tâche${n > 1 ? "s" : ""} publiée${n > 1 ? "s" : ""}` : `${n} task${n > 1 ? "s" : ""} posted`,
    firstTask: isFr ? `Salut ${name}, publiez votre première tâche pour commencer` : `Hey ${name}, post your first task to get started`,
    newTask: isFr ? "+ Nouvelle tâche" : "+ New task",
    postTask: isFr ? "+ Poster une tâche" : "+ Post task",
    noTasks: isFr ? "Aucune tâche encore" : "No tasks yet",
    noTasksDesc: isFr ? "Publiez votre première tâche et les coursiers de votre ville vous enverront leurs offres." : "Post your first task and runners in your city will send you their offers.",
    postFree: isFr ? "Poster une tâche — c'est gratuit →" : "Post a task — it's free →",
    dashboard: isFr ? "Tableau de bord" : "Dashboard",
    noOffers: isFr ? "Aucune offre" : "No offers yet",
    offers: (n: number) => isFr ? `${n} offre${n > 1 ? "s" : ""}` : `${n} offer${n > 1 ? "s" : ""}`,
    overdue: isFr ? "En retard" : "Overdue",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href={`/${locale}/dashboard`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.dashboard}</a>
          <a href={`/${locale}/tasks/new`}
            style={{ backgroundColor: "#F97316", color: "white", padding: "8px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            {t.postTask}
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>{t.myTasks}</h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>
              {tasks?.length ? t.posted(tasks.length) : t.firstTask}
            </p>
          </div>
          <a href={`/${locale}/tasks/new`}
            style={{ backgroundColor: "#F97316", color: "white", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            {t.newTask}
          </a>
        </div>

        {!tasks?.length ? (
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 60, border: "1px solid #E7E5E4", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{t.noTasks}</h2>
            <p style={{ fontSize: 15, color: "#78716C", maxWidth: 380, margin: "0 auto 28px" }}>{t.noTasksDesc}</p>
            <a href={`/${locale}/tasks/new`}
              style={{ backgroundColor: "#F97316", color: "white", padding: "12px 28px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              {t.postFree}
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tasks.map((task) => {
              const st = STATUS_STYLE[task.status] || STATUS_STYLE.open;
              const bidCount = (task.bids as { count: number }[])?.[0]?.count ?? 0;
              const deadline = task.deadline ? new Date(task.deadline) : null;
              const isOverdue = deadline && deadline < new Date() && task.status === "open";
              return (
                <a key={task.id} href={`/${locale}/tasks/${task.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.1)"; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ backgroundColor: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{st.label}</span>
                          <span style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", padding: "3px 10px", borderRadius: 999 }}>{task.category}</span>
                          {isOverdue && <span style={{ fontSize: 12, color: "#DC2626", backgroundColor: "#FEF2F2", padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>{t.overdue}</span>}
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", marginBottom: 6 }}>{task.title}</h3>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "#78716C" }}>📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}</span>
                          {deadline && (
                            <span style={{ fontSize: 13, color: isOverdue ? "#DC2626" : "#78716C" }}>
                              ⏰ {deadline.toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316", marginBottom: 4 }}>${task.budget.toFixed(0)}</div>
                        <div style={{ fontSize: 13, color: bidCount > 0 ? "#16A34A" : "#78716C", fontWeight: bidCount > 0 ? 600 : 400 }}>
                          {bidCount > 0 ? t.offers(bidCount) : t.noOffers}
                        </div>
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
