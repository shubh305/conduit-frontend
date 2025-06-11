export interface FeedItem {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  postId: string;
  postSlug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  publishedAt: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
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
