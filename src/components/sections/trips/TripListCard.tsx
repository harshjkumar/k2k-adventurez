"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Map, ArrowRight, Bike, Clock, Tag } from "lucide-react";
import type { Trip } from "@/types/trip";

interface TripListCardProps {
  trip: Trip;
  index: number;
}

export function TripListCard({ trip, index }: TripListCardProps) {
  // Category mapping
  const categoryName = "K2K EXPEDITION";
  const startLoc = trip.startLocation ? trip.startLocation.split(", ") : ["Unknown", ""];
  const endLoc = trip.endLocation ? trip.endLocation.split(", ") : ["Unknown", ""];
  
  const currentPrice = trip.pricing?.[0]?.price || 0;
  const originalPrice = currentPrice > 0 ? Math.round(currentPrice * 1.2) : 0;
  const perNightPrice = trip.durationNights > 0 ? Math.round(currentPrice / trip.durationNights) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="bg-white border border-gray-200 group flex flex-col h-full rounded-sm overflow-hidden"
    >
      {/* Top Banner Category */}
      <div className="w-full text-center py-2.5 bg-[#F6F4F0] border-b border-gray-200">
        <p className="font-nav text-[9px] uppercase tracking-widest text-[#3a3a3a] font-medium">
          {categoryName}
        </p>
      </div>

      {/* Image Block */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={trip.coverImage || "/images/trips/1.webp"}
          alt={trip.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {/* Map Button Overlay */}
        <button className="absolute bottom-4 right-4 bg-white px-3 py-1.5 flex items-center gap-1.5 text-charcoal text-[10px] font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm shadow-sm">
          <Map size={12} /> Map
        </button>
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1 bg-white">
      <Link href={`/trips/${trip.slug}`} className="group block h-full">
        {/* Trip Title */}
        <h3 className="text-[#102a43] text-xl font-bold leading-tight mb-4 group-hover:text-red-800 transition-colors">
          {trip.title}
        </h3>

        {/* Route Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-[42%]">
            <h4 className="text-red-800 text-lg md:text-xl font-bold leading-tight mb-0.5">
              {startLoc[0]}
            </h4>
            {startLoc[1] && startLoc[1].trim() !== startLoc[0].trim() && (
              <p className="text-[#102a43] text-sm font-bold">{startLoc[1]}</p>
            )}
          </div>
          <div className="w-[16%] flex justify-center pt-2 text-gray-400">
            <ArrowRight size={18} strokeWidth={2} />
          </div>
          <div className="w-[42%] text-right">
            <h4 className="text-red-800 text-lg md:text-xl font-bold leading-tight mb-0.5">
              {endLoc[0]}
            </h4>
            {endLoc[1] && endLoc[1].trim() !== endLoc[0].trim() && (
              <p className="text-[#102a43] text-sm font-bold">{endLoc[1]}</p>
            )}
          </div>
        </div>

        {/* Dates Row (Dummy dates if departures are not fetched yet) */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-6 font-medium">
          <span>{trip.departures?.[0]?.startDate || "02 Apr 2026"}</span>
          <span>{trip.departures?.[0]?.endDate || "13 Apr 2026"}</span>
        </div>

        {/* Info Row (Duration) */}
        <div className="flex items-center justify-center text-[11px] text-gray-500 mb-5 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[22px] leading-none text-red-800">{trip.durationNights} Nights</span>
          </div>
        </div>

        {/* Tag */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4c5b0]/20 text-[#8c7454] text-[9px] font-nav uppercase tracking-widest font-bold rounded-full">
            <Tag size={10} /> BEST SELLER - APPLIED
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[11px] text-gray-500 mb-1">
              Per rider, from:
            </p>
            {originalPrice > 0 && (
              <p className="text-[13px] text-gray-400 line-through decoration-gray-400 mb-0.5 font-medium">
                ₹{originalPrice.toLocaleString("en-IN")}
              </p>
            )}
            <p className="text-[22px] font-bold text-[#102a43] leading-none mb-1">
              ₹{currentPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500">
              ₹{perNightPrice.toLocaleString("en-IN")} per night
            </p>
          </div>

          <div className="px-6 py-2.5 bg-[#102a43] text-white text-[11px] font-medium rounded-sm border border-[#102a43] hover:bg-white hover:text-[#102a43] transition-colors">
            Book Now
          </div>
        </div>      </Link>
      </div>
    </motion.div>
  );
}
