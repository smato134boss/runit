import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "victoria",
  name: "Victoria",
  runners: "420+",
  tasks: "1,100+",
  rating: "4.9",
  tagline: "Post any errand in Victoria and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Victoria, BC residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "James Bay", "Fairfield", "Fernwood", "Oak Bay", "Saanich", "Esquimalt", "Langford"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$32", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$20–$40", time: "2–3 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$20–$32", time: "Scheduled" },
    { emoji: "🏠", task: "Furniture assembly", price: "$42–$80", time: "2–4 hrs" },
    { emoji: "📦", task: "Moving help (local)", price: "$50–$100", time: "Half day" },
  ],
  airportTask: { emoji: "🚗", task: "YYJ airport drop-off", price: "$28–$50", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function VictoriaPage() {
  return <CityPage city={city} />;
}
