import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

// GET /api/admin/homepage — fetch all homepage sections
export async function GET() {
  try {
    const supabase = createAdminSupabase();
    const [heroRes, statsRes, howItWorksRes, testimonialsRes] = await Promise.all([
      supabase.from("hero_slides").select("*").order("order"),
      supabase.from("stats").select("*").order("order"),
      supabase.from("how_it_works").select("*").order("order"),
      supabase.from("testimonials").select("*").order("created_at"),
    ]);

    return NextResponse.json({
      heroSlides: heroRes.data || [],
      stats: statsRes.data || [],
      howItWorks: howItWorksRes.data || [],
      testimonials: testimonialsRes.data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/homepage — update homepage section items
export async function PUT(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const body = await req.json();
    const { section, items } = body;

    const tableMap: Record<string, string> = {
      heroSlides: "hero_slides",
      stats: "stats",
      howItWorks: "how_it_works",
      testimonials: "testimonials",
    };

    const table = tableMap[section];
    if (!table) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    // Upsert items — update existing, insert new
    for (const item of items) {
      if (item.id) {
        await supabase.from(table).update(item).eq("id", item.id);
      } else {
        await supabase.from(table).insert(item);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
