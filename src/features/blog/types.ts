export interface Tenant {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  status: "active" | "suspended" | "deleted";
  plan: "free" | "pro" | "enterprise";
  customDomain?: string;
}

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
  [key: string]: unknown;
};

export type TiptapContent = {
  type: string;
  content: TiptapNode[];
};

export type PostStatus = "draft" | "published" | "archived" | "scheduled" | "deleted" | "unlisted";

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: TiptapContent;
  theme: "classic" | "cyber";
  logo?: string;
  createdAt: string;
  updatedAt: string;
  excerpt: string;
  summary?: string;
  featuredImage?: string;
  featuredImageAttribution?: {
    name: string;
    url: string;
  } | null;
  tags: string[];
  status: "draft" | "published" | "archived" | "scheduled";
  authorId: string;
  authorName: string;
  authorUsername: string;
  publishedAt: string;
  scheduledAt?: string;
  viewsCount: number;
  likesCount?: number;
  commentsCount?: number;
  readingTimeMinutes: number;
  wordCount?: number;
  paragraphsCount?: number;
  tenantId?: string;
  tenantSlug?: string;
  tenantName?: string;
  deletedAt?: string;
  isLiked?: boolean;
  isFollowing?: boolean;
}
