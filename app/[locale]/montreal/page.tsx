import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const enCity: CityData = {
  slug: "montreal",
  name: "Montreal",
  runners: "2,100+",
  tasks: "5,800+",
  rating: "4.9",
  tagline: "Post any errand in Montreal and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Montreal residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Plateau-Mont-Royal", "Mile End", "Downtown", "Rosemont", "Villeray", "Verdun", "Côte-des-Neiges", "Outremont"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$35", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$20–$42", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$25–$50", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$80", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$20–$32", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YUL airport drop-off", price: "$40–$65", time: "Scheduled" },
};

const frCity: CityData = {
  slug: "montreal",
  name: "Montréal",
  runners: "2 100+",
  tasks: "5 800+",
  rating: "4,9",
  tagline: "Publiez n'importe quelle course à Montréal et un coursier local vérifié la prend en charge — le jour même. Épicerie, livraison, tâches ménagères et plus.",
  description: "Plateforme de tâches mettant en relation les résidents de Montréal avec des coursiers locaux vérifiés pour les courses, livraisons, épicerie et plus.",
  neighborhoods: ["Plateau-Mont-Royal", "Mile End", "Centre-ville", "Rosemont", "Villeray", "Verdun", "Côte-des-Neiges", "Outremont"],
  popularTasks: [
    { emoji: "📦", task: "Collecte et livraison de colis", price: "15 $–35 $", time: "Même jour" },
    { emoji: "🛒", task: "Course d'épicerie", price: "20 $–42 $", time: "2–3 h" },
    { emoji: "💐", task: "Envoyer des fleurs dans toute la ville", price: "25 $–50 $", time: "Même jour" },
    { emoji: "🏠", task: "Montage IKEA", price: "40 $–80 $", time: "2–4 h" },
    { emoji: "🐾", task: "Promenade de chien (1 h)", price: "20 $–32 $", time: "Sur rendez-vous" },
  ],
  airportTask: { emoji: "🚗", task: "Dépose à l'aéroport YUL", price: "40 $–65 $", time: "Sur rendez-vous" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale === "fr" ? frCity : enCity, locale);
}

export default async function MontrealPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CityPage city={locale === "fr" ? frCity : enCity} />;
}
