"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface TripRow {
  id: string;
  title: string;
  slug: string;
  region: string;
  difficulty: string;
  duration_days: number;
  duration_nights: number;
  is_featured: boolean;
  is_active: boolean;
  cover_image: string;
  trip_pricing?: { price: number }[];
  trip_categories?: { name: string }[];
  created_at: string;
}

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trips");
      const data = await res.json();
      setTrips(data || []);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (trip: TripRow) => {
    try {
      await fetch(`/api/admin/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !trip.is_active }),
      });
      fetchTrips();
    } catch (err) {
      console.error("Failed to toggle trip:", err);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      await fetch(`/api/admin/trips/${id}`, { method: "DELETE" });
      fetchTrips();
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.region?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && t.is_active) ||
      (filterStatus === "inactive" && !t.is_active);
    return matchesSearch && matchesStatus;
  });

  const getLowestPrice = (t: TripRow) => {
    if (!t.trip_pricing?.length) return 0;
    return Math.min(...t.trip_pricing.map((p) => p.price));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Trips</h1>
          <p className="text-sm text-charcoal/50 mt-1">{trips.length} total trips</p>
        </div>
        <Link
          href="/admin/trips/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} /> Add New Trip
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips by title or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-xs font-medium rounded-md capitalize transition-colors ${
                filterStatus === s
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-charcoal/60 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal/40">Loading trips...</div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40">No trips found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Trip</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Region</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Duration</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Price</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Status</th>
                <th className="px-4 py-3 text-right font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-md bg-gray-100 bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${trip.cover_image || "/images/trips/1.webp"})` }}
                      />
                      <div>
                        <p className="font-medium text-charcoal">{trip.title}</p>
                        <p className="text-xs text-charcoal/40 mt-0.5">
                          {trip.trip_categories?.[0]?.name || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-charcoal/70">{trip.region || "—"}</td>
                  <td className="px-4 py-4 text-charcoal/70">
                    {trip.duration_days}D / {trip.duration_nights}N
                  </td>
                  <td className="px-4 py-4 font-medium text-charcoal">
                    {getLowestPrice(trip) > 0
                      ? `₹${getLowestPrice(trip).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                        trip.is_active
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {trip.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/trips/${trip.slug}`}
                        target="_blank"
                        className="p-2 rounded hover:bg-gray-100 text-charcoal/40 hover:text-charcoal transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="p-2 rounded hover:bg-accent/10 text-charcoal/40 hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => toggleActive(trip)}
                        className="p-2 rounded hover:bg-blue-50 text-charcoal/40 hover:text-blue-600 transition-colors"
                        title={trip.is_active ? "Deactivate" : "Activate"}
                      >
                        {trip.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="p-2 rounded hover:bg-red-50 text-charcoal/40 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
