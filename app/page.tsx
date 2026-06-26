"use client";

import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { icon: "📦", name: "Delivery & Pickup", tasks: "3,200+" },
  { icon: "🛒", name: "Grocery Shopping", tasks: "1,800+" },
  { icon: "💐", name: "Send a Gift", tasks: "940+" },
  { icon: "🏠", name: "Home Tasks", tasks: "2,100+" },
  { icon: "🚗", name: "Rides & Transport", tasks: "1,500+" },
  { icon: "📋", name: "Admin & Errands", tasks: "780+" },
  { icon: "🐾", name: "Pet Care", tasks: "620+" },
  { icon: "💻", name: "Online Tasks", tasks: "1,060+" },
];

const steps = [
  { n: "01", title: "Post your task", desc: "Describe what you need, where, and your budget. Free to post — takes under 2 minutes.", icon: "🗒️" },
  { n: "02", title: "Runners bid", desc: "Nearby runners see your task and send offers. You pick the one you like best.", icon: "🙋" },
  { n: "03", title: "Done & paid", desc: "Your runner completes the task. Payment releases only when you're satisfied.", icon: "✅" },
];

const testimonials = [
  { quote: "I sent birthday flowers to my sister in Vancouver without leaving Hamilton. Runly made it so easy.", name: "Maria K.", role: "Task poster · Hamilton", initials: "MK", color: "#FED7AA" },
  { quote: "I make $400–600 extra per week just picking up tasks around Toronto on my days off. Best side income I've found.", name: "James T.", role: "Runner · Toronto", initials: "JT", color: "#BBF7D0" },
  { quote: "Found someone to pick up my parcel from across the city in under an hour. Completely changed how I handle errands.", name: "Priya S.", role: "Task poster · Mississauga", initials: "PS", color: "#BFDBFE" },
];

const pricingExamples = [
  { emoji: "📦", task: "Parcel pickup & drop-off", range: "$15 – $35", time: "Same day" },
  { emoji: "🛒", task: "Grocery run (under $100)", range: "$20 – $40", time: "2–3 hrs" },
  { emoji: "💐", task: "Send flowers across the city", range: "$25 – $50", time: "Same day" },
  { emoji: "🏠", task: "IKEA assembly (1–2 items)", range: "$40 – $80", time: "2–4 hrs" },
  { emoji: "🐾", task: "Dog walk (1 hr)", range: "$20 – $30", time: "Scheduled" },
  { emoji: "🚗", task: "Airport drop-off", range: "$30 – $60", time: "Scheduled" },
];

const cities = ["Toronto", "Hamilton", "Vancouver", "Ottawa", "Calgary", "Mississauga", "Brampton", "Edmonton"];

const faqs = [
  {
    q: "How much does it cost to post a task?",
    a: "Posting a task on Runly is completely free. You only pay when a runner accepts your task and completes it. You set your own budget — runners bid and you choose the offer that works for you.",
  },
  {
    q: "Is Runly available across Canada?",
    a: "Yes. Runly is live in Toronto, Hamilton, Vancouver, Ottawa, Calgary, Mississauga, Brampton, Edmonton, and growing. If you don't see your city yet, post a task anyway — we're expanding fast.",
  },
  {
    q: "How do I know the runner is trustworthy?",
    a: "Every runner on Runly completes identity verification before their first task. You can also see their rating, completed task count, and public reviews before you accept their bid.",
  },
  {
    q: "When does the runner get paid?",
    a: "Payment is held securely by Runly until you confirm the task is done. The runner only receives payment after you mark the task as complete — so you're always protected.",
  },
  {
    q: "What kinds of tasks can I post?",
    a: "Almost anything: parcel pickup and delivery, grocery shopping, sending gifts, home assembly, dog walking, airport drop-offs, admin errands, and more. If it's legal and local, you can post it.",
  },
  {
    q: "How quickly can a runner start my task?",
    a: "Most tasks in active cities receive bids within 15–30 minutes. Same-day completion is common for delivery and shopping tasks. You control the schedule — set a time that works for you.",
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header>
      {/* Skip navigation — accessibility */}
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-white"
        style={{ background: "#C2410C" }}>
        Skip to content
      </a>

      <nav aria-label="Main navigation"
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-stone-200" : "border-b border-transparent"}`}
        style={{ background: scrolled ? "rgba(255,255,255,0.94)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center justify-between">
          <a href="/" className="no-underline py-3">
            <span className="text-2xl font-extrabold tracking-tight transition-colors duration-300"
              style={{ color: scrolled ? "#C2410C" : "white" }}>
              Runly
            </span>
          </a>

          {/* Nav links — touch targets padded to 44px via py-3 */}
          <div className="hidden md:flex gap-1 items-center">
            {["How it works", "Browse tasks", "Earn money"].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium no-underline transition-colors duration-200 px-4 py-3 rounded-lg"
                style={{ color: scrolled ? "#78716C" : "rgba(255,255,255,0.75)" }}
                onMouseEnter={e => e.currentTarget.style.color = scrolled ? "#1C1917" : "white"}
                onMouseLeave={e => e.currentTarget.style.color = scrolled ? "#78716C" : "rgba(255,255,255,0.75)"}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <a href="/login"
              className="hidden sm:block text-sm font-medium no-underline transition-colors px-3 py-3"
              style={{ color: scrolled ? "#78716C" : "rgba(255,255,255,0.8)" }}>
              Log in
            </a>
            {/* Button uses darker orange #C2410C for WCAG AA contrast (5.2:1 with white) */}
            <a href="/register"
              className="text-white px-5 py-3 rounded-full text-sm font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "#C2410C", boxShadow: "0 2px 8px rgba(194,65,12,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(194,65,12,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(194,65,12,0.35)"; }}>
              Post a task
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex items-center px-6 overflow-hidden -mt-[68px]"
      style={{ background: "linear-gradient(150deg,#1C1917 0%,#292524 60%,#1C1917 100%)", minHeight: "100vh" }}>
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#F97316 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)" }} />

      <div id="main-content" className="max-w-[1200px] mx-auto w-full relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-7"
              style={{ background: "rgba(249,115,22,0.12)", borderColor: "rgba(249,115,22,0.3)" }}>
              <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: "#F97316" }} />
              <span className="text-xs font-semibold tracking-widest" style={{ color: "#FB923C" }}>Live across Canada 🇨🇦</span>
            </div>

            <h1 className="animate-fade-up-delay-1 font-extrabold text-white leading-[1.05] mb-6"
              style={{ fontSize: "clamp(40px,5.5vw,68px)", letterSpacing: "-2.5px" }}>
              Your neighbour<br />
              will <span style={{ color: "#F97316" }}>handle it.</span>
            </h1>

            <p className="animate-fade-up-delay-2 text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 460 }}>
              Post any errand or task — a verified runner in your city picks it up.
              Fast, safe, and community-powered.
            </p>

            <div className="animate-fade-up-delay-2 flex flex-wrap gap-3 mb-10">
              <a href="/register"
                className="text-white rounded-full text-base font-bold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 px-7 py-4"
                style={{ background: "#C2410C", boxShadow: "0 4px 20px rgba(194,65,12,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(194,65,12,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(194,65,12,0.4)"; }}>
                Post a task — it&apos;s free →
              </a>
              <a href="/tasks/browse"
                className="text-white rounded-full text-base font-semibold no-underline transition-all duration-200 px-7 py-4"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                Browse tasks
              </a>
            </div>

            <div className="animate-fade-up-delay-3 flex flex-wrap gap-5">
              {[["🔒","Secure payments"],["✅","Verified runners"],["⚡","Same-day delivery"]].map(([icon, text]) => (
                <span key={text} className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>

          {/* Task preview card — hidden on small/medium screens */}
          <div className="hidden lg:flex justify-center animate-float">
            <div className="rounded-3xl p-7 w-full max-w-[370px]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Task request</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ color: "#4ADE80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  ● 3 runners interested
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-white mb-5 leading-snug">
                Pick up flowers in Toronto for my mom 💐
              </h3>
              <div className="flex flex-col gap-2.5 mb-5">
                {[["📍","Hamilton → Toronto",false],["💰","Budget: $35",true],["⏰","Today, by 5 pm",false]].map(([icon, val, hi], i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span>{icon}</span>
                    <span className="text-sm" style={{ color: hi ? "#F97316" : "rgba(255,255,255,0.6)", fontWeight: hi ? 700 : 500 }}>{val as string}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex">
                  {["#FCA5A5","#FCD34D","#6EE7B7"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: c, border: "2px solid rgba(28,25,23,0.8)", marginLeft: i === 0 ? 0 : -8, color: "#1C1917" }}>
                      {["A","B","C"][i]}
                    </div>
                  ))}
                </div>
                <button className="text-white text-sm font-bold px-4 py-2.5 rounded-full border-0 cursor-pointer"
                  style={{ background: "#F97316" }}>
                  View offers
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────

function StatsBar() {
  const { ref, inView } = useInView(0.3);
  const tasks   = useCounter(12000, 1800, inView);
  const runners = useCounter(8500,  1800, inView);
  const cityCnt = useCounter(12,    1200, inView);

  const stats = [
    { value: tasks.toLocaleString() + "+",   label: "Tasks posted" },
    { value: runners.toLocaleString() + "+", label: "Active runners" },
    { value: "4.9★",                         label: "Average rating" },
    { value: cityCnt + " cities",            label: "Across Canada" },
  ];

  return (
    <div ref={ref} className="px-6 py-9" style={{ background: "#1C1917" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label}>
            <div className="text-3xl font-extrabold" style={{ color: "#F97316", letterSpacing: "-1px" }}>{s.value}</div>
            <div className="text-sm font-medium mt-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>How it works</p>
          <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            From task to done<br />in three steps.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#78716C" }}>
            No phone calls, no hunting for contacts. Post once, get offers from verified runners nearby.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {steps.map((step, i) => (
            <div key={i}
              className="p-10 transition-transform duration-200 hover:-translate-y-1 cursor-default"
              style={{
                background: i === 1 ? "#1C1917" : "white",
                border: "1px solid #E7E5E4",
                borderLeft: i > 0 ? "none" : "1px solid #E7E5E4",
                borderRadius: i === 0 ? "20px 0 0 20px" : i === 2 ? "0 20px 20px 0" : 0,
              }}>
              <div className="text-5xl font-extrabold mb-6 leading-none" style={{ color: i === 1 ? "rgba(249,115,22,0.2)" : "rgba(0,0,0,0.06)", letterSpacing: "-2px" }}>{step.n}</div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2.5" style={{ color: i === 1 ? "white" : "#1C1917" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: i === 1 ? "rgba(255,255,255,0.55)" : "#78716C" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

function Categories() {
  return (
    <section id="browse-tasks" className="py-16 md:py-24 px-6" style={{ background: "#F5F4F2" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>Categories</p>
            <h2 className="font-extrabold leading-tight" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
              What can Runly<br />do for you?
            </h2>
          </div>
          <a href="/tasks/browse" className="text-sm font-semibold no-underline" style={{ color: "#F97316" }}>Browse all tasks →</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <a key={i} href="/tasks/browse"
              className="bg-white rounded-2xl p-6 no-underline block transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1.5px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(249,115,22,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-sm font-bold mb-1" style={{ color: "#1C1917" }}>{cat.name}</div>
              <div className="text-xs font-medium" style={{ color: "#78716C" }}>{cat.tasks} tasks</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Price Guide ──────────────────────────────────────────────────────────────

function PriceGuide() {
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>Pricing guide</p>
          <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            Know what to budget<br />before you post.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#78716C" }}>
            Typical prices for the most popular tasks on Runly. You set your own budget — runners bid competitively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pricingExamples.map((item, i) => (
            <div key={i}
              className="bg-white rounded-2xl p-6 flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
              style={{ border: "1px solid #E7E5E4" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "#FFF7ED" }}>
                {item.emoji}
              </div>
              <div>
                <div className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: "#1C1917" }}>{item.task}</div>
                <div className="text-xl font-extrabold mb-1" style={{ color: "#F97316", letterSpacing: "-0.5px" }}>{item.range}</div>
                <div className="text-xs font-medium" style={{ color: "#78716C" }}>⏱ {item.time}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center" style={{ color: "#A8A29E" }}>
          Prices are typical ranges based on completed tasks. Final price depends on your location and task details.
        </p>
      </div>
    </section>
  );
}

// ─── Trust ────────────────────────────────────────────────────────────────────

function Trust() {
  const pillars = [
    { icon: "🔒", title: "Secure payments", desc: "Funds are held safely until the task is done and you're satisfied. You never pay for incomplete work.", stat: "100%", statLabel: "payment protection" },
    { icon: "✅", title: "Verified runners", desc: "Every runner is reviewed by the community, rated after each task, and can be reported instantly.", stat: "4.9★", statLabel: "average runner rating" },
    { icon: "💬", title: "Real reviews", desc: "Thousands of honest reviews from real Canadians in your city — no fake testimonials, ever.", stat: "98%", statLabel: "tasks completed on time" },
  ];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#1C1917" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>Trust & safety</p>
          <h2 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1.5px" }}>
            Built on trust.<br />Backed by data.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {pillars.map((p, i) => (
            <div key={i}
              className="p-10 transition-all duration-200 cursor-default"
              style={{ background: "rgba(255,255,255,0.04)", borderLeft: `4px solid ${i === 0 ? "#F97316" : "rgba(255,255,255,0.06)"}` }}
              onMouseEnter={e => e.currentTarget.style.borderLeftColor = "#F97316"}
              onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderLeftColor = "rgba(255,255,255,0.06)"; }}>
              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2.5">{p.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{p.desc}</p>
              <div className="text-3xl font-extrabold" style={{ color: "#F97316", letterSpacing: "-1px" }}>{p.stat}</div>
              <div className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{p.statLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Earn Money ───────────────────────────────────────────────────────────────

function EarnMoney() {
  return (
    <section id="earn-money" className="py-16 md:py-24 px-6" style={{ background: "#F5F4F2" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "#F97316" }}>For runners</p>
          <h2 className="font-extrabold leading-tight mb-5" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            Turn your free time<br />into real income.
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#78716C" }}>
            Runners on Runly average <strong style={{ color: "#1C1917" }}>$400–600/week</strong> picking up tasks nearby. No boss, no minimum hours, no commute.
          </p>
          <div className="flex flex-col gap-3.5 mb-10">
            {[["🗓️","Work only when you want to"],["⚡","Payouts every week, no delays"],["📍","Only tasks near you"],["💬","Build your reputation, earn more"]].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-base font-medium" style={{ color: "#1C1917" }}>{text}</span>
              </div>
            ))}
          </div>
          <a href="/register"
            className="text-white px-8 py-4 rounded-full text-base font-bold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "#1C1917" }}
            onMouseEnter={e => e.currentTarget.style.background = "#C2410C"}
            onMouseLeave={e => e.currentTarget.style.background = "#1C1917"}>
            Start earning today →
          </a>
        </div>

        <div className="animate-float-slow">
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.1)", border: "1px solid #E7E5E4" }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "#78716C" }}>This week&apos;s earnings</p>
                <p className="text-5xl font-extrabold leading-none" style={{ color: "#1C1917", letterSpacing: "-2px" }}>$512</p>
                <p className="text-xs font-semibold mt-1.5" style={{ color: "#22C55E" }}>↑ 23% vs last week</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "#FFF7ED" }}>💰</div>
            </div>

            <div className="rounded-xl p-4 mb-5" style={{ background: "#F5F4F2" }}>
              <div className="flex justify-between mb-2.5">
                <span className="text-xs font-semibold" style={{ color: "#78716C" }}>Tasks this week</span>
                <span className="text-xs font-semibold" style={{ color: "#78716C" }}>Earned</span>
              </div>
              {[
                ["Grocery run · Scarborough","$45",true],
                ["Package pickup · Etobicoke","$60",true],
                ["Send flowers · North York","$35",false],
                ["Airport drop-off · YYZ","$55",true],
              ].map(([task, amt, done], i) => (
                <div key={i} className="flex justify-between items-center py-2.5" style={{ borderTop: i > 0 ? "1px solid #E7E5E4" : "none" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>{task as string}</p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: done ? "#22C55E" : "#F97316" }}>
                      {done ? "✓ Completed" : "● In progress"}
                    </p>
                  </div>
                  <span className="text-base font-bold" style={{ color: "#22C55E" }}>+{amt as string}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-white text-sm font-bold py-3 rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: "#F97316" }}>
                Withdraw $512
              </button>
              <button className="flex-1 text-sm font-semibold py-3 rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-75"
                style={{ background: "#F5F4F2", color: "#1C1917" }}>
                View history
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const topColors = ["#F97316","#22C55E","#3B82F6"];
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>What people say</p>
          <h2 className="font-extrabold leading-tight" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            Real Canadians.<br />Real tasks. Real results.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i}
              className="bg-white rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 cursor-default"
              style={{ border: "1px solid #E7E5E4", borderTop: `4px solid ${topColors[i]}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_,j) => <span key={j} style={{ color: "#F97316" }}>★</span>)}
              </div>
              <p className="text-base leading-relaxed mb-7 italic" style={{ color: "#44403C" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: t.color, color: "#1C1917" }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1C1917" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#78716C" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cities ───────────────────────────────────────────────────────────────────

function Cities() {
  return (
    <section className="py-10 px-6" style={{ background: "#F5F4F2", borderTop: "1px solid #E7E5E4" }}>
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-6">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#78716C" }}>Now in</span>
        <div className="flex flex-wrap gap-2.5">
          {cities.map(city => (
            <span key={city}
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-white transition-all duration-200 cursor-default"
              style={{ border: "1px solid #E7E5E4", color: "#44403C" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.color = "#44403C"; }}>
              {city}
            </span>
          ))}
          <span className="text-sm font-semibold py-1.5" style={{ color: "#F97316" }}>+ more →</span>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[760px] mx-auto">
        <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4 text-center" style={{ color: "#F97316" }}>FAQ</p>
        <h2 className="font-extrabold text-center leading-tight mb-12" style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1.5px", color: "#1C1917" }}>
          Common questions
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border transition-all"
              style={{ borderColor: open === i ? "#F97316" : "#E7E5E4", background: "#fff" }}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-600 text-base leading-snug" style={{ color: "#1C1917", fontWeight: 600 }}>{faq.q}</span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform text-sm font-bold"
                  style={{
                    background: open === i ? "#C2410C" : "#F5F5F4",
                    color: open === i ? "#fff" : "#78716C",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "all 0.2s ease",
                  }}
                >+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-base leading-relaxed" style={{ color: "#57534E" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(150deg,#1C1917 0%,#292524 100%)" }}>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)" }} />
      <div className="max-w-[700px] mx-auto text-center relative">
        <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: "#F97316" }}>Ready?</p>
        <h2 className="font-extrabold text-white leading-tight mb-5" style={{ fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-2px" }}>
          Get your first task done<br />
          <span style={{ color: "#F97316" }}>today.</span>
        </h2>
        <p className="text-lg mb-11 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Join thousands of Canadians who trust Runly to handle their everyday tasks.
        </p>
        <div className="flex flex-wrap gap-3.5 justify-center">
          <a href="/register"
            className="text-white px-9 py-4 rounded-full text-base font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "#C2410C", boxShadow: "0 4px 20px rgba(194,65,12,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; }}>
            Post a task — it&apos;s free
          </a>
          <a href="/register"
            className="text-white px-9 py-4 rounded-full text-base font-semibold no-underline transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
            Become a Runner
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerCols = [
  { title: "Product", links: [["How it works","#how-it-works"],["Browse tasks","/tasks/browse"],["Post a task","/register"],["Pricing guide","#"]] },
  { title: "Runners", links: [["Earn money","#earn-money"],["How to run","#"],["Payouts","#"],["Dashboard","/dashboard"]] },
  { title: "Cities",  links: [["Toronto","#"],["Hamilton","#"],["Vancouver","#"],["Ottawa","#"],["Calgary","#"]] },
  { title: "Legal",   links: [["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Safety","#"]] },
];

function Footer() {
  return (
    <footer className="px-6 pt-16 pb-9" style={{ background: "#1C1917", color: "white" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-12 mb-14">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-2xl font-extrabold mb-4" style={{ color: "#F97316", letterSpacing: "-1px" }}>Runly</div>
            <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Canada&apos;s community-powered task marketplace. Get it done by someone nearby.
            </p>
            <div className="flex gap-2.5 mt-6 flex-wrap">
              {["🍎 App Store","▶ Google Play"].map(store => (
                <a key={store} href="#"
                  className="text-[11px] font-semibold px-3 py-2 rounded-lg no-underline transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                  {store}
                </a>
              ))}
            </div>
          </div>

          {footerCols.map(col => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map(([label, href]) => (
                  <a key={label} href={href}
                    className="text-sm no-underline transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 pt-7" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>© 2025 Runly. All rights reserved. Made in Canada 🇨🇦</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>Trusted by 8,500+ runners across Canada</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Categories />
      <PriceGuide />
      <Trust />
      <EarnMoney />
      <Testimonials />
      <Cities />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
