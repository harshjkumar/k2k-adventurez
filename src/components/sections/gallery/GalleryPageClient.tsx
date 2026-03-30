"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  caption: string;
}

const defaultImages: GalleryImage[] = [
  { id: "1", src: "/images/trips/1.webp", alt: "Ladakh Mountains", category: "Ladakh", caption: "The stunning Ladakh landscape" },
  { id: "2", src: "/images/trips/2.webp", alt: "Spiti Valley", category: "Spiti", caption: "Spiti Valley road adventure" },
  { id: "3", src: "/images/trips/3.webp", alt: "Kashmir Highway", category: "Kashmir", caption: "Srinagar-Leh Highway" },
  { id: "4", src: "/images/trips/4.webp", alt: "Pangong Lake", category: "Ladakh", caption: "The mesmerizing Pangong Lake" },
  { id: "5", src: "/images/trips/5.webp", alt: "Mountain Pass", category: "Spiti", caption: "Kunzum Pass crossing" },
  { id: "6", src: "/images/trips/1.webp", alt: "Nubra Valley", category: "Ladakh", caption: "Nubra Valley sand dunes" },
  { id: "7", src: "/images/trips/2.webp", alt: "Key Monastery", category: "Spiti", caption: "Key Monastery at dawn" },
  { id: "8", src: "/images/trips/3.webp", alt: "Dal Lake", category: "Kashmir", caption: "Shikara ride on Dal Lake" },
  { id: "9", src: "/images/trips/4.webp", alt: "Magnetic Hill", category: "Ladakh", caption: "The mysterious Magnetic Hill" },
  { id: "10", src: "/images/trips/5.webp", alt: "Pin Valley", category: "Spiti", caption: "Pin Valley National Park" },
  { id: "11", src: "/images/trips/1.webp", alt: "Khardung La", category: "Ladakh", caption: "World's highest motorable pass" },
  { id: "12", src: "/images/trips/3.webp", alt: "Gulmarg Meadows", category: "Kashmir", caption: "The meadows of Gulmarg" },
];

// Masonry column heights for varied layout
const MASONRY_HEIGHTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-square"];

export function GalleryPageClient({ images }: { images: GalleryImage[] | null }) {
  const allImages = images?.length ? images : defaultImages;
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(allImages.map((img) => img.category).filter(Boolean)))];

  const filtered = activeCategory === "All" ? allImages : allImages.filter((img) => img.category === activeCategory);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/trips/4.webp" alt="K2K Gallery" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}>
            <p className="font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/80 mb-6">From The Road</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight">Adventure Gallery</h1>
            <p className="mt-6 max-w-2xl text-white/70 text-sm md:text-base leading-relaxed font-sans mx-auto">
              Stunning moments captured across Ladakh, Spiti, Kashmir, and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 text-xs font-medium rounded-full transition-all duration-300 ${activeCategory === cat ? "bg-accent text-white shadow-md" : "bg-gray-100 text-charcoal/60 hover:bg-gray-200"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16 lg:py-24 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <div className={`relative ${MASONRY_HEIGHTS[i % MASONRY_HEIGHTS.length]} rounded-lg overflow-hidden bg-gray-100`}>
                  <Image src={img.src} alt={img.alt || "Gallery"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={28} className="text-white" />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }} className="absolute top-6 right-6 p-2 text-white/60 hover:text-white z-10">
              <X size={28} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 z-10">
              <ChevronLeft size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 z-10">
              <ChevronRight size={24} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].alt || "Gallery"} fill className="object-contain" />
              {filtered[lightboxIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 text-center p-4">
                  <p className="text-white/80 text-sm">{filtered[lightboxIndex].caption}</p>
                </div>
              )}
            </motion.div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              {lightboxIndex + 1} / {filtered.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
