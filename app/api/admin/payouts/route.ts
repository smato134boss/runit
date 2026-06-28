import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendPayoutSentEmail } from "@/lib/email";

const ADMIN_EMAIL = "smato134@gmail.com";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { payoutId, runnerId, amount, runnerEmail, runnerName } = await request.json();

  await adminSupabase.from("payouts").update({
    status: "sent",
    processed_at: new Date().toISOString(),
  }).eq("id", payoutId);

  if (runnerEmail) {
    await sendPayoutSentEmail({ email: runnerEmail, name: runnerName || "there", amount }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
