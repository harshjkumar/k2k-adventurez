"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  AlertTriangle,
  Clock,
  HeartPulse,
  Cloud,
  Backpack,
  Leaf,
  Shield,
} from "lucide-react";
import { defaultGuidelines } from "@/lib/data/trips";

const icons = [AlertTriangle, Clock, HeartPulse, Cloud, Backpack, Leaf, Shield];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7 },
};

export function GuidelinesPageClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/trips/4.webp" alt="Travel Guidelines" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight">
              Travel Guidelines
            </h1>
            <p className="mt-6 max-w-xl text-white/70 text-sm md:text-base mx-auto">
              Ensure a safe, enjoyable, and responsible expedition. Read our
              essential guidelines for traveling to high-altitude destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Guidelines ───────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            {defaultGuidelines.map((g, i) => {
              const Icon = icons[i] || Shield;
              return (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-stone-50 p-8 border border-gray-100 hover:border-accent/20 hover:shadow-md transition-all duration-500"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-accent/5 flex items-center justify-center shrink-0">
                      <Icon size={24} strokeWidth={1.5} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-nav text-[10px] uppercase tracking-widest text-accent/60 mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif text-2xl font-light text-charcoal mb-3">
                        {g.title}
                      </h3>
                      <p className="text-sm text-charcoal/60 leading-relaxed mb-4">
                        {g.description}
                      </p>
                      {g.items && (
                        <ul className="space-y-2">
                          {g.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-charcoal/60">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
