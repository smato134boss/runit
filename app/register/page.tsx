"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "poster" | "runner" | null;
const cities = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton", "Winnipeg", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Validate phone format if provided
    if (form.phone && !/^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(form.phone.trim())) {
      setError("Please enter a valid Canadian phone number, e.g. +1 (416) 000-0000");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: form.name,
          role,
          city: form.city,
          phone: form.phone,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
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
        setError("This phone number is already registered. Please use a different number.");
        setLoading(false);
        return;
      }

      // If email confirmation is enabled, show verify screen
      if (!data.session) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

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
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 12 }}>
            Check your email
          </h1>
          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.6, marginBottom: 8 }}>
            We sent a confirmation link to
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#F97316", marginBottom: 24 }}>{form.email}</p>
          <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>
            Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
          </p>
          <Link href="/login" style={{
            display: "inline-block", backgroundColor: "#F97316", color: "white",
            padding: "14px 32px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}>
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </Link>
        <span style={{ fontSize: 14, color: "#78716C" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#F97316", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
        </span>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
              {step === 1 ? "Join runit" : `Almost there, ${form.name.split(" ")[0] || ""}! 👋`}
            </h1>
            <p style={{ fontSize: 15, color: "#78716C" }}>
              {step === 1 ? "How do you want to use runit?" : "Just a few more details"}
            </p>
          </div>

          {/* Progress */}
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
                  Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
                  <span style={{ fontSize: 13, color: "#78716C", fontWeight: 500 }}>or sign up with email</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: "#E7E5E4" }} />
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>I want to...</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    { value: "poster" as Role, icon: "📋", title: "Post tasks", desc: "Get things done by someone nearby" },
                    { value: "runner" as Role, icon: "🏃", title: "Run tasks", desc: "Earn money helping people in my city" },
                  ].map(opt => (
                    <button
                      key={opt.value}
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
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>Full name</label>
                    <input type="text" value={form.name} onChange={e => updateForm("name", e.target.value)} placeholder="Alex Johnson" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>Email</label>
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
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>Password</label>
                  <input type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="Min. 8 characters" required minLength={8} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>Your city</label>
                  <select value={form.city} onChange={e => updateForm("city", e.target.value)} required style={{ ...inputStyle, appearance: "none" as const }}>
                    <option value="">Select your city</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>
                    Phone <span style={{ color: "#78716C", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)} placeholder="+1 (416) 000-0000" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
                </div>

                <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{role === "poster" ? "📋" : "🏃"}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#EA580C" }}>Joining as: {role === "poster" ? "Task Poster" : "Runner"}</p>
                    <p style={{ fontSize: 12, color: "#78716C" }}>You can switch anytime in settings</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ flex: 1, padding: "14px", borderRadius: 12, backgroundColor: "white", color: "#1C1917", fontSize: 15, fontWeight: 600, border: "2px solid #E7E5E4", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#1C1917"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#E7E5E4"}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 2, padding: "14px", borderRadius: 12, backgroundColor: loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#EA580C"; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#F97316"; }}>
                    {loading ? "Creating account..." : "Create account 🎉"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#78716C", marginTop: 20 }}>
            By signing up, you agree to our{" "}
            <Link href="/terms" style={{ color: "#F97316", textDecoration: "none" }}>Terms</Link>{" "}and{" "}
            <Link href="/privacy" style={{ color: "#F97316", textDecoration: "none" }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
