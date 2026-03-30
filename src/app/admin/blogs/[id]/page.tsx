"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("K2K Adventurez");
  const [category, setCategory] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => { if (!isNew) fetchPost(); }, []);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`);
      const p = await res.json();
      setTitle(p.title || "");
      setSlug(p.slug || "");
      setExcerpt(p.excerpt || "");
      setContent(p.content || "");
      setCoverImage(p.cover_image || "");
      setAuthor(p.author || "K2K Adventurez");
      setCategory(p.category || "");
      setTagsStr((p.tags || []).join(", "));
      setIsPublished(p.is_published || false);
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt,
        content,
        cover_image: coverImage,
        author,
        category,
        tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
        is_published: isPublished,
      };

      const url = isNew ? "/api/admin/blogs" : `/api/admin/blogs/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      if (isNew) router.push(`/admin/blogs/${saved.id}`);
      else alert("Post saved!");
    } catch { alert("Failed to save."); } finally { setSaving(false); }
  };

  if (loading) return <div className="p-12 text-center text-charcoal/40">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/blogs")} className="p-2 rounded hover:bg-gray-100 text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20} /></button>
          <h1 className="text-3xl font-serif text-charcoal">{isNew ? "New Post" : "Edit Post"}</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save Post"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated" className="admin-input" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="admin-input" placeholder="Brief summary shown on the listing page..." />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="admin-input font-mono text-xs" placeholder="Write your article content here. HTML is supported." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Travel Guide" className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
            <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="Ladakh, Tips" className="admin-input" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Cover Image URL</label>
          <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="admin-input" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-accent" />
          <span className="text-sm text-charcoal">Published</span>
        </label>
      </div>
    </div>
  );
}
