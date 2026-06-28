import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "saskatoon",
  name: "Saskatoon",
  runners: "310+",
  tasks: "810+",
  rating: "4.9",
  tagline: "Post any errand in Saskatoon and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Saskatoon residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Broadway", "Nutana", "Riversdale", "Westside", "Arbor Creek", "Lakeview", "Stonebridge"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$12–$26", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$16–$34", time: "2–3 hrs" },
    { emoji: "🌿", task: "Lawn care & yard work", price: "$28–$52", time: "2–3 hrs" },
    { emoji: "❄️", task: "Snow shovelling", price: "$25–$45", time: "Same day" },
    { emoji: "🏠", task: "Furniture assembly", price: "$35–$65", time: "2–4 hrs" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function SaskatoonPage() {
  return <CityPage city={city} />;
}
