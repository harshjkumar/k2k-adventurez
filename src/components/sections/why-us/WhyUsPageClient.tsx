"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Search, Calendar, Shield, Camera, Award, Headphones } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "1. Local Expertise You Can Trust",
    desc: "Our travel specialists have deep knowledge of every destination we offer. From hidden gems to popular attractions, we design journeys that let you experience the destination like a local.",
  },
  {
    icon: Calendar,
    title: "2. Carefully Crafted Tour Packages",
    desc: "Every itinerary is thoughtfully planned to give you the perfect balance of adventure, culture, comfort, and relaxation. Whether it's a mountain expedition or a family holiday, we ensure every moment counts.",
  },
  {
    icon: Search,
    title: "3. Personalized Travel Planning",
    desc: "Your travel dreams are unique, and so should be your itinerary. We offer customized travel packages tailored to your schedule, interests, and budget.",
  },
  {
    icon: Shield,
    title: "4. Safety Comes First",
    desc: "Travel with confidence. Our experienced team understands the terrain, weather conditions, and travel challenges—especially in remote destinations like Ladakh—ensuring a safe and smooth journey.",
  },
  {
    icon: Camera,
    title: "5. Unforgettable Local Experiences",
    desc: "We go beyond sightseeing. Enjoy local festivals, cultural experiences, and authentic interactions that make your trip truly memorable.",
  },
  {
    icon: Award,
    title: "6. Best Value for Your Money",
    desc: "We provide high-quality services at competitive prices. Our strong network with hotels, transport providers, and local partners ensures you get the best experience without overspending.",
  },
  {
    icon: Headphones,
    title: "7. Dedicated Support Throughout",
    desc: "From the moment you plan your trip until you return home, our team is always ready to assist you, ensuring a stress-free and enjoyable travel experience.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export function WhyUsPageClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[450px] w-full overflow-hidden">
        <Image src="/images/trips/3.webp" alt="Why Choose K2K Adventurez" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <p className="font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/80 mb-6">
              K2K Promise
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight">
              Why Choose Us
            </h1>
            <p className="mt-6 max-w-2xl text-white/70 text-sm md:text-base leading-relaxed font-sans mx-auto">
              We don&apos;t just plan trips; we curate unforgettable experiences.
              Here&apos;s why travelers trust us with their biggest adventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Reasons Grid ─────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white p-10 border border-gray-100 hover:border-accent/20 hover:shadow-lg transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-accent/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <r.icon size={24} strokeWidth={1.5} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-2xl font-light text-charcoal mb-4 group-hover:text-accent transition-colors">
                  {r.title.split('. ')[1]}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed font-sans">
                  {r.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal mb-6">
              Ready for an Adventure?
            </h2>
            <p className="text-charcoal/60 text-sm md:text-base leading-relaxed mb-10">
              Let&apos;s create the perfect itinerary tailored to your dreams.
            </p>
            <Link
              href="/trips"
              className="inline-flex items-center gap-3 font-nav text-xs uppercase tracking-[0.2em] font-medium px-10 py-5 bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Book A Ride Now <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
