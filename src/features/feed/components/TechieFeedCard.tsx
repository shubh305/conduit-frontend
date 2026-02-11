"use client";

import { FeedItem } from "../../feed/types";
import { cn, getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";

interface TechieFeedCardProps {
  item: FeedItem;
  variant?: "default" | "compact";
  className?: string;
  onRemove?: () => void;
}

export function TechieFeedCard({ item, className, variant = "default", onRemove }: TechieFeedCardProps) {
  const postUrl = getPostUrl(item);
  const score = (((parseInt((item.postId || "0").substring(0, 8), 16) % 30) + 70) / 10).toFixed(1);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group relative flex items-center bg-noir-panel/30 hover:bg-noir-panel/50 transition-all duration-500 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] overflow-hidden h-28 rounded-lg",
          className,
        )}
      >
        <Link href={postUrl} className="flex items-center flex-1 h-full min-w-0">
          {item.featuredImage && (
            <div className="relative w-36 h-full bg-black overflow-hidden shrink-0 border-r border-white/5">
              <Image
                src={getMediaUrl(item.featuredImage) || ""}
                alt={item.title}
                fill
                className="object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.03)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[length:10px_10px] pointer-events-none" />
            </div>
          )}

          <div className="flex-1 min-w-0 p-3 flex flex-col justify-between h-full">
            <div className="flex items-start gap-2">
              <span className="text-[8px] font-mono leading-none bg-accent/20 text-accent px-1 py-0.5 font-bold shadow-sm shrink-0">
                {score}
              </span>
              <h3 className="text-[13px] font-sans font-black text-white uppercase tracking-tight leading-tight group-hover:text-accent/80 line-clamp-2">
                {item.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[8px] font-mono text-accent/60 uppercase shrink-0">
                  {new Date(item.publishedAt)
                    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    .toUpperCase()}
                </span>
                <span className="text-[8px] font-mono text-foreground/20 italic shrink-0">{"//"}</span>
                <span className="text-[8px] font-mono text-foreground/50 uppercase truncate max-w-[80px] shrink-0">
                  {item.authorName?.split(" ")[0]}
                </span>
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <span className="text-[8px] font-mono text-foreground/20 italic">{"//"}</span>
                  <div className="flex gap-1.5">
                    {item.tags.slice(0, 1).map(tag => (
                      <span
                        key={tag}
                        className="text-[8px] text-accent/40 font-mono lowercase hover:text-accent/80 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <PostActions
                  data={item}
                  onRemove={onRemove}
                  compact
                  interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
                  className="border-none pt-0 mt-0 flex flex-row gap-2 bg-transparent p-0 shadow-none"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-noir-panel/30 hover:bg-noir-panel/50 transition-all duration-500 h-[420px] md:h-[460px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] overflow-hidden rounded-xl",
        className,
      )}
    >
      <Link href={postUrl} className="flex flex-col flex-1 min-w-0">
        <div className="px-3 py-1.5 flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.1em] text-foreground-muted border-b border-white/5">
          <span className="text-accent/80">
            {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
          </span>
          <span className="opacity-30">{"//"}</span>
          <span>5 MIN</span>
          <span className="opacity-30">{"//"}</span>
          <span className="text-foreground/60 truncate max-w-[100px]">{item.tenantName || "CORE_LOG"}</span>
        </div>

        {/* 2. Visual Layer */}
        {item.featuredImage && (
          <div className="relative aspect-[21/9] w-full bg-black overflow-hidden group-hover:bg-accent/5">
            <Image
              src={getMediaUrl(item.featuredImage) || ""}
              alt={item.title}
              fill
              className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.03)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.03)_1px,transparent_1px)] bg-[length:15px_15px] pointer-events-none" />
          </div>
        )}

        {/* 3. Content Section */}
        <div className="p-3 flex flex-col flex-1 gap-2 relative">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex flex-col items-center">
              <span className="text-[8px] font-mono leading-none bg-accent/20 text-accent px-1.5 py-1 font-bold shadow-sm">
                {score}
              </span>
            </div>
            <h3 className="text-base font-sans font-black text-white uppercase tracking-tight leading-[1] transition-colors group-hover:text-accent/80 line-clamp-2">
              {item.title}
            </h3>
          </div>

          <div className="mt-auto pt-2 border-t border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-[8px] text-accent/50 font-mono lowercase hover:text-accent/80 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-foreground-subtle group-hover:text-foreground">
                {item.authorName?.split(" ")[0]}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex [@media(pointer:coarse)]:md:flex md:hidden items-center justify-between pt-2 border-t border-white/5">
              <PostActions
                data={item}
                onRemove={onRemove}
                compact
                interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
                className="w-full border-none bg-accent/5 p-1.5 rounded-lg justify-around"
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Action Bar Overlay */}
      <div className="hidden md:flex [@media(pointer:coarse)]:md:hidden absolute top-4 right-3 flex-col translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-20">
        <PostActions
          data={item}
          onRemove={onRemove}
          compact
          layout="vertical"
          interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
          className="border-none bg-black/95 backdrop-blur-xl p-2.5 shadow-2xl rounded-full border border-white/10"
        />
      </div>
    </div>
  );
}
