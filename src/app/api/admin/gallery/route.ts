import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

// GET /api/admin/gallery — list all gallery images
export async function GET() {
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("order");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/gallery — add gallery image(s)
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const body = await req.json();

    // Support single or batch insert
    const items = Array.isArray(body) ? body : [body];

    const { data, error } = await supabase
      .from("gallery_images")
      .insert(items)
      .select();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
