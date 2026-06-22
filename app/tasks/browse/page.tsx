"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CITIES = ["All cities", "Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg"];
const CATEGORIES = ["All", "Delivery & Pickup", "Grocery Shopping", "Send a Gift", "Home Tasks", "Rides & Transport", "Admin & Errands", "Pet Care", "Online Tasks"];

type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  from_city: string;
  to_city: string | null;
  budget: number;
  deadline: string | null;
  created_at: string;
  poster_id: string;
  profiles?: { full_name: string; rating: number; reviews_count: number } | null;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function BrowsePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("All cities");
  const [catFilter, setCatFilter] = useState("All");
  const [myBids, setMyBids] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      // Load my existing bids
      const { data: bids } = await supabase.from("bids").select("task_id").eq("runner_id", user.id);
      if (bids) setMyBids(new Set(bids.map(b => b.task_id)));

      fetchTasks(user.id);
    };
    init();
  }, []);

  const fetchTasks = async (uid?: string) => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("tasks")
      .select("*")
      .eq("status", "open")
      .neq("poster_id", uid || userId || "")
      .order("created_at", { ascending: false });

    if (cityFilter !== "All cities") query = query.eq("from_city", cityFilter);
    if (catFilter !== "All") query = query.eq("category", catFilter);

    const { data } = await query;
    setTasks((data as Task[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchTasks();
  }, [cityFilter, catFilter]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Dashboard</a>
          <a href="/jobs" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>My jobs</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 4 }}>Browse tasks</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>Find tasks near you and send your best offer.</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: 999, border: "2px solid #E7E5E4", fontSize: 14, color: "#1C1917", backgroundColor: "white", cursor: "pointer", appearance: "none" as const }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `2px solid ${catFilter === cat ? "#F97316" : "#E7E5E4"}`,
                  backgroundColor: catFilter === cat ? "#FFF7ED" : "white",
                  color: catFilter === cat ? "#EA580C" : "#78716C",
                  fontSize: 13,
                  fontWeight: catFilter === cat ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#78716C" }}>Loading tasks...</div>
        ) : !tasks.length ? (
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 60, border: "1px solid #E7E5E4", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>No tasks found</h2>
            <p style={{ fontSize: 14, color: "#78716C" }}>Try changing city or category filters.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tasks.map(task => {
              const alreadyBid = myBids.has(task.id);
              const deadline = task.deadline ? new Date(task.deadline) : null;

              return (
                <div key={task.id} style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: `2px solid ${alreadyBid ? "#BBF7D0" : "#E7E5E4"}`, transition: "all 0.2s" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", padding: "3px 10px", borderRadius: 999 }}>{task.category}</span>
                        <span style={{ fontSize: 12, color: "#A8A29E" }}>{timeAgo(task.created_at)}</span>
                        {alreadyBid && <span style={{ fontSize: 12, color: "#16A34A", backgroundColor: "#F0FDF4", padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>✓ Offer sent</span>}
                      </div>

                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{task.title}</h3>

                      {task.description && (
                        <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.5, marginBottom: 10 }}>
                          {task.description.length > 120 ? task.description.slice(0, 120) + "..." : task.description}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: "#78716C" }}>
                          📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}
                        </span>
                        {deadline && (
                          <span style={{ fontSize: 13, color: deadline < new Date() ? "#DC2626" : "#78716C" }}>
                            ⏰ {deadline.toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        {task.profiles && (
                          <span style={{ fontSize: 13, color: "#78716C" }}>
                            👤 {task.profiles.full_name}
                            {task.profiles.reviews_count > 0 && ` · ${task.profiles.rating.toFixed(1)}★`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#F97316" }}>
                        ${task.budget.toFixed(0)}
                      </div>
                      <a href={`/tasks/${task.id}`}
                        style={{
                          backgroundColor: alreadyBid ? "#F5F4F2" : "#F97316",
                          color: alreadyBid ? "#78716C" : "white",
                          padding: "10px 18px",
                          borderRadius: 999,
                          fontSize: 14,
                          fontWeight: 700,
                          textDecoration: "none",
                          whiteSpace: "nowrap" as const,
                          transition: "all 0.15s",
                        }}>
                        {alreadyBid ? "View offer" : "Place offer →"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
