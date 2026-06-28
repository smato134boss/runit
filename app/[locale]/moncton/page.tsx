import CityPage, { buildMetadata, type CityData } from "@/components/CityPage";

const city: CityData = {
  slug: "moncton",
  name: "Moncton",
  runners: "210+",
  tasks: "540+",
  rating: "4.9",
  tagline: "Post any errand in Moncton and a verified local runner picks it up — same day. Grocery runs, delivery, home tasks and more.",
  description: "Task marketplace connecting Moncton residents with verified local runners for errands, delivery, grocery shopping, and more.",
  neighborhoods: ["Downtown", "Riverview", "Dieppe", "Royal Road", "Lewisville", "Sunny Brae", "Mountain Road", "Moncton North"],
  popularTasks: [
    { emoji: "📦", task: "Parcel pickup & drop-off", price: "$11–$24", time: "Same day" },
    { emoji: "🛒", task: "Grocery run", price: "$15–$32", time: "2–3 hrs" },
    { emoji: "🌿", task: "Lawn care & yard work", price: "$26–$48", time: "2–3 hrs" },
    { emoji: "🏠", task: "Furniture assembly", price: "$32–$60", time: "2–4 hrs" },
    { emoji: "🐾", task: "Pet care & sitting", price: "$20–$35", time: "Scheduled" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata(city, locale);
}

export default function MonctonPage() {
  return <CityPage city={city} />;
}
