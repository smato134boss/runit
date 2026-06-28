import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const enCity: CityData = {
  slug: "laval",
  name: "Laval",
  runners: "680+",
  tasks: "1,800+",
  rating: "4.9",
  tagline: "Post any errand in Laval and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Laval residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Chomedey", "Sainte-Rose", "Vimont", "Pont-Viau", "Auteuil", "Fabreville", "Saint-Vincent-de-Paul", "Duvernay"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🌿", task: "Lawn care & yard work", price: "$32–$60", time: "2–3 hrs" },
    { emoji: "🏠", task: "IKEA assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
};

const frCity: CityData = {
  slug: "laval",
  name: "Laval",
  runners: "680+",
  tasks: "1 800+",
  rating: "4,9",
  tagline: "Publiez n'importe quelle course à Laval et un coursier local vérifié la prend en charge — le jour même. Épicerie, livraison, tâches ménagères et plus.",
  description: "Plateforme de tâches mettant en relation les résidents de Laval avec des coursiers locaux vérifiés pour les courses, livraisons, épicerie et plus.",
  neighborhoods: ["Chomedey", "Sainte-Rose", "Vimont", "Pont-Viau", "Auteuil", "Fabreville", "Saint-Vincent-de-Paul", "Duvernay"],
  popularTasks: [
    { emoji: "📦", task: "Collecte et livraison de colis", price: "13 $–28 $", time: "Même jour" },
    { emoji: "🛒", task: "Course d'épicerie", price: "18 $–38 $", time: "2–3 h" },
    { emoji: "🌿", task: "Entretien du gazon et travaux extérieurs", price: "32 $–60 $", time: "2–3 h" },
    { emoji: "🏠", task: "Montage IKEA", price: "38 $–72 $", time: "2–4 h" },
    { emoji: "🐾", task: "Promenade de chien (1 h)", price: "18 $–28 $", time: "Sur rendez-vous" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(locale === "fr" ? frCity : enCity, locale);
}

export default async function LavalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CityPage city={locale === "fr" ? frCity : enCity} />;
}
