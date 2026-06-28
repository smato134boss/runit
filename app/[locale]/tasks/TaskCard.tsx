"use client";

type Task = {
  id: string;
  title: string;
  status: string;
  category: string;
  from_city: string;
  to_city?: string | null;
  budget: number;
  deadline?: string | null;
  bids?: { count: number }[];
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: "#F0FDF4", color: "#16A34A", label: "Open" },
  in_progress: { bg: "#FFF7ED", color: "#EA580C", label: "In progress" },
  completed:   { bg: "#F5F4F2", color: "#78716C", label: "Completed" },
  cancelled:   { bg: "#FEF2F2", color: "#DC2626", label: "Cancelled" },
};

export default function TaskCard({ task, locale }: { task: Task; locale: string }) {
  const isFr = locale === "fr";
  const st = STATUS_STYLE[task.status] || STATUS_STYLE.open;
  const bidCount = task.bids?.[0]?.count ?? 0;
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadline && deadline < new Date() && task.status === "open";
  const t = {
    noOffers: isFr ? "Aucune offre" : "No offers yet",
    overdue:  isFr ? "En retard" : "Overdue",
    offers:   (n: number) => isFr ? `${n} offre${n > 1 ? "s" : ""}` : `${n} offer${n > 1 ? "s" : ""}`,
  };

  return (
    <a href={`/${locale}/tasks/${task.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{ backgroundColor: "white", borderRadius: 16, padding: 24, border: "1px solid #E7E5E4", transition: "all 0.2s", cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ backgroundColor: st.bg, color: st.color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{st.label}</span>
              <span style={{ fontSize: 12, color: "#78716C", backgroundColor: "#F5F4F2", padding: "3px 10px", borderRadius: 999 }}>{task.category}</span>
              {isOverdue && <span style={{ fontSize: 12, color: "#DC2626", backgroundColor: "#FEF2F2", padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>{t.overdue}</span>}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", marginBottom: 6 }}>{task.title}</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#78716C" }}>📍 {task.from_city}{task.to_city ? ` → ${task.to_city}` : ""}</span>
              {deadline && (
                <span style={{ fontSize: 13, color: isOverdue ? "#DC2626" : "#78716C" }}>
                  ⏰ {deadline.toLocaleDateString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316", marginBottom: 4 }}>${task.budget.toFixed(0)}</div>
            <div style={{ fontSize: 13, color: bidCount > 0 ? "#16A34A" : "#78716C", fontWeight: bidCount > 0 ? 600 : 400 }}>
              {bidCount > 0 ? t.offers(bidCount) : t.noOffers}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
