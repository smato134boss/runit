import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "edmonton",
  name: "Edmonton",
  runners: "920+",
  tasks: "2,400+",
  rating: "4.8",
  tagline: "Post any errand in Edmonton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Edmonton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Oliver", "Glenora", "Whyte Avenue", "Windermere", "South Edmonton", "Sherwood Park", "St. Albert"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "❄️", task: "Snow shovelling & salting", price: "$28–$50", time: "Same day" },
    { emoji: "🏠", task: "Furniture assembly", price: "$35–$70", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$17–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YEG airport drop-off", price: "$35–$60", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function EdmontonPage() {
  return <CityPage city={city} />;
}
