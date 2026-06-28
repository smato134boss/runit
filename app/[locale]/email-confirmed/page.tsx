import { createClient } from "@/lib/supabase/server";

export default async function EmailConfirmedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  const dashboardHref = `/${locale}/dashboard`;
  const browseHref = `/${locale}/tasks/browse`;
  const newTaskHref = `/${locale}/tasks/new`;
  const isRunner = profile?.role === "runner";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#F0FDF4", border: "3px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 28px" }}>
            ✓
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.5px", marginBottom: 12 }}>
            {isFr ? "Email confirmé !" : "Email confirmed!"}
          </h1>

          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.6, marginBottom: 36 }}>
            {isFr
              ? "Votre adresse email a été vérifiée avec succès. Votre compte Runly est maintenant actif."
              : "Your email address has been verified. Your Runly account is now active and ready to go."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={dashboardHref}
              style={{ display: "block", backgroundColor: "#F97316", color: "white", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              {isFr ? "Aller au tableau de bord →" : "Go to dashboard →"}
            </a>
            {isRunner ? (
              <a href={browseHref}
                style={{ display: "block", backgroundColor: "white", color: "#1C1917", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "2px solid #E7E5E4" }}>
                {isFr ? "Parcourir les tâches" : "Browse tasks"}
              </a>
            ) : (
              <a href={newTaskHref}
                style={{ display: "block", backgroundColor: "white", color: "#1C1917", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "2px solid #E7E5E4" }}>
                {isFr ? "Poster une tâche" : "Post your first task"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
