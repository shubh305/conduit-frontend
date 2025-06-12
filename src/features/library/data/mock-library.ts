import { FeedItem } from "../../feed/types";

export const mockLibraryItems: FeedItem[] = [
  {
    tenantId: "t2",
    tenantSlug: "design-systems",
    tenantName: "Design Systems Daily",
    postId: "p3",
    postSlug: "building-accessible-components",
    title: "Building Accessible Components",
    excerpt: "Accessibility should not be an afterthought. Here is how to bake it into your design system from day one.",
    featuredImage: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=1000",
    authorName: "Sarah Design",
    authorAvatar: "https://i.pravatar.cc/150?u=sarah",
    tags: ["accessibility", "design", "react"],
    publishedAt: "2026-01-25T14:20:00Z",
    viewsCount: 3200,
    likesCount: 156,
    commentsCount: 24,
  },
  {
    tenantId: "t1",
    tenantSlug: "alice",
    tenantName: "Alice's Tech Blog",
    postId: "p4",
    postSlug: "async-await-rust",
    title: "Understanding Async/Await in Rust",
    excerpt: "Deep dive into the future implementation and how to handle concurrency without fear.",
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    authorName: "Alice Chen",
    authorAvatar: "https://i.pravatar.cc/150?u=alice",
    tags: ["rust", "async", "backend"],
    publishedAt: "2026-01-15T09:00:00Z",
    viewsCount: 890,
    likesCount: 45,
    commentsCount: 8,
  }
];

export const mockHistoryItems: FeedItem[] = [
    {
        tenantId: "t3",
        tenantSlug: "web-futures",
        tenantName: "Web Futures",
        postId: "p5",
        postSlug: "wasm-future",
        title: "WebAssembly: The Future of the Browser",
        excerpt: "Why WASM is changing the landscape of high-performance web applications.",
        featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        authorName: "David Web",
        authorAvatar: "https://i.pravatar.cc/150?u=david",
        tags: ["wasm", "web", "performance"],
        publishedAt: "2026-01-14T11:00:00Z",
        viewsCount: 2100,
        likesCount: 120,
        commentsCount: 30,
    }
];
