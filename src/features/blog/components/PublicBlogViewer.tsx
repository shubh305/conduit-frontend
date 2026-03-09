"use client";

import { useState, useEffect } from "react";
import { FeedItem } from "@/features/feed/types";
import { BlogHeader } from "@/features/blog/components/BlogHeader";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { LayoutManager, LayoutType } from "@/features/blog/layouts/LayoutManager";
import { TerminalLayoutManager } from "@/features/blog/layouts/TerminalLayoutManager";
import { TerminalBlogShell } from "@/components/terminal/TerminalBlogShell";
import { useLayoutManager } from "@/features/blog/hooks/useLayoutManager";
import { cn } from "@/lib/utils";
import { Post, Tenant } from "@/features/blog/types"

const feedItemToPost = (item: FeedItem): Post => ({
  id: item.postId,
  slug: item.postSlug,
  title: item.title,
  excerpt: item.excerpt,
  featuredImage: item.featuredImage,
  featuredImageAttribution: item.featuredImageAttribution,
  publishedAt: item.publishedAt,
  readingTimeMinutes: item.readingTimeMinutes || 5,
  tags: item.tags || [],
  authorName: item.authorName,
  authorUsername: item.authorUsername || "",
  likesCount: item.likesCount,
  commentsCount: item.commentsCount,
  isLiked: item.isLiked,
  content: { type: "doc", content: [] },
  theme: "classic",
  createdAt: item.publishedAt,
  updatedAt: item.publishedAt,
  status: "published",
  authorId: "",
  viewsCount: item.viewsCount,
});

interface PublicBlogViewerProps {
  tenant: Tenant;
  items: FeedItem[];
  classicHeader?: React.ReactNode;
  fallbackFeed?: React.ReactNode;
  currentTenantSlug?: string;
}

export function PublicBlogViewer({ tenant, items, currentTenantSlug }: PublicBlogViewerProps) {
  const { theme, config } = useTheme();
  const { layout: layoutConfig } = useLayoutManager(tenant.id);

  const layout = (layoutConfig.mode as LayoutType) || "stacked";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const shouldHide = layout === "magazine" || theme === "terminal";
    if (shouldHide) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("terminal-overflow-lock");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("terminal-overflow-lock");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("terminal-overflow-lock");
    };
  }, [layout, theme]);

  const { isTerminalCopy, isTechieCopy } = useThemeHelpers();
  const isTerminal = isTerminalCopy;

  const posts = items.map(feedItemToPost);

  if (!isMounted) return <div className="min-h-screen bg-transparent" />;

  const allTags = items.flatMap(item => item.tags || []);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagStats = Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const trendingPosts = posts.slice(0, 5).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    authorUsername: post.authorUsername,
    publishedAt: post.publishedAt,
    likesCount: post.likesCount || 0,
    readingTimeMinutes: post.readingTimeMinutes,
  }));

  if (isTerminal) {
    return (
      <TerminalBlogShell
        tenant={tenant}
        tags={tagStats}
        trendingPosts={trendingPosts}
        currentTenantSlug={currentTenantSlug}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body { overflow: hidden !important; height: 100vh !important; position: fixed !important; width: 100% !important; }
          .terminal-layout-root { height: 100% !important; display: flex !important; flex-direction: column !important; }
        `,
          }}
        />
        <div className="terminal-layout-root">
          <TerminalLayoutManager
            posts={posts}
            tenantSlug={tenant.slug}
            currentTenantSlug={currentTenantSlug}
            layout={layout}
            showHero={layoutConfig.showHero}
            themeConfig={{
              fontFamily: "mono",
            }}
          />
        </div>
      </TerminalBlogShell>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col transition-all duration-300 w-full",
        isTechieCopy ? "bg-noir-bg" : "bg-background",
        layout === "magazine" ? "h-[calc(100dvh-144px)] md:h-[calc(100dvh-128px)] overflow-hidden" : "min-h-screen",
      )}
    >
      <div
        className={cn(
          layout === "magazine" ? "px-0 md:px-0 pt-6 md:pt-1 pb-1 shrink-0" : "mb-4 shrink-0 pt-6 md:pt-0 px-4 md:px-8",
        )}
      >
        <BlogHeader tenant={tenant} className={layout === "magazine" ? "px-6 md:px-16" : ""} />
      </div>

      <div className="flex-1 min-h-0 relative h-full">
        <LayoutManager
          posts={posts}
          tenantSlug={tenant.slug}
          currentTenantSlug={currentTenantSlug}
          layout={layout}
          showHero={layoutConfig.showHero}
          density={layoutConfig.density}
          themeConfig={{
            fontFamily: config.fontFamily,
          }}
        />
      </div>
    </div>
  );
}
