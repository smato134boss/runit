"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CITIES = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg", "Montréal", "Québec", "Laval", "Other"];

type Role = "poster" | "runner";

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const isFr = locale === "fr";

  const [role, setRole] = useState<Role | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = {
    title: isFr ? "Bienvenue sur Runly ! 👋" : "Welcome to Runly! 👋",
    subtitle: isFr ? "Dites-nous comment vous voulez utiliser Runly." : "Tell us how you'd like to use Runly.",
    wantTo: isFr ? "Je veux..." : "I want to...",
    poster: { title: isFr ? "Poster des tâches" : "Post tasks", desc: isFr ? "Faire faire des choses par quelqu'un près de moi" : "Get things done by someone nearby" },
    runner: { title: isFr ? "Exécuter des tâches" : "Run tasks", desc: isFr ? "Gagner de l'argent en aidant les gens dans ma ville" : "Earn money helping people in my city" },
    city: isFr ? "Votre ville" : "Your city",
    selectCity: isFr ? "Sélectionnez votre ville" : "Select your city",
    continue: isFr ? "Continuer →" : "Continue →",
    saving: isFr ? "Enregistrement..." : "Saving...",
  };

  const handleSubmit = async () => {
    if (!role || !city) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${locale}/login`); return; }

    const { error: err } = await supabase.from("profiles").update({ role, city }).eq("id", user.id);
    if (err) { setError(err.message); setLoading(false); return; }

    router.push(`/${locale}/dashboard`);
    router.refresh();
  };

  const isValid = role && city;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>{t.title}</h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>{t.subtitle}</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 40, border: "1px solid #E7E5E4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {error && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>{error}</div>
            )}

            <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>{t.wantTo}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              {([
                { value: "poster" as Role, icon: "📋", ...t.poster },
                { value: "runner" as Role, icon: "🏃", ...t.runner },
              ]).map(opt => (
                <button key={opt.value} onClick={() => setRole(opt.value)}
                  style={{ padding: "20px 16px", borderRadius: 14, border: `2px solid ${role === opt.value ? "#F97316" : "#E7E5E4"}`, backgroundColor: role === opt.value ? "#FFF7ED" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 8 }}>{t.city}</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: city ? "#1C1917" : "#A8A29E", backgroundColor: "#FAFAF8", outline: "none", appearance: "none", boxSizing: "border-box" as const }}>
                <option value="">{t.selectCity}</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={handleSubmit} disabled={!isValid || loading}
              style={{ width: "100%", padding: "14px", borderRadius: 12, backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer" }}>
              {loading ? t.saving : t.continue}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
