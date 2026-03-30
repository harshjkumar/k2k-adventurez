"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author: string;
  tags: string[];
  category: string;
  published_at: string;
}

const defaultPosts: BlogPost[] = [
  {
    id: "1", title: "Top 10 Things to Do in Leh Ladakh", slug: "top-10-things-leh-ladakh",
    excerpt: "From Pangong Lake to Khardung La, discover the must-visit places and experiences that make Ladakh a once-in-a-lifetime destination.",
    cover_image: "/images/trips/1.webp", author: "K2K Adventurez", tags: ["Ladakh", "Travel Guide"], category: "Travel Guide", published_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "2", title: "Spiti Valley: A Complete Travel Guide", slug: "spiti-valley-complete-guide",
    excerpt: "Everything you need to know before planning your Spiti Valley trip — best time to visit, permit requirements, and hidden gems.",
    cover_image: "/images/trips/2.webp", author: "K2K Adventurez", tags: ["Spiti", "Travel Guide"], category: "Travel Guide", published_at: "2024-11-20T00:00:00Z",
  },
  {
    id: "3", title: "Essential Packing List for High-Altitude Bike Trips", slug: "packing-list-high-altitude",
    excerpt: "Don't forget these crucial items when preparing for a bike expedition in the Himalayas. From gear to documents, we cover it all.",
    cover_image: "/images/trips/3.webp", author: "K2K Adventurez", tags: ["Tips", "Packing"], category: "Tips & Tricks", published_at: "2024-10-10T00:00:00Z",
  },
  {
    id: "4", title: "Why Monsoon is the Best Time for Ladakh", slug: "monsoon-best-time-ladakh",
    excerpt: "Contrary to popular belief, monsoon season offers unique advantages for Ladakh travelers. Here's why you should consider it.",
    cover_image: "/images/trips/4.webp", author: "K2K Adventurez", tags: ["Ladakh", "Season"], category: "Insights", published_at: "2024-09-05T00:00:00Z",
  },
  {
    id: "5", title: "Kashmir to Ladakh: The Ultimate Road Trip", slug: "kashmir-ladakh-road-trip",
    excerpt: "A day-by-day account of the legendary Srinagar to Leh highway — one of the most scenic drives on Earth.",
    cover_image: "/images/trips/5.webp", author: "K2K Adventurez", tags: ["Kashmir", "Ladakh", "Road Trip"], category: "Journey Diary", published_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "6", title: "How to Acclimatize at High Altitudes", slug: "acclimatize-high-altitudes",
    excerpt: "Altitude sickness can ruin your trip. Learn the proven methods to acclimatize safely and enjoy your high-altitude adventure.",
    cover_image: "/images/trips/1.webp", author: "K2K Adventurez", tags: ["Health", "Tips"], category: "Tips & Tricks", published_at: "2024-07-20T00:00:00Z",
  },
];

export function BlogListingClient({ posts }: { posts: BlogPost[] | null }) {
  const allPosts = posts?.length ? posts : defaultPosts;
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = ["All", ...Array.from(new Set(allPosts.flatMap((p) => p.tags || [])))];

  const filtered = allPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "All" || p.tags?.includes(activeTag);
    return matchSearch && matchTag;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/trips/2.webp" alt="K2K Blog" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}>
            <p className="font-nav text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/80 mb-6">Stories & Guides</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight">The K2K Blog</h1>
            <p className="mt-6 max-w-2xl text-white/70 text-sm md:text-base leading-relaxed font-sans mx-auto">
              Travel stories, expert trip guides, and insider tips from the road.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${activeTag === tag ? "bg-accent text-white" : "bg-gray-100 text-charcoal/60 hover:bg-gray-200"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <Link href={`/blogs/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                  <Image src={featured.cover_image || "/images/trips/1.webp"} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-white text-[10px] font-nav uppercase tracking-widest font-bold rounded-full">
                      <Tag size={10} /> Featured
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-accent font-medium uppercase tracking-wider mb-3">{featured.category || "Travel Guide"}</p>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal leading-tight group-hover:text-accent transition-colors">{featured.title}</h2>
                  <p className="mt-4 text-charcoal/60 text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 mt-6 text-xs text-charcoal/40">
                    <span className="flex items-center gap-1.5"><User size={12} /> {featured.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(featured.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-accent font-nav text-xs uppercase tracking-widest font-medium group-hover:gap-3 transition-all">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="py-16 lg:py-24 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {rest.length === 0 && !featured ? (
            <p className="text-center text-charcoal/40 py-12">No articles found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                  <Link href={`/blogs/${post.slug}`} className="group block bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={post.cover_image || "/images/trips/1.webp"} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] text-accent font-medium uppercase tracking-wider mb-2">{post.category || "Article"}</p>
                      <h3 className="font-serif text-xl font-light text-charcoal leading-snug group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                      <p className="mt-3 text-sm text-charcoal/50 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-charcoal/40">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
