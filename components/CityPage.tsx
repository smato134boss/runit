import type { Metadata } from "next";

export interface CityData {
  slug: string;
  name: string;
  runners: string;
  tasks: string;
  rating: string;
  tagline: string;
  description: string;
  neighborhoods: string[];
  popularTasks: { emoji: string; task: string; price: string; time: string }[];
  airportTask?: { emoji: string; task: string; price: string; time: string };
}

export function buildMetadata(city: CityData): Metadata {
  const title = `Errand & Task Service in ${city.name} | Runly`;
  const description = `Post any errand in ${city.name} and a verified local runner picks it up — same day. Grocery runs, parcel delivery, home tasks and more. Free to post.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `https://runly.ca/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `https://runly.ca/${city.slug}`,
      locale: "en_CA",
    },
  };
}

export function buildSchema(city: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Runly ${city.name}`,
    url: `https://runly.ca/${city.slug}`,
    description: city.description,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Canada" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: city.rating,
      reviewCount: Math.floor(parseInt(city.tasks.replace(/\D/g, "")) / 28).toString(),
      bestRating: "5",
    },
    serviceType: "Task Marketplace",
  };
}

export default function CityPage({ city }: { city: CityData }) {
  const schema = buildSchema(city);
  const allTasks = city.airportTask
    ? [...city.popularTasks, city.airportTask]
    : city.popularTasks;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28"
        style={{ background: "linear-gradient(150deg,#1C1917 0%,#292524 100%)" }}
      >
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="max-w-[800px] mx-auto relative text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", color: "#FB923C" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
            Now live in {city.name}
          </div>
          <h1
            className="font-extrabold text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(36px,6vw,68px)", letterSpacing: "-2.5px" }}
          >
            Your neighbour in{" "}
            <span style={{ color: "#F97316" }}>{city.name}</span>
            <br />will handle it.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-[580px] mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            {city.tagline}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#C2410C" }}
            >
              Post a task — it&apos;s free
            </a>
            <a
              href="/tasks/browse"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              Browse {city.name} tasks
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 px-6 border-b" style={{ background: "#1C1917", borderColor: "#2C2925" }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: city.runners, label: `Runners in ${city.name}` },
            { value: city.tasks, label: "Tasks completed" },
            { value: `${city.rating}★`, label: "Average rating" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: "#F97316", letterSpacing: "-1px" }}>
                {s.value}
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular tasks ── */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3 text-center" style={{ color: "#F97316" }}>
            Popular in {city.name}
          </p>
          <h2
            className="font-extrabold text-center leading-tight mb-12"
            style={{ fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-1.5px", color: "#1C1917" }}
          >
            What {city.name} residents ask for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTasks.map((t) => (
              <div
                key={t.task}
                className="rounded-2xl p-5 border flex flex-col gap-3"
                style={{ background: "#fff", borderColor: "#E7E5E4" }}
              >
                <div className="text-3xl">{t.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: "#1C1917" }}>{t.task}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold" style={{ color: "#C2410C" }}>{t.price}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#F5F5F4", color: "#78716C" }}>
                    {t.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#C2410C" }}
            >
              Post your {city.name} task — free
            </a>
          </div>
        </div>
      </section>

      {/* ── Neighbourhoods ── */}
      <section className="py-16 md:py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#F97316" }}>Coverage</p>
          <h2
            className="font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(24px,3.5vw,36px)", letterSpacing: "-1.5px", color: "#1C1917" }}
          >
            We cover all of {city.name}
          </h2>
          <p className="text-base mb-10" style={{ color: "#78716C" }}>
            Runners are active across every neighbourhood — wherever you are, someone is nearby.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {city.neighborhoods.map((n) => (
              <span
                key={n}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{ background: "#F5F5F4", color: "#57534E", border: "1px solid #E7E5E4" }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-24 px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-[860px] mx-auto">
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3 text-center" style={{ color: "#F97316" }}>How it works</p>
          <h2
            className="font-extrabold text-center leading-tight mb-12"
            style={{ fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-1.5px", color: "#1C1917" }}
          >
            Done in 3 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Post your task", desc: `Describe what you need in ${city.name}, set your budget. Free to post — takes 2 minutes.` },
              { n: "02", title: "A runner bids", desc: `Local ${city.name} runners see your task and send offers. You pick the best one.` },
              { n: "03", title: "Done & paid", desc: "Your runner completes the task. Payment releases only when you're satisfied." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-7 border" style={{ background: "#fff", borderColor: "#E7E5E4" }}>
                <div className="text-4xl font-extrabold mb-4" style={{ color: "#F2EDE8", letterSpacing: "-2px" }}>{s.n}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1C1917" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 md:py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg,#1C1917 0%,#292524 100%)" }}
      >
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)" }}
        />
        <div className="max-w-[640px] mx-auto text-center relative">
          <h2
            className="font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: "clamp(28px,4.5vw,48px)", letterSpacing: "-2px" }}
          >
            Get your first {city.name} task done{" "}
            <span style={{ color: "#F97316" }}>today.</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join {city.runners} runners and thousands of {city.name} residents already using Runly.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#C2410C" }}
            >
              Post a task — it&apos;s free
            </a>
            <a
              href="/register?mode=runner"
              className="inline-flex items-center rounded-full px-8 py-4 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              Become a Runner in {city.name}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
