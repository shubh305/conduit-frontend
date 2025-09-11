"use client";

import { useState, useEffect } from "react";
import { getTenant, getPost } from "@/features/blog/api";
import { getGlobalFeed } from "@/features/feed/api";
import { mapPostToFeedItem, FeedItemExtended } from "@/features/blog/mappers";
import { FeedItem } from "@/features/feed/types";
import { Tenant } from "@/features/blog/types";

interface PostLoaderResult {
  loading: boolean;
  error: string | null;
  data: {
    post: FeedItemExtended;
    tenant: Tenant;
    nextPost?: FeedItem;
  } | null;
}

export function usePostLoader(tenantIdentifier: string, postSlug: string): PostLoaderResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ post: FeedItemExtended; tenant: Tenant; nextPost?: FeedItem } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);


        const { tenant } = await getTenant(tenantIdentifier);
        console.log(tenant)
        if (!tenant) {
          throw new Error("Tenant not found");
        }


        const { post } = await getPost(postSlug, tenant.id);

        if (!post) {
          throw new Error("Post not found");
        }


        let nextPost: FeedItem | undefined;
        try {
          const { data: globalFeed } = await getGlobalFeed({ limit: 50 });
          console.log("[usePostLoader] Current post ID:", post.id, "slug:", post.slug);
          console.log("[usePostLoader] Total global posts fetched:", globalFeed.length);
          console.log("[usePostLoader] Global feed posts:", globalFeed.map(p => ({ postId: p.postId, postSlug: p.postSlug })).slice(0, 5));


          const currentIndex = globalFeed.findIndex(p => p.postId === post.id || p.postSlug === post.slug);
          console.log("[usePostLoader] Current post index in global feed:", currentIndex);


          if (currentIndex >= 0 && currentIndex < globalFeed.length - 1) {
            nextPost = globalFeed[currentIndex + 1];
            console.log("[usePostLoader] Found next (older) post in global feed:", nextPost.postSlug, "from tenant:", nextPost.tenantSlug);
          } else if (currentIndex === globalFeed.length - 1) {
            console.log("[usePostLoader] Already at the oldest post in global feed.");
          } else {
            console.log("[usePostLoader] Current post not found in global feed.");
          }
        } catch (e) {
          console.warn("Failed to fetch global feed for navigation", e);
        }


        const feedItem = mapPostToFeedItem(post, tenant);

        if (isMounted) {
          setData({ post: feedItem, tenant, nextPost });
        }
      } catch (err: unknown) {
        console.error("[usePostLoader] Error:", err);
        if (isMounted) {
          setError("Failed to load transmission.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (tenantIdentifier && postSlug) {
      load();
    }
    
    return () => {
      isMounted = false;
    };
  }, [tenantIdentifier, postSlug]);

  return { loading, error, data };
}
