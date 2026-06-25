import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 16, color: i <= Math.round(rating) ? "#F97316" : "#E7E5E4" }}>★</span>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function memberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

const AVATAR_COLORS = [
  ["#FED7AA", "#EA580C"], ["#BFDBFE", "#1D4ED8"], ["#BBF7D0", "#16A34A"],
  ["#E9D5FF", "#7C3AED"], ["#FECACA", "#DC2626"], ["#FEF08A", "#CA8A04"],
];

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) redirect("/");

  const isOwn = user?.id === id;

  // Stats
  const [{ count: jobsDone }, { count: tasksPosted }, { data: reviews }] = await Promise.all([
    supabase.from("bids").select("*", { count: "exact", head: true })
      .eq("runner_id", id).eq("status", "accepted"),
    supabase.from("tasks").select("*", { count: "exact", head: true })
      .eq("poster_id", id),
    supabase.from("reviews")
      .select("*, reviewer:profiles!reviewer_id(full_name, city, created_at)")
      .eq("reviewee_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : profile.rating || 0;

  const name = profile.full_name || "User";
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const [bgColor, textColor] = avatarColor(name);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>Dashboard</a>
          {user && (
            <a href={`/profile/${user.id}`} style={{ fontSize: 14, color: "#F97316", fontWeight: 600, textDecoration: "none" }}>My profile</a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 28, alignItems: "start" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Avatar + name card */}
            <div style={{ backgroundColor: "white", borderRadius: 20, padding: 28, border: "1px solid #E7E5E4", textAlign: "center" }}>
              <div style={{
                width: 96, height: 96, borderRadius: "50%",
                backgroundColor: bgColor, color: textColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, fontWeight: 800, margin: "0 auto 16px",
              }}>
                {initials}
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", marginBottom: 4 }}>{name}</h1>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>📍 {profile.city || "—"}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                  backgroundColor: profile.role === "runner" ? "#FFF7ED" : "#EFF6FF",
                  color: profile.role === "runner" ? "#EA580C" : "#1D4ED8",
                }}>
                  {profile.role === "runner" ? "🏃 Runner" : "📋 Task Poster"}
                </span>
              </div>

              {avgRating > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                  <StarRating rating={avgRating} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>{avgRating.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: "#78716C" }}>({reviews?.length || 0})</span>
                </div>
              )}

              <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 14, marginTop: 4 }}>
                <p style={{ fontSize: 12, color: "#A8A29E" }}>
                  Member since {memberSince(profile.created_at)}
                </p>
              </div>

              {isOwn && (
                <div style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, backgroundColor: "#F0FDF4", padding: "4px 12px", borderRadius: 999 }}>
                    ✓ This is you
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ backgroundColor: "white", borderRadius: 16, padding: 20, border: "1px solid #E7E5E4" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>Stats</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {profile.role === "runner" ? (
                  <StatRow label="Jobs completed" value={String(jobsDone || 0)} />
                ) : (
                  <StatRow label="Tasks posted" value={String(tasksPosted || 0)} />
                )}
                <StatRow label="Reviews" value={String(reviews?.length || 0)} />
                <StatRow label="Rating" value={avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : "No ratings yet"} highlight={avgRating > 0} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Bio / Edit */}
            {isOwn ? (
              <EditProfileForm profile={profile} />
            ) : (
              profile.bio && (
                <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>About</p>
                  <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.7 }}>{profile.bio}</p>
                </div>
              )
            )}

            {/* Reviews */}
            <div style={{ backgroundColor: "white", borderRadius: 20, padding: 24, border: "1px solid #E7E5E4" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
                Reviews {reviews && reviews.length > 0 ? `(${reviews.length})` : ""}
              </p>

              {!reviews || reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#A8A29E" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                  <p style={{ fontSize: 14 }}>No reviews yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.map(r => {
                    const reviewer = r.reviewer as { full_name: string; city: string; created_at: string } | null;
                    const rName = reviewer?.full_name || "User";
                    const rInitials = rName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    const [rBg, rText] = avatarColor(rName);
                    return (
                      <div key={r.id} style={{ paddingBottom: 16, borderBottom: "1px solid #F5F4F2" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: rBg, color: rText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                            {rInitials}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>{rName}</span>
                              <span style={{ fontSize: 11, color: "#A8A29E" }}>{timeAgo(r.created_at)}</span>
                            </div>
                            <StarRating rating={r.rating} />
                          </div>
                        </div>
                        {r.comment && (
                          <p style={{ fontSize: 14, color: "#44403C", lineHeight: 1.6, margin: 0, paddingLeft: 46 }}>{r.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: "#78716C" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: highlight ? "#F97316" : "#1C1917" }}>{value}</span>
    </div>
  );
}
