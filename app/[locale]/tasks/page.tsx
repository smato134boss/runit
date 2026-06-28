import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TaskCard from "./TaskCard";


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
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task as any} locale={locale} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
