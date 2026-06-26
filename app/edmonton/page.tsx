import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "edmonton",
  name: "Edmonton",
  runners: "580+",
  tasks: "1,400+",
  rating: "4.8",
  tagline: "Post any errand in Edmonton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Edmonton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Whyte Ave", "Glenora", "Mill Woods", "West Edmonton", "Windermere", "St. Albert area", "Ellerslie"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "West Edmonton Mall grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$20–$42", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$38–$72", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$16–$26", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "YEG airport drop-off", price: "$35–$60", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function EdmontonPage() {
  return <CityPage city={city} />;
}
