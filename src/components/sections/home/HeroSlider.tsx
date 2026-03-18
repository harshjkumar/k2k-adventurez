"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ── Hardcoded fallback ─────────────────────────────────────── */
const fallbackSlides = [
  { overline: "EXPLORE WITH US", title: "Explore Ladakh your way.", image: "/images/trips/1.webp" },
  { overline: "SPITI VALLEY", title: "Into the middle land.", image: "/images/trips/2.webp" },
  { overline: "KASHMIR TO LADAKH", title: "Paradise to moonscape.", image: "/images/trips/3.webp" },
];

interface Slide {
  overline: string;
  title: string;
  image: string;
}

interface HeroSliderProps {
  dbSlides?: Slide[] | null;
}

export function HeroSlider({ dbSlides }: HeroSliderProps) {
  const slides: Slide[] = dbSlides?.length ? dbSlides : fallbackSlides;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={current === 0}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center justify-center w-full max-w-lg mb-8"
            >
              <div className="flex-1 h-[1px] bg-white/40" />
              <p className="px-6 font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/90 shrink-0">
                {slide.overline}
              </p>
              <div className="flex-1 h-[1px] bg-white/40" />
            </motion.div>

            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[110px] font-light text-white leading-[1.05] tracking-tight text-center max-w-[1400px]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="block"
              >
                {slide.title}
              </motion.span>
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1 transition-all duration-500 rounded-full ${
                i === current ? "bg-white h-8" : "bg-white/30 h-3 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
