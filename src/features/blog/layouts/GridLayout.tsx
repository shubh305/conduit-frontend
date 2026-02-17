"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { getPostUrl, cn, isRootSite } from "@/lib/utils";
import { LayoutProps } from "./types";
import Link from "next/link";
import Image from "next/image";

export function GridLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  const gridThemeConfig = {
    ...themeConfig,
    cardStyle: themeConfig?.cardStyle || "bordered",
    showExcerpt: themeConfig?.showExcerpt !== false,
  } as const;

  return (
    <div className={cn("py-8 px-4 md:px-6", isRootSite() ? "container mx-auto" : "w-full max-w-none")}>
      {/* Mobile */}
      <div className="grid grid-cols-2 sm:hidden gap-3">
        {posts.map(post => (
          <Link
            key={post.id}
            href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
            className="group flex flex-col gap-2 p-3 bg-noir-panel/30 rounded-lg border border-noir-border/30 hover:border-accent/50 transition-all"
          >
            {post.featuredImage && (
              <div className="aspect-square w-full overflow-hidden rounded-md relative">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <h3 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="text-xs text-foreground-muted line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map(post => (
          <BasePostCard
            key={post.id}
            post={post}
            tenantSlug={tenantSlug}
            currentTenantSlug={currentTenantSlug}
            orientation="vertical"
            imageClassName="aspect-[16/10] object-cover"
            className="h-full"
            themeConfig={gridThemeConfig}
          />
        ))}
      </div>
    </div>
  );
}
