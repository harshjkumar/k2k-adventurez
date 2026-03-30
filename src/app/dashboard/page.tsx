"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User as UserIcon, Calendar, Info } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      // If profile doesn't exist yet but user does (sometimes happens if trigger fails)
      setProfile(profileData || { full_name: session.user.email?.split('@')[0], phone: "Not provided" });

      // Check Admin privileges securely via database
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .single();
      
      setIsAdmin(!!adminData);

      // Fetch Bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          id,
          total_amount,
          payment_status,
          status,
          created_at,
          trip_departures ( start_date, end_date ),
          trips ( title, slug, cover_image )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setBookings(bookingsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return <div className="p-12 text-center text-charcoal/40">Loading Dashboard...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Profile */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon size={32} className="text-gray-400" />
          </div>
          <h2 className="font-serif text-xl font-medium text-charcoal">{profile?.full_name}</h2>
          <p className="text-xs text-charcoal/60 mt-1">{profile?.phone}</p>
          
          {isAdmin && (
            <Link 
              href="/admin"
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-white bg-charcoal hover:bg-charcoal/90 rounded-md transition-colors"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="w-full h-px bg-gray-100 my-6" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content - Bookings */}
      <div className="lg:col-span-3 space-y-6">
        <h1 className="font-serif text-2xl text-charcoal">My Trips & Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <Calendar size={48} className="mx-auto text-charcoal/20 mb-4" strokeWidth={1} />
            <h3 className="font-serif text-xl text-charcoal mb-2">No bookings yet</h3>
            <p className="text-sm text-charcoal/60 mb-6 max-w-sm mx-auto">Explore our featured packages and start your next great adventure with K2K.</p>
            <Link href="/trips" className="inline-block px-8 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors">
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {booking.trips?.cover_image && (
                    <img src={booking.trips.cover_image} alt={booking.trips.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xl text-charcoal hover:text-accent transition-colors">
                          <Link href={`/trips/${booking.trips?.slug}`}>{booking.trips?.title}</Link>
                        </h3>
                        <p className="text-sm text-charcoal/60 mt-1">
                          {new Date(booking.trip_departures?.start_date).toLocaleDateString()} - {new Date(booking.trip_departures?.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          booking.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-medium">Total Amount</p>
                      <p className="font-serif text-lg text-charcoal">₹{booking.total_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-medium">Payment</p>
                      <p className={`text-sm font-medium ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                        {booking.payment_status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
