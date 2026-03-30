import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

// GET /api/admin/trips/[id] — single trip with all relations
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("trips")
      .select("*, trip_pricing(*), trip_itinerary(*), trip_departures(*), trip_categories(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/trips/[id] — update trip fields
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createAdminSupabase();
    const body = await req.json();

    // Extract nested data that goes to separate tables
    const { pricing, itinerary, departures, trip_pricing, trip_itinerary, trip_departures, trip_categories, ...tripData } = body;

    // Update main trip record
    tripData.updated_at = new Date().toISOString();
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .update(tripData)
      .eq("id", id)
      .select()
      .single();

    if (tripError) {
      console.error("Trip Update Error:", tripError);
      throw tripError;
    }

    // Replace pricing if provided
    if (pricing) {
      const { error: delError } = await supabase.from("trip_pricing").delete().eq("trip_id", id);
      if (delError) console.error("Pricing Delete Error:", delError);
      
      if (pricing.length) {
        const pricingRows = pricing.map((p: any, i: number) => ({
          trip_id: id,
          label: p.label,
          price: p.price,
          order: i,
        }));
        const { error: insError } = await supabase.from("trip_pricing").insert(pricingRows);
        if (insError) console.error("Pricing Insert Error:", insError);
      }
    }

    // Replace itinerary if provided
    if (itinerary) {
      const { error: delError } = await supabase.from("trip_itinerary").delete().eq("trip_id", id);
      if (delError) console.error("Itinerary Delete Error:", delError);

      if (itinerary.length) {
        const itineraryRows = itinerary.map((d: any) => ({
          trip_id: id,
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
    }

    // Replace departures if provided
    if (departures) {
      const { error: delError } = await supabase.from("trip_departures").delete().eq("trip_id", id);
      if (delError) console.error("Departure Delete Error:", delError);

      if (departures.length) {
        const departureRows = departures.map((d: any) => ({
          trip_id: id,
          start_date: d.start_date,
          end_date: d.end_date,
          available_seats: d.available_seats || 20,
          booked_seats: d.booked_seats || 0,
          status: d.status || "available",
        }));
        const { error: insError } = await supabase.from("trip_departures").insert(departureRows);
        if (insError) console.error("Departure Insert Error:", insError);
      }
    }

    return NextResponse.json(trip);
  } catch (err: any) {
    console.error("Admin Trip Save Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/trips/[id] — soft-delete (set is_active = false)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createAdminSupabase();
    const { error } = await supabase
      .from("trips")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
