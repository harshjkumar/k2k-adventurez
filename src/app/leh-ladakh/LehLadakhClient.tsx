"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TripListCard } from "@/components/sections/trips/TripListCard";
import type { Trip } from "@/types/trip";
import { Mountain, MapPin, Calendar, Users } from "lucide-react";

interface LehLadakhClientProps {
  initialTrips: Trip[];
}

// All 8 Leh Ladakh related trip slugs
const LEH_LADAKH_SLUGS = [
  "6-days-leh-to-leh",
  "8-days-srinagar-leh-ladakh",
  "8-days-manali-leh-ladakh",
  "8-days-leh-ladakh-srinagar",
  "8-days-leh-ladakh-manali",
  "9-days-ex-leh-hanle-umlingla-tso-moriri",
  "10-days-srinagar-leh-ladakh-manali",
  "10-days-manali-leh-ladakh-srinagar",
];

const STATS = [
  { icon: Mountain, value: "18,380 ft", label: "Highest Pass" },
  { icon: MapPin, value: "8", label: "Unique Routes" },
  { icon: Calendar, value: "Apr – Oct", label: "Best Season" },
  { icon: Users, value: "2000+", label: "Happy Riders" },
];

export function LehLadakhClient({ initialTrips }: LehLadakhClientProps) {
  // Filter only Leh Ladakh related trips
  const lehLadakhTrips = useMemo(() => {
    return initialTrips.filter(
      (trip) =>
        LEH_LADAKH_SLUGS.includes(trip.slug) ||
        (trip.region &&
          (trip.region.toLowerCase().includes("leh") ||
            trip.region.toLowerCase().includes("ladakh"))) ||
        (trip.title &&
          (trip.title.toLowerCase().includes("leh") ||
            trip.title.toLowerCase().includes("ladakh")))
    );
  }, [initialTrips]);

  const [durationFilter, setDurationFilter] = useState<string>("all");

  const filteredTrips = useMemo(() => {
    if (durationFilter === "all") return lehLadakhTrips;
    const days = parseInt(durationFilter);
    return lehLadakhTrips.filter((t) => t.durationDays === days);
  }, [lehLadakhTrips, durationFilter]);

  const uniqueDurations = useMemo(() => {
    const durations = new Set(lehLadakhTrips.map((t) => t.durationDays));
    return Array.from(durations).sort((a, b) => a - b);
  }, [lehLadakhTrips]);

  return (
    <div className="relative bg-[#FAF9F6] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-charcoal text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/trips/1.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-40 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-nav uppercase tracking-[0.3em] text-accent mb-4">
              Destination
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
              LEH LADAKH
            </h1>
            <p className="text-warm-gray text-lg max-w-2xl leading-relaxed mb-12">
              Explore the Land of High Passes — from the iconic Khardung La to
              the mesmerizing Pangong Lake. Choose from {lehLadakhTrips.length}{" "}
              unique expeditions ranging from 6 to 10 days, covering every legendary
              route through the Himalayas.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-sm"
                >
                  <stat.icon
                    size={22}
                    className="text-accent flex-shrink-0"
                  />
                  <div>
                    <p className="text-lg font-bold leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-warm-gray uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-map-texture" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-1">
              All Leh Ladakh Expeditions
            </h2>
            <p className="text-sm text-charcoal/50">
              {filteredTrips.length} expedition
              {filteredTrips.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setDurationFilter("all")}
              className={`px-4 py-2 text-xs font-nav uppercase tracking-widest rounded-full border transition-colors ${
                durationFilter === "all"
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40"
              }`}
            >
              All
            </button>
            {uniqueDurations.map((d) => (
              <button
                key={d}
                onClick={() => setDurationFilter(String(d))}
                className={`px-4 py-2 text-xs font-nav uppercase tracking-widest rounded-full border transition-colors ${
                  durationFilter === String(d)
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Trip Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip, idx) => (
            <TripListCard key={trip.id} trip={trip} index={idx} />
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-32 text-charcoal/50">
            <p className="text-lg">No expeditions found for this filter.</p>
            <button
              onClick={() => setDurationFilter("all")}
              className="mt-4 text-sm text-accent underline"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-white border border-charcoal/10 rounded-xl p-8 md:p-12"
        >
          <h3 className="font-serif text-2xl text-charcoal mb-4">
            Why Ride Leh Ladakh with K2K?
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-charcoal/70 leading-relaxed">
            <div className="space-y-4">
              <p>
                Leh Ladakh is the ultimate motorcycle destination in India —
                a land of towering passes, crystal-clear lakes, ancient
                monasteries, and stark desert landscapes that leave every rider
                spellbound. Our expeditions are designed for riders of all skill
                levels, from first-timers to seasoned adventurers.
              </p>
              <p>
                Every K2K Ladakh trip includes Royal Enfield bike rental, fuel,
                accommodation, meals, backup vehicles, oxygen support, and an
                experienced road captain — so you can focus solely on the ride
                and the experience.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong>Iconic Highlights:</strong> Khardung La (18,380 ft),
                Pangong Tso, Nubra Valley, Chang La, Magnetic Hill, Lamayuru
                Moonland, Zoji La, Baralacha La, Umling La (19,024 ft), Tso
                Moriri, and many more.
              </p>
              <p>
                <strong>Flexible Options:</strong> Choose from 6-day quick
                getaways, 8-day classic circuits, 9-day eastern Ladakh
                explorations, or 10-day cross-Himalayan grand expeditions from
                Srinagar to Manali and vice versa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
