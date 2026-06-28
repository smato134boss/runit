import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "winnipeg",
  name: "Winnipeg",
  runners: "740+",
  tasks: "1,900+",
  rating: "4.8",
  tagline: "Post any errand in Winnipeg and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Winnipeg residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "St. Boniface", "Fort Rouge", "River Heights", "West End", "Transcona", "St. Vital", "St. James"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "❄️", task: "Snow shovelling & salting", price: "$30–$55", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YWG airport drop-off", price: "$30–$50", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function WinnipegPage() {
  return <CityPage city={city} />;
}
