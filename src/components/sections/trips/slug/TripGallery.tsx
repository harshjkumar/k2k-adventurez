"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

interface TripGalleryProps {
  images: string[];
}

export function TripGallery({ images }: TripGalleryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!images || images.length === 0) return null;

  return (
    <section ref={ref} id="gallery" className="relative py-20 overflow-hidden bg-[#FAF9F6]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="inline-block font-nav text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">
            ── Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-charcoal">
            Moments on the Trail
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((imgSrc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * idx }}
              className="relative aspect-[4/3] w-full group overflow-hidden rounded-xl bg-charcoal/5"
            >
              <Image
                src={imgSrc}
                alt={`Trip gallery image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
