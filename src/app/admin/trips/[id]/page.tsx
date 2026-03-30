"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";

const TABS = ["General", "Itinerary", "Pricing", "Departures", "Gallery", "SEO"] as const;
type Tab = (typeof TABS)[number];

const DIFFICULTY_OPTIONS = ["beginner", "moderate", "advanced", "expert"];

interface PricingItem { label: string; price: number }
interface ItineraryDay { day: number; title: string; description: string; overnight?: string; distance?: string; altitude?: string }
interface Departure { start_date: string; end_date: string; available_seats: number; booked_seats: number; status: string }

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [tab, setTab] = useState<Tab>("General");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [categories, setCategories] = useState<any[]>([]);

  // General fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [durationDays, setDurationDays] = useState(1);
  const [durationNights, setDurationNights] = useState(0);
  const [maxAltitude, setMaxAltitude] = useState(0);
  const [difficulty, setDifficulty] = useState("moderate");
  const [season, setSeason] = useState("");
  const [region, setRegion] = useState("");
  const [route, setRoute] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [terrain, setTerrain] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [rating, setRating] = useState(4.5);
  const [reviewCount, setReviewCount] = useState(0);
  const [highlightsStr, setHighlightsStr] = useState("");
  const [inclusionsStr, setInclusionsStr] = useState("");
  const [exclusionsStr, setExclusionsStr] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [coverImage, setCoverImage] = useState("");

  // Gallery
  const [galleryStr, setGalleryStr] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywordsStr, setKeywordsStr] = useState("");

  // Relations
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);

  useEffect(() => {
    fetchCategories();
    if (!isNew) fetchTrip();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch {}
  };

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/trips/${id}`);
      const t = await res.json();
      setTitle(t.title || "");
      setSlug(t.slug || "");
      setTagline(t.tagline || "");
      setDescription(t.description || "");
      setCategoryId(t.category_id || "");
      setDurationDays(t.duration_days || 1);
      setDurationNights(t.duration_nights || 0);
      setMaxAltitude(t.max_altitude_ft || 0);
      setDifficulty(t.difficulty || "moderate");
      setSeason(t.season || "");
      setRegion(t.region || "");
      setRoute(t.route || "");
      setStartLocation(t.start_location || "");
      setEndLocation(t.end_location || "");
      setTotalDistance(t.total_distance || "");
      setTerrain(t.terrain || "");
      setBestFor(t.best_for || "");
      setRating(t.rating || 4.5);
      setReviewCount(t.review_count || 0);
      setHighlightsStr((t.highlights || []).join("\n"));
      setInclusionsStr((t.inclusions || []).join("\n"));
      setExclusionsStr((t.exclusions || []).join("\n"));
      setIsFeatured(t.is_featured || false);
      setIsActive(t.is_active ?? true);
      setCoverImage(t.cover_image || "");
      setGalleryStr((t.gallery_images || []).join("\n"));
      setKeywordsStr((t.keywords || []).join(", "));
      setMetaTitle(t.meta_title || "");
      setMetaDescription(t.meta_description || "");
      setPricing(
        (t.trip_pricing || [])
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          .map((p: any) => ({ label: p.label, price: p.price }))
      );
      setItinerary(
        (t.trip_itinerary || [])
          .sort((a: any, b: any) => a.day - b.day)
          .map((d: any) => ({
            day: d.day,
            title: d.title,
            description: d.description || "",
            overnight: d.overnight || "",
            distance: d.distance || "",
            altitude: d.altitude || "",
          }))
      );
      setDepartures(
        (t.trip_departures || []).map((d: any) => ({
          start_date: d.start_date,
          end_date: d.end_date,
          available_seats: d.available_seats || 20,
          booked_seats: d.booked_seats || 0,
          status: d.status || "available",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch trip:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        tagline,
        description,
        category_id: categoryId || null,
        duration_days: durationDays,
        duration_nights: durationNights,
        max_altitude_ft: maxAltitude,
        difficulty,
        season,
        region,
        route,
        start_location: startLocation,
        end_location: endLocation,
        total_distance: totalDistance,
        terrain,
        best_for: bestFor,
        rating,
        review_count: reviewCount,
        highlights: highlightsStr.split("\n").map((s) => s.trim()).filter(Boolean),
        inclusions: inclusionsStr.split("\n").map((s) => s.trim()).filter(Boolean),
        exclusions: exclusionsStr.split("\n").map((s) => s.trim()).filter(Boolean),
        is_featured: isFeatured,
        is_active: isActive,
        cover_image: coverImage,
        gallery_images: galleryStr.split("\n").map((s) => s.trim()).filter(Boolean),
        keywords: keywordsStr.split(",").map((s) => s.trim()).filter(Boolean),
        meta_title: metaTitle,
        meta_description: metaDescription,
        pricing,
        itinerary,
        departures,
      };

      const url = isNew ? "/api/admin/trips" : `/api/admin/trips/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Save failed");
      }
      
      const saved = await res.json();
      if (isNew) {
        router.push(`/admin/trips/${saved.id}`);
      } else {
        alert("Trip saved successfully!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save trip.");
    } finally {
      setSaving(false);
    }
  };

  // --- Helpers for itinerary, pricing, departures ---
  const addPricing = () => setPricing([...pricing, { label: "", price: 0 }]);
  const removePricing = (i: number) => setPricing(pricing.filter((_, idx) => idx !== i));
  const updatePricing = (i: number, field: string, val: any) => {
    const copy = [...pricing];
    (copy[i] as any)[field] = val;
    setPricing(copy);
  };

  const addItineraryDay = () =>
    setItinerary([...itinerary, { day: itinerary.length + 1, title: "", description: "", overnight: "", distance: "", altitude: "" }]);
  const removeItineraryDay = (i: number) =>
    setItinerary(itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));
  const updateItinerary = (i: number, field: string, val: any) => {
    const copy = [...itinerary];
    (copy[i] as any)[field] = val;
    setItinerary(copy);
  };

  const addDeparture = () =>
    setDepartures([...departures, { start_date: "", end_date: "", available_seats: 20, booked_seats: 0, status: "available" }]);
  const removeDeparture = (i: number) => setDepartures(departures.filter((_, idx) => idx !== i));
  const updateDeparture = (i: number, field: string, val: any) => {
    const copy = [...departures];
    (copy[i] as any)[field] = val;
    setDepartures(copy);
  };

  if (loading) return <div className="p-12 text-center text-charcoal/40">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/trips")} className="p-2 rounded hover:bg-gray-100 text-charcoal/40 hover:text-charcoal transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif text-charcoal">{isNew ? "New Trip" : "Edit Trip"}</h1>
            {!isNew && <p className="text-xs text-charcoal/40 mt-1">/{slug}</p>}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Trip"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium rounded-md transition-colors ${
              tab === t ? "bg-white text-charcoal shadow-sm" : "text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* ─── GENERAL ─── */}
        {tab === "General" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Title" required>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
              </Field>
              <Field label="Slug">
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated from title" className="admin-input" />
              </Field>
            </div>

            <Field label="Tagline">
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" />
            </Field>

            <Field label="Description">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="admin-input" />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Category">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-input">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="mt-2 text-right">
                  <a href="/admin/categories" target="_blank" className="text-[10px] text-accent font-medium uppercase tracking-wider hover:underline">
                    + Add missing category
                  </a>
                </div>
              </Field>
              <Field label="Difficulty">
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="admin-input">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Region">
                <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="admin-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Field label="Duration (Days)">
                <input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="admin-input" />
              </Field>
              <Field label="Duration (Nights)">
                <input type="number" value={durationNights} onChange={(e) => setDurationNights(Number(e.target.value))} className="admin-input" />
              </Field>
              <Field label="Max Altitude (ft)">
                <input type="number" value={maxAltitude} onChange={(e) => setMaxAltitude(Number(e.target.value))} className="admin-input" />
              </Field>
              <Field label="Rating">
                <input type="number" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="admin-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Start Location">
                <input type="text" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} placeholder="e.g. Srinagar, Kashmir" className="admin-input" />
              </Field>
              <Field label="End Location">
                <input type="text" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} placeholder="e.g. Manali, Himachal" className="admin-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Route">
                <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} placeholder="e.g. Manali - Rohtang - Kaza" className="admin-input" />
              </Field>
              <Field label="Search Keywords (comma separated)">
                <input type="text" value={keywordsStr} onChange={(e) => setKeywordsStr(e.target.value)} placeholder="e.g. Himalayas, Zanskar, Motorbike" className="admin-input" />
                <p className="text-[10px] text-charcoal/50 mt-1">These keywords help users find this trip via search.</p>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Season">
                <input type="text" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="e.g. June - September" className="admin-input" />
              </Field>
              <Field label="Total Distance">
                <input type="text" value={totalDistance} onChange={(e) => setTotalDistance(e.target.value)} className="admin-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Terrain">
                <input type="text" value={terrain} onChange={(e) => setTerrain(e.target.value)} className="admin-input" />
              </Field>
              <Field label="Best For">
                <input type="text" value={bestFor} onChange={(e) => setBestFor(e.target.value)} className="admin-input" />
              </Field>
            </div>

            <Field label="Cover Image URL">
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="admin-input" />
            </Field>

            <Field label="Highlights (one per line)">
              <textarea value={highlightsStr} onChange={(e) => setHighlightsStr(e.target.value)} rows={4} className="admin-input" placeholder="Khardung La Pass&#10;Pangong Lake&#10;Nubra Valley" />
            </Field>

            <Field label="Inclusions (one per line)">
              <textarea value={inclusionsStr} onChange={(e) => setInclusionsStr(e.target.value)} rows={4} className="admin-input" />
            </Field>

            <Field label="Exclusions (one per line)">
              <textarea value={exclusionsStr} onChange={(e) => setExclusionsStr(e.target.value)} rows={4} className="admin-input" />
            </Field>

            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-accent" />
                <span className="text-sm text-charcoal">Featured Trip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-accent" />
                <span className="text-sm text-charcoal">Active</span>
              </label>
            </div>
          </>
        )}

        {/* ─── ITINERARY ─── */}
        {tab === "Itinerary" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-charcoal">Day-by-Day Itinerary</h3>
              <button onClick={addItineraryDay} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Day
              </button>
            </div>
            {itinerary.length === 0 && <p className="text-sm text-charcoal/40">No itinerary days added yet.</p>}
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-gray-300" />
                    <span className="text-sm font-bold text-accent">Day {day.day}</span>
                  </div>
                  <button onClick={() => removeItineraryDay(i)} className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Title">
                    <input type="text" value={day.title} onChange={(e) => updateItinerary(i, "title", e.target.value)} className="admin-input" />
                  </Field>
                  <Field label="Overnight Stay">
                    <input type="text" value={day.overnight || ""} onChange={(e) => updateItinerary(i, "overnight", e.target.value)} className="admin-input" />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea value={day.description} onChange={(e) => updateItinerary(i, "description", e.target.value)} rows={2} className="admin-input" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Distance">
                    <input type="text" value={day.distance || ""} onChange={(e) => updateItinerary(i, "distance", e.target.value)} className="admin-input" />
                  </Field>
                  <Field label="Altitude">
                    <input type="text" value={day.altitude || ""} onChange={(e) => updateItinerary(i, "altitude", e.target.value)} className="admin-input" />
                  </Field>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ─── PRICING ─── */}
        {tab === "Pricing" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-charcoal">Pricing Options</h3>
              <button onClick={addPricing} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Tier
              </button>
            </div>
            {pricing.length === 0 && <p className="text-sm text-charcoal/40">No pricing tiers added yet.</p>}
            {pricing.map((p, i) => (
              <div key={i} className="flex items-end gap-4 border border-gray-200 rounded-lg p-4">
                <Field label="Label" className="flex-1">
                  <input type="text" value={p.label} onChange={(e) => updatePricing(i, "label", e.target.value)} placeholder="e.g. Solo Rider" className="admin-input" />
                </Field>
                <Field label="Price (₹)">
                  <input type="number" value={p.price} onChange={(e) => updatePricing(i, "price", Number(e.target.value))} className="admin-input w-32" />
                </Field>
                <button onClick={() => removePricing(i)} className="p-2.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 mb-0.5">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}

        {/* ─── DEPARTURES ─── */}
        {tab === "Departures" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl text-charcoal">Departure Dates</h3>
              <button onClick={addDeparture} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90">
                <Plus size={14} /> Add Departure
              </button>
            </div>
            {departures.length === 0 && <p className="text-sm text-charcoal/40">No departures added yet.</p>}
            {departures.map((d, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <Field label="Start Date">
                  <input type="date" value={d.start_date} onChange={(e) => updateDeparture(i, "start_date", e.target.value)} className="admin-input" />
                </Field>
                <Field label="End Date">
                  <input type="date" value={d.end_date} onChange={(e) => updateDeparture(i, "end_date", e.target.value)} className="admin-input" />
                </Field>
                <Field label="Seats">
                  <input type="number" value={d.available_seats} onChange={(e) => updateDeparture(i, "available_seats", Number(e.target.value))} className="admin-input" />
                </Field>
                <Field label="Status">
                  <select value={d.status} onChange={(e) => updateDeparture(i, "status", e.target.value)} className="admin-input">
                    <option value="available">Available</option>
                    <option value="filling_fast">Filling Fast</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </Field>
                <button onClick={() => removeDeparture(i)} className="p-2.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 self-end mb-0.5">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}

        {/* ─── GALLERY ─── */}
        {tab === "Gallery" && (
          <>
            <h3 className="font-serif text-xl text-charcoal mb-2">Gallery Images</h3>
            <p className="text-xs text-charcoal/40 mb-4">Enter image URLs, one per line. These will appear in the trip detail gallery.</p>
            <textarea
              value={galleryStr}
              onChange={(e) => setGalleryStr(e.target.value)}
              rows={8}
              className="admin-input"
              placeholder="https://res.cloudinary.com/…/image1.jpg&#10;https://res.cloudinary.com/…/image2.jpg"
            />
            {galleryStr && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {galleryStr.split("\n").filter(Boolean).map((url, i) => (
                  <div key={i} className="aspect-square rounded-md bg-gray-100 bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url(${url.trim()})` }} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ─── SEO & SEARCH ─── */}
        {tab === "SEO" && (
          <>
            <h3 className="font-serif text-xl text-charcoal mb-4">SEO & Search</h3>
            <div className="mt-2 border-t border-gray-100 pt-6">
              <Field label="Meta Title">
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Custom page title for search engines" className="admin-input" />
              </Field>
            </div>
            <Field label="Meta Description">
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Custom description for search engine results" className="admin-input" />
            </Field>
            <Field label="Review Count">
              <input type="number" value={reviewCount} onChange={(e) => setReviewCount(Number(e.target.value))} className="admin-input w-32" />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

// --- Reusable Field Component ---
function Field({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
