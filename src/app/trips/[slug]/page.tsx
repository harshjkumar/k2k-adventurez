import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTripBySlug } from "@/lib/data/queries";
import { defaultTrips } from "@/lib/data/trips";
import TripDetailClient from "@/components/sections/trips/slug/TripDetailClient";

// Next.js config to revalidate data periodically or on demand
export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  let trip = await getTripBySlug(slug);
  if (!trip) {
    trip = defaultTrips.find((t) => t.slug === slug);
  }
  
  if (!trip) return { title: "Trip Not Found" };

  return {
    title: `${trip.title} | K2K Adventurez`,
    description: trip.metaDescription || trip.tagline,
  };
}

export default async function TripDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  let rawTrip = await getTripBySlug(slug);
  let trip: any = null;
  
  if (!rawTrip) {
    trip = defaultTrips.find((t) => t.slug === slug);
  } else {
    trip = rawTrip;
  }

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}
