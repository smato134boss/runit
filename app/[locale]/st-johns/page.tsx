import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "st-johns",
  name: "St. John's",
  runners: "260+",
  tasks: "660+",
  rating: "4.9",
  tagline: "Post any errand in St. John's and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting St. John's, Newfoundland residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "East End", "West End", "Mount Pearl", "Conception Bay South", "Goulds", "Kilbride", "Airport Heights"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$11–$24", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$16–$32", time: "2–3 hrs" },
    { emoji: "🏠", task: "IKEA assembly", price: "$35–$65", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$16–$26", time: "Scheduled" },
    { emoji: "📦", task: "Moving help (local)", price: "$40–$80", time: "Half day" },
  ],
  airportTask: { emoji: "🚗", task: "YYT airport drop-off", price: "$22–$40", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function StJohnsPage() {
  return <CityPage city={city} />;
}
