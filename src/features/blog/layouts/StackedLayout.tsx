"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { getPostUrl } from "@/lib/utils";
import { LayoutProps } from "./types";
import Link from "next/link";
import Image from "next/image";

export function StackedLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="flex flex-col sm:hidden">
        {posts.map(post => (
          <Link
            key={post.id}
            href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
            className="group flex gap-4 p-4 border-b border-noir-border/30 hover:bg-noir-hover/30 transition-colors"
          >
            {post.featuredImage && (
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg relative">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-foreground-muted line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground-subtle mt-2">
                <span>{post.authorName}</span>
                <span>•</span>
                <span>{post.readingTimeMinutes} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop*/}
      <div className="hidden sm:flex flex-col gap-12 w-full max-w-5xl mx-auto px-4">
        {posts.map(post => (
          <BasePostCard
            key={post.id}
            post={post}
            tenantSlug={tenantSlug}
            currentTenantSlug={currentTenantSlug}
            orientation="horizontal"
            className="md:grid-cols-[1fr_400px] border-none"
            themeConfig={themeConfig}
          />
        ))}
      </div>
    </div>
  );
}
