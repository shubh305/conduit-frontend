"use client";

import { BasePostCard } from "../components/base/BasePostCard";
import { getPostUrl } from "@/lib/utils";
import { LayoutProps } from "./types";
import Link from "next/link";
import Image from "next/image";

export function SplitLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  const splitThemeConfig = {
    ...themeConfig,
    showExcerpt: true,
    showBio: true,
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Mobile View */}
      <div className="flex flex-col gap-4 sm:hidden">
        {posts.map(post => (
          <Link
            key={post.id}
            href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
            className="group relative overflow-hidden rounded-xl"
          >
            <div className="aspect-[16/9] w-full relative">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">{post.title}</h3>
              <p className="text-sm text-white/80 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-white/60">
                <span>{post.authorName}</span>
                <span>•</span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:flex flex-col gap-0 w-full">
        {posts.map((post, index) => (
          <BasePostCard
            key={post.id}
            post={post}
            tenantSlug={tenantSlug}
            currentTenantSlug={currentTenantSlug}
            orientation="horizontal"
            reversed={index % 2 !== 0}
            className="grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-12 md:py-16 border-b border-noir-border/30 last:border-b-0"
            imageClassName="aspect-video md:aspect-[4/3] object-cover w-full h-full min-h-[250px] md:min-h-[400px]"
            themeConfig={splitThemeConfig}
          />
        ))}
      </div>
    </div>
  );
}
