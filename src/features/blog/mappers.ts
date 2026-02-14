import { Post, Tenant } from "./types";
import { FeedItem } from "@/features/feed/types";
import { getMediaUrl } from "@/lib/utils";

/**
 * Centralizes the transformation of a Backend Post + Tenant into a Frontend FeedItem.
 */

type RawPost = Post & { _id?: string; authorAvatar?: string; isLiked?: boolean };

export type FeedItemExtended = FeedItem & {
  content: Post["content"];
  readingTimeMinutes: number;
  status: "draft" | "published" | "archived";
  isLiked?: boolean;
};

export function mapPostToFeedItem(post: Post, tenant: Tenant): FeedItemExtended {
  const p = post as RawPost;
  
  return {
    tenantId: tenant.id || tenant._id || "",
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    postId: post.id || p._id || "",
    postSlug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: getMediaUrl(post.featuredImage),
    authorName: post.authorName,
    authorId: post.authorId,
    authorUsername: post.authorUsername,
    authorAvatar: p.authorAvatar,
    tags: post.tags || [],
    publishedAt: post.publishedAt || post.createdAt,
    viewsCount: post.viewsCount || 0,
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    content: post.content,
    readingTimeMinutes: post.readingTimeMinutes || 0,
    status: post.status as "draft" | "published" | "archived",
    isLiked: p.isLiked || false,
    isFollowing: p.isFollowing || false,
    summary: post.summary,
  };
}
