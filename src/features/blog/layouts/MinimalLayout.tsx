"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { getPostUrl } from "@/lib/utils";
import { LayoutProps } from "./types";
import Link from "next/link";

export function MinimalLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  const minimalConfig = {
    ...themeConfig,
    showImage: true,
    showExcerpt: true,
    cardStyle: "minimal" as const,
  };

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="flex flex-col sm:hidden px-4 py-6">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
            className="group py-6 border-b border-noir-border/20 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs font-mono text-foreground-subtle">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-foreground-muted line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                  <span>{post.authorName}</span>
                  <span>•</span>
                  <span>{post.readingTimeMinutes} min read</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-accent">#{post.tags[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:flex flex-col gap-0 w-full mx-auto divide-y divide-border/40">
        {posts.map(post => (
          <BasePostCard
            key={post.id}
            post={post}
            tenantSlug={tenantSlug}
            currentTenantSlug={currentTenantSlug}
            orientation="horizontal"
            className="py-8 md:grid-cols-[1fr_220px] gap-8"
            themeConfig={minimalConfig}
          />
        ))}
      </div>
    </div>
  );
}
