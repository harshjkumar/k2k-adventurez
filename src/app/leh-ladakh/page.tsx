import { Metadata } from "next";
import { LehLadakhClient } from "./LehLadakhClient";
import { getAllTrips } from "@/lib/data/queries";
import { defaultTrips } from "@/lib/data/trips";

export const metadata: Metadata = {
  title: "Leh Ladakh Bike Trips & Expeditions | K2K Adventurez",
  description:
    "Explore our complete collection of Leh Ladakh motorcycle expeditions — from 6-day quick getaways to 10-day cross-Himalayan adventures covering Khardung La, Pangong Tso, Nubra Valley, and more.",
};

export const revalidate = 3600;

export default async function LehLadakhPage() {
  let trips: any[] = [];
  const rawTrips = await getAllTrips();

  if (!rawTrips || rawTrips.length === 0) {
    trips = defaultTrips;
  } else {
    trips = rawTrips;
  }

  return <LehLadakhClient initialTrips={trips} />;
}
