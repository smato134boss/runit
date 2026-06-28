import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActionCard from "@/app/dashboard/ActionCard";
import LogoutButton from "@/app/dashboard/LogoutButton";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name || user.email || "there";
  const role = profile?.role || "poster";
  const city = profile?.city || (isFr ? "votre ville" : "your city");

  const t = {
    welcome: isFr ? `Salut, ${name.split(" ")[0]} 👋` : `Hey, ${name.split(" ")[0]} 👋`,
    subtitle: isFr
      ? `Bienvenue sur Runly. Vous êtes inscrit(e) en tant que <strong>${role === "poster" ? "Posteur de tâches" : "Coursier"}</strong> à ${city}.`
      : `Welcome to Runly. You're joined as a <strong>${role === "poster" ? "Task Poster" : "Runner"}</strong> in ${city}.`,
    postTask: isFr ? "Poster une tâche" : "Post a task",
    postTaskDesc: isFr ? "Décrivez ce dont vous avez besoin" : "Describe what you need done",
    myTasks: isFr ? "Mes tâches" : "My tasks",
    myTasksDesc: isFr ? "Suivez vos tâches actives" : "Track your active tasks",
    myProfile: isFr ? "Mon profil" : "My profile",
    myProfileDesc: isFr ? "Modifier vos infos et paramètres" : "Edit your info and settings",
    browseTasks: isFr ? "Parcourir les tâches" : "Browse tasks",
    browseTasksDesc: isFr ? "Trouvez des tâches près de vous" : "Find tasks near you",
    myJobs: isFr ? "Mes emplois" : "My jobs",
    myJobsDesc: isFr ? "Suivez les tâches que vous effectuez" : "Track tasks you're running",
    earnings: isFr ? "Revenus" : "Earnings",
    earningsDesc: isFr ? "Consultez vos paiements" : "View your payouts",
    comingSoon: isFr ? "La plateforme sera bientôt lancée" : "Platform is launching soon",
    comingSoonDesc: isFr
      ? "Vous êtes l'un de nos premiers membres. La publication et la recherche de tâches seront disponibles sous peu — restez connecté !"
      : "You're one of our first members. Task posting and browsing will be live shortly — stay tuned!",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#78716C" }}>{city}</span>
          <a href={`/${locale}/profile/${user.id}`} style={{ textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#EA580C", cursor: "pointer" }}>
              {name.charAt(0).toUpperCase()}
            </div>
          </a>
          <LogoutButton />
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
            {t.welcome}
          </h1>
          <p style={{ fontSize: 16, color: "#78716C" }} dangerouslySetInnerHTML={{ __html: t.subtitle }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {role === "poster" ? (
            <>
              <ActionCard icon="📋" title={t.postTask} desc={t.postTaskDesc} href={`/${locale}/tasks/new`} primary />
              <ActionCard icon="🔍" title={t.myTasks} desc={t.myTasksDesc} href={`/${locale}/tasks`} />
              <ActionCard icon="👤" title={t.myProfile} desc={t.myProfileDesc} href={`/${locale}/profile`} />
            </>
          ) : (
            <>
              <ActionCard icon="🔍" title={t.browseTasks} desc={t.browseTasksDesc} href={`/${locale}/tasks/browse`} primary />
              <ActionCard icon="📋" title={t.myJobs} desc={t.myJobsDesc} href={`/${locale}/jobs`} />
              <ActionCard icon="💰" title={t.earnings} desc={t.earningsDesc} href={`/${locale}/earnings`} />
            </>
          )}
        </div>

        {role === "runner" && (!profile?.verification_status || profile.verification_status === "unverified") && (
          <div style={{ backgroundColor: "#EFF6FF", borderRadius: 16, padding: "20px 24px", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>🛡️</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1E3A8A", marginBottom: 2 }}>
                  {isFr ? "Vérifiez votre identité" : "Verify your identity"}
                </p>
                <p style={{ fontSize: 13, color: "#3B82F6" }}>
                  {isFr ? "Les coursiers vérifiés gagnent plus et inspirent plus confiance." : "Verified runners earn more and get accepted faster."}
                </p>
              </div>
            </div>
            <a href={`/${locale}/verify`}
              style={{ flexShrink: 0, backgroundColor: "#1D4ED8", color: "white", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              {isFr ? "Vérifier maintenant →" : "Verify now →"}
            </a>
          </div>
        )}

        {role === "runner" && profile?.verification_status === "pending" && (
          <div style={{ backgroundColor: "#FFFBEB", borderRadius: 16, padding: "16px 24px", border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 24 }}>⏳</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#92400E" }}>
              {isFr ? "Vérification en cours — nous vous informerons sous 24h." : "Verification in progress — we'll notify you within 24 hours."}
            </p>
          </div>
        )}

        {role === "runner" && profile?.verification_status === "verified" && (
          <div style={{ backgroundColor: "#F0FDF4", borderRadius: 16, padding: "16px 24px", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 24 }}>✅</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#15803D" }}>
              {isFr ? "Identité vérifiée — badge visible sur votre profil." : "Identity verified — badge visible on your profile."}
            </p>
          </div>
        )}

        <div style={{ backgroundColor: "white", borderRadius: 20, padding: 32, border: "1px solid #E7E5E4", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>{t.comingSoon}</h2>
          <p style={{ fontSize: 15, color: "#78716C", maxWidth: 400, margin: "0 auto" }}>{t.comingSoonDesc}</p>
        </div>
      </div>
    </div>
  );
}
