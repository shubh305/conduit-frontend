"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";

export function MinimalLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {
  const minimalConfig = {
    ...themeConfig,
    showImage: true,
    showExcerpt: true,
    cardStyle: "minimal" as const
  };

  return (
    <div className="flex flex-col gap-0 w-full mx-auto divide-y divide-border/40">
      {posts.map(post => (
        <BasePostCard
          key={post.id}
          post={post}
          tenantSlug={tenantSlug}
          orientation="horizontal"
          className="py-8 md:grid-cols-[1fr_220px] gap-8"
          themeConfig={minimalConfig}
        />
      ))}
    </div>
  )
}
