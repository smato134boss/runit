import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "fredericton",
  name: "Fredericton",
  runners: "180+",
  tasks: "450+",
  rating: "4.9",
  tagline: "Post any errand in Fredericton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Fredericton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Uptown", "Skyline Acres", "Brookside", "Southwood Park", "Marysville", "Devon", "Hanwell"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$10–$22", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$14–$30", time: "2–3 hrs" },
    { emoji: "🌿", task: "Yard work & clean-up", price: "$24–$45", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$30–$58", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$16–$25", time: "Scheduled" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function FrederictonPage() {
  return <CityPage city={city} />;
}
