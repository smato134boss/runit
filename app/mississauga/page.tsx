import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "mississauga",
  name: "Mississauga",
  runners: "940+",
  tasks: "2,400+",
  rating: "4.9",
  tagline: "Post any errand in Mississauga and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Mississauga residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Port Credit", "Streetsville", "Meadowvale", "Erin Mills", "Malton", "Cooksville", "City Centre", "Lakeview"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$32", time: "Same day" },
    { emoji: "🛒", task: "Square One grocery run", price: "$20–$38", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$78", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "Pearson airport drop-off", price: "$20–$40", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function MississaugaPage() {
  return <CityPage city={city} />;
}
