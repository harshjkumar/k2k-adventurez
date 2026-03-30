"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  cover_image: string;
  order: number;
  is_active: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      setCategories(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const resetForm = () => { setName(""); setSlug(""); setDescription(""); setRegion(""); setOrder(0); setEditingId(null); setShowNew(false); };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setShowNew(false);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setRegion(c.region || "");
    setOrder(c.order);
  };

  const handleSave = async () => {
    const body = { name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description, region, order };
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const isEditing = editingId || showNew;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Categories</h1>
          <p className="text-sm text-charcoal/50 mt-1">{categories.length} main categories configured</p>
        </div>
      </div>

      {/* Edit / New Form */}
      {isEditing && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-charcoal">{editingId ? "Edit Category" : "New Category"}</h3>
            <button onClick={resetForm} className="p-2 rounded hover:bg-gray-100 text-charcoal/40"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Region</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="admin-input" />
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal/40">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40">No categories yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Name</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Slug</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Region</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Status</th>
                <th className="px-4 py-3 text-right font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-charcoal">{c.name}</td>
                  <td className="px-4 py-4 text-charcoal/50 text-xs font-mono">{c.slug}</td>
                  <td className="px-4 py-4 text-charcoal/70">{c.region || "—"}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase ${c.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(c)} className="p-2 rounded hover:bg-accent/10 text-charcoal/40 hover:text-accent"><Pencil size={16} /></button>
                      <button disabled className="p-2 rounded text-charcoal/20 cursor-not-allowed opacity-50" title="Main categories cannot be deleted"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
