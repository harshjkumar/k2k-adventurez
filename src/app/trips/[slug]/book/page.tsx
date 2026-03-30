import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTripBySlug } from "@/lib/data/queries";
import { defaultTrips } from "@/lib/data/trips";
import BookTripClient from "@/components/sections/trips/slug/book/BookTripClient";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  let trip = await getTripBySlug(slug);
  if (!trip) {
    trip = defaultTrips.find((t) => t.slug === slug);
  }
  
  if (!trip) return { title: "Trip Not Found" };

  return {
    title: `Book ${trip.title} | K2K Adventurez`,
  };
}

export default async function BookTripPage({ params }: { params: { slug: string } }) {
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

  return <BookTripClient trip={trip} />;
}
