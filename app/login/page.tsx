"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      router.push("/dashboard");
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </Link>
        <span style={{ fontSize: 14, color: "#78716C" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#F97316", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
        </span>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>Log in to your runit account</p>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 40, border: "1px solid #E7E5E4", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
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
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
              <span style={{ fontSize: 13, color: "#78716C", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
            </div>

            {error && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#DC2626" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#F97316"}
                  onBlur={e => e.target.style.borderColor = "#E7E5E4"}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: 13, color: "#F97316", fontWeight: 500, textDecoration: "none" }}>Forgot password?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 15, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#F97316"}
                  onBlur={e => e.target.style.borderColor = "#E7E5E4"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 12, backgroundColor: loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", marginTop: 4 }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = loading ? "#FED7AA" : "#F97316"; }}>
                {loading ? "Logging in..." : "Log in →"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#78716C", marginTop: 24 }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" style={{ color: "#F97316", textDecoration: "none" }}>Terms</Link>{" "}and{" "}
            <Link href="/privacy" style={{ color: "#F97316", textDecoration: "none" }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
