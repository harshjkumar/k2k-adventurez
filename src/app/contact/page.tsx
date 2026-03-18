import { Metadata } from "next";
import { ContactPageClient } from "@/components/sections/contact/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | K2K Adventurez",
  description:
    "Have questions about our Ladakh, Spiti, or Kashmir expeditions? Get in touch with K2K Adventurez — call, email, or fill out the form.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
