import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const locale = searchParams.get("locale") || "en";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check if profile is complete (has role) — new OAuth users need onboarding
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles").select("role, city").eq("id", user.id).single();

      if (!profile?.role || !profile?.city) {
        return NextResponse.redirect(`${origin}/en/onboarding`);
      }
    }
  }

  // Email confirmation → show success page
  if (type === "signup" || type === "email_change") {
    return NextResponse.redirect(`${origin}/en/email-confirmed`);
  }

  // Password reset
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/${locale}/reset-password`);
  }

  return NextResponse.redirect(`${origin}/en/dashboard`);
}
