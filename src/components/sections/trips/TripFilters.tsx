"use client";

import { motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

import type { Trip } from "@/types/trip";

interface TripFiltersProps {
  totalCount: number;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  trips?: Trip[];
  selectedTrip?: string;
  onSelectTrip?: (tripId: string) => void;
}

export function TripFilters({ totalCount, categories, selectedCategory, onSelectCategory, trips = [], selectedTrip = "", onSelectTrip = () => {} }: TripFiltersProps) {
  return (
    <div className="w-full">
      {/* ── Heading ───────────────────────────────────────── */}
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-charcoal uppercase tracking-wide"
        >
          FIND YOUR JOURNEY
        </motion.h1>
      </div>

      {/* ── Category Tabs ─────────────────────────────────── */}
      <div className="flex overflow-x-auto hide-scrollbar gap-8 mb-16 px-2 justify-start md:justify-center border-b border-gray-200 pb-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap pb-2 text-sm uppercase tracking-widest font-nav transition-colors relative ${
              selectedCategory === cat ? "text-accent font-semibold" : "text-charcoal/60 hover:text-charcoal"
            }`}
          >
            {cat}
            {selectedCategory === cat && (
              <motion.div
                layoutId="activeCategory"
                className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ── Filters Row ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-4">
        <div className="flex-1 w-full relative">
          <label className="block text-sm text-charcoal mb-2">Where to?</label>
          <div className="relative border-b border-charcoal/30 flex items-center group hover:border-charcoal transition-colors">
            <select
              value={selectedTrip}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="w-full pb-2 text-left appearance-none bg-transparent outline-none cursor-pointer text-charcoal/60 hover:text-charcoal transition-colors z-10"
            >
              <option value="">Any Destination</option>
              {trips.map(trip => (
                <option key={trip.id} value={trip.id} className="text-charcoal">{trip.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="text-charcoal/40 absolute right-0 bottom-2 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <label className="block text-sm text-charcoal mb-2">When?</label>
          <button className="w-full flex items-center justify-between border-b border-charcoal/30 pb-2 text-left hover:border-charcoal transition-colors group">
            <span className="text-charcoal/60 group-hover:text-charcoal transition-colors">Any Time</span>
            <ChevronDown size={16} className="text-charcoal/40" />
          </button>
        </div>

        <button className="flex items-center gap-2 pb-2 text-charcoal hover:text-accent transition-colors shrink-0">
          <SlidersHorizontal size={16} />
          <span className="text-sm font-medium">Advanced</span>
        </button>
      </div>

      {/* ── Sub Filters Row ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16">
        <p className="text-xs text-charcoal/60 mb-4 sm:mb-0">
          {totalCount} journeys available
        </p>
        <button 
          onClick={() => { onSelectCategory("All Expeditions"); onSelectTrip(""); }}
          className="text-[10px] font-nav uppercase tracking-widest text-accent border-b border-accent pb-0.5 hover:text-charcoal hover:border-charcoal transition-colors"
        >
          RESET FILTERS
        </button>
      </div>

      {/* ── View & Sort Row ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-4 mb-10">
        <div className="flex items-center gap-2 text-charcoal/40 w-full sm:w-auto mb-4 sm:mb-0">
          {/* Note: List view vs Grid view could normally go here. Removed map/photo specific buttons per request */}
        </div>

        <div className="flex items-center gap-2 text-xs text-charcoal/60 w-full sm:w-auto justify-end">
          <span>Sort by:</span>
          <button className="flex items-center gap-1 font-medium text-charcoal hover:text-accent transition-colors">
            Date Closest <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
