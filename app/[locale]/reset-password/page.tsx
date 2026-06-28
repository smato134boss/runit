"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isFr = locale === "fr";
  const t = {
    title: isFr ? "Nouveau mot de passe" : "Set new password",
    subtitle: isFr ? "Choisissez un nouveau mot de passe pour votre compte" : "Choose a new password for your account",
    password: isFr ? "Nouveau mot de passe" : "New password",
    confirm: isFr ? "Confirmer le mot de passe" : "Confirm password",
    submit: isFr ? "Mettre à jour →" : "Update password →",
    loading: isFr ? "Mise à jour..." : "Updating...",
    mismatch: isFr ? "Les mots de passe ne correspondent pas" : "Passwords do not match",
    minLength: isFr ? "Le mot de passe doit contenir au moins 8 caractères" : "Password must be at least 8 characters",
    doneTitle: isFr ? "Mot de passe mis à jour !" : "Password updated!",
    doneBody: isFr ? "Votre mot de passe a été changé avec succès." : "Your password has been changed successfully.",
    login: isFr ? "Se connecter →" : "Log in →",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError(t.minLength); return; }
    if (password !== confirm) { setError(t.mismatch); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
        <Link href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 40, border: "1px solid #E7E5E4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {done ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="24" height="24" fill="none" stroke="#16A34A" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1C1917", marginBottom: 10 }}>{t.doneTitle}</h2>
                <p style={{ fontSize: 14, color: "#78716C", marginBottom: 28 }}>{t.doneBody}</p>
                <Link href={`/${locale}/login`}
                  style={{ display: "inline-block", padding: "14px 32px", borderRadius: 12, backgroundColor: "#F97316", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                  {t.login}
                </Link>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", marginBottom: 8 }}>{t.title}</h1>
                <p style={{ fontSize: 14, color: "#78716C", marginBottom: 28 }}>{t.subtitle}</p>

                {error && (
                  <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.password}</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#F97316"}
                      onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.confirm}</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required
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
        </div>
      </div>
    </div>
  );
}
