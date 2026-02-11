"use client";

import { FeedItem } from "../types";
import { cn, getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";

interface OctaneFeedCardProps {
  item: FeedItem;
  variant?: "default" | "compact";
  className?: string;
  onRemove?: () => void;
}

export function OctaneFeedCard({ item, className, onRemove }: OctaneFeedCardProps) {
  const postUrl = getPostUrl(item);

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-noir-bg octane-card octane-speedometer transition-all duration-500 h-[400px] md:h-[440px] overflow-hidden border border-noir-border rounded-sm transition-colors duration-300 shadow-xl",
        className,
      )}
    >
      {/* 1. Carbon Fiber Accent */}
      <div
        className="absolute top-0 right-0 w-24 h-full bg-noir-bg skew-x-[-15deg] translate-x-12 z-0 border-l border-noir-border"
        style={{
          backgroundImage: `linear-gradient(45deg, var(--bg-primary) 25%, transparent 25%, transparent 75%, var(--bg-primary) 75%, var(--bg-primary)), linear-gradient(45deg, var(--bg-primary) 25%, transparent 25%, transparent 75%, var(--bg-primary) 75%, var(--bg-primary))`,
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 2px 2px",
        }}
      />

      {/* 2. Image Block (Top 55%) */}
      <Link href={postUrl} className="relative h-[55%] w-full overflow-hidden block group/image">
        {item.featuredImage ? (
          <Image
            src={getMediaUrl(item.featuredImage) || ""}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-[400ms] ease-out-expo grayscale-[50%] group-hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 bg-noir-bg flex items-center justify-center">
            <span className="text-noir-border font-black italic text-4xl uppercase tracking-tighter skew-x-[-10deg]">
              NO_SIGNAL
            </span>
          </div>
        )}

        {/* Speedometer Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-noir-panel to-transparent pointer-events-none" />

        {/* Badge */}
        <div className="absolute top-4 left-4 bg-accent text-white font-black text-xs px-3 py-1 skew-x-[-10deg] uppercase shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform translate-x-0 md:translate-x-[-20px] opacity-100 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <span className="skew-x-[10deg] block">TURBO_CHARGED</span>
        </div>
      </Link>

      {/* 3. Content Cockpit (Bottom 45%) */}
      <div className="relative z-10 flex flex-col p-6 h-[45%] justify-between">
        <div className="flex flex-col gap-2">
          {/* Tech Header */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">
            <span className="text-accent">{"///"}</span>
            <span>{new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span className="opacity-30">|</span>
            <span>PILOT: {item.authorName?.split(" ")[0]}</span>
          </div>

          <Link href={postUrl} className="group/title">
            <h3 className="text-2xl font-black italic text-white uppercase leading-[0.9] tracking-tighter transition-colors group-hover/title:text-accent line-clamp-3 font-sans">
              {item.title}
            </h3>
          </Link>
        </div>

        {/* Footer Stats */}
        <div className="mt-auto pt-4 border-t border-noir-border flex items-center justify-between">
          <div className="flex gap-2">
            {item.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[9px] bg-noir-bg text-foreground-muted px-2 py-1 uppercase font-bold tracking-wider hover:bg-accent hover:text-white transition-colors cursor-pointer skew-x-[-10deg]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-foreground-subtle hover:text-accent transition-colors md:bg-transparent bg-accent/5 px-3 py-1.5 md:p-0 rounded-full md:rounded-none">
            <PostActions
              data={item}
              onRemove={onRemove}
              interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
              className="border-none bg-transparent p-0 m-0 gap-3 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Active Border Effect */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent group-hover:w-full transition-all duration-500 ease-out z-20" />
    </div>
  );
}
