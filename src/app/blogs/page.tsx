import { Metadata } from "next";
import { getBlogPosts } from "@/lib/data/queries";
import { BlogListingClient } from "@/components/sections/blog/BlogListingClient";

export const metadata: Metadata = {
  title: "Blog | K2K Adventurez",
  description: "Travel stories, trip guides, and adventure insights from K2K Adventurez.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogListingClient posts={posts} />;
}
