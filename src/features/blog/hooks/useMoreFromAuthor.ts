import { useState, useEffect } from "react";
import { Post } from "@/features/blog/types";
import { getPosts } from "@/features/blog/api";

export function useMoreFromAuthor(tenantId: string, currentPostId: string, limit: number = 5) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tenantId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await getPosts(tenantId, { limit });
        const filtered = data.filter((post) => post.id !== currentPostId).slice(0, limit - 1);
        setPosts(filtered);
      } catch (e) {
        console.error("Failed to fetch more posts", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [tenantId, currentPostId, limit]);

  return { posts, isLoading, hasMore: posts.length > 0 };
}
