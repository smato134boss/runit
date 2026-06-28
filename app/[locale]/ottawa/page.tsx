import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "ottawa",
  name: "Ottawa",
  runners: "980+",
  tasks: "2,600+",
  rating: "4.9",
  tagline: "Post any errand in Ottawa and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Ottawa residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Glebe", "Centretown", "Byward Market", "Kanata", "Barrhaven", "Orleans", "Westboro"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
  ],
  airportTask: { emoji: "🚗", task: "YOW airport drop-off", price: "$30–$50", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function OttawaPage() {
  return <CityPage city={city} />;
}
