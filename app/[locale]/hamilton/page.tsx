import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "hamilton",
  name: "Hamilton",
  runners: "620+",
  tasks: "1,580+",
  rating: "4.9",
  tagline: "Post any errand in Hamilton and a verified local runner picks it up — same day. Grocery runs, parcel delivery, home tasks and more.",
  description: "Task marketplace connecting Hamilton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Westdale", "Dundas", "Ancaster", "Stoney Creek", "Waterdown", "Flamborough", "Binbrook"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function HamiltonPage() {
  return <CityPage city={city} />;
}
