import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "vancouver",
  name: "Vancouver",
  runners: "1,400+",
  tasks: "3,800+",
  rating: "4.9",
  tagline: "Post any errand in Vancouver and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Vancouver residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Kitsilano", "Commercial Drive", "East Vancouver", "West End", "Burnaby", "North Vancouver", "Richmond"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$18–$38", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$22–$42", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$28–$55", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$45–$85", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$22–$35", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YVR airport drop-off", price: "$35–$60", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function VancouverPage() {
  return <CityPage city={city} />;
}
