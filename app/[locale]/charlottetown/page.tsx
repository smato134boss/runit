import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "charlottetown",
  name: "Charlottetown",
  runners: "140+",
  tasks: "360+",
  rating: "4.9",
  tagline: "Post any errand in Charlottetown and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Charlottetown, PEI residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "West Royalty", "East Royalty", "Sherwood", "Parkdale", "Stratford", "Hillsborough Park", "Brighton"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$10–$22", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$14–$28", time: "2–3 hrs" },
    { emoji: "🌿", task: "Yard work & gardening", price: "$24–$45", time: "2–3 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$15–$24", time: "Scheduled" },
    { emoji: "📦", task: "Moving help (local)", price: "$35–$70", time: "Half day" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function CharlottetownPage() {
  return <CityPage city={city} />;
}
