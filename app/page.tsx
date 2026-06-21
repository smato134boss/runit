"use client";

import { useState, useEffect } from "react";

const categories = [
  { icon: "📦", name: "Delivery & Pickup" },
  { icon: "🛒", name: "Grocery Shopping" },
  { icon: "💐", name: "Send a Gift" },
  { icon: "🏠", name: "Home Tasks" },
  { icon: "🚗", name: "Rides & Transport" },
  { icon: "📋", name: "Admin & Errands" },
  { icon: "🐾", name: "Pet Care" },
  { icon: "💻", name: "Online Tasks" },
];

const testimonials = [
  {
    quote: "I sent birthday flowers to my sister in Vancouver without leaving Hamilton. runit made it so easy!",
    name: "Maria K.",
    city: "Hamilton",
    color: "#FED7AA",
    initials: "MK",
  },
  {
    quote: "I make $400–600 extra per week just picking up tasks around Toronto on my days off.",
    name: "James T.",
    city: "Toronto Runner",
    color: "#BBF7D0",
    initials: "JT",
  },
  {
    quote: "Found someone to pick up my parcel from across the city in under an hour. Incredible.",
    name: "Priya S.",
    city: "Mississauga",
    color: "#BFDBFE",
    initials: "PS",
  },
];

const avatarColors = ["#FCA5A5", "#FCD34D", "#6EE7B7"];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "white",
        borderBottom: scrolled ? "1px solid #E7E5E4" : "1px solid transparent",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>runit</span>
        </a>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#how" style={{ color: "#78716C", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
            onMouseLeave={e => (e.currentTarget.style.color = "#78716C")}>
            How it works
          </a>
          <a href="#tasks" style={{ color: "#78716C", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
            onMouseLeave={e => (e.currentTarget.style.color = "#78716C")}>
            Browse tasks
          </a>
          <a href="#earn" style={{ color: "#78716C", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
            onMouseLeave={e => (e.currentTarget.style.color = "#78716C")}>
            Earn money
          </a>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#" style={{ color: "#78716C", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Log in</a>
          <a href="#"
            style={{ backgroundColor: "#F97316", color: "white", padding: "10px 20px", borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 0.2s, transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EA580C"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#F97316"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Post a task
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#FAFAF8", padding: "80px 24px 100px" }}>
      {/* Background blobs */}
      <div className="blob" style={{ width: 500, height: 500, backgroundColor: "#F97316", top: -100, right: -100 }} />
      <div className="blob" style={{ width: 400, height: 400, backgroundColor: "#22C55E", bottom: -80, left: -80 }} />
      <div className="blob" style={{ width: 300, height: 300, backgroundColor: "#FCD34D", top: "40%", left: "40%" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        {/* Left */}
        <div>
          <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 999, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#F97316", display: "inline-block" }} className="animate-pulse" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#EA580C" }}>Now live in Canada 🇨🇦</span>
          </div>

          <h1 className="animate-fade-up-delay-1" style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 800, color: "#1C1917", lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20 }}>
            Get it done by<br />
            <span style={{ color: "#F97316" }}>someone nearby</span>
          </h1>

          <p className="animate-fade-up-delay-2" style={{ fontSize: 18, color: "#78716C", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Post any errand or task — a neighbour in your city picks it up and gets it done. Fast, safe, and community-powered.
          </p>

          <div className="animate-fade-up-delay-2" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <a href="#"
              style={{ backgroundColor: "#F97316", color: "white", padding: "14px 28px", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EA580C"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(249,115,22,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#F97316"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              Post a task — it&apos;s free →
            </a>
            <a href="#"
              style={{ backgroundColor: "white", color: "#1C1917", padding: "14px 28px", borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: "none", border: "2px solid #E7E5E4", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.color = "#1C1917"; }}>
              Browse tasks
            </a>
          </div>

          <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["Free to post", "Secure payments", "Rated runners"].map(badge => (
              <span key={badge} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#78716C", fontWeight: 500 }}>
                <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span> {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Task Card Mockup */}
        <div className="animate-float" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", maxWidth: 360, width: "100%", border: "1px solid #F5F4F2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#78716C", backgroundColor: "#F5F4F2", padding: "4px 10px", borderRadius: 999 }}>TASK REQUEST</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", backgroundColor: "#F0FDF4", padding: "4px 10px", borderRadius: 999, border: "1px solid #BBF7D0" }}>● 3 runners interested</span>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 16, lineHeight: 1.4 }}>
              Pick up flowers in Toronto for my mom 💐
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>📍</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                  <span style={{ color: "#1C1917" }}>Hamilton</span>
                  <span style={{ color: "#E7E5E4" }}>→</span>
                  <span style={{ color: "#1C1917" }}>Toronto</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>💰</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#F97316" }}>Budget: $35</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: "#78716C" }}>⏰</span>
                <span style={{ fontSize: 14, color: "#78716C" }}>Today, by 5pm</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                {avatarColors.map((color, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: color, border: "2px solid white", marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#1C1917" }}>
                    {["A", "B", "C"][i]}
                  </div>
                ))}
                <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#F5F4F2", border: "2px solid white", marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#78716C" }}>
                  +2
                </div>
              </div>
              <button style={{ backgroundColor: "#F97316", color: "white", border: "none", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                View offers
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { number: "12,000+", label: "Tasks posted" },
    { number: "8,500+", label: "Runners ready" },
    { number: "4.9★", label: "Average rating" },
    { number: "98%", label: "Completed on time" },
  ];

  return (
    <section style={{ backgroundColor: "#F5F4F2", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
        {stats.map(stat => (
          <div key={stat.label}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>{stat.number}</div>
            <div style={{ fontSize: 14, color: "#78716C", fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", icon: "🗒️", title: "Post your task", desc: "Describe what you need done, where, and your budget. It's completely free." },
    { n: "2", icon: "🙋", title: "Get offers", desc: "Runners in your city see your task and send you their best offer." },
    { n: "3", icon: "✅", title: "Done & paid", desc: "Choose your runner, they complete the task, you release payment securely." },
  ];

  return (
    <section id="how" style={{ padding: "100px 24px", backgroundColor: "#FAFAF8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F97316", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>Simple as 1, 2, 3</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {steps.map((step, i) => (
            <div key={i}
              style={{ backgroundColor: "white", borderRadius: 20, padding: 32, border: "1px solid #E7E5E4", transition: "all 0.25s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#F97316"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E7E5E4"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>
                  {step.n}
                </div>
                <span style={{ fontSize: 28 }}>{step.icon}</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="tasks" style={{ padding: "80px 24px", backgroundColor: "#F5F4F2" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F97316", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>CATEGORIES</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>What can runit do for you?</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {categories.map((cat, i) => (
            <div key={i}
              style={{ backgroundColor: "white", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "2px solid transparent", transition: "all 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(249,115,22,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const pillars = [
    { icon: "🔒", title: "Secure payments", desc: "Money held safely until the task is done. Pay only when satisfied.", color: "#FFF7ED" },
    { icon: "✅", title: "Verified runners", desc: "Every runner is reviewed, rated, and verified by the community.", color: "#F0FDF4" },
    { icon: "💬", title: "Real reviews", desc: "Thousands of honest reviews from real people in your city.", color: "#EFF6FF" },
  ];

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#FAFAF8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>TRUST & SAFETY</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>Built on trust.<br />Driven by community.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ backgroundColor: p.color, borderRadius: 20, padding: 36, border: "1px solid #E7E5E4" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1C1917", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: "#78716C", lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EarnMoney() {
  return (
    <section id="earn" style={{ padding: "100px 24px", backgroundColor: "#F9F7F5" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F97316", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>FOR RUNNERS</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 20, lineHeight: 1.2 }}>
            Turn your free time<br />into income
          </h2>
          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.7, marginBottom: 28 }}>
            Browse tasks posted in your city. Pick what you like. Get paid securely through the platform.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            {["Work on your schedule", "No minimum hours", "Fast payouts"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#22C55E", fontWeight: 700, fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: "#1C1917" }}>{item}</span>
              </div>
            ))}
          </div>
          <a href="#"
            style={{ backgroundColor: "#F97316", color: "white", padding: "14px 28px", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EA580C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#F97316"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Start earning today →
          </a>
        </div>

        {/* Earnings Card */}
        <div className="animate-float-slow">
          <div style={{ backgroundColor: "white", borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid #E7E5E4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 13, color: "#78716C", fontWeight: 500 }}>This week</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>$245</p>
                <p style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>↑ 18% vs last week</p>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                💰
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F5F4F2", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { task: "Grocery run — Scarborough", amount: "+$45", status: "Completed" },
                { task: "Package pickup — Etobicoke", amount: "+$60", status: "Completed" },
                { task: "Send flowers — North York", amount: "+$35", status: "In progress" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{t.task}</p>
                    <p style={{ fontSize: 11, color: t.status === "In progress" ? "#F97316" : "#22C55E", fontWeight: 500 }}>{t.status}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#22C55E" }}>{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#FAFAF8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F97316", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>TESTIMONIALS</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1C1917", letterSpacing: "-1px" }}>What people are saying</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i}
              style={{ backgroundColor: "white", borderRadius: 20, padding: 32, border: "1px solid #E7E5E4", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 32, color: "#F97316", marginBottom: 16, lineHeight: 1 }}>&ldquo;</div>
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => <span key={j} style={{ color: "#F97316", fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1C1917" }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#78716C" }}>{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "white", letterSpacing: "-2px", marginBottom: 16, lineHeight: 1.1 }}>
          Ready to get things done?
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 40 }}>
          Join thousands of Canadians who use runit every day.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#"
            style={{ backgroundColor: "white", color: "#F97316", padding: "14px 32px", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            Post a task
          </a>
          <a href="#"
            style={{ backgroundColor: "transparent", color: "white", padding: "14px 32px", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", border: "2px solid rgba(255,255,255,0.5)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "white"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
            Become a Runner
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1917", color: "white", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#F97316", marginBottom: 12, letterSpacing: "-1px" }}>runit</div>
            <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.7, maxWidth: 260 }}>
              Canada&apos;s community-powered task marketplace. Get it done by someone nearby.
            </p>
          </div>

          {[
            { title: "Company", links: ["About", "How it works", "Safety", "Blog"] },
            { title: "Runners", links: ["Earn money", "How to run", "Payouts", "Runner app"] },
            { title: "Cities", links: ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: 14, color: "#D6D3D1", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F97316"}
                    onMouseLeave={e => e.currentTarget.style.color = "#D6D3D1"}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #292524", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#78716C" }}>© 2024 runit. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map(link => (
              <a key={link} href="#" style={{ fontSize: 13, color: "#78716C", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#D6D3D1"}
                onMouseLeave={e => e.currentTarget.style.color = "#78716C"}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Categories />
      <Trust />
      <EarnMoney />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
