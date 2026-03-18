"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { PricingOption } from "@/types/trip";

interface TripPricingProps {
  pricing: PricingOption[];
  inclusions: string[];
  exclusions: string[];
}

export const TripPricing = ({ pricing, inclusions, exclusions }: TripPricingProps) => {
  return (
    <div className="space-y-12">
      {/* Pricing Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {pricing.map((option, idx) => (
          <motion.div 
            key={idx} 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="bg-[#FAF9F6] border border-charcoal/10 rounded-xl p-8 text-center flex flex-col justify-center"
          >
            <h4 className="font-nav text-sm uppercase tracking-widest text-charcoal/60 mb-2">{option.label}</h4>
            <div className="text-4xl font-serif text-charcoal mb-4">
              ₹{option.price.toLocaleString("en-IN")}
              <span className="text-sm font-sans text-charcoal/50 ml-1">/ rider</span>
            </div>
            <p className="text-xs text-charcoal/50 uppercase tracking-widest">Taxes Included</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.6 }}
        >
          <h4 className="text-xl font-serif text-charcoal mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-accent" size={24} /> What's Included
          </h4>
          <ul className="space-y-4">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex flex-col text-charcoal/70 text-sm md:text-base leading-relaxed pl-7 relative">
                <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-xl font-serif text-charcoal mb-6 flex items-center gap-2">
            <XCircle className="text-charcoal/40" size={24} /> What's Not Included
          </h4>
          <ul className="space-y-4">
            {exclusions.map((item, idx) => (
              <li key={idx} className="flex flex-col text-charcoal/50 text-sm md:text-base leading-relaxed pl-7 relative">
                <span className="absolute left-0 top-1.5 w-4 h-4 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
