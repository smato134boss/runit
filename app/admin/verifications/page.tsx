import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { ApproveButton, RejectButton } from "./Actions";

const ADMIN_EMAIL = "smato134@gmail.com";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ID_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  drivers_license: "Driver's licence",
  provincial_id: "Provincial ID",
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#FFFBEB", color: "#92400E" },
  verified: { bg: "#F0FDF4", color: "#15803D" },
  rejected: { bg: "#FEF2F2", color: "#DC2626" },
};

export default async function AdminVerificationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ padding: 40, fontFamily: "monospace" }}>
        <p>Access denied.</p>
        <p>Your email: <strong>{user.email}</strong></p>
        <p>Required: <strong>{ADMIN_EMAIL}</strong></p>
      </div>
    );
  }

  const { data: verifications } = await adminSupabase
    .from("verifications")
    .select("*, profiles(full_name, email, city, role)")
    .order("created_at", { ascending: false });

  const pending = verifications?.filter(v => v.status === "pending") || [];
  const others = verifications?.filter(v => v.status !== "pending") || [];
  const all = [...pending, ...others];

  async function getSignedUrl(path: string) {
    const { data } = await adminSupabase.storage
      .from("verification-docs")
      .createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  }

  const withUrls = await Promise.all(
    all.map(async (v) => ({
      ...v,
      idUrl: await getSignedUrl(v.id_front_url),
      selfieUrl: v.selfie_url ? await getSignedUrl(v.selfie_url) : null,
    }))
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#78716C", backgroundColor: "#F5F4F2", padding: "4px 12px", borderRadius: 999 }}>🔐 Admin</span>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.5px", marginBottom: 6 }}>Identity Verifications</h1>
          <p style={{ fontSize: 14, color: "#78716C" }}>
            {pending.length} pending · {verifications?.filter(v => v.status === "verified").length || 0} verified · {verifications?.filter(v => v.status === "rejected").length || 0} rejected
          </p>
        </div>

        {withUrls.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#A8A29E", fontSize: 15 }}>
            No verification requests yet.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {withUrls.map(v => {
            const st = STATUS_STYLE[v.status] || STATUS_STYLE.pending;
            return (
              <div key={v.id} style={{ backgroundColor: "white", borderRadius: 16, border: "1px solid #E7E5E4", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #F5F4F2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#EA580C" }}>
                      {v.profiles?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", marginBottom: 2 }}>{v.profiles?.full_name}</p>
                      <p style={{ fontSize: 13, color: "#78716C" }}>{v.profiles?.email} · {v.profiles?.city}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, backgroundColor: st.bg, color: st.color }}>
                      {v.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: "#A8A29E" }}>
                      {new Date(v.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Submitted Info</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <Row label="Legal name" value={v.full_name} />
                      <Row label="Date of birth" value={new Date(v.date_of_birth).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })} />
                      <Row label="ID type" value={ID_TYPE_LABELS[v.id_type] || v.id_type} />
                      {v.rejection_reason && <Row label="Rejection reason" value={v.rejection_reason} />}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Documents</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      {v.idUrl && (
                        <a href={v.idUrl} target="_blank" rel="noreferrer"
                          style={{ display: "block", borderRadius: 10, overflow: "hidden", border: "2px solid #E7E5E4", flexShrink: 0 }}>
                          <img src={v.idUrl} alt="ID front"
                            style={{ width: 140, height: 90, objectFit: "cover", display: "block" }} />
                          <p style={{ fontSize: 11, color: "#78716C", padding: "4px 8px", textAlign: "center" }}>ID photo</p>
                        </a>
                      )}
                      {v.selfieUrl && (
                        <a href={v.selfieUrl} target="_blank" rel="noreferrer"
                          style={{ display: "block", borderRadius: 10, overflow: "hidden", border: "2px solid #E7E5E4", flexShrink: 0 }}>
                          <img src={v.selfieUrl} alt="Selfie"
                            style={{ width: 140, height: 90, objectFit: "cover", display: "block" }} />
                          <p style={{ fontSize: 11, color: "#78716C", padding: "4px 8px", textAlign: "center" }}>Selfie</p>
                        </a>
                      )}
                      {!v.idUrl && <p style={{ fontSize: 13, color: "#A8A29E" }}>No documents available</p>}
                    </div>
                  </div>
                </div>

                {v.status === "pending" && (
                  <div style={{ padding: "16px 24px", borderTop: "1px solid #F5F4F2", backgroundColor: "#FAFAF8", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <ApproveButton userId={v.user_id} />
                    <RejectButton userId={v.user_id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ fontSize: 13, color: "#A8A29E", minWidth: 110, flexShrink: 0 }}>{label}:</span>
      <span style={{ fontSize: 13, color: "#1C1917", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
