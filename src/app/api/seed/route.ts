import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import {
  defaultTrips,
  defaultCategories,
  defaultTestimonials,
} from "@/lib/data/trips";

/**
 * POST /api/seed
 * Seeds all homepage + trips data into Supabase.
 * Uses the service-role key to bypass RLS.
 * Should only be called once (or to reset data).
 */
export async function POST() {
  try {
    const supabase = createAdminSupabase();

    // ── 1. Hero Slides ──────────────────────────────────────────
    const heroSlides = [
      { overline: "EXPLORE WITH US", title: "Explore Ladakh your way.", image: "/images/trips/1.webp", order: 0 },
      { overline: "SPITI VALLEY", title: "Into the middle land.", image: "/images/trips/2.webp", order: 1 },
      { overline: "KASHMIR TO LADAKH", title: "Paradise to moonscape.", image: "/images/trips/3.webp", order: 2 },
    ];
    await supabase.from("hero_slides").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: heroErr } = await supabase.from("hero_slides").insert(heroSlides);
    if (heroErr) throw new Error(`hero_slides: ${heroErr.message}`);

    // ── 2. Stats ─────────────────────────────────────────────────
    const stats = [
      { value: 200, suffix: "+", label: "Expeditions Completed", order: 0 },
      { value: 10, suffix: "K+", label: "Happy Riders", order: 1 },
      { value: 50, suffix: "+", label: "Unique Destinations", order: 2 },
      { value: 100, suffix: "%", label: "Adrenaline", order: 3 },
    ];
    await supabase.from("stats").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: statsErr } = await supabase.from("stats").insert(stats);
    if (statsErr) throw new Error(`stats: ${statsErr.message}`);

    // ── 3. How It Works ──────────────────────────────────────────
    const howItWorks = [
      { step_number: "01", title: "Choose Your Ride", description: "Browse our curated expeditions and pick the one that matches your vibe — beginner, moderate, or expert-level trails.", icon: "ClipboardList", order: 0 },
      { step_number: "02", title: "Gear Up", description: "We provide a fully serviced Royal Enfield, riding gear, helmets, and everything you need.", icon: "Mountain", order: 1 },
      { step_number: "03", title: "Ride & Explore", description: "Follow our expert ride captains through breathtaking terrains. Backup vehicle, mechanic, and emergency support ride with you.", icon: "Navigation", order: 2 },
      { step_number: "04", title: "Capture Memories", description: "Professional photography, GoPro mounts, drone shots — we make sure every moment is documented forever.", icon: "Camera", order: 3 },
    ];
    await supabase.from("how_it_works").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: hiwErr } = await supabase.from("how_it_works").insert(howItWorks);
    if (hiwErr) throw new Error(`how_it_works: ${hiwErr.message}`);

    // ── 4. Testimonials ──────────────────────────────────────────
    const testimonials = defaultTestimonials.map((t) => ({
      name: t.name,
      trip: t.trip,
      rating: t.rating,
      location: t.location,
      review: t.review,
    }));
    await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: testErr } = await supabase.from("testimonials").insert(testimonials);
    if (testErr) throw new Error(`testimonials: ${testErr.message}`);

    // ── 5. Trip Categories ───────────────────────────────────────
    await supabase.from("trip_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const categoriesToInsert = defaultCategories.map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      region: c.region,
      order: c.order,
      is_active: c.isActive,
    }));
    const { data: insertedCats, error: catErr } = await supabase
      .from("trip_categories")
      .insert(categoriesToInsert)
      .select("id, slug");
    if (catErr) throw new Error(`trip_categories: ${catErr.message}`);

    // Build a slug → UUID map for categories
    const catMap = new Map<string, string>();
    for (const cat of insertedCats || []) {
      catMap.set(cat.slug, cat.id);
    }

    // ── 6. Trips ─────────────────────────────────────────────────
    // Clear child tables first
    await supabase.from("trip_departures").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("trip_itinerary").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("trip_pricing").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("trips").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Find category slug from old categoryId
    const oldCatIdToSlug = new Map<string, string>();
    for (const c of defaultCategories) {
      oldCatIdToSlug.set(c.id, c.slug);
    }

    for (const trip of defaultTrips) {
      const catSlug = oldCatIdToSlug.get(trip.categoryId) || "";
      const categoryId = catMap.get(catSlug) || null;

      const { data: insertedTrip, error: tripErr } = await supabase
        .from("trips")
        .insert({
          category_id: categoryId,
          title: trip.title,
          slug: trip.slug,
          tagline: trip.tagline,
          description: trip.description,
          duration_days: trip.durationDays,
          duration_nights: trip.durationNights,
          max_altitude_ft: trip.maxAltitudeFt,
          difficulty: trip.difficulty,
          season: trip.season,
          region: trip.region,
          route: trip.route,
          start_location: trip.startLocation,
          end_location: trip.endLocation,
          total_distance: trip.totalDistance,
          terrain: trip.terrain,
          best_for: trip.bestFor,
          rating: trip.rating,
          review_count: trip.reviewCount,
          highlights: trip.highlights,
          inclusions: trip.inclusions,
          exclusions: trip.exclusions,
          cover_image: trip.coverImage,
          gallery_images: trip.galleryImages,
          is_featured: trip.isFeatured,
          is_active: trip.isActive,
        })
        .select("id")
        .single();

      if (tripErr) throw new Error(`trips (${trip.slug}): ${tripErr.message}`);
      const tripId = insertedTrip!.id;

      // Pricing
      if (trip.pricing.length) {
        const pricingRows = trip.pricing.map((p, i) => ({
          trip_id: tripId,
          label: p.label,
          price: p.price,
          order: i,
        }));
        const { error } = await supabase.from("trip_pricing").insert(pricingRows);
        if (error) throw new Error(`pricing (${trip.slug}): ${error.message}`);
      }

      // Itinerary
      if (trip.itinerary.length) {
        const itRows = trip.itinerary.map((d) => ({
          trip_id: tripId,
          day: d.day,
          title: d.title,
          description: d.description,
          overnight: d.overnight || null,
          distance: d.distance || null,
          altitude: d.altitude || null,
        }));
        const { error } = await supabase.from("trip_itinerary").insert(itRows);
        if (error) throw new Error(`itinerary (${trip.slug}): ${error.message}`);
      }

      // Departures
      if (trip.departures.length) {
        const depRows = trip.departures.map((d) => ({
          trip_id: tripId,
          start_date: d.startDate,
          end_date: d.endDate,
          available_seats: d.availableSeats,
          booked_seats: d.bookedSeats,
          status: d.status,
        }));
        const { error } = await supabase.from("trip_departures").insert(depRows);
        if (error) throw new Error(`departures (${trip.slug}): ${error.message}`);
      }
    }

    return NextResponse.json({ success: true, message: "All data seeded successfully!" });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
