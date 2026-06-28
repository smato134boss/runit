"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "poster" | "runner" | null;
const cities = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg", "Montréal", "Québec", "Laval", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isFr = locale === "fr";

  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const t = {
    alreadyAccount: isFr ? "Déjà un compte ?" : "Already have an account?",
    logIn: isFr ? "Se connecter" : "Log in",
    join: isFr ? "Rejoindre Runly" : "Join Runly",
    almostThere: (name: string) => isFr ? `Presque fini, ${name} ! 👋` : `Almost there, ${name}! 👋`,
    wantTo: isFr ? "Je veux..." : "I want to...",
    howUse: isFr ? "Comment voulez-vous utiliser Runly ?" : "How do you want to use Runly?",
    fewMore: isFr ? "Quelques détails supplémentaires" : "Just a few more details",
    poster: { title: isFr ? "Poster des tâches" : "Post tasks", desc: isFr ? "Faire faire des choses par quelqu'un près de moi" : "Get things done by someone nearby" },
    runner: { title: isFr ? "Exécuter des tâches" : "Run tasks", desc: isFr ? "Gagner de l'argent en aidant les gens dans ma ville" : "Earn money helping people in my city" },
    google: isFr ? "Continuer avec Google" : "Continue with Google",
    orEmail: isFr ? "ou s'inscrire par courriel" : "or sign up with email",
    fullName: isFr ? "Nom complet" : "Full name",
    email: isFr ? "Courriel" : "Email",
    continue: isFr ? "Continuer →" : "Continue →",
    password: isFr ? "Mot de passe" : "Password",
    passwordPlaceholder: isFr ? "Min. 8 caractères" : "Min. 8 characters",
    city: isFr ? "Votre ville" : "Your city",
    selectCity: isFr ? "Sélectionner votre ville" : "Select your city",
    phone: isFr ? "Téléphone" : "Phone",
    optional: isFr ? "(optionnel)" : "(optional)",
    phonePlaceholder: "+1 (416) 000-0000",
    joiningAs: isFr ? "Vous rejoignez en tant que :" : "Joining as:",
    posterLabel: isFr ? "Posteur de tâches" : "Task Poster",
    runnerLabel: isFr ? "Coursier" : "Runner",
    switchAnytime: isFr ? "Vous pouvez changer à tout moment dans les paramètres" : "You can switch anytime in settings",
    termsText: isFr
      ? "Je comprends que Runly est un intermédiaire de marché uniquement et ne fournit ni ne garantit aucun service. Toutes les tâches sont effectuées par des utilisateurs indépendants. J'accepte les"
      : "I understand that Runly is a marketplace intermediary only and does not provide or guarantee any services. All tasks are performed by independent users. I agree to the",
    termsLink: isFr ? "Conditions d'utilisation" : "Terms of Service",
    and: isFr ? "et la" : "and",
    privacyLink: isFr ? "Politique de confidentialité" : "Privacy Policy",
    back: isFr ? "← Retour" : "← Back",
    create: isFr ? "Créer un compte 🎉" : "Create account 🎉",
    creating: isFr ? "Création en cours..." : "Creating account...",
    disclaimer: isFr ? "Runly est un intermédiaire de marché. Les services sont fournis par des utilisateurs indépendants." : "Runly is a marketplace intermediary. Services are provided by independent users.",
    checkEmail: isFr ? "Vérifiez votre courriel" : "Check your email",
    emailSentTo: isFr ? "Nous avons envoyé un lien de confirmation à" : "We sent a confirmation link to",
    clickLink: isFr ? "Cliquez sur le lien dans l'e-mail pour activer votre compte. Vérifiez vos spams si vous ne le voyez pas." : "Click the link in the email to activate your account. Check your spam folder if you don't see it.",
    goToLogin: isFr ? "Aller à la connexion →" : "Go to login →",
    phoneError: isFr ? "Veuillez entrer un numéro de téléphone canadien valide, ex. +1 (416) 000-0000" : "Please enter a valid Canadian phone number, e.g. +1 (416) 000-0000",
    phoneTaken: isFr ? "Ce numéro de téléphone est déjà enregistré. Veuillez en utiliser un autre." : "This phone number is already registered. Please use a different number.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (form.phone && !/^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(form.phone.trim())) {
      setError(t.phoneError);
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: form.name, role, city: form.city, phone: form.phone },
      },
    });

    if (signUpError) {
      const msg = signUpError.message;
      const code = (signUpError as any).code || (signUpError as any).status || "";
      const display = (msg && msg !== "{}" && msg !== "[object Object]") ? msg : code ? `Error ${code}` : "Registration failed. Please try again.";
      setError(display);
      setLoading(false);
      return;
    }

    if (data.user) {
      const normalizedPhone = form.phone.trim() || null;
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.name,
        email: form.email,
        role,
        city: form.city,
        phone: normalizedPhone,
      }, { onConflict: "id" });

      if (profileError?.code === "23505") {
        setError(t.phoneTaken);
        setLoading(false);
        return;
      }

      if (profileError) {
        setError(isFr ? "Erreur lors de la création du profil. Veuillez réessayer." : "Error creating profile. Please try again.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "2px solid #E7E5E4",
    fontSize: 15,
    color: "#1C1917",
    backgroundColor: "#FAFAF8",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  const canProceed = form.name && form.email && role;

  if (emailSent) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>📬</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 12 }}>{t.checkEmail}</h1>
          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.6, marginBottom: 8 }}>{t.emailSentTo}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#F97316", marginBottom: 24 }}>{form.email}</p>
          <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>{t.clickLink}</p>
          <Link href={`/${locale}/login`} style={{ display: "inline-block", backgroundColor: "#F97316", color: "white", padding: "14px 32px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            {t.goToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </Link>
        <span style={{ fontSize: 14, color: "#78716C" }}>
          {t.alreadyAccount}{" "}
          <Link href={`/${locale}/login`} style={{ color: "#F97316", fontWeight: 600, textDecoration: "none" }}>{t.logIn}</Link>
        </span>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
              {step === 1 ? t.join : t.almostThere(form.name.split(" ")[0] || "")}
            </h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>
              {step === 1 ? t.howUse : t.fewMore}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s === step ? 24 : 8, height: 8, borderRadius: 999, backgroundColor: s <= step ? "#F97316" : "#E7E5E4", transition: "all 0.3s" }} />
            ))}
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 40, border: "1px solid #E7E5E4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {error && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <div>
                <button
                  onClick={handleGoogle}
                  style={{ width: "100%", padding: "12px 20px", borderRadius: 12, border: "2px solid #E7E5E4", backgroundColor: "white", fontSize: 15, fontWeight: 600, color: "#1C1917", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24, transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#1C1917"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E7E5E4"}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                  </svg>
                  {t.google}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
                  <span style={{ fontSize: 13, color: "#78716C", fontWeight: 500 }}>{t.orEmail}</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>{t.wantTo}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {([
                    { value: "poster" as Role, icon: "📋", ...t.poster },
                    { value: "runner" as Role, icon: "🏃", ...t.runner },
                  ] as { value: Role; icon: string; title: string; desc: string }[]).map(opt => (
                    <button
                      key={opt.value as string}
                      onClick={() => setRole(opt.value)}
                      style={{ padding: "20px 16px", borderRadius: 14, border: `2px solid ${role === opt.value ? "#F97316" : "#E7E5E4"}`, backgroundColor: role === opt.value ? "#FFF7ED" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "#FED7AA"; }}
                      onMouseLeave={e => { if (role !== opt.value) e.currentTarget.style.borderColor = "#E7E5E4"; }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>{opt.title}</div>
                      <div style={{ fontSize: 12, color: "#78716C", lineHeight: 1.4 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.fullName}</label>
                    <input type="text" value={form.name} onChange={e => updateForm("name", e.target.value)} placeholder="Alex Johnson" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.email}</label>
                    <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="you@example.com" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                </div>

                <button
                  onClick={() => { if (canProceed) setStep(2); }}
                  disabled={!canProceed}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, backgroundColor: !canProceed ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !canProceed ? "not-allowed" : "pointer", transition: "all 0.2s", marginTop: 20 }}
                  onMouseEnter={e => { if (canProceed) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                  onMouseLeave={e => { if (canProceed) e.currentTarget.style.backgroundColor = "#F97316"; }}>
                  {t.continue}
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.password}</label>
                  <input type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder={t.passwordPlaceholder} required minLength={8} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.city}</label>
                  <select value={form.city} onChange={e => updateForm("city", e.target.value)} required style={{ ...inputStyle, appearance: "none" as const }}>
                    <option value="">{t.selectCity}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>
                    {t.phone} <span style={{ color: "#78716C", fontWeight: 400 }}>{t.optional}</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)} placeholder={t.phonePlaceholder} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>

                <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{role === "poster" ? "📋" : "🏃"}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#EA580C" }}>{t.joiningAs} {role === "poster" ? t.posterLabel : t.runnerLabel}</p>
                    <p style={{ fontSize: 12, color: "#78716C" }}>{t.switchAnytime}</p>
                  </div>
                </div>

                <div style={{ backgroundColor: "#F5F4F2", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <input type="checkbox" id="terms-agree" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#F97316", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
                  <label htmlFor="terms-agree" style={{ fontSize: 13, color: "#44403C", lineHeight: 1.6, cursor: "pointer" }}>
                    {t.termsText}{" "}
                    <Link href={`/${locale}/terms`} target="_blank" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>{t.termsLink}</Link>
                    {" "}{t.and}{" "}
                    <Link href={`/${locale}/privacy`} target="_blank" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>{t.privacyLink}</Link>.
                  </label>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ flex: 1, padding: "14px", borderRadius: 12, backgroundColor: "white", color: "#1C1917", fontSize: 15, fontWeight: 600, border: "2px solid #E7E5E4", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#1C1917"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#E7E5E4"}>
                    {t.back}
                  </button>
                  <button type="submit" disabled={loading || !agreedToTerms}
                    style={{ flex: 2, padding: "14px", borderRadius: 12, backgroundColor: loading || !agreedToTerms ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: loading || !agreedToTerms ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { if (!loading && agreedToTerms) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                    onMouseLeave={e => { if (!loading && agreedToTerms) e.currentTarget.style.backgroundColor = "#F97316"; }}>
                    {loading ? t.creating : t.create}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#A8A29E", marginTop: 20 }}>{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
