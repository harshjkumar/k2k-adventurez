import { Metadata } from "next/metadata";
import { WhyUsPageClient } from "@/components/sections/why-us/WhyUsPageClient";

export const metadata: Metadata = {
  title: "Why Choose Us | K2K Adventurez",
  description: "We don't just plan trips; we curate unforgettable experiences. See why travelers trust K2K Adventurez with their biggest Himalayan adventures.",
};

export default function WhyUsPage() {
  return <WhyUsPageClient />;
}
