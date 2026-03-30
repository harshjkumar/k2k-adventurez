"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TripFilters } from "./TripFilters";
import { TripListCard } from "./TripListCard";
import type { Trip } from "@/types/trip";

interface TripsListingClientProps {
  initialTrips: Trip[];
}

export function TripsListingClient({ initialTrips }: TripsListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Extract unique categories from trips
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialTrips.forEach(t => {
      if (t.trip_categories && Array.isArray(t.trip_categories)) {
        t.trip_categories.forEach((tc: any) => cats.add(tc.name || tc));
      } else if (t.category) {
        cats.add(t.category);
      }
    });
    return Array.from(cats).sort();
  }, [initialTrips]);

  // Extract unique months from trips
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    initialTrips.forEach(t => {
      if (t.departures && Array.isArray(t.departures)) {
        t.departures.forEach((d: any) => {
          if (d.startDate || d.start_date) {
            const dateStr = d.startDate || d.start_date;
            if (typeof dateStr === "string") {
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                months.add(monthStr);
              }
            }
          }
        });
      }
    });
    // Sort chronologically
    return Array.from(months).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [initialTrips]);

  // Filter trips by category and selected trip
  const filteredTrips = useMemo(() => {
    let result = initialTrips;
    if (selectedCategory && selectedCategory !== "All Expeditions") {
      result = result.filter(t => {
        if (t.trip_categories && Array.isArray(t.trip_categories)) {
          return t.trip_categories.some((tc: any) => (tc.name || tc) === selectedCategory);
        }
        return t.category === selectedCategory;
      });
    }

    if (selectedTrip) {
      result = result.filter(t => t.id === selectedTrip);
    }
    
    if (selectedMonth) {
      result = result.filter(t => {
        if (!t.departures || !Array.isArray(t.departures)) return false;
        return t.departures.some((d: any) => {
          const dateStr = d.startDate || d.start_date;
          if (typeof dateStr === "string") {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) === selectedMonth;
            }
          }
          return false;
        });
      });
    }

    return result;
  }, [initialTrips, selectedCategory, selectedTrip, selectedMonth]);

  return (
    <div className="relative bg-[#FAF9F6] min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Background Map */}
      <div className="bg-map-texture" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* The top filter and view toggle section */}
        <TripFilters 
          totalCount={filteredTrips.length} 
          categories={["All Expeditions", ...categories]}
          selectedCategory={selectedCategory || "All Expeditions"}
          onSelectCategory={setSelectedCategory}
          trips={initialTrips}
          selectedTrip={selectedTrip}
          onSelectTrip={setSelectedTrip}
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />

        {/* The Grid of Trips */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip, idx) => (
            <TripListCard key={trip.id} trip={trip} index={idx} />
          ))}
        </div>

        {/* Pagination placeholder */}
        {filteredTrips.length > 0 && (
          <div className="mt-20 border-t border-gray-200 pt-8 flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 text-sm text-charcoal/60 mb-2">
              <button className="hover:text-charcoal pr-2">&lt;</button>
              <button className="font-bold text-charcoal">1</button>
              <button className="hover:text-charcoal pl-2">&gt;</button>
            </div>
            <p className="text-xs text-charcoal/40">
              1 - {filteredTrips.length} of {filteredTrips.length} results
            </p>
          </div>
        )}

        {filteredTrips.length === 0 && (
          <div className="text-center py-32 text-charcoal/50">
            <p className="text-lg">No journeys found.</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSelectedTrip(""); setSelectedMonth(""); }}
              className="mt-4 text-sm text-accent underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
