import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "halifax",
  name: "Halifax",
  runners: "480+",
  tasks: "1,200+",
  rating: "4.9",
  tagline: "Post any errand in Halifax and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Halifax residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "North End", "South End", "West End", "Dartmouth", "Fairview", "Clayton Park", "Bedford"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "📦", task: "Moving help (local)", price: "$45–$90", time: "Half day" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$70", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YHZ airport drop-off", price: "$28–$48", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function HalifaxPage() {
  return <CityPage city={city} />;
}
