"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Users, ArrowRight, Tag } from "lucide-react";
import { Trip } from "@/types/trip";

interface TripBookingWidgetProps {
  trip: Trip;
}

export const TripBookingWidget = ({ trip }: TripBookingWidgetProps) => {
  const departures = trip.departures || [];
  const pricing = trip.pricing || [];

  const [selectedDepartureId, setSelectedDepartureId] = useState<string>(departures[0]?.id || "");
  const selectedDeparture = departures.find(d => d.id === selectedDepartureId) || departures[0] || null;

  const displayPrice = pricing.length > 0 ? Math.min(...pricing.map(p => p.price)) : 0;

  return (
    <div className="bg-[#FAF9F6] border border-charcoal/10 rounded-xl p-6 md:p-8 sticky top-32 shadow-xl shadow-charcoal/5">
      <h3 className="font-serif text-2xl text-charcoal mb-2">Book Your Journey</h3>
      <p className="text-charcoal/60 text-sm mb-6 pb-6 border-b border-charcoal/10">
        Secure your spot for the adventure of a lifetime.
      </p>

      <div className="mb-2">
        <span className="text-sm font-nav uppercase tracking-widest text-charcoal/50">Starting Price from</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-serif text-charcoal">₹{displayPrice.toLocaleString("en-IN")}</span>
          <span className="text-xs font-nav text-charcoal/50">/ person</span>
        </div>
      </div>
      <div className="mb-6 px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg">
        <p className="text-xs font-nav font-semibold text-accent text-center tracking-wide">
          👉 Click &quot;Book Now&quot; to select other packages
        </p>
      </div>

      <div className="space-y-5 mb-8">
        

        {/* Departure Date Selection */}
        <div className="flex flex-col gap-2 text-charcoal/70">
          <label className="text-xs uppercase tracking-widest font-nav flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            Select Departure
          </label>
          <select 
            className="w-full bg-white border border-charcoal/20 rounded-lg p-3 text-sm font-medium focus:outline-none focus:border-accent text-charcoal"
            value={selectedDepartureId}
            onChange={(e) => setSelectedDepartureId(e.target.value)}
          >
            {departures.length > 0 ? (
              departures.map(d => (
                <option key={d.id} value={d.id}>
                  {new Date(d.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </option>
              ))
            ) : (
              <option value="">TBA (Contact Us)</option>
            )}
          </select>
        </div>

        {/* Availability Display */}
        <div className="flex flex-col gap-2 text-charcoal/70">
          <label className="text-xs uppercase tracking-widest font-nav flex items-center gap-2">
            <Users size={14} className="text-accent" />
            Availability
          </label>
          <div className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg p-3 text-sm font-medium text-charcoal">
            {selectedDeparture?.availableSeats 
              ? `${selectedDeparture.availableSeats - (selectedDeparture.bookedSeats || 0)} Seats Left`
              : "Check Dates with our team"}
          </div>
        </div>
      </div>

      <Link
        href={`/trips/${trip.slug}/book?date=${selectedDepartureId}`}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-[#FAF9F6] rounded-full text-xs font-nav font-medium uppercase tracking-widest transition-colors duration-300 hover:bg-accent group"
      >
        Book Now
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <p className="mt-4 text-center text-xs text-charcoal/40 font-nav uppercase tracking-widest">
        Need assistance? <Link href="/contact" className="text-accent hover:underline">Contact Us</Link>
      </p>
    </div>
  );
};
