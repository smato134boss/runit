import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - importing from Next.js route segment directory
import BidForm from "@/app/tasks/[id]/BidForm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AcceptBidButton from "@/app/tasks/[id]/AcceptBidButton";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MarkAsDoneButton from "@/app/tasks/[id]/MarkAsDoneButton";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Chat from "@/app/tasks/[id]/Chat";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReviewForm from "@/app/tasks/[id]/ReviewForm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CancelTaskButton from "@/app/tasks/[id]/CancelTaskButton";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: "#F0FDF4", color: "#16A34A", label: "Open — accepting offers" },
  in_progress: { bg: "#FFF7ED", color: "#EA580C", label: "In progress" },
  completed:   { bg: "#F5F4F2", color: "#78716C", label: "Completed" },
  cancelled:   { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled" },
};

export default async function TaskDetailPage({ params, searchParams }: { params: Promise<{ locale: string; id: string }>; searchParams: Promise<{ payment?: string }> }) {
  const { locale, id } = await params;
  const { payment } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: task } = await supabase
    .from("tasks")
    .select("*, poster:profiles!poster_id(full_name, city, rating, reviews_count)")
    .eq("id", id)
    .single();

  if (!task) redirect(`/${locale}/tasks`);

  const isPoster = task.poster_id === user.id;

  const { data: bids } = await supabase
    .from("bids")
    .select("*, profiles(full_name, city, rating, reviews_count)")
    .eq("task_id", id)
    .order("created_at", { ascending: true });

  const myBid = bids?.find(b => b.runner_id === user.id);
  const acceptedBid = bids?.find(b => b.status === "accepted");
  const isAcceptedRunner = !isPoster && acceptedBid?.runner_id === user.id;
  const showChat = task.status === "in_progress" && (isPoster || isAcceptedRunner);

  const isCompleted = task.status === "completed";
  const canReview = isCompleted && (isPoster || isAcceptedRunner);
  let alreadyReviewed = false;
  let revieweeName = "";
  let revieweeId = "";

  if (canReview) {
    revieweeId = isPoster ? (task.runner_id ?? "") : task.poster_id;
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("task_id", id)
      .eq("reviewer_id", user.id)
      .maybeSingle();
    alreadyReviewed = !!existingReview;

    if (isPoster && acceptedBid) {
      revieweeName = acceptedBid.profiles?.full_name || "Runner";
    } else {
      revieweeName = task.poster?.full_name || "Poster";
    }
  }

  const st = STATUS_STYLE[task.status] || STATUS_STYLE.open;
  const deadline = task.deadline ? new Date(task.deadline) : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      {payment === "success" && (
        <div style={{ backgroundColor: "#16A34A", color: "white", textAlign: "center", padding: "12px 24px", fontSize: 14, fontWeight: 600 }}>
          ✓ Payment successful — chat is now open. Runner will be notified.
        </div>
      )}
      {payment === "cancelled" && (
        <div style={{ backgroundColor: "#DC2626", color: "white", textAlign: "center", padding: "12px 24px", fontSize: 14, fontWeight: 600 }}>
          Payment cancelled — the offer was not accepted.
        </div>
      )}
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href={isPoster ? `/${locale}/tasks` : `/${locale}/tasks/browse`} style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>
          ← {isPoster ? "My tasks" : "Browse tasks"}
        </a>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 32, border: "1px solid #E7E5E4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ backgroundColor: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>● {st.label}</span>
              <span style={{ fontSize: 12, color: "#A8A29E" }}>{timeAgo(task.created_at)}</span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.5px", marginBottom: 20, lineHeight: 1.3 }}>{task.title}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <InfoBlock icon="📦" label="Category" value={task.category} />
              <InfoBlock icon="💰" label="Budget" value={`$${task.budget.toFixed(0)} CAD`} highlight />
              <InfoBlock icon="📍" label="Location" value={task.to_city ? `${task.from_city} → ${task.to_city}` : task.from_city} />
              {deadline && (
                <InfoBlock icon="⏰" label="Deadline" value={deadline.toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} warn={deadline < new Date() && task.status === "open"} />
              )}
            </div>

            {task.description && (
              <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#78716C", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Details</p>
                <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.7 }}>{task.description}</p>
              </div>
            )}
          </div>

          {task.poster && (
            <div style={{ backgroundColor: "white", borderRadius: 16, padding: 20, border: "1px solid #E7E5E4" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Posted by</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#EA580C", flexShrink: 0 }}>
                  {task.poster.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>{task.poster.full_name}</p>
                  <p style={{ fontSize: 13, color: "#78716C" }}>
                    {task.poster.city}
                    {task.poster.reviews_count > 0 && ` · ${task.poster.rating.toFixed(1)}★ (${task.poster.reviews_count} reviews)`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isPoster && bids && bids.length > 0 && (
            <div style={{ backgroundColor: "white", borderRadius: 20, padding: 24, border: "1px solid #E7E5E4" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>Offers ({bids.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {bids.map(bid => (
                  <div key={bid.id} style={{ padding: 16, borderRadius: 12, border: `2px solid ${bid.status === "accepted" ? "#22C55E" : "#E7E5E4"}`, backgroundColor: bid.status === "accepted" ? "#F0FDF4" : "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <a href={`/${locale}/profile/${bid.runner_id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>
                            {bid.profiles?.full_name?.charAt(0).toUpperCase()}
                          </div>
                        </a>
                        <div>
                          <a href={`/${locale}/profile/${bid.runner_id}`} style={{ textDecoration: "none" }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", margin: 0 }}>{bid.profiles?.full_name}</p>
                          </a>
                          <p style={{ fontSize: 12, color: "#78716C", margin: 0 }}>
                            {bid.profiles?.city}
                            {bid.profiles?.reviews_count > 0 && ` · ${bid.profiles.rating.toFixed(1)}★`}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color: "#F97316" }}>${bid.amount.toFixed(0)}</p>
                        <p style={{ fontSize: 11, color: "#A8A29E" }}>{timeAgo(bid.created_at)}</p>
                      </div>
                    </div>
                    {bid.message && <p style={{ fontSize: 13, color: "#44403C", lineHeight: 1.5, margin: "8px 0" }}>{bid.message}</p>}
                    {task.status === "open" && bid.status === "pending" && (
                      <AcceptBidButton bidId={bid.id} taskId={task.id} runnerId={bid.runner_id} amount={bid.amount} />
                    )}
                    {bid.status === "accepted" && <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 700 }}>✓ Accepted</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPoster && (!bids || bids.length === 0) && task.status === "open" && (
            <div style={{ backgroundColor: "white", borderRadius: 16, padding: 28, border: "1px solid #E7E5E4", textAlign: "center" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>⏳</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", marginBottom: 4 }}>Waiting for offers</p>
              <p style={{ fontSize: 13, color: "#78716C" }}>Runners in your city will see your task and send their offers.</p>
            </div>
          )}
        </div>

        <div>
          {showChat && <Chat taskId={task.id} currentUserId={user.id} />}

          {!showChat && !isPoster && task.status === "open" && (
            <BidForm taskId={task.id} budget={task.budget} existingBid={myBid || null} />
          )}

          {!showChat && isPoster && (
            <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4", position: "sticky", top: 80 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>Task summary</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>Budget</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>${task.budget.toFixed(0)} CAD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>Offers received</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: bids?.length ? "#F97316" : "#1C1917" }}>{bids?.length || 0}</span>
              </div>
              {acceptedBid && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: "#78716C" }}>Accepted offer</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>${acceptedBid.amount.toFixed(0)}</span>
                </div>
              )}
              <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 16, marginTop: 16 }}>
                <p style={{ fontSize: 12, color: "#A8A29E", lineHeight: 1.5 }}>Runly charges 15% platform fee on the completed task amount.</p>
              </div>
              {task.status === "in_progress" && <MarkAsDoneButton taskId={task.id} />}
              {task.status === "open" && (
                <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={`/${locale}/tasks/${task.id}/edit`}
                    style={{ display: "block", width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E7E5E4", backgroundColor: "white", fontSize: 13, fontWeight: 600, color: "#1C1917", textDecoration: "none", textAlign: "center" }}>
                    ✏️ Edit task
                  </a>
                  <CancelTaskButton taskId={task.id} />
                </div>
              )}
            </div>
          )}

          {canReview && !alreadyReviewed && revieweeId && (
            <ReviewForm taskId={task.id} revieweeId={revieweeId} revieweeName={revieweeName} />
          )}

          {canReview && alreadyReviewed && (
            <div style={{ backgroundColor: "#F0FDF4", borderRadius: 16, padding: 24, border: "1px solid #BBF7D0", textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#15803D" }}>✓ You&apos;ve already reviewed this task</p>
            </div>
          )}

          {!showChat && !isPoster && task.status !== "open" && !canReview && (
            <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4", textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#78716C" }}>This task is no longer accepting offers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value, highlight, warn }: { icon: string; label: string; value: string; highlight?: boolean; warn?: boolean }) {
  return (
    <div style={{ backgroundColor: "#FAFAF8", borderRadius: 10, padding: "12px 16px" }}>
      <p style={{ fontSize: 11, color: "#A8A29E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: highlight ? "#F97316" : warn ? "#DC2626" : "#1C1917" }}>{icon} {value}</p>
    </div>
  );
}
