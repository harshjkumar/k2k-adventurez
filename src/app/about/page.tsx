import { Metadata } from "next";
import { AboutPageClient } from "@/components/sections/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | K2K Adventurez",
  description:
    "We are a passionate travel company dedicated to creating unforgettable adventure experiences across Ladakh, Spiti, Kashmir, and the Himalayas.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
