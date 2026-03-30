import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogPosts } from "@/lib/data/queries";
import { BlogArticleClient } from "@/components/sections/blog/BlogArticleClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | K2K Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  // Get related posts for sidebar
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts?.filter((p: any) => p.id !== post.id).slice(0, 3) || [];

  return <BlogArticleClient post={post} relatedPosts={relatedPosts} />;
}
