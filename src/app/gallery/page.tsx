import { Metadata } from "next";
import { getGalleryImages } from "@/lib/data/queries";
import { GalleryPageClient } from "@/components/sections/gallery/GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery | K2K Adventurez",
  description: "Explore stunning photographs from our adventures across Ladakh, Spiti, and beyond.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return <GalleryPageClient images={images} />;
}
