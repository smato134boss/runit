import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import MarkSentButton from "./MarkSentButton";

const ADMIN_EMAIL = "smato134@gmail.com";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPayoutsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.email !== ADMIN_EMAIL) redirect("/");

  const { data: payouts } = await adminSupabase
    .from("payouts")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const pending = payouts?.filter(p => p.status === "requested") || [];
  const sent = payouts?.filter(p => p.status !== "requested") || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="/admin/verifications" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Verifications</a>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#78716C", backgroundColor: "#F5F4F2", padding: "4px 12px", borderRadius: 999 }}>🔐 Admin</span>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.5px", marginBottom: 6 }}>Payout Requests</h1>
          <p style={{ fontSize: 14, color: "#78716C" }}>
            {pending.length} pending · {sent.length} processed
          </p>
        </div>

        {pending.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>⏳ Pending</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pending.map(p => (
                <div key={p.id} style={{ backgroundColor: "white", borderRadius: 14, padding: "20px 24px", border: "2px solid #FDE68A" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>{p.profiles?.full_name}</p>
                      <p style={{ fontSize: 13, color: "#78716C", marginBottom: 2 }}>Account: {p.profiles?.email}</p>
                      <p style={{ fontSize: 13, color: "#1C1917", fontWeight: 600 }}>Send to: <span style={{ color: "#F97316" }}>{p.interac_email}</span></p>
                      <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>{new Date(p.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 26, fontWeight: 800, color: "#F97316", marginBottom: 12 }}>${p.amount.toFixed(2)}</p>
                      <MarkSentButton payoutId={p.id} runnerId={p.runner_id} amount={p.amount} runnerEmail={p.profiles?.email} runnerName={p.profiles?.full_name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 40, border: "1px solid #E7E5E4", textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>✅</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#78716C" }}>No pending payout requests</p>
          </div>
        )}

        {sent.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#78716C", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>✓ Processed</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sent.map(p => (
                <div key={p.id} style={{ backgroundColor: "white", borderRadius: 12, padding: "16px 20px", border: "1px solid #E7E5E4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>{p.profiles?.full_name}</p>
                    <p style={{ fontSize: 12, color: "#78716C" }}>{p.interac_email} · {new Date(p.created_at).toLocaleDateString("en-CA")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#16A34A" }}>${p.amount.toFixed(2)}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 999 }}>SENT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
