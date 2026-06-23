"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  city: string;
  phone: string;
  bio: string | null;
  role: string;
}

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    city: profile.city || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
  });

  async function save() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({
      full_name: form.full_name.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim() || null,
    }).eq("id", profile.id);
    setSaving(false);
    setEditing(false);
    window.location.reload();
  }

  if (!editing) {
    return (
      <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>About me</p>
          <button onClick={() => setEditing(true)} style={{ fontSize: 13, color: "#F97316", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Edit profile
          </button>
        </div>
        {form.bio ? (
          <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.7, margin: 0 }}>{form.bio}</p>
        ) : (
          <p style={{ fontSize: 14, color: "#A8A29E", margin: 0 }}>Tell others about yourself — your skills, experience, what you can do.</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "2px solid #F97316" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>Edit profile</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
        <Field label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
        <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+1 (416) 000-0000" />
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#78716C", display: "block", marginBottom: 6 }}>About me</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Tell others what you can do, your skills, experience..."
            rows={4}
            style={{
              width: "100%", border: "1.5px solid #E7E5E4", borderRadius: 10,
              padding: "10px 14px", fontSize: 14, color: "#1C1917",
              resize: "vertical", fontFamily: "inherit", outline: "none",
              boxSizing: "border-box", backgroundColor: "#FAFAF8",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button onClick={save} disabled={saving} style={{
          flex: 1, backgroundColor: saving ? "#FED7AA" : "#F97316", color: "white",
          border: "none", borderRadius: 999, padding: "11px 0", fontSize: 14,
          fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button onClick={() => setEditing(false)} style={{
          padding: "11px 20px", borderRadius: 999, border: "1.5px solid #E7E5E4",
          background: "white", fontSize: 14, color: "#78716C", cursor: "pointer",
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#78716C", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", border: "1.5px solid #E7E5E4", borderRadius: 10,
          padding: "10px 14px", fontSize: 14, color: "#1C1917", outline: "none",
          boxSizing: "border-box", backgroundColor: "#FAFAF8",
        }}
      />
    </div>
  );
}
