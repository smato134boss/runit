"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ID_TYPES = [
  { value: "passport", label: "Passport", labelFr: "Passeport", icon: "🛂" },
  { value: "drivers_license", label: "Driver's licence", labelFr: "Permis de conduire", icon: "🪪" },
  { value: "provincial_id", label: "Provincial ID", labelFr: "Carte d'identité", icon: "🆔" },
];

const T = {
  en: {
    title: "Verify your identity",
    subtitle: "Verified runners earn more trust from task posters. Your documents are encrypted and never shared publicly.",
    badge: "🛡️ Identity Verification",
    benefits: "What you get after verification:",
    b1: "✓ Verified badge on your profile",
    b2: "✓ Higher visibility in task listings",
    b3: "✓ Posters accept your bids faster",
    fullName: "Full legal name",
    fullNamePlaceholder: "As it appears on your ID",
    dob: "Date of birth",
    idType: "ID type",
    idPhoto: "Photo of your ID",
    idHint: "Clear photo of the front of your document. JPG, PNG, or PDF. Max 10MB.",
    uploadId: "Upload ID photo",
    selfie: "Selfie",
    selfieOptional: "(optional but recommended)",
    selfieHint: "Photo of you holding your ID next to your face.",
    uploadSelfie: "Upload selfie with ID",
    clickChange: "Click to change",
    clickBrowse: "Click to browse",
    privacy: "🔒 Your documents are encrypted and stored securely. They are only used to verify your identity and are never shared with task posters or third parties. By submitting, you agree to our",
    privacyLink: "Privacy Policy",
    submit: "Submit for verification →",
    uploading: "Uploading...",
    errorNoId: "Please upload a photo of your ID.",
    doneTitle: "Submitted!",
    doneText: "Your documents are under review. We usually verify within 24 hours. You'll get an email once approved.",
    doneBtn: "Back to dashboard",
    back: "← Dashboard",
  },
  fr: {
    title: "Vérifiez votre identité",
    subtitle: "Les coursiers vérifiés inspirent plus confiance. Vos documents sont chiffrés et jamais partagés.",
    badge: "🛡️ Vérification d'identité",
    benefits: "Ce que vous obtenez après vérification :",
    b1: "✓ Badge vérifié sur votre profil",
    b2: "✓ Meilleure visibilité dans les annonces",
    b3: "✓ Les clients acceptent vos offres plus vite",
    fullName: "Nom légal complet",
    fullNamePlaceholder: "Tel qu'il apparaît sur votre pièce d'identité",
    dob: "Date de naissance",
    idType: "Type de pièce d'identité",
    idPhoto: "Photo de votre pièce d'identité",
    idHint: "Photo nette du recto. JPG, PNG ou PDF. Max 10 Mo.",
    uploadId: "Télécharger la photo",
    selfie: "Selfie",
    selfieOptional: "(optionnel mais recommandé)",
    selfieHint: "Photo de vous tenant votre pièce d'identité.",
    uploadSelfie: "Télécharger un selfie avec pièce d'identité",
    clickChange: "Cliquer pour changer",
    clickBrowse: "Cliquer pour parcourir",
    privacy: "🔒 Vos documents sont chiffrés et stockés en sécurité. Ils sont utilisés uniquement pour vérifier votre identité. En soumettant, vous acceptez notre",
    privacyLink: "Politique de confidentialité",
    submit: "Soumettre pour vérification →",
    uploading: "Téléchargement...",
    errorNoId: "Veuillez télécharger une photo de votre pièce d'identité.",
    doneTitle: "Soumis !",
    doneText: "Vos documents sont en cours d'examen. La vérification prend généralement 24 heures. Vous recevrez un e-mail dès l'approbation.",
    doneBtn: "Retour au tableau de bord",
    back: "← Tableau de bord",
  },
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
  boxSizing: "border-box" as const,
};

export default function VerifyLocalePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = T[locale as "en" | "fr"] ?? T.en;

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
    if (!idFile) { setError(t.errorNoId); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${locale}/login`); return; }

    const ext = idFile.name.split(".").pop();
    const idPath = `${user.id}/id_front.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("verification-docs").upload(idPath, idFile, { upsert: true });
    if (uploadErr) { setError("Upload failed: " + uploadErr.message); setLoading(false); return; }

    let selfiePath: string | null = null;
    if (selfieFile) {
      const sExt = selfieFile.name.split(".").pop();
      selfiePath = `${user.id}/selfie.${sExt}`;
      await supabase.storage.from("verification-docs").upload(selfiePath, selfieFile, { upsert: true });
    }

    await supabase.from("verifications").upsert({
      user_id: user.id,
      full_name: form.fullName,
      date_of_birth: form.dob,
      id_type: form.idType,
      id_front_url: idPath,
      selfie_url: selfiePath,
      status: "pending",
    }, { onConflict: "user_id" });

    await supabase.from("profiles").update({ verification_status: "pending" }).eq("id", user.id);

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", marginBottom: 12 }}>{t.doneTitle}</h1>
          <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>{t.doneText}</p>
          <a href={`/${locale}/dashboard`} style={{ display: "inline-block", backgroundColor: "#F97316", color: "white", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            {t.doneBtn}
          </a>
        </div>
      </div>
    );
  }

  const isValid = form.fullName && form.dob && form.idType && idFile;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href={`/${locale}/dashboard`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>{t.back}</a>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#EFF6FF", borderRadius: 999, padding: "6px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>{t.badge}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 10 }}>{t.title}</h1>
          <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.6 }}>{t.subtitle}</p>
        </div>

        <div style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: "16px 20px", marginBottom: 28, border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#15803D", marginBottom: 4 }}>{t.benefits}</p>
          <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: "#166534", lineHeight: 1.8 }}>
            <li>{t.b1}</li>
            <li>{t.b2}</li>
            <li>{t.b3}</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626" }}>{error}</div>
          )}

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.fullName} *
            </label>
            <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)} required
              placeholder={t.fullNamePlaceholder} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.dob} *
            </label>
            <input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#F97316"} onBlur={e => e.target.style.borderColor = "#E7E5E4"} />
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.idType} *
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {ID_TYPES.map(type => (
                <button key={type.value} type="button" onClick={() => update("idType", type.value)}
                  style={{ flex: 1, padding: "14px 8px", borderRadius: 12, border: `2px solid ${form.idType === type.value ? "#F97316" : "#E7E5E4"}`, backgroundColor: form.idType === type.value ? "#FFF7ED" : "white", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{type.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: form.idType === type.value ? "#EA580C" : "#1C1917" }}>{locale === "fr" ? type.labelFr : type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.idPhoto} *
            </label>
            <p style={{ fontSize: 13, color: "#78716C", marginBottom: 12 }}>{t.idHint}</p>
            <input ref={idFileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
              onChange={e => setIdFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => idFileRef.current?.click()}
              style={{ width: "100%", padding: "20px", borderRadius: 12, border: `2px dashed ${idFile ? "#F97316" : "#E7E5E4"}`, backgroundColor: idFile ? "#FFF7ED" : "#FAFAF8", cursor: "pointer", textAlign: "center" }}>
              {idFile ? (
                <div>
                  <p style={{ fontSize: 20, marginBottom: 4 }}>📎</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#EA580C" }}>{idFile.name}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>{t.clickChange}</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 28, marginBottom: 6 }}>📷</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>{t.uploadId}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>{t.clickBrowse}</p>
                </div>
              )}
            </button>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t.selfie} <span style={{ color: "#A8A29E", textTransform: "none", fontWeight: 400 }}>{t.selfieOptional}</span>
            </label>
            <p style={{ fontSize: 13, color: "#78716C", marginBottom: 12 }}>{t.selfieHint}</p>
            <input ref={selfieFileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => selfieFileRef.current?.click()}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: `2px dashed ${selfieFile ? "#16A34A" : "#E7E5E4"}`, backgroundColor: selfieFile ? "#F0FDF4" : "#FAFAF8", cursor: "pointer", textAlign: "center" }}>
              {selfieFile ? (
                <div>
                  <p style={{ fontSize: 20, marginBottom: 4 }}>🤳</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#16A34A" }}>{selfieFile.name}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>{t.clickChange}</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 22, marginBottom: 4 }}>🤳</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>{t.uploadSelfie}</p>
                  <p style={{ fontSize: 12, color: "#A8A29E" }}>{t.clickBrowse}</p>
                </div>
              )}
            </button>
          </div>

          <div style={{ backgroundColor: "#FAFAF8", borderRadius: 12, padding: "14px 18px", border: "1px solid #E7E5E4" }}>
            <p style={{ fontSize: 12, color: "#78716C", lineHeight: 1.6 }}>
              {t.privacy} <a href={`/${locale}/privacy`} style={{ color: "#F97316" }}>{t.privacyLink}</a>.
            </p>
          </div>

          <button type="submit" disabled={!isValid || loading}
            style={{ padding: "16px", borderRadius: 12, backgroundColor: !isValid || loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 16, fontWeight: 700, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer" }}>
            {loading ? t.uploading : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
