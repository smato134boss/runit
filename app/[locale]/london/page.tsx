import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "london",
  name: "London",
  runners: "480+",
  tasks: "1,200+",
  rating: "4.9",
  tagline: "Post any errand in London and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting London, Ontario residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Old East Village", "Wortley Village", "Old South", "Hyde Park", "Masonville", "White Oaks", "Byron"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$40–$75", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
    { emoji: "🌿", task: "Lawn mowing", price: "$35–$60", time: "Same day" },
  ],
  airportTask: { emoji: "🚗", task: "YXU airport drop-off", price: "$25–$45", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function LondonPage() {
  return <CityPage city={city} />;
}
