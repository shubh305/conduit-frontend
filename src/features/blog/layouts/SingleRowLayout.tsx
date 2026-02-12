"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { getPostUrl } from "@/lib/utils";
import { LayoutProps } from "./types";
import Link from "next/link";
import Image from "next/image";

export function SingleRowLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="flex flex-col gap-6 sm:hidden px-4 py-6">
        {posts.map(post => (
          <Link
            key={post.id}
            href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl mb-3">
              {post.featuredImage && (
                <div className="aspect-[16/9] w-full relative">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-bold text-xl leading-tight group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-foreground-muted line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-foreground-subtle pt-2">
                <span className="font-medium">{post.authorName}</span>
                <span>•</span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:flex overflow-x-auto gap-6 pb-8 px-4 scrollbar-hide snap-x">
        {posts.map(post => (
          <div key={post.id} className="min-w-[300px] md:min-w-[350px] snap-center">
            <BasePostCard
              post={post}
              tenantSlug={tenantSlug}
              currentTenantSlug={currentTenantSlug}
              orientation="vertical"
              themeConfig={{
                ...themeConfig,
                cardStyle: "bordered",
                showExcerpt: themeConfig?.showExcerpt !== false,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
