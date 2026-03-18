"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mountain, ChevronLeft, ChevronRight, Bike, Map, ArrowRight, Tag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { defaultTrips } from "@/lib/data/trips";

/* ── Map DB trips to card format ────────────────────────────── */
interface TripCard {
  id: string;
  slug: string;
  title: string;
  region: string;
  difficulty: string;
  durationDays: number;
  durationNights: number;
  maxAltitudeFt: number;
  coverImage: string;
  price: number;
  startLocation?: string;
  endLocation?: string;
  departures?: any[];
}

function mapDbTrip(t: any): TripCard {
  const pricing = t.trip_pricing || [];
  const lowestPrice = pricing.length
    ? Math.min(...pricing.map((p: any) => p.price))
    : 0;
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    region: t.region,
    difficulty: t.difficulty,
    durationDays: t.duration_days,
    durationNights: t.duration_nights,
    maxAltitudeFt: t.max_altitude_ft,
    coverImage: t.cover_image,
    price: lowestPrice,
    startLocation: t.start_location || t.startLocation,
    endLocation: t.end_location || t.endLocation,
    departures: t.trip_departures,
  };
}

function mapStaticTrip(t: (typeof defaultTrips)[0]): TripCard {
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    region: t.region,
    difficulty: t.difficulty,
    durationDays: t.durationDays,
    durationNights: t.durationNights,
    maxAltitudeFt: t.maxAltitudeFt,
    coverImage: t.coverImage,
    price: t.pricing?.[0]?.price ?? 0,
    startLocation: t.startLocation,
    endLocation: t.endLocation,
    departures: t.departures,
  };
}

interface FeaturedTripsProps {
  dbTrips?: any[] | null;
}

export function FeaturedTrips({ dbTrips }: FeaturedTripsProps) {
  const trips: TripCard[] = dbTrips?.length
    ? dbTrips.map(mapDbTrip)
    : defaultTrips.filter((t) => t.isFeatured).map(mapStaticTrip);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((api: any) => {
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center opacity-[0.12]"
          style={{ 
            backgroundImage: 'url("/MapChart_Map.svg")',
            backgroundSize: '200%',
            filter: 'grayscale(100%) brightness(1.1)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-xl">
            <p className="font-nav text-[10px] md:text-xs font-medium uppercase tracking-[0.25em] text-accent mb-4">
              PREMIUM EXPEDITIONS
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-charcoal leading-tight">
              Featured Adventures
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className={`w-12 h-12 border flex items-center justify-center transition-all ${
                prevBtnDisabled
                  ? "border-gray-200 text-gray-300"
                  : "border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal"
              }`}
              aria-label="Previous trip"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className={`w-12 h-12 border flex items-center justify-center transition-all ${
                nextBtnDisabled
                  ? "border-gray-200 text-gray-300"
                  : "border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal"
              }`}
              aria-label="Next trip"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden p-1 -m-1" ref={emblaRef}>
          <div className="flex gap-6 lg:gap-8">
            {trips.map((trip, i) => {
              const categoryName = "K2K EXPEDITION";
              const startLoc = trip.startLocation ? trip.startLocation.split(", ") : ["Unknown", ""];
              const endLoc = trip.endLocation ? trip.endLocation.split(", ") : ["Unknown", ""];
              const currentPrice = trip.price || 0;
              const originalPrice = currentPrice > 0 ? Math.round(currentPrice * 1.2) : 0;
              const perNightPrice = trip.durationNights > 0 ? Math.round(currentPrice / trip.durationNights) : 0;
              
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] max-w-[420px]"
                >
                  <Link href={`/trips/${trip.slug}`} className="group block h-full">
                    <div className="bg-white border border-gray-200 group flex flex-col h-full rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="w-full text-center py-2.5 bg-[#F6F4F0] border-b border-gray-200">
                        <p className="font-nav text-[9px] uppercase tracking-widest text-[#3a3a3a] font-medium">
                          {categoryName}
                        </p>
                      </div>

                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={trip.coverImage || "/images/trips/1.webp"}
                          alt={trip.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        <button className="absolute bottom-4 right-4 bg-white px-3 py-1.5 flex items-center gap-1.5 text-charcoal text-[10px] font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm shadow-sm">
                          <Map size={12} /> Map
                        </button>
                      </div>

                      <div className="p-6 flex flex-col flex-1 bg-white">
                        {/* Trip Title */}
                        <h3 className="text-[#102a43] text-xl font-bold leading-tight mb-4 group-hover:text-red-800 transition-colors">
                          {trip.title}
                        </h3>

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

                      <div className="flex items-center justify-between text-[11px] text-gray-600 mb-6 font-medium bg-gray-50 px-3 py-1.5 rounded-sm">
                        <span>{trip.departures?.[0]?.startDate ? new Date(trip.departures[0].startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</span>
                        <span>{trip.departures?.[0]?.endDate ? new Date(trip.departures[0].endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</span>
                      </div>

                      <div className="flex items-center justify-center text-[11px] text-gray-500 mb-5 pb-5 border-b border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[22px] leading-none text-red-800">{trip.durationNights} Nights</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[9px] font-nav uppercase tracking-widest font-bold rounded-full">
                          <Tag size={10} /> BEST SELLER
                        </span>
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-[11px] text-gray-500 mb-1">Per rider, from:</p>
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
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
