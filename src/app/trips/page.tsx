import { Metadata } from "next";
import { TripsListingClient } from "@/components/sections/trips/TripsListingClient";
import { getAllTrips } from "@/lib/data/queries";
import { defaultTrips } from "@/lib/data/trips";

export const metadata: Metadata = {
  title: "Find Your Journey | K2K Adventurez",
  description: "Browse our collection of premium Himalayan motorcycle expeditions to Ladakh, Spiti, Rajasthan, and more.",
};

// Next.js config to revalidate data periodically or on demand
export const revalidate = 3600; // 1 hour

export default async function TripsPage() {
  let trips: any[] = [];
  const rawTrips = await getAllTrips();

  // Fallback to static data if Supabase fails (e.g., if DB isn't seeded)
  if (!rawTrips || rawTrips.length === 0) {
    trips = defaultTrips;
  } else {
    trips = rawTrips;
  }

  return <TripsListingClient initialTrips={trips} />;
}
