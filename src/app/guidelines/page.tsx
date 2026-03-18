import { Metadata } from "next";
import { GuidelinesPageClient } from "@/components/sections/guidelines/GuidelinesPageClient";

export const metadata: Metadata = {
  title: "Travel Guidelines | K2K Adventurez",
  description: "Essential guidelines for high-altitude trips to Ladakh and other Himalayan destinations — altitude awareness, packing list, responsible tourism.",
};

export default function GuidelinesPage() {
  return <GuidelinesPageClient />;
}
