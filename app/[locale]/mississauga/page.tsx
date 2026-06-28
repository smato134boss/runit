import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "mississauga",
  name: "Mississauga",
  runners: "1,050+",
  tasks: "2,750+",
  rating: "4.9",
  tagline: "Post any errand in Mississauga and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Mississauga residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Port Credit", "Streetsville", "Clarkson", "Erin Mills", "Square One", "Meadowvale", "Malton", "Lakeview"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$78", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$19–$30", time: "Scheduled" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
  ],
  airportTask: { emoji: "🚗", task: "Pearson airport drop-off", price: "$20–$35", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function MississaugaPage() {
  return <CityPage city={city} />;
}
