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

const T = {
  en: {
    title: "Edit task",
    subtitle: "Update your task details. Changes are visible to runners immediately.",
    whatNeeded: "What do you need done?",
    category: "Category",
    location: "Location",
    fromCity: "From city",
    toCity: "To city",
    ifDelivery: "(if delivery)",
    selectCity: "Select city",
    sameCity: "Same city",
    budgetDeadline: "Budget & Deadline",
    budget: "Your budget (CAD)",
    deadline: "Deadline",
    optional: "(optional)",
    details: "Details",
    moreDetails: "Add any extra details...",
    cancel: "Cancel",
    save: "Save changes →",
    saving: "Saving...",
    backToTask: "← Back to task",
    loading: "Loading...",
  },
  fr: {
    title: "Modifier la tâche",
    subtitle: "Mettez à jour les détails. Les changements sont visibles immédiatement.",
    whatNeeded: "Que faut-il faire?",
    category: "Catégorie",
    location: "Localisation",
    fromCity: "Ville de départ",
    toCity: "Ville de destination",
    ifDelivery: "(si livraison)",
    selectCity: "Choisir une ville",
    sameCity: "Même ville",
    budgetDeadline: "Budget et délai",
    budget: "Votre budget (CAD)",
    deadline: "Date limite",
    optional: "(optionnel)",
    details: "Détails",
    moreDetails: "Ajoutez des détails...",
    cancel: "Annuler",
    save: "Enregistrer →",
    saving: "Enregistrement...",
    backToTask: "← Retour à la tâche",
    loading: "Chargement...",
  },
};

export default function EditTaskLocalePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const taskId = params.id as string;
  const t = T[locale as "en" | "fr"] ?? T.en;

  const [form, setForm] = useState({ title: "", description: "", category: "", from_city: "", to_city: "", budget: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/login`); return; }

      const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).single();
      if (!task || task.poster_id !== user.id) { router.push(`/${locale}/tasks`); return; }
      if (task.status !== "open") { router.push(`/${locale}/tasks/${taskId}`); return; }

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
  }, [taskId, locale]);

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

    router.push(`/${locale}/tasks/${taskId}`);
    router.refresh();
  };

  const isValid = form.title && form.category && form.from_city && form.budget;

  if (fetching) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#78716C" }}>{t.loading}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href={`/${locale}/tasks/${taskId}`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.backToTask}</a>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>{t.title}</h1>
          <p style={{ fontSize: 15, color: "#78716C" }}>{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626" }}>{error}</div>
          )}

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.whatNeeded} *
            </label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.category} *</label>
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

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.location} *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>{t.fromCity}</label>
                <select value={form.from_city} onChange={e => update("from_city", e.target.value)} required style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">{t.selectCity}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>{t.toCity} <span style={{ color: "#A8A29E" }}>{t.ifDelivery}</span></label>
                <select value={form.to_city} onChange={e => update("to_city", e.target.value)} style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="">{t.sameCity}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.budgetDeadline}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>{t.budget} *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#78716C", fontWeight: 600 }}>$</span>
                  <input type="number" value={form.budget} onChange={e => update("budget", e.target.value)} required min="5" step="0.01"
                    style={{ ...inputStyle, paddingLeft: 28 }} onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#78716C", fontWeight: 500, display: "block", marginBottom: 6 }}>{t.deadline} <span style={{ color: "#A8A29E" }}>{t.optional}</span></label>
                <input type="datetime-local" value={form.deadline} onChange={e => update("deadline", e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.details} <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>{t.optional}</span>
            </label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4}
              placeholder={t.moreDetails}
              style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href={`/${locale}/tasks/${taskId}`}
              style={{ flex: 1, padding: "14px", borderRadius: 12, backgroundColor: "white", color: "#1C1917", fontSize: 15, fontWeight: 600, border: "2px solid #E7E5E4", textDecoration: "none", textAlign: "center" }}>
              {t.cancel}
            </a>
            <button type="submit" disabled={!isValid || loading}
              style={{ flex: 2, padding: "14px", borderRadius: 12, backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
              {loading ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
