"use client";

import { motion } from "framer-motion";
import { ClipboardList, Mountain, Navigation, Camera } from "lucide-react";

/* ── Hardcoded fallback ─────────────────────────────────────── */
const fallbackSteps = [
  { step_number: "01", title: "Choose Your Ride", description: "Browse our curated expeditions and pick the one that matches your vibe — beginner, moderate, or expert-level trails.", icon: "ClipboardList" },
  { step_number: "02", title: "Gear Up", description: "We provide a fully serviced Royal Enfield, riding gear, helmets, and everything you need.", icon: "Mountain" },
  { step_number: "03", title: "Ride & Explore", description: "Follow our expert ride captains through breathtaking terrains. Backup vehicle, mechanic, and emergency support ride with you.", icon: "Navigation" },
  { step_number: "04", title: "Capture Memories", description: "Professional photography, GoPro mounts, drone shots — we make sure every moment is documented forever.", icon: "Camera" },
];

const iconMap: Record<string, any> = {
  ClipboardList,
  Mountain,
  Navigation,
  Camera,
};

interface Step {
  step_number: string;
  title: string;
  description: string;
  icon: string;
}

interface HowItWorksProps {
  dbSteps?: Step[] | null;
}

export function HowItWorks({ dbSteps }: HowItWorksProps) {
  const steps: Step[] = dbSteps?.length ? dbSteps : fallbackSteps;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/trips/1.webp')" }}
      />
      <div className="absolute inset-0 z-0 bg-white/95" />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              HOW IT WORKS
            </p>
            <div className="w-16 h-[1px] bg-accent/40" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-light text-charcoal mb-6 leading-tight">
            Your Adventure in <br className="hidden sm:block" />
            <span className="text-accent">4 Simple Steps</span>
          </h2>

          <p className="text-sm md:text-base text-charcoal/60 font-sans max-w-2xl leading-relaxed">
            From booking to memories, we handle every detail so you can focus on
            the ride of your life.
          </p>
        </motion.div>

        <div className="relative w-full">
          <div className="hidden lg:block absolute top-[45px] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-accent/20 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || ClipboardList;
              return (
                <motion.div
                  key={step.step_number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex flex-col items-start relative group"
                >
                  <div className="relative mb-8">
                    <div className="w-[90px] h-[90px] rounded-full bg-white shadow-lg border border-accent/10 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                      <IconComponent
                        size={32}
                        strokeWidth={1.5}
                        className="text-accent"
                      />
                    </div>
                    <div className="absolute -top-1 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                      <span className="font-nav text-[10px] font-bold text-white tracking-wider">
                        {step.step_number}
                      </span>
                    </div>
                  </div>

                  <div className="pr-4">
                    <h3 className="font-serif text-2xl lg:text-3xl font-light text-charcoal mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed font-sans max-w-[280px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
