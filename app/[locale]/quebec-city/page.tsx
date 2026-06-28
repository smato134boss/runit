import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const enCity: CityData = {
  slug: "quebec-city",
  name: "Quebec City",
  runners: "520+",
  tasks: "1,400+",
  rating: "4.9",
  tagline: "Post any errand in Quebec City and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Quebec City residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Old Quebec", "Saint-Roch", "Limoilou", "Sainte-Foy", "Beauport", "Charlesbourg", "Lebourgneuf", "Quartier Saint-Jean-Baptiste"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🌿", task: "Yard work & snow removal", price: "$30–$60", time: "Same day" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YQB airport drop-off", price: "$30–$55", time: "Scheduled" },
};

const frCity: CityData = {
  slug: "quebec-city",
  name: "Québec",
  runners: "520+",
  tasks: "1 400+",
  rating: "4,9",
  tagline: "Publiez n'importe quelle course à Québec et un coursier local vérifié la prend en charge — le jour même. Épicerie, livraison, tâches ménagères et plus.",
  description: "Plateforme de tâches mettant en relation les résidents de Québec avec des coursiers locaux vérifiés pour les courses, livraisons, épicerie et plus.",
  neighborhoods: ["Vieux-Québec", "Saint-Roch", "Limoilou", "Sainte-Foy", "Beauport", "Charlesbourg", "Lebourgneuf", "Quartier Saint-Jean-Baptiste"],
  popularTasks: [
    { emoji: "📦", task: "Collecte et livraison de colis", price: "13 $–30 $", time: "Même jour" },
    { emoji: "🛒", task: "Course d'épicerie", price: "18 $–38 $", time: "2–3 h" },
    { emoji: "🏠", task: "Montage de meubles", price: "38 $–72 $", time: "2–4 h" },
    { emoji: "🌿", task: "Travaux extérieurs et déneigement", price: "30 $–60 $", time: "Même jour" },
    { emoji: "🐾", task: "Promenade de chien (1 h)", price: "18 $–28 $", time: "Sur rendez-vous" },
  ],
  airportTask: { emoji: "🚗", task: "Dépose à l'aéroport YQB", price: "30 $–55 $", time: "Sur rendez-vous" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale === "fr" ? frCity : enCity, locale);
}

export default async function QuebecCityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CityPage city={locale === "fr" ? frCity : enCity} />;
}
