import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendVerificationApprovedEmail, sendVerificationRejectedEmail } from "@/lib/email";

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

  const { userId, action, reason } = await request.json();
  if (!userId || !["verify", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const verificationStatus = action === "verify" ? "verified" : "rejected";
  const verStatus = action === "verify" ? "verified" : "rejected";

  await adminSupabase
    .from("profiles")
    .update({ verification_status: verificationStatus })
    .eq("id", userId);

  await adminSupabase
    .from("verifications")
    .update({ status: verStatus, reviewed_at: new Date().toISOString(), rejection_reason: reason || null })
    .eq("user_id", userId);

  // Send email notification
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .single();

  if (profile?.email) {
    try {
      if (action === "verify") {
        await sendVerificationApprovedEmail({ email: profile.email, name: profile.full_name || "there" });
      } else {
        await sendVerificationRejectedEmail({ email: profile.email, name: profile.full_name || "there", reason });
      }
    } catch (_) {}
  }

  return NextResponse.json({ ok: true });
}
