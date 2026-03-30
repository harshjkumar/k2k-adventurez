"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("Failed to load posts:", data);
        setPosts([]);
      }
    } catch {
      setPosts([]);
    } finally { 
      setLoading(false); 
    }
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/blogs/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : post.published_at,
      }),
    });
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Blog Posts</h1>
          <p className="text-sm text-charcoal/50 mt-1">{posts.length} posts</p>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-charcoal/40">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-charcoal/40">No blog posts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Title</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Category</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Status</th>
                <th className="px-4 py-3 text-left font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Date</th>
                <th className="px-4 py-3 text-right font-nav text-[10px] uppercase tracking-widest text-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-charcoal">{post.title}</p>
                    <p className="text-xs text-charcoal/40 mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 text-charcoal/70">{post.category || "—"}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase border ${post.is_published ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-charcoal/50">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {post.is_published && (
                        <Link href={`/blogs/${post.slug}`} target="_blank" className="p-2 rounded hover:bg-gray-100 text-charcoal/40 hover:text-charcoal"><Eye size={16} /></Link>
                      )}
                      <Link href={`/admin/blogs/${post.id}`} className="p-2 rounded hover:bg-accent/10 text-charcoal/40 hover:text-accent"><Pencil size={16} /></Link>
                      <button onClick={() => togglePublish(post)} className="p-2 rounded hover:bg-blue-50 text-charcoal/40 hover:text-blue-600" title={post.is_published ? "Unpublish" : "Publish"}>
                        {post.is_published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="p-2 rounded hover:bg-red-50 text-charcoal/40 hover:text-red-600"><Trash2 size={16} /></button>
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
