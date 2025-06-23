export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description?: string;
  status: "active" | "suspended" | "deleted";
  plan: "free" | "pro" | "enterprise";
}

export type TiptapContent = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
};

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: TiptapContent;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  authorId: string;
  authorName: string;
  publishedAt: string;
  viewsCount: number;
  likesCount?: number;
  commentsCount?: number;
  readingTimeMinutes: number;
}
