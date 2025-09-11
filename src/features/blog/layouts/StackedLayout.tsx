"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";

export function StackedLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
      {posts.map((post) => (
        <BasePostCard 
          key={post.id} 
          post={post} 
          tenantSlug={tenantSlug} 
          orientation="horizontal"
          className="md:grid-cols-[1fr_400px] border-none"
          themeConfig={themeConfig} 
        />
      ))}
    </div>
  );
}
