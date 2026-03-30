"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import type { Trip } from "@/types/trip";

export function Navbar({ trips = [] }: { trips?: Trip[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  const lehTrips = trips.filter(t => t.region?.toLowerCase().includes('ladakh') || t.categoryId?.includes('ladakh') || t.title?.toLowerCase().includes('ladakh'));
  const spitiTrips = trips.filter(t => t.region?.toLowerCase().includes('spiti') || t.categoryId?.includes('spiti') || t.title?.toLowerCase().includes('spiti'));
  const otherTrips = trips.filter(t => !lehTrips.some(lt => lt.id === t.id) && !spitiTrips.some(st => st.id === t.id));

  const navLinks = [
    { label: "Leh Ladakh", href: "/leh-ladakh", items: lehTrips },
    { label: "Spiti Valley", href: "/trips", items: spitiTrips },
    { label: "Other Destinations", href: "/trips", items: otherTrips },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blogs" },
  ];

  // Pages that don't have a dark hero image at the top
  const forceSolid = ['/trips', '/faq', '/policies/cancellation', '/policies/privacy'].includes(pathname) || pathname.startsWith('/trips/');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine colors based on scroll state
  const isScrolled = scrolled || forceSolid;
  const textColor = isScrolled ? "text-charcoal" : "text-white";
  const hoverColor = isScrolled ? "hover:text-accent" : "hover:text-white/70";
  const borderColor = isScrolled ? "border-charcoal/30" : "border-white/30";
  const borderHover = isScrolled ? "hover:border-charcoal" : "hover:border-white";
  const iconColor = isScrolled ? "text-charcoal/60 hover:text-charcoal" : "text-white/80 hover:text-white";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[60]" />

      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent border-b border-white/10"
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo — left */}
            <Link href="/" className={`flex-shrink-0 group flex flex-col items-start leading-none transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
              <span className={`font-serif text-[26px] lg:text-[30px] font-semibold tracking-[0.02em]`}>
                K<span className="text-[22px] lg:text-[26px]">2</span>K
              </span>
              <span className={`font-nav text-[8px] lg:text-[9px] font-medium uppercase tracking-[0.35em] ${isScrolled ? 'text-warm-gray' : 'text-white/70'} -mt-1`}>
                Adventurez
              </span>
            </Link>

            {/* Center nav links — desktop */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <div key={link.href + link.label} className="relative group">
                  <Link
                    href={link.href}
                    className={`font-nav text-[11px] font-medium uppercase tracking-[0.18em] transition-colors flex items-center gap-1 py-4 ${isScrolled ? 'text-charcoal/80 hover:text-charcoal' : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {link.label}
                    {link.items && <ChevronDown size={12} className={isScrolled ? "text-charcoal/40" : "text-white/40 group-hover:text-white/70"} />}
                  </Link>

                  {link.items && link.items.length > 0 && (
                    <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="py-2 flex flex-col">
                        {link.items.map(trip => (
                          <Link
                            key={trip.id}
                            href={`/trips/${trip.slug}`}
                            className="px-4 py-2.5 text-xs text-charcoal/80 hover:text-accent hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 truncate"
                          >
                            {trip.displayTitle || trip.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions — desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${iconColor}`}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                href={user ? "/dashboard" : "/login"}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${iconColor}`}
                aria-label="Profile"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link
                href="/contact"
                className={`font-nav text-[10px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 border transition-all duration-300 rounded-sm ${textColor} ${borderColor} ${borderHover} ${isScrolled ? 'hover:bg-charcoal/5' : 'hover:bg-white/10'}`}
              >
                Contact Us
              </Link>

              <Link
                href="/trips"
                className="font-nav text-[10px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-accent text-white hover:bg-accent-dark transition-all duration-300 rounded-sm"
              >
                Reserve
              </Link>
            </div>

            {/* Mobile actions & menu button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href={user ? "/dashboard" : "/login"}
                onClick={() => setMobileOpen(false)}
                className={`p-2 transition-colors flex items-center justify-center ${textColor} ${hoverColor}`}
                aria-label="Profile"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 transition-colors ${textColor} ${hoverColor}`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col justify-center items-center pt-20"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href + link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-3xl font-light text-charcoal hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.items && link.items.length > 0 && (
                    <div className="flex flex-col items-center mt-3 gap-2">
                      {link.items.map(trip => (
                        <Link
                          key={trip.id}
                          href={`/trips/${trip.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="font-nav text-sm text-charcoal/70 hover:text-accent transition-colors text-center px-4"
                        >
                          {trip.displayTitle || trip.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex flex-col items-center gap-4 mt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="font-nav text-xs font-medium uppercase tracking-widest px-8 py-3 border border-charcoal/30 text-charcoal hover:bg-charcoal/5 transition-all"
                >
                  Contact Us
                </Link>
                <Link
                  href="/trips"
                  onClick={() => setMobileOpen(false)}
                  className="font-nav text-xs font-medium uppercase tracking-widest px-8 py-3 bg-accent text-white hover:bg-accent-dark transition-all w-full text-center"
                >
                  Reserve
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 max-w-[1440px] w-full mx-auto">
              <div className="flex items-center gap-4 flex-1">
                <Search className="text-charcoal/40" size={24} />
                <input
                  type="text"
                  placeholder="Search treks by name, location, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xl md:text-2xl font-serif text-charcoal outline-none placeholder:text-charcoal/20"
                  autoFocus
                />
              </div>
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 text-charcoal/40 hover:text-charcoal transition-colors">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
              {searchQuery.trim().length > 1 ? (
                (() => {
                  const q = searchQuery.toLowerCase();
                  const results = trips.filter(t =>
                    t.title.toLowerCase().includes(q) ||
                    t.region?.toLowerCase().includes(q) ||
                    t.route?.toLowerCase().includes(q) ||
                    t.keywords?.some((k: string) => k.toLowerCase().includes(q))
                  );
                  return (
                    <div className="max-w-3xl">
                      <h3 className="font-nav text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-6">Search Results ({results.length})</h3>
                      {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {results.map(trip => (
                            <Link
                              key={trip.id}
                              href={`/trips/${trip.slug}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                              className="group flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-accent/30 hover:shadow-sm transition-all"
                            >
                              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {trip.coverImage && <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                              </div>
                              <div className="flex flex-col justify-center">
                                <h4 className="font-serif text-lg text-charcoal group-hover:text-accent transition-colors line-clamp-1">{trip.title}</h4>
                                <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">{trip.tagline || (trip.durationDays + " Days")}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-lg text-charcoal/50">No treks found matching &quot;{searchQuery}&quot;.</p>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="max-w-3xl">
                  <h3 className="font-nav text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-6">Popular Treks</h3>
                  <div className="flex flex-wrap gap-3">
                    {trips.filter(t => t.isFeatured).slice(0, 5).map(trip => (
                      <Link
                        key={trip.id}
                        href={`/trips/${trip.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="px-4 py-2 border border-gray-100 rounded-full text-sm text-charcoal hover:border-accent hover:text-accent transition-colors"
                      >
                        {trip.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
