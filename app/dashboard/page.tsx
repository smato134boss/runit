import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name || user.email || "there";
  const role = profile?.role || "poster";
  const city = profile?.city || "your city";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#78716C" }}>{city}</span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#EA580C" }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>
            Hey, {name.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: 16, color: "#78716C" }}>
            Welcome to runit. You&apos;re joined as a <strong style={{ color: "#F97316" }}>{role === "poster" ? "Task Poster" : "Runner"}</strong> in {city}.
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {role === "poster" ? (
            <>
              <ActionCard icon="📋" title="Post a task" desc="Describe what you need done" href="/tasks/new" primary />
              <ActionCard icon="🔍" title="My tasks" desc="Track your active tasks" href="/tasks" />
              <ActionCard icon="👤" title="My profile" desc="Edit your info and settings" href="/profile" />
            </>
          ) : (
            <>
              <ActionCard icon="🔍" title="Browse tasks" desc="Find tasks near you" href="/tasks/browse" primary />
              <ActionCard icon="📋" title="My jobs" desc="Track tasks you're running" href="/jobs" />
              <ActionCard icon="💰" title="Earnings" desc="View your payouts" href="/earnings" />
            </>
          )}
        </div>

        {/* Coming soon */}
        <div style={{ backgroundColor: "white", borderRadius: 20, padding: 32, border: "1px solid #E7E5E4", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 8 }}>Platform is launching soon</h2>
          <p style={{ fontSize: 15, color: "#78716C", maxWidth: 400, margin: "0 auto" }}>
            You&apos;re one of our first members. Task posting and browsing will be live shortly — stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, href, primary }: { icon: string; title: string; desc: string; href: string; primary?: boolean }) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div style={{ backgroundColor: primary ? "#F97316" : "white", borderRadius: 16, padding: 24, border: primary ? "none" : "1px solid #E7E5E4", cursor: "pointer", transition: "all 0.2s", height: "100%" }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { if (!primary) { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { if (!primary) { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.transform = "translateY(0)"; } }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: primary ? "white" : "#1C1917", marginBottom: 4 }}>{title}</h3>
        <p style={{ fontSize: 13, color: primary ? "rgba(255,255,255,0.8)" : "#78716C" }}>{desc}</p>
      </div>
    </a>
  );
}
