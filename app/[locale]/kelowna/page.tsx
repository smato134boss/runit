import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "kelowna",
  name: "Kelowna",
  runners: "290+",
  tasks: "740+",
  rating: "4.9",
  tagline: "Post any errand in Kelowna and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Kelowna, BC residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Rutland", "Glenmore", "Mission", "Lower Mission", "Westbank", "Pandosy Village", "Black Mountain"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "🌿", task: "Yard work & landscaping", price: "$35–$65", time: "2–4 hrs" },
    { emoji: "🍷", task: "Winery pickup & delivery", price: "$20–$40", time: "Same day" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$30", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YLW airport drop-off", price: "$22–$38", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function KelownaPage() {
  return <CityPage city={city} />;
}
