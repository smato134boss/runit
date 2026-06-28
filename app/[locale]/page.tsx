"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ─── Hooks ────────────────────────────────────────────────────────────────────

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
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("browseTasks"), href: "#browse-tasks" },
    { label: t("earnMoney"), href: "#earn-money" },
  ];

  return (
    <header>
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-white"
        style={{ background: "#C2410C" }}>
        {t("skip")}
      </a>

      <nav aria-label="Main navigation"
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-stone-200" : "border-b border-transparent"}`}
        style={{ background: scrolled ? "rgba(255,255,255,0.94)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center justify-between">
          <a href={`/${locale}`} className="no-underline py-3">
            <span className="text-2xl font-extrabold tracking-tight transition-colors duration-300"
              style={{ color: scrolled ? "#C2410C" : "white" }}>
              Runly
            </span>
          </a>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href}
                className="text-sm font-medium no-underline transition-colors duration-200 px-4 py-3 rounded-lg"
                style={{ color: scrolled ? "#78716C" : "rgba(255,255,255,0.75)" }}
                onMouseEnter={e => e.currentTarget.style.color = scrolled ? "#1C1917" : "white"}
                onMouseLeave={e => e.currentTarget.style.color = scrolled ? "#78716C" : "rgba(255,255,255,0.75)"}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <LanguageSwitcher scrolled={scrolled} />
            <a href={`/${locale}/login`}
              className="hidden sm:block text-sm font-medium no-underline transition-colors px-3 py-3"
              style={{ color: scrolled ? "#78716C" : "rgba(255,255,255,0.8)" }}>
              {t("login")}
            </a>
            <a href={`/${locale}/register`}
              className="text-white px-5 py-3 rounded-full text-sm font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "#C2410C", boxShadow: "0 2px 8px rgba(194,65,12,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(194,65,12,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(194,65,12,0.35)"; }}>
              {t("postTask")}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
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
              <span className="text-xs font-semibold tracking-widest" style={{ color: "#FB923C" }}>{t("badge")}</span>
            </div>

            <h1 className="animate-fade-up-delay-1 font-extrabold text-white leading-[1.05] mb-6"
              style={{ fontSize: "clamp(40px,5.5vw,68px)", letterSpacing: "-2.5px" }}>
              {t("h1a")}<br />
              {t("h1b")} <span style={{ color: "#F97316" }}>{t("h1highlight")}</span>
            </h1>

            <p className="animate-fade-up-delay-2 text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 460 }}>
              {t("subtitle")}
            </p>

            <div className="animate-fade-up-delay-2 flex flex-wrap gap-3 mb-10">
              <a href={`/${locale}/register`}
                className="text-white rounded-full text-base font-bold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 px-7 py-4"
                style={{ background: "#C2410C", boxShadow: "0 4px 20px rgba(194,65,12,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(194,65,12,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(194,65,12,0.4)"; }}>
                {t("cta1")}
              </a>
              <a href={`/${locale}/tasks/browse`}
                className="text-white rounded-full text-base font-semibold no-underline transition-all duration-200 px-7 py-4"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                {t("cta2")}
              </a>
            </div>

            <div className="animate-fade-up-delay-3 flex flex-wrap gap-5">
              {([["🔒", t("trust1")], ["✅", t("trust2")], ["⚡", t("trust3")]] as [string, string][]).map(([icon, text]) => (
                <span key={text} className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-float">
            <div className="rounded-3xl p-7 w-full max-w-[370px]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>{t("cardLabel")}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ color: "#4ADE80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  ● {t("cardStatus")}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-white mb-5 leading-snug">{t("cardTitle")}</h3>
              <div className="flex flex-col gap-2.5 mb-5">
                {([["📍", t("cardLocation"), false], ["💰", t("cardBudget"), true], ["⏰", t("cardTime"), false]] as [string, string, boolean][]).map(([icon, val, hi], i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span>{icon}</span>
                    <span className="text-sm" style={{ color: hi ? "#F97316" : "rgba(255,255,255,0.6)", fontWeight: hi ? 700 : 500 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex">
                  {["#FCA5A5", "#FCD34D", "#6EE7B7"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{ backgroundColor: c, border: "2px solid rgba(28,25,23,0.8)", marginLeft: i === 0 ? 0 : -8, color: "#1C1917" }}>
                      {["A", "B", "C"][i]}
                    </div>
                  ))}
                </div>
                <button className="text-white text-sm font-bold px-4 py-2.5 rounded-full border-0 cursor-pointer"
                  style={{ background: "#F97316" }}>
                  {t("cardCta")}
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
  const t = useTranslations("Stats");
  const { ref, inView } = useInView(0.3);
  const tasks = useCounter(12000, 1800, inView);
  const runners = useCounter(8500, 1800, inView);
  const cityCnt = useCounter(23, 1200, inView);

  const stats = [
    { value: tasks.toLocaleString() + "+", label: t("tasksPosted") },
    { value: runners.toLocaleString() + "+", label: t("activeRunners") },
    { value: "4.9★", label: t("avgRating") },
    { value: cityCnt + " cities", label: t("acrossCanada") },
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
  const t = useTranslations("HowItWorks");
  const steps = [
    { n: "01", title: t("step1Title"), desc: t("step1Desc"), icon: "🗒️" },
    { n: "02", title: t("step2Title"), desc: t("step2Desc"), icon: "🙋" },
    { n: "03", title: t("step3Title"), desc: t("step3Desc"), icon: "✅" },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>{t("badge")}</p>
          <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            {t("h2a")}<br />{t("h2b")}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#78716C" }}>{t("desc")}</p>
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
  const t = useTranslations("Categories");
  const locale = useLocale();
  const categories = [
    { icon: "📦", name: t("c1"), tasks: "3,200+" },
    { icon: "🛒", name: t("c2"), tasks: "1,800+" },
    { icon: "💐", name: t("c3"), tasks: "940+" },
    { icon: "🏠", name: t("c4"), tasks: "2,100+" },
    { icon: "🚗", name: t("c5"), tasks: "1,500+" },
    { icon: "📋", name: t("c6"), tasks: "780+" },
    { icon: "🐾", name: t("c7"), tasks: "620+" },
    { icon: "💻", name: t("c8"), tasks: "1,060+" },
  ];

  return (
    <section id="browse-tasks" className="py-16 md:py-24 px-6" style={{ background: "#F5F4F2" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>{t("badge")}</p>
            <h2 className="font-extrabold leading-tight" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
              {t("h2a")}<br />{t("h2b")}
            </h2>
          </div>
          <a href={`/${locale}/tasks/browse`} className="text-sm font-semibold no-underline" style={{ color: "#F97316" }}>{t("browseAll")}</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <a key={i} href={`/${locale}/tasks/browse`}
              className="bg-white rounded-2xl p-6 no-underline block transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1.5px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(249,115,22,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-sm font-bold mb-1" style={{ color: "#1C1917" }}>{cat.name}</div>
              <div className="text-xs font-medium" style={{ color: "#78716C" }}>{cat.tasks} {t("tasksSuffix")}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Price Guide ──────────────────────────────────────────────────────────────

function PriceGuide() {
  const t = useTranslations("PriceGuide");
  const pricingExamples = [
    { emoji: "📦", task: t("t1"), range: "$15 – $35", time: t("sameDay") },
    { emoji: "🛒", task: t("t2"), range: "$20 – $40", time: t("twoThreeHrs") },
    { emoji: "💐", task: t("t3"), range: "$25 – $50", time: t("sameDay") },
    { emoji: "🏠", task: t("t4"), range: "$40 – $80", time: t("twoFourHrs") },
    { emoji: "🐾", task: t("t5"), range: "$20 – $30", time: t("scheduled") },
    { emoji: "🚗", task: t("t6"), range: "$30 – $60", time: t("scheduled") },
  ];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>{t("badge")}</p>
          <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            {t("h2a")}<br />{t("h2b")}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#78716C" }}>{t("desc")}</p>
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

        <p className="text-xs text-center" style={{ color: "#A8A29E" }}>{t("disclaimer")}</p>
      </div>
    </section>
  );
}

// ─── Trust ────────────────────────────────────────────────────────────────────

function Trust() {
  const t = useTranslations("Trust");
  const pillars = [
    { icon: "🔒", title: t("p1Title"), desc: t("p1Desc"), stat: t("p1Stat"), statLabel: t("p1StatLabel") },
    { icon: "✅", title: t("p2Title"), desc: t("p2Desc"), stat: t("p2Stat"), statLabel: t("p2StatLabel") },
    { icon: "💬", title: t("p3Title"), desc: t("p3Desc"), stat: t("p3Stat"), statLabel: t("p3StatLabel") },
  ];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#1C1917" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[560px] mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>{t("badge")}</p>
          <h2 className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1.5px" }}>
            {t("h2a")}<br />{t("h2b")}
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
  const t = useTranslations("EarnMoney");
  const locale = useLocale();
  const bullets = [t("b1"), t("b2"), t("b3"), t("b4")];
  const taskRows = [
    { task: t("task1"), amt: "$45", done: true },
    { task: t("task2"), amt: "$60", done: true },
    { task: t("task3"), amt: "$35", done: false },
    { task: t("task4"), amt: "$55", done: true },
  ];

  return (
    <section id="earn-money" className="py-16 md:py-24 px-6" style={{ background: "#F5F4F2" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: "#F97316" }}>{t("badge")}</p>
          <h2 className="font-extrabold leading-tight mb-5" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            {t("h2a")}<br />{t("h2b")}
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#78716C" }}>
            {t("desc")}
          </p>
          <div className="flex flex-col gap-3.5 mb-10">
            {bullets.map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{["🗓️", "⚡", "📍", "💬"][i]}</span>
                <span className="text-base font-medium" style={{ color: "#1C1917" }}>{text}</span>
              </div>
            ))}
          </div>
          <a href={`/${locale}/register`}
            className="text-white px-8 py-4 rounded-full text-base font-bold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "#1C1917" }}
            onMouseEnter={e => e.currentTarget.style.background = "#C2410C"}
            onMouseLeave={e => e.currentTarget.style.background = "#1C1917"}>
            {t("cta")}
          </a>
        </div>

        <div className="animate-float-slow">
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.1)", border: "1px solid #E7E5E4" }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "#78716C" }}>{t("cardLabel")}</p>
                <p className="text-5xl font-extrabold leading-none" style={{ color: "#1C1917", letterSpacing: "-2px" }}>$512</p>
                <p className="text-xs font-semibold mt-1.5" style={{ color: "#22C55E" }}>{t("cardGrowth")}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "#FFF7ED" }}>💰</div>
            </div>

            <div className="rounded-xl p-4 mb-5" style={{ background: "#F5F4F2" }}>
              <div className="flex justify-between mb-2.5">
                <span className="text-xs font-semibold" style={{ color: "#78716C" }}>{t("tasksThisWeek")}</span>
                <span className="text-xs font-semibold" style={{ color: "#78716C" }}>{t("earned")}</span>
              </div>
              {taskRows.map(({ task, amt, done }, i) => (
                <div key={i} className="flex justify-between items-center py-2.5" style={{ borderTop: i > 0 ? "1px solid #E7E5E4" : "none" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>{task}</p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: done ? "#22C55E" : "#F97316" }}>
                      {done ? t("completed") : t("inProgress")}
                    </p>
                  </div>
                  <span className="text-base font-bold" style={{ color: "#22C55E" }}>+{amt}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-white text-sm font-bold py-3 rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: "#F97316" }}>
                {t("withdraw")}
              </button>
              <button className="flex-1 text-sm font-semibold py-3 rounded-xl border-0 cursor-pointer transition-opacity hover:opacity-75"
                style={{ background: "#F5F4F2", color: "#1C1917" }}>
                {t("viewHistory")}
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
  const t = useTranslations("Testimonials");
  const testimonials = [
    { quote: t("q1"), name: t("n1"), role: t("r1"), initials: t("n1").split(" ").map(n => n[0]).join(""), color: "#FED7AA" },
    { quote: t("q2"), name: t("n2"), role: t("r2"), initials: t("n2").split(" ").map(n => n[0]).join(""), color: "#BBF7D0" },
    { quote: t("q3"), name: t("n3"), role: t("r3"), initials: t("n3").split(" ").map(n => n[0]).join(""), color: "#BFDBFE" },
  ];
  const topColors = ["#F97316", "#22C55E", "#3B82F6"];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>{t("badge")}</p>
          <h2 className="font-extrabold leading-tight" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#1C1917", letterSpacing: "-1.5px" }}>
            {t("h2a")}<br />{t("h2b")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t2, i) => (
            <div key={i}
              className="bg-white rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 cursor-default"
              style={{ border: "1px solid #E7E5E4", borderTop: `4px solid ${topColors[i]}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => <span key={j} style={{ color: "#F97316" }}>★</span>)}
              </div>
              <p className="text-base leading-relaxed mb-7 italic" style={{ color: "#44403C" }}>
                &ldquo;{t2.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: t2.color, color: "#1C1917" }}>
                  {t2.initials}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1C1917" }}>{t2.name}</p>
                  <p className="text-xs" style={{ color: "#78716C" }}>{t2.role}</p>
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
  const t = useTranslations("Cities");
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  const initialCities = [
    { label: "Toronto",      slug: "toronto" },
    { label: "Hamilton",     slug: "hamilton" },
    { label: "Vancouver",    slug: "vancouver" },
    { label: "Ottawa",       slug: "ottawa" },
    { label: "Calgary",      slug: "calgary" },
    { label: "Mississauga",  slug: "mississauga" },
    { label: "Brampton",     slug: "brampton" },
    { label: "Edmonton",     slug: "edmonton" },
  ];
  const moreCities = [
    { label: "Montréal",     slug: "montreal" },
    { label: "Québec",       slug: "quebec-city" },
    { label: "Laval",        slug: "laval" },
    { label: "Winnipeg",     slug: "winnipeg" },
    { label: "London",       slug: "london" },
    { label: "Kitchener",    slug: "kitchener" },
    { label: "Victoria",     slug: "victoria" },
    { label: "Kelowna",      slug: "kelowna" },
    { label: "Saskatoon",    slug: "saskatoon" },
    { label: "Regina",       slug: "regina" },
    { label: "Halifax",      slug: "halifax" },
    { label: "Moncton",      slug: "moncton" },
    { label: "Fredericton",  slug: "fredericton" },
    { label: "St. John's",   slug: "st-johns" },
    { label: "Charlottetown",slug: "charlottetown" },
  ];

  const visible = showAll ? [...initialCities, ...moreCities] : initialCities;

  return (
    <section className="py-10 px-6" style={{ background: "#F5F4F2", borderTop: "1px solid #E7E5E4" }}>
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-6">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#78716C" }}>{t("nowIn")}</span>
        <div className="flex flex-wrap gap-2.5 items-center">
          {visible.map(city => (
            <a key={city.slug} href={`/${locale}/${city.slug}`}
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-white transition-all duration-200 no-underline"
              style={{ border: "1px solid #E7E5E4", color: "#44403C" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E4"; e.currentTarget.style.color = "#44403C"; }}>
              {city.label}
            </a>
          ))}
          {!showAll && (
            <button onClick={() => setShowAll(true)}
              className="text-sm font-semibold py-1.5 px-3 rounded-full transition-all duration-200 border-0 bg-transparent cursor-pointer"
              style={{ color: "#F97316" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {t("more")} +
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const t = useTranslations("FAQ");
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
      <div className="max-w-[760px] mx-auto">
        <p className="text-xs font-bold tracking-[0.18em] uppercase mb-4 text-center" style={{ color: "#F97316" }}>{t("badge")}</p>
        <h2 className="font-extrabold text-center leading-tight mb-12" style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1.5px", color: "#1C1917" }}>
          {t("h2")}
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
  const t = useTranslations("FinalCTA");
  const locale = useLocale();
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(150deg,#1C1917 0%,#292524 100%)" }}>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)" }} />
      <div className="max-w-[700px] mx-auto text-center relative">
        <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: "#F97316" }}>{t("badge")}</p>
        <h2 className="font-extrabold text-white leading-tight mb-5" style={{ fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-2px" }}>
          {t("h2a")}<br />
          <span style={{ color: "#F97316" }}>{t("h2b")}</span>
        </h2>
        <p className="text-lg mb-11 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("desc")}
        </p>
        <div className="flex flex-wrap gap-3.5 justify-center">
          <a href={`/${locale}/register`}
            className="text-white px-9 py-4 rounded-full text-base font-bold no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "#C2410C", boxShadow: "0 4px 20px rgba(194,65,12,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#9A3412"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#C2410C"; }}>
            {t("cta1")}
          </a>
          <a href={`/${locale}/register`}
            className="text-white px-9 py-4 rounded-full text-base font-semibold no-underline transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
            {t("cta2")}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const footerCols = [
    { title: t("col1"), links: [[t("col1l1"), "#how-it-works"], [t("col1l2"), `/${locale}/tasks/browse`], [t("col1l3"), `/${locale}/register`], [t("col1l4"), "#"]] },
    { title: t("col2"), links: [[t("col2l1"), "#earn-money"], [t("col2l2"), "#"], [t("col2l3"), "#"], [t("col2l4"), `/${locale}/dashboard`]] },
    { title: t("col3"), links: [[t("col3l1"), `/${locale}/toronto`], [t("col3l2"), `/${locale}/hamilton`], [t("col3l3"), `/${locale}/vancouver`], [t("col3l4"), `/${locale}/ottawa`], [t("col3l5"), `/${locale}/calgary`]] },
    { title: t("col4"), links: [[t("col4l1"), `/${locale}/privacy`], [t("col4l2"), `/${locale}/terms`], [t("col4l3"), "#"]] },
  ];

  return (
    <footer className="px-6 pt-16 pb-9" style={{ background: "#1C1917", color: "white" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-12 mb-14">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-2xl font-extrabold mb-4" style={{ color: "#F97316", letterSpacing: "-1px" }}>Runly</div>
            <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("tagline")}
            </p>
            <div className="flex gap-2.5 mt-6 flex-wrap">
              {[t("appStore"), t("googlePlay")].map(store => (
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
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>{t("copyright")}</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>{t("trustedBy")}</p>
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
