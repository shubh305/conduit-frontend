"use client";

import { FeedItem } from "@/features/feed/types";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";

interface ProfileFeedProps {
  posts: FeedItem[];
}

export function ProfileFeed({ posts }: ProfileFeedProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy } = useThemeHelpers();

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-noir-border mb-8 overflow-x-auto no-scrollbar">
        <div
          className={cn(
            "pb-4 text-[10px] uppercase tracking-[0.2em] font-mono transition-all border-b-2 border-accent text-foreground",
            isCyberCopy ? "" : "font-sans font-bold",
          )}
        >
          {isSakuraCopy ? "送信履歴" : "Transmissions"} ({posts.length})
        </div>
      </div>

      <div className={cn("space-y-4")}>
        {posts.map(post => (
          <FeedCard key={post.postId} item={post} variant="compact" />
        ))}
        {posts.length === 0 && (
          <div
            className={cn(
              "col-span-full flex flex-col items-center justify-center py-24 text-center border bg-noir-panel transition-all",
              isCyberCopy ? "border-accent/20 rounded-none" : "border-noir-border rounded-3xl",
            )}
          >
            <h3
              className={cn(
                "text-foreground text-lg font-bold mb-2 transition-colors",
                isCyberCopy ? "font-mono uppercase" : config.fontFamily === "serif" ? "font-serif italic" : "font-sans",
              )}
            >
              {isSakuraCopy ? "まだ送信履歴はありません。" : "No transmissions yet."}
            </h3>
            <p className="text-foreground-subtle font-mono text-[10px] max-w-sm uppercase tracking-[0.2em] animate-pulse">
              {isSakuraCopy ? "信号待機中..." : "Awaiting signal broadcast..."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
