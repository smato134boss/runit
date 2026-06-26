import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "brampton",
  name: "Brampton",
  runners: "760+",
  tasks: "1,800+",
  rating: "4.8",
  tagline: "Post any errand in Brampton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Brampton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown Brampton", "Bramalea", "Heart Lake", "Springdale", "Castlemore", "Sandalwood", "Fletcher's Creek", "Vales of Castlemore"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$14–$30", time: "Same day" },
    { emoji: "🛒", task: "Bramalea City Centre grocery run", price: "$18–$36", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$20–$42", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$38–$75", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$16–$26", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "Pearson airport drop-off", price: "$22–$42", time: "Scheduled" },
};

export const metadata = buildMetadata(city);

export default function BramptonPage() {
  return <CityPage city={city} />;
}
