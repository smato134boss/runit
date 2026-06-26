import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "hamilton",
  name: "Hamilton",
  runners: "820+",
  tasks: "2,100+",
  rating: "4.9",
  tagline: "Post any errand in Hamilton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Hamilton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown Hamilton", "Westdale", "Dundas", "Ancaster", "Waterdown", "Stoney Creek", "East Mountain", "West Mountain"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$30", time: "Same day" },
    { emoji: "🛒", task: "Limeridge Mall grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$20–$45", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$75", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "Hamilton Airport drop-off", price: "$25–$45", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function HamiltonPage() {
  return <CityPage city={city} />;
}
