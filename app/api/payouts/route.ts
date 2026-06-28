import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPayoutRequestEmail } from "@/lib/email";

const ADMIN_EMAIL = "smato134@gmail.com";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { interacEmail, amount } = await req.json();
  if (!interacEmail || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles").select("full_name, email, role").eq("id", user.id).single();

  if (profile?.role !== "runner") {
    return NextResponse.json({ error: "Only runners can request payouts" }, { status: 403 });
  }

  // Check for existing pending payout
  const { data: existing } = await supabase
    .from("payouts").select("id").eq("runner_id", user.id).eq("status", "requested").maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "You already have a pending payout request" }, { status: 400 });
  }

  const { error } = await supabase.from("payouts").insert({
    runner_id: user.id,
    amount,
    interac_email: interacEmail,
    status: "requested",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sendPayoutRequestEmail({
    adminEmail: ADMIN_EMAIL,
    runnerName: profile?.full_name || "Runner",
    runnerEmail: profile?.email || user.email || "",
    interacEmail,
    amount,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
