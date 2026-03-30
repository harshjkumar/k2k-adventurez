"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface GalleryImage {
  id?: string;
  src: string;
  alt: string;
  category: string;
  caption: string;
  order: number;
  is_active: boolean;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New image form
  const [newSrc, setNewSrc] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCaption, setNewCaption] = useState("");

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      } else {
        console.error("Failed to load images:", data);
        setImages([]);
      }
    } catch {
      setImages([]);
    } finally { 
      setLoading(false); 
    }
  };

  const addImage = async () => {
    if (!newSrc) return;
    setSaving(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: newSrc, alt: newAlt, category: newCategory, caption: newCaption, order: images.length }),
      });
      setNewSrc(""); setNewAlt(""); setNewCategory(""); setNewCaption("");
      fetchImages();
    } catch {} finally { setSaving(false); }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    fetchImages();
  };

  const updateImage = async (id: string, data: Partial<GalleryImage>) => {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchImages();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Gallery</h1>
          <p className="text-sm text-charcoal/50 mt-1">{images.length} images</p>
        </div>
      </div>

      {/* Add New Image */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="font-serif text-xl text-charcoal">Add Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Image URL <span className="text-red-500">*</span></label>
            <input type="text" value={newSrc} onChange={(e) => setNewSrc(e.target.value)} placeholder="https://..." className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Alt Text</label>
            <input type="text" value={newAlt} onChange={(e) => setNewAlt(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Category</label>
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Ladakh" className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Caption</label>
            <input type="text" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} className="admin-input" />
          </div>
        </div>
        <button onClick={addImage} disabled={saving || !newSrc} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
          <Plus size={16} /> {saving ? "Adding..." : "Add Image"}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {loading ? (
          <div className="p-12 text-center text-charcoal/40">Loading...</div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40">No gallery images yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${img.src})` }} />
                <div className="p-3">
                  <p className="text-xs font-medium text-charcoal truncate">{img.alt || img.caption || "Untitled"}</p>
                  <p className="text-[10px] text-charcoal/40 mt-0.5">{img.category || "No category"}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => updateImage(img.id!, { is_active: !img.is_active })} className={`p-1.5 rounded text-xs font-medium ${img.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {img.is_active ? "ON" : "OFF"}
                  </button>
                  <button onClick={() => deleteImage(img.id!)} className="p-1.5 rounded bg-red-500 text-white"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
