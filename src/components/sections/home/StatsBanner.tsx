"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Hardcoded fallback ─────────────────────────────────────── */
const fallbackStats = [
  { value: 200, suffix: "+", label: "Expeditions Completed" },
  { value: 10, suffix: "K+", label: "Happy Riders" },
  { value: 50, suffix: "+", label: "Unique Destinations" },
  { value: 100, suffix: "%", label: "Adrenaline" },
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface StatsBannerProps {
  dbStats?: Stat[] | null;
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white">
      {count}
      <span className="text-white/80">{suffix}</span>
    </div>
  );
}

export function StatsBanner({ dbStats }: StatsBannerProps) {
  const stats: Stat[] = dbStats?.length ? dbStats : fallbackStats;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/trips/3.webp)" }}
      />
      <div className="absolute inset-0 bg-charcoal/80" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/50 font-medium font-nav">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
