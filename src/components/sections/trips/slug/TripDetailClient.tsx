"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Mountain, Map, Info, Star } from "lucide-react";
import { Trip } from "@/types/trip";
import { TripItinerary } from "./TripItinerary";
import { TripPricing } from "./TripPricing";
import { TripBookingWidget } from "./TripBookingWidget";
import { TripGallery } from "./TripGallery";

interface TripDetailClientProps {
  trip: Trip;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {

  return (
    <div className="relative bg-[#FAF9F6] min-h-screen overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center opacity-[0.1]"
          style={{ 
            backgroundImage: 'url("/MapChart_Map.svg")',
            backgroundSize: '250%',
            filter: 'grayscale(100%) brightness(1.1)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <div className="pt-32 pb-12 md:pb-16 px-6 lg:px-8 border-b border-charcoal/10 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="font-nav text-xs uppercase tracking-[0.2em] text-accent border border-accent/20 px-4 py-1.5 rounded-full bg-accent/5">
                {trip.category || "Expedition"}
              </span>
              <span className="font-nav text-xs uppercase tracking-[0.2em] text-charcoal flex items-center gap-1">
                <Star size={12} className="fill-accent text-accent" /> {trip.rating} <span className="text-charcoal/60">({trip.reviewCount})</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-4 leading-tight">
              {trip.title}
            </h1>
            <p className="text-lg md:text-xl font-light text-charcoal/70 max-w-2xl mx-auto mb-8 text-center">
              {trip.tagline}
            </p>

            {/* In-page Navigation Links */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-12 pb-6 border-b border-charcoal/10">
              <button 
                onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="px-6 py-3 rounded-full border border-charcoal/20 text-xs font-nav uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] transition-all"
              >
                Overview
              </button>
              {trip.itinerary?.length > 0 && (
                <button 
                  onClick={() => document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-6 py-3 rounded-full border border-charcoal/20 text-xs font-nav uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] transition-all"
                >
                  Itinerary
                </button>
              )}
              {(trip.pricing?.length > 0 || trip.inclusions?.length > 0) && (
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-6 py-3 rounded-full border border-charcoal/20 text-xs font-nav uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] transition-all"
                >
                  Pricing
                </button>
              )}
              {trip.galleryImages?.length > 0 && (
                <button 
                  onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-6 py-3 rounded-full border border-charcoal/20 text-xs font-nav uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] transition-all"
                >
                  Gallery
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-2/3">
            {/* Quick Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 pb-12 border-b border-charcoal/10"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                { icon: Clock, label: "Duration", value: `${trip.durationDays} Days, ${trip.durationNights} Nights` },
                { icon: Map, label: "Region", value: trip.region },
                { icon: Mountain, label: "Max Altitude", value: `${trip.maxAltitudeFt.toLocaleString()} ft` },
                { icon: Info, label: "Difficulty", value: trip.difficulty, capitalize: true }
              ].map((stat, idx) => (
                <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col gap-2">
                  <stat.icon className="text-accent mb-2" size={28} strokeWidth={1.5} />
                  <span className="text-xs font-nav uppercase tracking-widest text-charcoal/50">{stat.label}</span>
                  <span className={`font-serif text-lg text-charcoal ${stat.capitalize ? "capitalize" : ""}`}>{stat.value}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Overview */}
            <motion.div 
              id="overview" 
              className="mb-16 scroll-mt-32"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-6 flex items-center gap-3">
                <Info className="text-accent" size={32} strokeWidth={1} />
                Overview
              </h2>
              <p className="text-charcoal/70 leading-relaxed text-lg whitespace-pre-line">
                {trip.description}
              </p>
              
              <div className="mt-8 bg-charcoal/5 rounded-xl p-8 border border-charcoal/10">
                <h3 className="font-nav text-sm uppercase tracking-widest text-charcoal mb-6 flex items-center gap-2">
                  <Star className="text-accent fill-accent" size={16} />
                  Trip Highlights
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(trip.highlights || []).map((highlight, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3 text-charcoal/70"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Itinerary */}
            {trip.itinerary?.length > 0 && (
              <motion.div 
                id="itinerary" 
                className="mb-20 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-10">
                  <Map className="text-accent" size={32} strokeWidth={1} />
                  <h2 className="text-3xl md:text-4xl font-serif text-charcoal">Detailed Itinerary</h2>
                </div>
                <TripItinerary itinerary={trip.itinerary} />
              </motion.div>
            )}

            {/* Pricing & Inclusions */}
            {(trip.pricing?.length > 0 || trip.inclusions?.length > 0) && (
              <motion.div 
                id="pricing" 
                className="mb-20 scroll-mt-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-10">
                  <Star className="text-accent fill-accent" size={32} strokeWidth={1} />
                  <h2 className="text-3xl md:text-4xl font-serif text-charcoal">Pricing & Details</h2>
                </div>
                <TripPricing 
                  pricing={trip.pricing || []} 
                  inclusions={trip.inclusions || []} 
                  exclusions={trip.exclusions || []} 
                />
              </motion.div>
            )}

            {/* Cancellation Policy */}
            <motion.div
              className="bg-charcoal/5 rounded-2xl p-8 border border-charcoal/10 scroll-mt-32 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-serif text-2xl text-charcoal mb-4 uppercase tracking-tight">Cancellation Policy</h3>
              <p className="text-charcoal/70 mb-4 leading-relaxed">
                We understand that plans can change. Cancellations made 30 days or more prior to the departure date will receive a full refund, excluding any non-refundable deposits.
              </p>
              <a href="/policies/cancellation" className="text-sm font-nav uppercase tracking-widest text-accent hover:text-charcoal transition-colors underline underline-offset-4">
                Read Full Policy
              </a>
            </motion.div>

            {/* Preparation Policy / Gear Guide */}
            <motion.div
              className="bg-accent/5 rounded-2xl p-8 border border-accent/10 scroll-mt-32"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h3 className="font-serif text-2xl text-accent mb-4 uppercase tracking-tight">Essential Gear & Preparation</h3>
              <p className="text-charcoal/70 mb-4 leading-relaxed">
                Proper gear is essential for your safety and comfort. We provide a comprehensive packing list upon booking. Ensure you have high-quality trekking boots, thermal layers, and a suitable daypack.
              </p>
              <a href="/guidelines" className="text-sm font-nav uppercase tracking-widest text-charcoal hover:text-accent transition-colors underline underline-offset-4">
                View Travel Guidelines
              </a>
            </motion.div>
            
          </div>

          {/* Right Column: Sidebar / Booking Widget */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 flex flex-col gap-12 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 pb-12 custom-scrollbar">
              <TripBookingWidget trip={trip} />
            </div>
          </div>

        </div>
      </div>

      {/* Trip Gallery */}
      {trip.galleryImages?.length > 0 && (
        <TripGallery images={trip.galleryImages} />
      )}
      </div>
    </div>
  );
}
