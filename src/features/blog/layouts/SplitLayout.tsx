"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";

export function SplitLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {
  return (
    <div className="flex flex-col gap-0 w-full border-t border-noir-border/30">
      {posts.map((post, index) => (
        <BasePostCard 
          key={post.id} 
          post={post} 
          tenantSlug={tenantSlug} 
          orientation="horizontal"
          reversed={index % 2 !== 0}
          className="md:grid-cols-[1.2fr_1fr] gap-12 py-16 border-none"
          imageClassName="aspect-video md:aspect-auto md:h-full min-h-[300px] max-h-[500px]"
          themeConfig={themeConfig} 
        />
      ))}
    </div>
  );
}
