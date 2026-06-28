import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "toronto",
  name: "Toronto",
  runners: "3,200+",
  tasks: "8,400+",
  rating: "4.9",
  tagline: "Post any errand in Toronto and a verified local runner picks it up — same day. Grocery runs, parcel delivery, home tasks and more.",
  description: "Task marketplace connecting Toronto residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown Core", "Scarborough", "North York", "Etobicoke", "East York", "Mississauga border", "York", "Midtown"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$15–$35", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$20–$40", time: "2–3 hrs" },
    { emoji: "💐", task: "Send flowers across the city", price: "$25–$50", time: "Same day" },
    { emoji: "🏠", task: "IKEA assembly", price: "$40–$80", time: "2–4 hrs" },
    { emoji: "🐾", task: "Dog walk (1 hr)", price: "$20–$30", time: "Scheduled" },
  ],
  airportTask: { emoji: "🚗", task: "Pearson airport drop-off", price: "$45–$70", time: "Scheduled" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function TorontoPage() {
  return <CityPage city={city} />;
}
