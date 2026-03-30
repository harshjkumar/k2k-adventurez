"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";

interface HeroSlide { id?: string; overline: string; title: string; image: string; order: number; is_active: boolean }
interface Stat { id?: string; value: number; suffix: string; label: string; order: number; is_active: boolean }
interface HowItWorksStep { id?: string; step_number: string; title: string; description: string; icon: string; order: number; is_active: boolean }
interface Testimonial { id?: string; name: string; trip: string; rating: number; location: string; review: string; is_active: boolean }

const SECTIONS = ["Hero Slides", "Stats", "How It Works", "Testimonials"] as const;
type SectionName = (typeof SECTIONS)[number];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionName>("Hero Slides");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [howItWorks, setHowItWorks] = useState<HowItWorksStep[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      const data = await res.json();
      setHeroSlides(data.heroSlides || []);
      setStats(data.stats || []);
      setHowItWorks(data.howItWorks || []);
      setTestimonials(data.testimonials || []);
    } catch {} finally { setLoading(false); }
  };

  const saveSection = async (section: string, items: any[]) => {
    setSaving(true);
    try {
      await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, items }),
      });
      alert("Saved successfully!");
      fetchAll();
    } catch {
      alert("Failed to save.");
    } finally { setSaving(false); }
  };

  const updateItem = (setter: Function, items: any[], i: number, field: string, value: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };
    setter(copy);
  };

  if (loading) return <div className="p-12 text-center text-charcoal/40">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-charcoal">Homepage Settings</h1>
        <button onClick={fetchAll} className="p-2 rounded hover:bg-gray-100 text-charcoal/40">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {SECTIONS.map((s) => (
          <button key={s} onClick={() => setActiveSection(s)} className={`flex-1 py-2.5 text-xs font-medium rounded-md transition-colors ${activeSection === s ? "bg-white text-charcoal shadow-sm" : "text-charcoal/50 hover:text-charcoal"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">

        {/* ── HERO SLIDES ── */}
        {activeSection === "Hero Slides" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Hero Slides</h3>
              <button onClick={() => setHeroSlides([...heroSlides, { overline: "", title: "", image: "", order: heroSlides.length, is_active: true }])} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Slide
              </button>
            </div>
            {heroSlides.map((slide, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">Slide {i + 1}</span>
                  <button onClick={() => setHeroSlides(heroSlides.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Overline</label>
                    <input type="text" value={slide.overline} onChange={(e) => updateItem(setHeroSlides, heroSlides, i, "overline", e.target.value)} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Title</label>
                    <input type="text" value={slide.title} onChange={(e) => updateItem(setHeroSlides, heroSlides, i, "title", e.target.value)} className="admin-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Image URL</label>
                  <input type="text" value={slide.image} onChange={(e) => updateItem(setHeroSlides, heroSlides, i, "image", e.target.value)} className="admin-input" />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={() => saveSection("heroSlides", heroSlides)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save Hero Slides"}
              </button>
            </div>
          </>
        )}

        {/* ── STATS ── */}
        {activeSection === "Stats" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Stats Counters</h3>
              <button onClick={() => setStats([...stats, { value: 0, suffix: "+", label: "", order: stats.length, is_active: true }])} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Stat
              </button>
            </div>
            {stats.map((stat, i) => (
              <div key={i} className="flex items-end gap-4 border border-gray-200 rounded-lg p-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Label</label>
                  <input type="text" value={stat.label} onChange={(e) => updateItem(setStats, stats, i, "label", e.target.value)} className="admin-input" />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Value</label>
                  <input type="number" value={stat.value} onChange={(e) => updateItem(setStats, stats, i, "value", Number(e.target.value))} className="admin-input" />
                </div>
                <div className="w-20">
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Suffix</label>
                  <input type="text" value={stat.suffix} onChange={(e) => updateItem(setStats, stats, i, "suffix", e.target.value)} className="admin-input" />
                </div>
                <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="p-2.5 rounded hover:bg-red-50 text-red-400 mb-0.5"><Trash2 size={16} /></button>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={() => saveSection("stats", stats)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save Stats"}
              </button>
            </div>
          </>
        )}

        {/* ── HOW IT WORKS ── */}
        {activeSection === "How It Works" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">How It Works Steps</h3>
              <button onClick={() => setHowItWorks([...howItWorks, { step_number: String(howItWorks.length + 1).padStart(2, "0"), title: "", description: "", icon: "ClipboardList", order: howItWorks.length, is_active: true }])} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Step
              </button>
            </div>
            {howItWorks.map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">Step {step.step_number}</span>
                  <button onClick={() => setHowItWorks(howItWorks.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Title</label>
                    <input type="text" value={step.title} onChange={(e) => updateItem(setHowItWorks, howItWorks, i, "title", e.target.value)} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Icon Name</label>
                    <input type="text" value={step.icon} onChange={(e) => updateItem(setHowItWorks, howItWorks, i, "icon", e.target.value)} className="admin-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label>
                  <textarea value={step.description} onChange={(e) => updateItem(setHowItWorks, howItWorks, i, "description", e.target.value)} rows={2} className="admin-input" />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={() => saveSection("howItWorks", howItWorks)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save Steps"}
              </button>
            </div>
          </>
        )}

        {/* ── TESTIMONIALS ── */}
        {activeSection === "Testimonials" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-charcoal">Testimonials</h3>
              <button onClick={() => setTestimonials([...testimonials, { name: "", trip: "", rating: 5, location: "", review: "", is_active: true }])} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Testimonial
              </button>
            </div>
            {testimonials.map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">Testimonial {i + 1}</span>
                  <button onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Name</label>
                    <input type="text" value={t.name} onChange={(e) => updateItem(setTestimonials, testimonials, i, "name", e.target.value)} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Trip</label>
                    <input type="text" value={t.trip} onChange={(e) => updateItem(setTestimonials, testimonials, i, "trip", e.target.value)} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Location</label>
                    <input type="text" value={t.location} onChange={(e) => updateItem(setTestimonials, testimonials, i, "location", e.target.value)} className="admin-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Review</label>
                  <textarea value={t.review} onChange={(e) => updateItem(setTestimonials, testimonials, i, "review", e.target.value)} rows={2} className="admin-input" />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Rating</label>
                  <input type="number" min={1} max={5} value={t.rating} onChange={(e) => updateItem(setTestimonials, testimonials, i, "rating", Number(e.target.value))} className="admin-input" />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button onClick={() => saveSection("testimonials", testimonials)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save Testimonials"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
