import type { MetadataRoute } from "next";

const BASE = "https://runly.ca";

const cities = [
  { slug: "toronto",      priority: 0.85 },
  { slug: "hamilton",     priority: 0.85 },
  { slug: "vancouver",    priority: 0.85 },
  { slug: "ottawa",       priority: 0.85 },
  { slug: "calgary",      priority: 0.85 },
  { slug: "edmonton",     priority: 0.85 },
  { slug: "mississauga",  priority: 0.85 },
  { slug: "brampton",     priority: 0.85 },
  { slug: "london",       priority: 0.80 },
  { slug: "kitchener",    priority: 0.80 },
  { slug: "victoria",     priority: 0.80 },
  { slug: "kelowna",      priority: 0.80 },
  { slug: "montreal",     priority: 0.85 },
  { slug: "quebec-city",  priority: 0.80 },
  { slug: "laval",        priority: 0.80 },
  { slug: "winnipeg",     priority: 0.80 },
  { slug: "saskatoon",    priority: 0.75 },
  { slug: "regina",       priority: 0.75 },
  { slug: "halifax",      priority: 0.80 },
  { slug: "moncton",      priority: 0.75 },
  { slug: "fredericton",  priority: 0.75 },
  { slug: "st-johns",     priority: 0.75 },
  { slug: "charlottetown",priority: 0.70 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const locales = ["en", "fr"];

  const staticPages = [
    { path: "",            freq: "weekly"  as const, priority: 1.0 },
    { path: "/tasks/browse", freq: "daily" as const, priority: 0.9 },
    { path: "/register",   freq: "monthly" as const, priority: 0.8 },
    { path: "/login",      freq: "monthly" as const, priority: 0.5 },
    { path: "/privacy",    freq: "yearly"  as const, priority: 0.3 },
    { path: "/terms",      freq: "yearly"  as const, priority: 0.3 },
  ];

  const staticEntries = locales.flatMap(locale =>
    staticPages.map(p => ({
      url: `${BASE}/${locale}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    }))
  );

  const cityEntries = locales.flatMap(locale =>
    cities.map(c => ({
      url: `${BASE}/${locale}/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: c.priority,
    }))
  );

  return [...staticEntries, ...cityEntries];
}
