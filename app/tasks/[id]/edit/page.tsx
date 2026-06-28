"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { icon: "📦", name: "Delivery & Pickup" },
  { icon: "🛒", name: "Grocery Shopping" },
  { icon: "💐", name: "Send a Gift" },
  { icon: "🏠", name: "Home Tasks" },
  { icon: "🚗", name: "Rides & Transport" },
  { icon: "📋", name: "Admin & Errands" },
  { icon: "🐾", name: "Pet Care" },
  { icon: "💻", name: "Online Tasks" },
];

const CITIES = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg", "Montréal", "Québec", "Laval", "Other"];

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "2px solid #E7E5E4",
  fontSize: 15,
  color: "#1C1917",
  backgroundColor: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box" as const,
};

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [form, setForm] = useState({ title: "", description: "", category: "", from_city: "", to_city: "", budget: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).single();
      if (!task || task.poster_id !== user.id) { router.push("/tasks"); return; }
      if (task.status !== "open") { router.push(`/tasks/${taskId}`); return; }

      setForm({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        from_city: task.from_city || "",
        to_city: task.to_city || "",
        budget: task.budget?.toString() || "",
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
      });
      setFetching(false);
    };
    load();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.from("tasks").update({
      title: form.title,
      description: form.description || null,
      category: form.category,
      from_city: form.from_city,
      to_city: form.to_city || null,
      budget: parseFloat(form.budget),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }).eq("id", taskId);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push(`/tasks/${taskId}`);
    router.refresh();
  };

  const isValid = form.title && form.category && form.from_city && form.budget;

  if (fetching) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#78716C" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href={`/tasks/${taskId}`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>← Back to task</a>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>Edit task</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>Update your task details. Changes are visible to runners immediately.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626" }}>{error}</div>
          )}

          {/* Title */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What do you need done? *
            </label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          {/* Category */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Category *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.name} type="button" onClick={() => update("category", cat.name)}
                  style={{ padding: "14px 8px", borderRadius: 12, border: `2px solid ${form.category === cat.name ? "#F97316" : "#E7E5E4"}`, backgroundColor: form.category === cat.name ? "#FFF7ED" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: form.category === cat.name ? "#EA580C" : "#1C1917", lineHeight: 1.3 }}>{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Location *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>From city</label>
                <select value={form.from_city} onChange={e => update("from_city", e.target.value)} required style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>To city <span style={{ color: "#A8A29E" }}>(if delivery)</span></label>
                <select value={form.to_city} onChange={e => update("to_city", e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">Same city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Budget & Deadline */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Budget & Deadline</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>Your budget (CAD) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#78716C", fontWeight: 600 }}>$</span>
                  <input type="number" value={form.budget} onChange={e => update("budget", e.target.value)} required min="5" step="0.01"
                    style={{ ...inputStyle, paddingLeft: 28 }} onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>Deadline <span style={{ color: "#A8A29E" }}>(optional)</span></label>
                <input type="datetime-local" value={form.deadline} onChange={e => update("deadline", e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Details <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4}
              placeholder="Add any extra details..."
              style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href={`/tasks/${taskId}`}
              style={{ flex: 1, padding: "14px", borderRadius: 12, backgroundColor: "white", color: "#1C1917", fontSize: 15, fontWeight: 600, border: "2px solid #E7E5E4", textDecoration: "none", textAlign: "center" }}>
              Cancel
            </a>
            <button type="submit" disabled={!isValid || loading}
              style={{ flex: 2, padding: "14px", borderRadius: 12, backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
              {loading ? "Saving..." : "Save changes →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
