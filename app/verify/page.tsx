"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ID_TYPES = [
  { value: "passport", label: "Passport", icon: "🛂" },
  { value: "drivers_license", label: "Driver's licence", icon: "🪪" },
  { value: "provincial_id", label: "Provincial ID", icon: "🆔" },
];

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

export default function VerifyPage() {
  const router = useRouter();
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ fullName: "", dob: "", idType: "" });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile) { setError("Please upload a photo of your ID."); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const ext = idFile.name.split(".").pop();
    const idPath = `${user.id}/id_front.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("verification-docs").upload(idPath, idFile, { upsert: true });
    if (uploadErr) { setError("Upload failed: " + uploadErr.message); setLoading(false); return; }

    let selfiePath: string | null = null;
    if (selfieFile) {
      const sExt = selfieFile.name.split(".").pop();
      selfiePath = `${user.id}/selfie.${sExt}`;
      const { error: selfieErr } = await supabase.storage.from("verification-docs").upload(selfiePath, selfieFile, { upsert: true });
      if (selfieErr) { setError("Selfie upload failed: " + selfieErr.message); setLoading(false); return; }
    }

    const { error: insertErr } = await supabase.from("verifications").upsert({
      user_id: user.id,
      full_name: form.fullName,
      date_of_birth: form.dob,
      id_type: form.idType,
      id_front_url: idPath,
      selfie_url: selfiePath,
      status: "pending",
    }, { onConflict: "user_id" });

    if (insertErr) { setError(insertErr.message); setLoading(false); return; }

    await supabase.from("profiles").update({ verification_status: "pending" }).eq("id", user.id);

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", marginBottom: 12 }}>Submitted!</h1>
          <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>
            Your documents are under review. We usually verify within 24 hours. You&apos;ll get an email once approved.
          </p>
          <a href="/dashboard" style={{ display: "inline-block", backgroundColor: "#F97316", color: "white", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  const isValid = form.fullName && form.dob && form.idType && idFile;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>← Dashboard</a>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#EFF6FF", borderRadius: 999, padding: "6px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>🛡️ Identity Verification</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 10 }}>Verify your identity</h1>
          <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.6 }}>
            Verified runners earn more trust from task posters. Your documents are encrypted and never shared publicly.
          </p>
        </div>

        <div style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: "16px 20px", marginBottom: 28, border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#15803D", marginBottom: 4 }}>What you get after verification:</p>
          <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: "#166534", lineHeight: 1.8 }}>
            <li>✓ Verified badge on your profile</li>
            <li>✓ Higher visibility in task listings</li>
            <li>✓ Posters accept your bids faster</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626" }}>{error}</div>
          )}

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Full legal name *
            </label>
            <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)} required
              placeholder="As it appears on your ID" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Date of birth *
            </label>
            <input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ID type *
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {ID_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => update("idType", t.value)}
                  style={{ flex: 1, padding: "14px 8px", borderRadius: 12, border: `2px solid ${form.idType === t.value ? "#F97316" : "#E7E5E4"}`, backgroundColor: form.idType === t.value ? "#FFF7ED" : "white", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: form.idType === t.value ? "#EA580C" : "#1C1917" }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Photo of your ID *
            </label>
            <p style={{ fontSize: 13, color: "#78716C", marginBottom: 12 }}>Clear photo of the front of your document. JPG, PNG, or PDF. Max 10MB.</p>
            <input ref={idFileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
              onChange={e => setIdFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => idFileRef.current?.click()}
              style={{ width: "100%", padding: "20px", borderRadius: 12, border: `2px dashed ${idFile ? "#F97316" : "#E7E5E4"}`, backgroundColor: idFile ? "#FFF7ED" : "#FAFAF8", cursor: "pointer", textAlign: "center" }}>
              {idFile ? (
                <div>
                  <p style={{ fontSize: 20, marginBottom: 4 }}>📎</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#EA580C" }}>{idFile.name}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>Click to change</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 28, marginBottom: 6 }}>📷</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>Upload ID photo</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>Click to browse</p>
                </div>
              )}
            </button>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Selfie <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>(optional but recommended)</span>
            </label>
            <p style={{ fontSize: 13, color: "#78716C", marginBottom: 12 }}>Photo of you holding your ID next to your face.</p>
            <input ref={selfieFileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => selfieFileRef.current?.click()}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: `2px dashed ${selfieFile ? "#16A34A" : "#E7E5E4"}`, backgroundColor: selfieFile ? "#F0FDF4" : "#FAFAF8", cursor: "pointer", textAlign: "center" }}>
              {selfieFile ? (
                <div>
                  <p style={{ fontSize: 20, marginBottom: 4 }}>🤳</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#16A34A" }}>{selfieFile.name}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>Click to change</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 22, marginBottom: 4 }}>🤳</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>Upload selfie with ID</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>Click to browse</p>
                </div>
              )}
            </button>
          </div>

          <div style={{ backgroundColor: "#FAFAF8", borderRadius: 12, padding: "14px 18px", border: "1px solid #E7E5E4" }}>
            <p style={{ fontSize: 12, color: "#78716C", lineHeight: 1.6 }}>
              🔒 Your documents are encrypted and stored securely. They are only used to verify your identity and are never shared with task posters or third parties. By submitting, you agree to our <a href="/privacy" style={{ color: "#F97316" }}>Privacy Policy</a>.
            </p>
          </div>

          <button type="submit" disabled={!isValid || loading}
            style={{ padding: "16px", borderRadius: 12, backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer" }}>
            {loading ? "Uploading..." : "Submit for verification →"}
          </button>
        </form>
      </div>
    </div>
  );
}
