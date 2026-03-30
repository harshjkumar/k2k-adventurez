import { Metadata } from "next";
import { FAQPageClient } from "@/components/sections/faq/FAQPageClient";

export const metadata: Metadata = {
  title: "FAQ | K2K Adventurez",
  description: "Frequently asked questions about Ladakh expeditions, altitude sickness, permits, clothing, and trip planning with K2K Adventurez.",
};

export default function FAQPage() {
  return <FAQPageClient />;
}
