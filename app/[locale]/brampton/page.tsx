import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "brampton",
  name: "Brampton",
  runners: "870+",
  tasks: "2,200+",
  rating: "4.9",
  tagline: "Post any errand in Brampton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Brampton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Bramalea", "Springdale", "Castlemore", "Heart Lake", "Fletchers Creek", "Gore", "Sandringham"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$17–$35", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
    { emoji: "🌿", task: "Lawn mowing", price: "$30–$55", time: "Same day" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function BramptonPage() {
  return <CityPage city={city} />;
}
