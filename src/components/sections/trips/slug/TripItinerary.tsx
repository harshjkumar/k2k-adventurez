"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, MapPin, Clock, Mountain } from "lucide-react";
import { ItineraryDay } from "@/types/trip";

const DayItem = ({ item, isFirst }: { item: ItineraryDay; isFirst: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isOpen, setIsOpen] = useState(isFirst);

  useEffect(() => {
    if (isInView) {
      setIsOpen(true);
    }
  }, [isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="border border-charcoal/10 rounded-lg overflow-hidden bg-white shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-charcoal/5 transition-colors"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <span className="font-nav text-xs font-bold uppercase tracking-widest text-accent whitespace-nowrap">
            Day {String(item.day).padStart(2, "0")}
          </span>
          <span className="text-charcoal font-medium font-serif text-lg">{item.title}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-charcoal/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-charcoal/70 border-t border-charcoal/5 bg-charcoal/5 leading-relaxed text-sm md:text-base">
              <p className="mb-4">{item.description}</p>
              
              <div className="flex flex-wrap gap-4 text-xs font-nav text-charcoal/60 mt-4">
                {item.altitude && (
                  <div className="flex items-center gap-1">
                    <Mountain size={14} /> <span>Altitude: {item.altitude}</span>
                  </div>
                )}
                {item.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> <span>Distance: {item.distance}</span>
                  </div>
                )}
                {item.overnight && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> <span>Overnight: {item.overnight}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface TripItineraryProps {
  itinerary: ItineraryDay[];
}

export const TripItinerary = ({ itinerary }: TripItineraryProps) => {
  return (
    <div className="space-y-4">
      {itinerary.map((item, idx) => (
        <DayItem key={item.day} item={item} isFirst={idx === 0} />
      ))}
    </div>
  );
};
