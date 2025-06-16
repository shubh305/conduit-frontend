import { PostsList } from "@/features/studio/components/PostsList";
import { mockPosts } from "@/features/blog/data/mock-blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts | Conduit Studio",
};

export default function PostsPage() {
  // Mock data for logged in user's tenant
  const posts = mockPosts["alice"] || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white mb-2">Posts</h1>
        </div>
      </header>
      
      <PostsList posts={posts} />
    </div>
  );
}
