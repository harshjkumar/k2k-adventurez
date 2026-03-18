"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Instagram, ArrowRight, Heart, MessageCircle } from "lucide-react";

const galleryImages = [
    { src: "https://res.cloudinary.com/dc0oduvyz/image/upload/v1/k2k/gallery/homepage/tt_1.jpg", alt: "Manali mountain road", likes: "3.1K", comments: "234", highlight: false },
    { src: "https://res.cloudinary.com/dc0oduvyz/image/upload/v1/k2k/gallery/homepage/tt_2.jpg", alt: "Leh Ladakh ride", likes: "2.4K", comments: "186", highlight: true },
    { src: "https://res.cloudinary.com/dc0oduvyz/image/upload/v1/k2k/gallery/homepage/tt_3.jpg", alt: "Spiti Valley expedition", likes: "1.8K", comments: "142", highlight: false },
    { src: "https://res.cloudinary.com/dc0oduvyz/image/upload/v1/k2k/gallery/homepage/tt_4.jpg", alt: "Rajasthan desert ride", likes: "2.7K", comments: "198", highlight: false },
    { src: "https://res.cloudinary.com/dc0oduvyz/image/upload/v1/k2k/gallery/homepage/tt_5.jpg", alt: "Meghalaya green hills", likes: "1.5K", comments: "112", highlight: false }
];

const GallerySection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="relative py-28 overflow-hidden bg-[#FAF9F6]"
        >
            {/* Background Map */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-no-repeat bg-center opacity-[0.12]"
                    style={{ 
                        backgroundImage: 'url("/MapChart_Map.svg")',
                        backgroundSize: '200%',
                        filter: 'grayscale(100%) brightness(1.1)',
                        mixBlendMode: 'multiply'
                    }}
                />
            </div>

            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30 z-10" />

            {/* Header Area */}
            <div className="relative z-10 container mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-end justify-between mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-[500px]"
                >
                    <span
                        className="inline-block font-nav text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4"
                    >
                        ── From The Road
                    </span>
                    <h2
                        className="mb-4 text-4xl lg:text-5xl font-serif font-light text-charcoal"
                    >
                        Adventure{" "}
                        <span className="text-accent italic">
                            Gallery
                        </span>
                    </h2>
                    <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-md">
                        Real moments from real rides. Explore our hand-picked collection of
                        the pristine mountains, muddy trails, and unforgettable journeys.
                    </p>
                </motion.div>

                {/* View All Button (Desktop) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="hidden md:block pb-2"
                >
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-3 px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] rounded-full text-xs font-nav font-medium uppercase tracking-widest transition-colors duration-300 group"
                    >
                        View Gallery
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="w-full relative z-10 px-6 lg:px-8 pb-10 line-height-none">
                <div className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 pt-8 hide-scrollbar items-center">
                    {galleryImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`relative group shrink-0 snap-center rounded-[8px] overflow-hidden cursor-pointer shadow-xl bg-charcoal/5 ${
                              img.highlight ? 'h-[440px] md:h-[540px]' : 'h-[360px] md:h-[460px]'
                            }`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-auto h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                                loading="lazy"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center gap-6 w-full">
                                    <div className="flex items-center gap-2 text-[#FAF9F6]">
                                        <Heart size={20} className="fill-[#FAF9F6] text-[#FAF9F6]" />
                                        <span className="text-sm font-semibold font-nav">{img.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#FAF9F6]">
                                        <MessageCircle size={20} className="fill-[#FAF9F6] text-[#FAF9F6]" />
                                        <span className="text-sm font-semibold font-nav">{img.comments}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Corner accent */}
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[#FAF9F6]">
                                <Instagram size={18} />
                            </div>

                            {/* Number Indicator */}
                            <div className="absolute bottom-4 right-4 text-[#FAF9F6]/80 font-bold text-sm font-nav">
                                0{idx + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mobile View All Button */}
            <div className="relative z-10 container mx-auto px-6 mt-4 text-center md:hidden">
                <Link
                    href="/gallery"
                    className="inline-flex flex-1 w-full justify-center items-center gap-3 px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-[#FAF9F6] rounded-full text-xs font-nav font-medium uppercase tracking-widest transition-colors duration-300 group"
                >
                    View Gallery
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Global CSS for hiding scrollbar specifically for this section */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default GallerySection;
