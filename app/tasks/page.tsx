import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TaskCard from "./TaskCard";


export default async function MyTasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  const name = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Dashboard</a>
          <a href="/tasks/new"
            style={{ backgroundColor: "#F97316", color: "white", padding: "8px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            + Post task
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>
              My tasks
            </h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>
              {tasks?.length ? `${tasks.length} task${tasks.length > 1 ? "s" : ""} posted` : `Hey ${name}, post your first task to get started`}
            </p>
          </div>
          <a href="/tasks/new"
            style={{ backgroundColor: "#F97316", color: "white", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            + New task
          </a>
        </div>

        {!tasks?.length ? (
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 60, border: "1px solid #E7E5E4", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>No tasks yet</h2>
            <p style={{ fontSize: 15, color: "#78716C", maxWidth: 380, margin: "0 auto 28px" }}>
              Post your first task and runners in your city will send you their offers.
            </p>
            <a href="/tasks/new"
              style={{ backgroundColor: "#F97316", color: "white", padding: "12px 28px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Post a task — it&apos;s free →
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task as Parameters<typeof TaskCard>[0]["task"]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
