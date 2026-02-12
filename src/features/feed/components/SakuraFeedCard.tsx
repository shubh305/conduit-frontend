"use client";

import { FeedItem } from "../../feed/types";
import { cn, getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";

interface SakuraFeedCardProps {
  item: FeedItem;
  variant?: "default" | "compact";
  className?: string;
  onRemove?: () => void;
  index?: number;
  currentTenantSlug?: string;
}

export function SakuraFeedCard({
  item,
  className,
  variant = "default",
  onRemove,
  currentTenantSlug,
}: SakuraFeedCardProps) {
  const postUrl = getPostUrl(item, currentTenantSlug);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group relative flex items-center bg-white/40 hover:bg-white/60 transition-all duration-500 overflow-hidden h-24 rounded-xl border border-accent/10 backdrop-blur-sm",
          className,
        )}
      >
        <Link href={postUrl} className="flex items-center flex-1 h-full min-w-0">
          <div className="relative w-28 h-full overflow-hidden shrink-0">
            {item.featuredImage ? (
              <Image
                src={getMediaUrl(item.featuredImage) || ""}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-noir-bg/20 flex items-center justify-center">
                <span className="text-accent/20 font-serif italic text-[8px]">Bloom</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 p-4 flex flex-col justify-center h-full relative z-20">
            <h3 className="text-sm font-serif font-bold text-foreground tracking-tight leading-tight group-hover:text-accent transition-colors line-clamp-1">
              {item.title}
            </h3>
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider mt-1 font-sans">
              {item.authorName}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-noir-bg shadow-sm hover:shadow-md transition-all duration-500 h-[400px] md:h-[440px] overflow-hidden rounded-xl border border-noir-border",
        className,
      )}
    >
      {/* 1. Visual Layer */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-noir-bg/20">
        <Link href={postUrl} className="block w-full h-full">
          {item.featuredImage ? (
            <Image
              src={getMediaUrl(item.featuredImage) || ""}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent/10 font-serif italic text-2xl">Sakura</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500 pointer-events-none" />
        </Link>

        {/* Floating Actions */}
        <div className="hidden md:flex [@media(pointer:coarse)]:md:hidden absolute top-3 right-3 translate-x-0 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <PostActions
            data={item}
            onRemove={onRemove}
            interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
            className="border-none bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-accent gap-3"
          />
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col p-3 flex-1 relative">
        {/* Metadata */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-sans font-bold text-accent uppercase tracking-[0.15em] shrink-0">
            {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
          <span className="text-[8px] font-sans font-medium text-foreground-muted uppercase tracking-wider shrink-0 opacity-60">
            {item.authorName}
          </span>
        </div>

        <Link href={postUrl} className="block group/title flex-1">
          <h3 className="text-lg font-serif font-medium text-foreground leading-[1.25] transition-colors duration-300 group-hover/title:text-accent line-clamp-3">
            {item.title}
          </h3>
        </Link>

        {/* Action Bar */}
        <div className="mt-4 flex [@media(pointer:coarse)]:md:flex md:hidden items-center justify-between pt-3 border-t border-accent/5">
          <PostActions
            data={item}
            onRemove={onRemove}
            compact
            interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
            className="w-full border-none bg-white/40 backdrop-blur-sm p-1.5 rounded-full justify-around text-accent/80"
          />
        </div>
      </div>
    </div>
  );
}
