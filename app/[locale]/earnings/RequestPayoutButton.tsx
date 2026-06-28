"use client";

import { useState } from "react";

export default function RequestPayoutButton({ available, defaultEmail, isFr }: {
  available: number;
  defaultEmail: string;
  isFr: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [interacEmail, setInteracEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const t = {
    request: isFr ? "Demander un virement" : "Request payout",
    title: isFr ? "Demander un virement" : "Request payout",
    subtitle: isFr
      ? `Nous enverrons $${available.toFixed(2)} CAD via Interac e-Transfer sous 2 jours ouvrables.`
      : `We'll send $${available.toFixed(2)} CAD via Interac e-Transfer within 2 business days.`,
    interacLabel: isFr ? "Votre email Interac" : "Your Interac email",
    cancel: isFr ? "Annuler" : "Cancel",
    confirm: isFr ? "Confirmer →" : "Confirm →",
    sending: isFr ? "Envoi..." : "Sending...",
    doneMsg: isFr ? "✓ Demande envoyée — vous recevrez l'argent sous 2 jours ouvrables." : "✓ Request sent — you'll receive the money within 2 business days.",
  };

  const submit = async () => {
    if (!interacEmail) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interacEmail, amount: available }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    setOpen(false);
  };

  if (done) {
    return (
      <div style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: "14px 20px", border: "1px solid #BBF7D0" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#15803D", margin: 0 }}>{t.doneMsg}</p>
      </div>
    );
  }

  if (available <= 0) return null;

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{ backgroundColor: "#F97316", color: "white", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
          {t.request} →
        </button>
      ) : (
        <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", marginBottom: 6 }}>{t.title}</h3>
          <p style={{ fontSize: 13, color: "#78716C", marginBottom: 16 }}>{t.subtitle}</p>

          {error && (
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#DC2626" }}>{error}</div>
          )}

          <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", display: "block", marginBottom: 6 }}>{t.interacLabel}</label>
          <input type="email" value={interacEmail} onChange={e => setInteracEmail(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #E7E5E4", fontSize: 14, color: "#1C1917", backgroundColor: "#FAFAF8", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
            onFocus={e => e.target.style.borderColor = "#F97316"}
            onBlur={e => e.target.style.borderColor = "#E7E5E4"} />

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setOpen(false)}
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E7E5E4", backgroundColor: "white", fontSize: 14, fontWeight: 600, color: "#78716C", cursor: "pointer" }}>
              {t.cancel}
            </button>
            <button onClick={submit} disabled={loading || !interacEmail}
              style={{ flex: 2, padding: "10px", borderRadius: 10, backgroundColor: loading ? "#FED7AA" : "#F97316", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? t.sending : t.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
