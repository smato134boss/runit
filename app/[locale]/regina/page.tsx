import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "regina",
  name: "Regina",
  runners: "270+",
  tasks: "690+",
  rating: "4.9",
  tagline: "Post any errand in Regina and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Regina residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Lakeview", "Harbour Landing", "Hillsdale", "Whitmore Park", "Albert Park", "Wascana", "Normanview"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$12–$25", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$16–$32", time: "2–3 hrs" },
    { emoji: "🌿", task: "Yard work & clean-up", price: "$28–$50", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$33–$62", time: "2–4 hrs" },
    { emoji: "🐾", task: "Pet sitting (half day)", price: "$22–$38", time: "Scheduled" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function ReginaPage() {
  return <CityPage city={city} />;
}
