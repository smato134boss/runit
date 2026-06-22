"use client";

export default function ActionCard({ icon, title, desc, href, primary }: { icon: string; title: string; desc: string; href: string; primary?: boolean }) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ backgroundColor: primary ? "#F97316" : "white", borderRadius: 16, padding: 24, border: primary ? "none" : "1px solid #E7E5E4", cursor: "pointer", transition: "all 0.2s", height: "100%" }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { if (!primary) { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { if (!primary) { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.transform = "translateY(0)"; } }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: primary ? "white" : "#1C1917", marginBottom: 4 }}>{title}</h3>
        <p style={{ fontSize: 13, color: primary ? "rgba(255,255,255,0.8)" : "#78716C" }}>{desc}</p>
      </div>
    </a>
  );
}
