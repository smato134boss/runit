"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/dashboard`);
      router.refresh();
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
    });
    setForgotLoading(false);
    if (error) {
      setForgotError(error.message);
    } else {
      setForgotSent(true);
    }
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const isFr = locale === "fr";
  const t = {
    noAccount: isFr ? "Pas encore de compte ?" : "Don't have an account?",
    signUp: isFr ? "S'inscrire" : "Sign up",
    welcome: isFr ? "Bon retour" : "Welcome back",
    subtitle: isFr ? "Connectez-vous à votre compte Runly" : "Log in to your Runly account",
    google: isFr ? "Continuer avec Google" : "Continue with Google",
    or: isFr ? "ou" : "or",
    email: isFr ? "Courriel" : "Email",
    password: isFr ? "Mot de passe" : "Password",
    forgot: isFr ? "Mot de passe oublié ?" : "Forgot password?",
    submit: isFr ? "Se connecter →" : "Log in →",
    loading: isFr ? "Connexion en cours..." : "Logging in...",
    terms: isFr ? "En continuant, vous acceptez nos" : "By continuing, you agree to our",
    termsLink: isFr ? "Conditions" : "Terms",
    and: isFr ? "et notre" : "and",
    privacy: isFr ? "Politique de confidentialité" : "Privacy Policy",
    forgotTitle: isFr ? "Réinitialiser le mot de passe" : "Reset your password",
    forgotSubtitle: isFr ? "Entrez votre courriel pour recevoir un lien de réinitialisation" : "Enter your email to receive a reset link",
    forgotSubmit: isFr ? "Envoyer le lien →" : "Send reset link →",
    forgotLoading: isFr ? "Envoi en cours..." : "Sending...",
    forgotSentTitle: isFr ? "Vérifiez votre courriel" : "Check your email",
    forgotSentBody: isFr ? "Si ce courriel est associé à un compte, vous recevrez un lien de réinitialisation." : "If this email is associated with an account, you'll receive a reset link shortly.",
    backToLogin: isFr ? "← Retour à la connexion" : "← Back to login",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={`/${locale}`} style={{ textDecoration: "none" }}>
          <Logo size={26} />
        </Link>
        <span style={{ fontSize: 14, color: "#78716C" }}>
          {t.noAccount}{" "}
          <Link href={`/${locale}/register`} style={{ color: "#F97316", fontWeight: 600, textDecoration: "none" }}>{t.signUp}</Link>
        </span>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>{t.welcome}</h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>{t.subtitle}</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 40, border: "1px solid #E7E5E4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {forgotMode ? (
              forgotSent ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="24" height="24" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 10 }}>{t.forgotSentTitle}</h2>
                  <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24, lineHeight: 1.6 }}>{t.forgotSentBody}</p>
                  <button onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(""); }}
                    style={{ fontSize: 14, color: "#F97316", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    {t.backToLogin}
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{t.forgotTitle}</h2>
                  <p style={{ fontSize: 14, color: "#78716C", marginBottom: 24 }}>{t.forgotSubtitle}</p>
                  {forgotError && (
                    <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                      {forgotError}
                    </div>
                  )}
                  <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.email}</label>
                      <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" required
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                        onFocus={e => e.target.style.borderColor = "#F97316"}
                        onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                    </div>
                    <button type="submit" disabled={forgotLoading}
                      style={{ width: "100%", padding: "14px", borderRadius: 12, backgroundColor: forgotLoading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: forgotLoading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { if (!forgotLoading) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                      onMouseLeave={e => { if (!forgotLoading) e.currentTarget.style.backgroundColor = forgotLoading ? "#FED7AA" : "#F97316"; }}>
                      {forgotLoading ? t.forgotLoading : t.forgotSubmit}
                    </button>
                  </form>
                  <button onClick={() => setForgotMode(false)}
                    style={{ marginTop: 20, fontSize: 14, color: "#78716C", background: "none", border: "none", cursor: "pointer", display: "block" }}>
                    {t.backToLogin}
                  </button>
                </>
              )
            ) : (
              <>
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
                  <span style={{ fontSize: 13, color: "#78716C", fontWeight: 500 }}>{t.or}</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
                </div>

                {error && (
                  <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.email}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#F97316"}
                      onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{t.password}</label>
                      <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(email); }}
                        style={{ fontSize: 13, color: "#F97316", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {t.forgot}
                      </button>
                    </div>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#F97316"}
                      onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, backgroundColor: loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", marginTop: 4 }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = loading ? "#FED7AA" : "#F97316"; }}>
                    {loading ? t.loading : t.submit}
                  </button>
                </form>
              </>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#78716C", marginTop: 24 }}>
            {t.terms}{" "}
            <Link href={`/${locale}/terms`} style={{ color: "#F97316", textDecoration: "none" }}>{t.termsLink}</Link>{" "}{t.and}{" "}
            <Link href={`/${locale}/privacy`} style={{ color: "#F97316", textDecoration: "none" }}>{t.privacy}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
