"use client";

import { FeedItem } from "../../feed/types";
import { cn, getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";

interface JournalFeedCardProps {
  item: FeedItem;
  variant?: "default" | "compact";
  className?: string;
  onRemove?: () => void;
  currentTenantSlug?: string;
}

export function JournalFeedCard({
  item,
  className,
  variant = "default",
  onRemove,
  currentTenantSlug,
}: JournalFeedCardProps) {
  const postUrl = getPostUrl(item, currentTenantSlug);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group relative flex items-center bg-[var(--journal-paper)] hover:bg-white transition-all duration-500 shadow-[4px_4px_0_rgba(0,0,0,0.05),8px_8px_0_rgba(0,0,0,0.02)] hover:shadow-xl overflow-hidden h-32 border border-accent/10 rounded-sm journal-page-curl",
          className,
        )}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply z-10" />

        <div className="flex items-center flex-1 h-full min-w-0">
          <Link href={postUrl} className="flex items-center flex-1 h-full min-w-0">
            {/* Left Visual: Hero Image */}
            {item.featuredImage && (
              <div className="relative w-40 h-full overflow-hidden shrink-0 border-r border-noir-border/20">
                <Image
                  src={getMediaUrl(item.featuredImage) || ""}
                  alt={item.title}
                  fill
                  className="object-cover sepia-[0.2] contrast-[1.05] group-hover:sepia-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
            )}

            {/* Right Content */}
            <div className="flex-1 min-w-0 p-4 flex flex-col justify-between h-full relative z-20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-serif italic text-accent/60">
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-serif italic text-accent/70">by {item.authorName}</span>
              </div>
            </div>
          </Link>

          {/* Actions - Moved outside main Link to fix touch interference */}
          <div className="relative z-30 pr-4">
            <PostActions
              data={item}
              onRemove={onRemove}
              compact
              interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
              className="border-none pt-0 mt-0 flex flex-row gap-2 bg-transparent p-0 shadow-none text-accent/80"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-[var(--journal-paper)] hover:bg-white transition-all duration-500 h-auto min-h-[280px] shadow-[6px_6px_0_rgba(0,0,0,0.05),12px_12px_0_rgba(0,0,0,0.02)] hover:shadow-2xl overflow-hidden border border-accent/10 rounded-sm journal-page-curl p-0",
        className,
      )}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply z-10" />

      {/* Decorative Corner (Stylized Fold) */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-noir-border/20 to-transparent pointer-events-none z-20" />

      <div className="flex flex-col flex-1 min-w-0 relative z-20">
        <Link href={postUrl} className="flex flex-col flex-1">
          {/* 1. Header */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-noir-border/20">
            <span className="text-[9px] font-serif italic text-accent/50 tracking-[0.2em] uppercase">
              {new Date(item.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[8px] font-serif font-bold text-accent/40 uppercase tracking-[0.15em]">
              {item.tenantName || "Journal Entry"}
            </span>
          </div>

          {/* 2. Visual Layer */}
          {item.featuredImage ? (
            <div className="block relative aspect-[16/10] w-full overflow-hidden m-3 self-center max-w-[calc(100%-1.5rem)] shadow-inner">
              <Image
                src={getMediaUrl(item.featuredImage) || ""}
                alt={item.title}
                fill
                className="object-cover sepia-[0.3] contrast-[1.1] brightness-[0.98] group-hover:sepia-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
              {/* Subtle Vignette on Image */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
            </div>
          ) : (
            <div className="block relative aspect-[16/10] w-full overflow-hidden m-3 self-center max-w-[calc(100%-1.5rem)] border-b border-noir-border/10 flex items-center justify-center bg-black/5 opacity-50">
              <div className="text-[10px] font-serif italic text-accent/30 tracking-[0.2em]">NO IMAGE</div>
            </div>
          )}

          {/* 3. Content Section (Title area as part of link) */}
          <div className="px-5 flex flex-col mb-4">
            <div className="group/title">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground leading-tight transition-colors group-hover/title:text-accent">
                {item.title}
              </h3>
            </div>
          </div>
        </Link>

        {/* 4. Non-Link Interactive Section */}
        <div className="px-5 pb-5 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] text-accent/60 font-serif italic border-b border-accent/10 hover:text-accent transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-noir-border/15 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-serif text-accent/40 uppercase tracking-widest mb-1">Written by</span>
              <span className="text-xs font-serif font-bold text-foreground italic">{item.authorName}</span>
            </div>

            <div className="relative z-30">
              <PostActions
                data={item}
                onRemove={onRemove}
                interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
                className="border-none bg-transparent pt-0 mt-0 text-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
