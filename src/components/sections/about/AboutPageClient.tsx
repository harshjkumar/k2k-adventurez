"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Mountain,
  Bike,
  Landmark,
  Package,
  Users,
  ShieldCheck,
  Map,
  Headphones,
  Clock,
  Heart,
  Leaf,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const offers = [
  { icon: Compass, title: "Adventure Tours", desc: "Push your limits with thrilling experiences." },
  { icon: Mountain, title: "High-Altitude Trips", desc: "Conquer the mighty Himalayas." },
  { icon: Bike, title: "Bike Expeditions", desc: "The ultimate freedom on two wheels." },
  { icon: Landmark, title: "Cultural Tours", desc: "Immerse in local heritage." },
  { icon: Package, title: "Custom Packages", desc: "Tailored to your perfect itinerary." },
  { icon: Users, title: "Group & Family", desc: "Shared memories that last a lifetime." },
];

const whyUs = [
  { icon: Map, title: "Expert Planners", desc: "Experienced professionals who design smooth and memorable journeys." },
  { icon: Compass, title: "Smart Itineraries", desc: "Well-planned travel routes that help you experience the best of every destination." },
  { icon: ShieldCheck, title: "Trusted Network", desc: "Reliable guides, partners, and service providers ensuring quality." },
  { icon: Heart, title: "Safety & Comfort", desc: "Your safety and comfort are our absolute highest priorities." },
  { icon: Headphones, title: "24/7 Support", desc: "Friendly assistance from the moment you plan until you return home." },
];

const globalPresence = [
  {
    country: "Delhi",
    address: "Head office - A-190, G Block, Phase 6, Arjan Garh, South Delhi – 110047",
    email: "info@k2kadventurez.com",
    contact: "+91 9899157292",
  },
  {
    country: "Leh Ladakh",
    address: "S.NO 2, G.H Road, Near Shanti Stupa, Leh, Ladakh - 194101",
    email: "info@k2kadventurez.com",
    contact: "+91 97188 00082",
  },
  {
    country: "Australia",
    address: "5, Patchouli Street, Truganina, Victoria, Australia - 3029",
    email: "reservation@k2kadventurez.com",
    contact: "+61 403053422",
  },
  {
    country: "Canada",
    address: "155, Eden Oak Trail, Kitchener, Ontario – N2A0H9",
    email: "reservation@k2kadventurez.com",
    contact: "+91 8595157292",
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function AboutPageClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src="/images/trips/2.webp"
          alt="About K2K Adventurez"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div {...fadeUp}>
            <p className="font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/80 mb-6">
              About K2K Adventurez
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-tight">
              Discover the Spirit <br className="hidden sm:block" />
              of Adventure.
            </h1>
            <p className="mt-6 max-w-2xl text-white/70 text-sm md:text-base leading-relaxed font-sans mx-auto">
              We are a passionate travel company dedicated to creating unforgettable
              travel experiences across some of the most breathtaking destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission / Vision ─────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div {...fadeUp} className="relative">
              <div className="absolute -top-2 left-0 w-12 h-1 bg-accent" />
              <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mb-6 pt-6">
                Our Mission
              </h2>
              <p className="text-charcoal/60 leading-relaxed font-sans">
                Our mission is to make every trip feel like an adventure worth
                remembering. With carefully crafted itineraries, reliable services,
                and a passion for exploration, we create travel experiences that stay
                with you long after the journey ends.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="relative">
              <div className="absolute -top-2 left-0 w-12 h-1 bg-accent" />
              <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mb-6 pt-6">
                Our Vision
              </h2>
              <p className="text-charcoal/60 leading-relaxed font-sans">
                Our vision is to inspire more people to pack their bags, chase new
                horizons, and experience the world beyond the ordinary. We aim to
                create travel experiences that spark adventure and leave lasting
                memories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">
              WHAT WE OFFER
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal">
              Experiences Crafted <br className="hidden sm:block" />
              for the Brave
            </h2>
            <p className="mt-4 text-charcoal/60 max-w-2xl mx-auto text-sm md:text-base">
              Our itineraries are carefully designed to ensure that travelers
              experience the best destinations, attractions, and local culture.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group bg-white p-8 border border-gray-100 hover:border-accent/20 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-14 h-14 bg-accent/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  <item.icon size={28} strokeWidth={1.5} className="text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-light text-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Travel With Us ───────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">
              WHY TRAVEL WITH US
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal">
              The K2K Difference
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-accent/5 rounded-full flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <item.icon size={28} strokeWidth={1.5} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-light text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Responsible Tourism ───────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <Image src="/images/trips/4.webp" alt="Responsible travel" fill className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <Leaf size={36} strokeWidth={1.5} className="mx-auto text-accent mb-6" />
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6">
              Responsible Tourism
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              We strongly believe in responsible and sustainable tourism. Our goal is
              to promote travel that benefits local communities, protects the
              environment, and preserves cultural heritage for future generations.
              Leave nothing but tire tracks, take nothing but stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Global Presence ──────────────────────────────────── */}
      <section className="py-24 bg-stone-50 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">
              Worldwide Reach
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">
              Our Global Presence
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {globalPresence.map((loc, i) => (
              <motion.div 
                key={loc.country}
                {...fadeUp}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow rounded-sm flex flex-col h-full"
              >
                <h3 className="font-serif text-2xl font-light text-charcoal mb-4 flex items-center gap-2">
                  <MapPin size={22} className="text-accent" />
                  {loc.country}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-6 flex-1">
                  {loc.address}
                </p>
                <div className="space-y-3 text-sm font-medium mt-auto">
                  <p className="flex items-center gap-3 text-charcoal/80">
                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-accent" />
                    </span>
                    <a href={`mailto:${loc.email}`} className="hover:text-accent transition-colors truncate text-xs">{loc.email}</a>
                  </p>
                  <p className="flex items-center gap-3 text-charcoal/80">
                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-accent" />
                    </span>
                    <a href={`tel:${loc.contact.replace(/\s+/g, '')}`} className="hover:text-accent transition-colors truncate">{loc.contact}</a>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal mb-6">
              Start Your Journey With Us
            </h2>
            <p className="text-charcoal/60 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-4">
              Whether you are looking for an adventurous road trip, a peaceful
              mountain getaway, or a unique cultural experience — K2K Adventurez is
              here to help you plan the perfect journey.
            </p>
            <p className="font-serif text-lg italic text-accent mb-10">
              &ldquo;Let us turn your travel dreams into unforgettable memories.&rdquo;
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-nav text-xs uppercase tracking-[0.2em] font-medium px-10 py-4 bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Plan Your Adventure <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
