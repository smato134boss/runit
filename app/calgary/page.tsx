import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "calgary",
  name: "Calgary",
  runners: "750+",
  tasks: "1,900+",
  rating: "4.9",
  tagline: "Post any errand in Calgary and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Calgary residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Beltline", "Kensington", "Mission", "Bridgeland", "NE Calgary", "SW Calgary", "NW Calgary"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$32", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$38", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$78", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$30", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YYC airport drop-off", price: "$32–$55", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function CalgaryPage() {
  return <CityPage city={city} />;
}
