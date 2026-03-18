"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { defaultFAQs } from "@/lib/data/trips";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7 },
};

export function FAQPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = defaultFAQs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/trips/5.webp" alt="FAQ" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <p className="font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/80 mb-6">
              Ladakh Expeditions
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight">
              Frequently Asked <br className="hidden sm:block" /> Questions
            </h1>
            <p className="mt-6 max-w-xl text-white/70 text-sm md:text-base mx-auto">
              Everything you need to know about navigating the High Himalayas with K2K Adventurez.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ List ─────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Search */}
          <motion.div {...fadeUp} className="relative mb-12">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-stone-50 border border-gray-200 text-charcoal text-sm placeholder:text-gray-400 focus:border-accent focus:outline-none transition-colors"
            />
          </motion.div>

          <div className="space-y-4">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-gray-100 hover:border-accent/10 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="flex items-start gap-4 pr-4">
                    <span className="font-nav text-[10px] font-bold text-accent/40 mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-lg text-charcoal">{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-accent shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 pl-16">
                    <p className="text-sm text-charcoal/60 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-charcoal/40 py-12">
                No questions match your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
