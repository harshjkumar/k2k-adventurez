"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function CTABanner() {
  return (
    <section className="relative py-24 w-full bg-charcoal overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/trips/3.webp"
          alt="Contact Us Background"
          fill
          className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/80 to-charcoal/40" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Heading & Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <p className="font-nav text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-6">
              LET'S RIDE
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[1.1] mb-8">
              Start Your <br />
              <span className="font-semibold">Next Journey</span>
            </h2>
            <p className="text-white/60 font-sans max-w-lg mx-auto lg:mx-0 leading-relaxed text-sm lg:text-base">
              Got questions about a specific expedition or looking to customize a private tour? Leave your details below and our ride captains will get back to you.
            </p>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 lg:p-10 rounded-sm">
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-nav text-[9px] uppercase tracking-widest text-white/70">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-serif text-lg" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-nav text-[9px] uppercase tracking-widest text-white/70">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-serif text-lg" 
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-nav text-[9px] uppercase tracking-widest text-white/70">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-serif text-lg" 
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label htmlFor="message" className="font-nav text-[9px] uppercase tracking-widest text-white/70">Your message</label>
                  <textarea 
                    id="message" 
                    rows={3} 
                    className="bg-transparent border-b border-white/20 px-0 py-2 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-serif text-lg resize-none" 
                    placeholder="Tell us about your next adventure..."
                  />
                </div>

                <button 
                  type="button"
                  className="w-full bg-accent text-white font-nav text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] py-4 hover:bg-accent-dark transition-colors duration-300 rounded-sm"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
