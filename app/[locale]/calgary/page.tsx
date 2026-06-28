import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "calgary",
  name: "Calgary",
  runners: "1,100+",
  tasks: "2,900+",
  rating: "4.9",
  tagline: "Post any errand in Calgary and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Calgary residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Beltline", "Kensington", "Mission", "Bridgeland", "Inglewood", "Mahogany", "Signal Hill"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$32", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$75", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$30", time: "Scheduled" },
    { emoji: "🌿", task: "Yard work & snow removal", price: "$28–$55", time: "Same day" },
  ],
  airportTask: { emoji: "🚗", task: "YYC airport drop-off", price: "$35–$55", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function CalgaryPage() {
  return <CityPage city={city} />;
}
