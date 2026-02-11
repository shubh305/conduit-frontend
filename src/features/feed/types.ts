export interface FeedItem {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  postId: string;
  postSlug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  featuredImageAttribution?: { name: string; url: string };
  authorId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar?: string;
  tags: string[];
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  readingTimeMinutes?: number;
}

export interface FeedResponse {
  data: FeedItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
