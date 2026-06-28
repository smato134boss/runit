import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "kitchener",
  name: "Kitchener",
  runners: "360+",
  tasks: "920+",
  rating: "4.9",
  tagline: "Post any errand in Kitchener and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Kitchener–Waterloo residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Williamsburg", "Forest Heights", "Pioneer Park", "Stanley Park", "Doon", "Huron Village", "Beechwood"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$13–$28", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$17–$36", time: "2–3 hrs" },
    { emoji: "💻", task: "Tech setup & install", price: "$30–$60", time: "1–2 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🌿", task: "Yard work & clean-up", price: "$30–$55", time: "2–3 hrs" },
  ],
  airportTask: { emoji: "🚗", task: "YKF airport drop-off", price: "$22–$40", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function KitchenerPage() {
  return <CityPage city={city} />;
}
