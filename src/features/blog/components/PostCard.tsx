"use client";

import Link from "next/link";
import { Post } from "../types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getPostUrl } from "@/lib/utils";

export function PostCard({
  post,
  tenantSlug,
  currentTenantSlug,
}: {
  post: Post;
  tenantSlug: string;
  currentTenantSlug?: string;
}) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy } = useThemeHelpers();

  return (
    <Link
      href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
      className="group block py-12 border-b border-noir-border hover:bg-noir-panel transition-colors -mx-4 px-4"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div
            className={cn(
              "flex items-center gap-4 text-xs uppercase text-foreground-subtle",
              isCyberCopy ? "font-mono" : "font-sans",
            )}
          >
            <span>{new Date(post.publishedAt).toLocaleDateString("en-US")}</span>
            <span>
              {post.readingTimeMinutes} {isSakuraCopy ? "分" : "min read"}
            </span>
          </div>

          <h2
            className={cn(
              "text-3xl font-bold leading-tight group-hover:text-accent group-hover:underline decoration-1 underline-offset-4 decoration-foreground-subtle text-foreground",
              isCyberCopy
                ? "font-mono uppercase tracking-tight"
                : config.fontFamily === "serif"
                  ? "font-serif"
                  : "font-sans",
            )}
          >
            {post.title}
          </h2>

          <p
            className={cn(
              "leading-relaxed text-sm md:text-base max-w-3xl text-foreground-muted",
              isCyberCopy ? "font-mono" : "font-sans",
            )}
          >
            {post.excerpt}
          </p>

          <div className="flex gap-2 pt-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-mono text-accent">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {post.featuredImage && (
          <div
            className={cn(
              "w-full md:w-64 aspect-[4/3] bg-noir-bg shrink-0 overflow-hidden border border-noir-border grayscale group-hover:grayscale-0 transition-all duration-500",
              !isCyberCopy && "rounded-lg",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </Link>
  );
}
