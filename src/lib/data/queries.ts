import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Fetches hero slides ordered by "order".
 * Falls back to hardcoded data when Supabase is unavailable.
 */
export async function getHeroSlides() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("order");
    if (error || !data?.length) throw error;
    return data;
  } catch {
    return null; // component falls back to hardcoded
  }
}

/**
 * Fetches stats counters ordered by "order".
 */
export async function getStats() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .eq("is_active", true)
      .order("order");
    if (error || !data?.length) throw error;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches How-It-Works steps.
 */
export async function getHowItWorks() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("how_it_works")
      .select("*")
      .eq("is_active", true)
      .order("order");
    if (error || !data?.length) throw error;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches testimonials.
 */
export async function getTestimonials() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true);
    if (error || !data?.length) throw error;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches featured trips with pricing.
 */
export async function getFeaturedTrips() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("trips")
      .select("*, trip_pricing(*)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at");
    if (error || !data?.length) throw error;
    return data.map(normalizeTrip);
  } catch {
    return null;
  }
}

export function normalizeTrip(raw: any) {
  if (!raw) return null;
  return {
    ...raw,
    // ensure camelCase properties
    categoryId: raw.category_id || raw.categoryId,
    durationDays: raw.duration_days || raw.durationDays || 0,
    durationNights: raw.duration_nights || raw.durationNights || 0,
    maxAltitudeFt: raw.max_altitude_ft || raw.maxAltitudeFt || 0,
    startLocation: raw.start_location || raw.startLocation || "",
    endLocation: raw.end_location || raw.endLocation || "",
    totalDistance: raw.total_distance || raw.totalDistance || "",
    reviewCount: raw.review_count || raw.reviewCount || 0,
    isFeatured: raw.is_featured ?? raw.isFeatured ?? false,
    isActive: raw.is_active ?? raw.isActive ?? true,
    coverImage: raw.cover_image || raw.coverImage || "/images/trips/1.webp",
    galleryImages: raw.gallery_images || raw.galleryImages || [],
    highlights: raw.highlights || [],
    inclusions: raw.inclusions || [],
    exclusions: raw.exclusions || [],
    metaTitle: raw.meta_title || raw.metaTitle || "",
    metaDescription: raw.meta_description || raw.metaDescription || "",
    createdAt: raw.created_at || raw.createdAt || "",
    updatedAt: raw.updated_at || raw.updatedAt || "",
    // ensure relations
    pricing: raw.trip_pricing || raw.pricing || [],
    itinerary: raw.trip_itinerary || raw.itinerary || [],
    departures: raw.trip_departures || raw.departures || [],
    categories: raw.trip_categories || raw.categories || [],
  };
}

/**
 * Fetches all active trips with pricing, itinerary, departures.
 */
export async function getAllTrips() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("trips")
      .select("*, trip_pricing(*), trip_itinerary(*), trip_departures(*), trip_categories(*)")
      .eq("is_active", true)
      .order("created_at");
    if (error || !data?.length) throw error;
    return data.map(normalizeTrip);
  } catch {
    return null;
  }
}


/**
 * Fetches a single trip by slug.
 */
export async function getTripBySlug(slug: string) {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("trips")
      .select("*, trip_pricing(*, order), trip_itinerary(*, day), trip_departures(*), trip_categories(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (error || !data) throw error;
    return normalizeTrip(data);
  } catch {
    return null;
  }
}

/**
 * Fetches all trip categories.
 */
export async function getCategories() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("trip_categories")
      .select("*")
      .eq("is_active", true)
      .order("order");
    if (error || !data?.length) throw error;
    return data;
  } catch {
    return null;
  }
}
