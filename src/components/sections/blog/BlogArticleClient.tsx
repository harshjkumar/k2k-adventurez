"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag, Share2, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  tags: string[];
  category: string;
  published_at: string;
}

export function BlogArticleClient({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url: shareUrl });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src={post.cover_image || "/images/trips/1.webp"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        <div className="relative z-10 h-full flex flex-col justify-end items-start px-6 lg:px-12 pb-12 max-w-[1440px] mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}>
            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/60 text-xs font-nav uppercase tracking-widest hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <p className="text-xs text-accent font-medium uppercase tracking-wider mb-3">{post.category || "Article"}</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight max-w-3xl">{post.title}</h1>
            <div className="flex items-center gap-6 mt-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {Math.max(1, Math.ceil((post.content?.length || 0) / 1200))} min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            {/* Article Body */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose-k2k max-w-none"
            >
              {post.content ? (
                <div
                  className="text-charcoal/70 leading-[1.9] text-[15px] space-y-6 font-sans"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
                />
              ) : (
                <div className="text-charcoal/70 leading-[1.9] text-[15px] space-y-6 font-sans">
                  <p>{post.excerpt}</p>
                  <p>Full article content will be available soon. Stay tuned for in-depth travel stories, guide tips, and adventure insights from K2K Adventurez.</p>
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-xs text-charcoal/60 rounded-full">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8">
                <button onClick={handleShare} className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-md text-sm text-charcoal/60 hover:text-accent hover:border-accent transition-colors">
                  <Share2 size={16} /> Share this article
                </button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Author Card */}
              <div className="bg-stone-50 rounded-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm uppercase">
                    {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-sm">{post.author}</p>
                    <p className="text-xs text-charcoal/40">Adventure Specialist</p>
                  </div>
                </div>
                <p className="text-xs text-charcoal/50 leading-relaxed">
                  Sharing stories and guides from the roads less traveled across the Indian Himalayas.
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} href={`/blogs/${rp.slug}`} className="group flex gap-3">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <Image src={rp.cover_image || "/images/trips/1.webp"} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-charcoal leading-snug group-hover:text-accent transition-colors line-clamp-2">{rp.title}</h4>
                          <p className="text-[10px] text-charcoal/40 mt-1">
                            {new Date(rp.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-charcoal rounded-lg p-6 text-center">
                <h3 className="font-serif text-xl text-white mb-2">Ready to Ride?</h3>
                <p className="text-xs text-white/60 mb-4">Explore our curated adventures across India.</p>
                <Link href="/trips" className="inline-block px-6 py-2.5 bg-accent text-white text-xs font-medium uppercase tracking-wider rounded-md hover:bg-accent/90 transition-colors">
                  View Trips
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
