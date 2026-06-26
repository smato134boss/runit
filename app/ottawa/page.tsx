import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "ottawa",
  name: "Ottawa",
  runners: "680+",
  tasks: "1,600+",
  rating: "4.8",
  tagline: "Post any errand in Ottawa and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Ottawa residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Kanata", "Orléans", "Barrhaven", "Gloucester", "Nepean", "Centretown", "Vanier"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$22–$45", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$38–$75", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$18–$28", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "Ottawa airport (YOW) drop-off", price: "$28–$50", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function OttawaPage() {
  return <CityPage city={city} />;
}
