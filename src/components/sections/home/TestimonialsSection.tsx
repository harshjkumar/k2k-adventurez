"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { defaultTestimonials } from "@/lib/data/trips";

interface TestimonialData {
  id?: string;
  name: string;
  trip: string;
  rating: number;
  location: string;
  review: string;
  avatar?: string;
}

interface TestimonialsSectionProps {
  dbTestimonials?: TestimonialData[] | null;
}

export function TestimonialsSection({ dbTestimonials }: TestimonialsSectionProps) {
  const testimonials: TestimonialData[] = dbTestimonials?.length
    ? dbTestimonials
    : defaultTestimonials;

  const [current, setCurrent] = useState(0);
  const testimonial = testimonials[current];

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent/40" />
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              REAL RIDERS, REAL ADVENTURES
            </p>
            <div className="w-8 h-[1px] bg-accent/40" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-charcoal leading-tight">
            What Our Riders Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="text-center"
            >
              <Quote size={48} className="mx-auto text-accent/20 mb-8" />

              <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-charcoal leading-relaxed font-light italic">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              <div className="flex justify-center gap-1 mt-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? "text-accent fill-accent"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>

              <div className="mt-6">
                <p className="font-serif text-lg font-semibold text-charcoal">
                  {testimonial.name}
                </p>
                <p className="text-sm text-accent mt-1">{testimonial.trip}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-warm-gray mt-2">
                  <MapPin size={12} />
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-8 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center text-charcoal/40 hover:text-accent hover:border-accent transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-xs uppercase tracking-widest text-warm-gray font-nav">
              {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>

            <button
              onClick={next}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center text-charcoal/40 hover:text-accent hover:border-accent transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
