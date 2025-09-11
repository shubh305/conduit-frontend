"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";

export function GridLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {
  const gridThemeConfig = {
    ...themeConfig,
    cardStyle: themeConfig?.cardStyle || "bordered",
    showExcerpt: themeConfig?.showExcerpt !== false
  } as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BasePostCard 
          key={post.id} 
          post={post} 
          tenantSlug={tenantSlug} 
          orientation="vertical"
          imageClassName="aspect-[16/10]"
          themeConfig={gridThemeConfig} 
        />
      ))}
    </div>
  );
}
