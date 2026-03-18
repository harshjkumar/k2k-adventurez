export const dynamic = "force-dynamic";

import { createServerSupabase } from "@/lib/supabase/server";
import { Mountain, MessageSquare, Tags } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();
  const [{ count: tripsCount }, { count: enquiresCount }] = await Promise.all([
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-charcoal">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-nav font-medium text-charcoal/60 uppercase tracking-widest mb-2">Total Trips</h3>
            <p className="text-4xl font-serif text-charcoal">{tripsCount || 0}</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Mountain className="text-accent" />
          </div>
        </div>
        <div className="bg-white p-8 rounded border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-nav font-medium text-charcoal/60 uppercase tracking-widest mb-2">Enquiries</h3>
            <p className="text-4xl font-serif text-charcoal">{enquiresCount || 0}</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <MessageSquare className="text-accent" />
          </div>
        </div>
        <div className="bg-white p-8 rounded border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-nav font-medium text-charcoal/60 uppercase tracking-widest mb-2">Categories</h3>
            <p className="text-4xl font-serif text-charcoal">3</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Tags className="text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
