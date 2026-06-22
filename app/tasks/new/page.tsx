"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const CITIES = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg", "Other"];

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

export default function NewTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    from_city: "",
    to_city: "",
    budget: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: err } = await supabase.from("tasks").insert({
      poster_id: user.id,
      title: form.title,
      description: form.description || null,
      category: form.category,
      from_city: form.from_city,
      to_city: form.to_city || null,
      budget: parseFloat(form.budget),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      status: "open",
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push("/tasks");
    router.refresh();
  };

  const isValid = form.title && form.category && form.from_city && form.budget;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </a>
        <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>← Back to dashboard</a>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>Post a task</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>Describe what you need — runners in your city will send you their best offer.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626" }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What do you need done? *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => update("title", e.target.value)}
              placeholder='e.g. "Pick up flowers in Toronto for my mom"'
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"}
              onBlur={e => e.target.style.borderColor = "#E7E5E4"}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["Pick up a package", "Send a gift", "Grocery run", "Errand in the city"].map(s => (
                <button key={s} type="button" onClick={() => update("title", s)}
                  style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", border: "1px solid #E7E5E4", borderRadius: 999, padding: "4px 12px", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Category *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => update("category", cat.name)}
                  style={{
                    padding: "14px 8px",
                    borderRadius: 12,
                    border: `2px solid ${form.category === cat.name ? "#F97316" : "#E7E5E4"}`,
                    backgroundColor: form.category === cat.name ? "#FFF7ED" : "white",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: form.category === cat.name ? "#EA580C" : "#1C1917", lineHeight: 1.3 }}>{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Location *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>From city</label>
                <select value={form.from_city} onChange={e => update("from_city", e.target.value)} required
                  style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>
                  To city <span style={{ color: "#A8A29E" }}>(if delivery)</span>
                </label>
                <select value={form.to_city} onChange={e => update("to_city", e.target.value)}
                  style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">Same city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Budget & Deadline */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Budget & Deadline
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>Your budget (CAD) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#78716C", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={e => update("budget", e.target.value)}
                    placeholder="0.00"
                    required
                    min="5"
                    step="0.01"
                    style={{ ...inputStyle, paddingLeft: 28 }}
                    onFocus={e => e.target.style.borderColor = "#F97316"}
                    onBlur={e => e.target.style.borderColor = "#E7E5E4"}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {["20", "35", "50", "100"].map(v => (
                    <button key={v} type="button" onClick={() => update("budget", v)}
                      style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", border: "1px solid #E7E5E4", borderRadius: 999, padding: "3px 10px", cursor: "pointer" }}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>
                  Deadline <span style={{ color: "#A8A29E" }}>(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={e => update("deadline", e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#F97316"}
                  onBlur={e => e.target.style.borderColor = "#E7E5E4"}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Details <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update("description", e.target.value)}
              placeholder="Add any extra details that will help runners understand exactly what you need..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#F97316"}
              onBlur={e => e.target.style.borderColor = "#E7E5E4"}
            />
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/dashboard"
              style={{ flex: 1, padding: "14px", borderRadius: 12, backgroundColor: "white", color: "#1C1917", fontSize: 15, fontWeight: 600, border: "2px solid #E7E5E4", textDecoration: "none", textAlign: "center" }}>
              Cancel
            </a>
            <button
              type="submit"
              disabled={!isValid || loading}
              style={{
                flex: 2,
                padding: "14px",
                borderRadius: 12,
                backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316",
                color: "white",
                fontSize: 16,
                fontWeight: 700,
                border: "none",
                cursor: !isValid || loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}>
              {loading ? "Posting task..." : "Post task — it's free →"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#78716C" }}>
            Posting is free. Runners pay a small fee to send you their offer.
          </p>
        </form>
      </div>
    </div>
  );
}
