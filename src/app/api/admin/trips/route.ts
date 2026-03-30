import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

// GET /api/admin/trips — list all trips (including inactive)
export async function GET() {
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("trips")
      .select("*, trip_pricing(*), trip_itinerary(*), trip_departures(*), trip_categories(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/trips — create a new trip
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const body = await req.json();

    // Extract nested data
    const { pricing, itinerary, departures, ...tripData } = body;

    // Auto-generate slug if not provided
    if (!tripData.slug && tripData.title) {
      tripData.slug = tripData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Insert trip
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert(tripData)
      .select()
      .single();

    if (tripError) {
      console.error("Trip Insert Error:", tripError);
      throw tripError;
    }

    // Insert pricing options
    if (pricing?.length) {
      const pricingRows = pricing.map((p: any, i: number) => ({
        trip_id: trip.id,
        label: p.label,
        price: p.price,
        order: i,
      }));
      const { error: insError } = await supabase.from("trip_pricing").insert(pricingRows);
      if (insError) console.error("Pricing Insert Error:", insError);
    }

    // Insert itinerary days
    if (itinerary?.length) {
      const itineraryRows = itinerary.map((d: any) => ({
        trip_id: trip.id,
        day: d.day,
        title: d.title,
        description: d.description,
        overnight: d.overnight || null,
        distance: d.distance || null,
        altitude: d.altitude || null,
      }));
      const { error: insError } = await supabase.from("trip_itinerary").insert(itineraryRows);
      if (insError) console.error("Itinerary Insert Error:", insError);
    }

    // Insert departures
    if (departures?.length) {
      const departureRows = departures.map((d: any) => ({
        trip_id: trip.id,
        start_date: d.start_date,
        end_date: d.end_date,
        available_seats: d.available_seats || 20,
        booked_seats: d.booked_seats || 0,
        status: d.status || "available",
      }));
      const { error: insError } = await supabase.from("trip_departures").insert(departureRows);
      if (insError) console.error("Departure Insert Error:", insError);
    }

    return NextResponse.json(trip, { status: 201 });
  } catch (err: any) {
    console.error("Admin Trip Create Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
