"use client";

import { Post } from "@/features/blog/types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getHeadingClasses, ThemeVariant } from "@/lib/theme-variants"

interface FrequencyPerformanceListProps {
  posts: Post[]
  isLoading?: boolean
  title?: string
}

export function FrequencyPerformanceList({ posts, isLoading, title }: FrequencyPerformanceListProps) {
  const { theme } = useTheme()
  const { isCyberCopy, isSakuraCopy, isJournalCopy, isTechieCopy, fontFamily } = useThemeHelpers()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getSearchPlaceholder = () => {
    if (isCyberCopy) return "SEARCH_SIGNALS..."
    if (isTechieCopy) return "QUERY_DATABASE..."
    if (isSakuraCopy) return "記事を検索..."
    if (isJournalCopy) return "Search in the archives..."
    return "Search articles..."
  }

  const getLoadingMessage = () => {
    if (isCyberCopy) return "SCANNING_UPLINKS..."
    if (isTechieCopy) return "DECRYPTING_LOGS..."
    if (isSakuraCopy) return "読み込み中..."
    return "Loading analytics..."
  }

  const getNoResultsMessage = () => {
    if (isCyberCopy) return "NO_SIGNALS_RECORDED"
    if (isTechieCopy) return "NULL_REFERENCE_EXCEPTION"
    if (isSakuraCopy) return "データが見つかりません"
    return "No performance data found"
  }

  return (
    <div
      className={cn("flex flex-col bg-noir-bg", isJournalCopy && "bg-transparent", isTechieCopy && "bg-transparent")}
    >
      <div className="flex items-center justify-between mb-8">
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight text-foreground",
            getHeadingClasses(theme as ThemeVariant),
            isTechieCopy && "text-foreground tracking-tight uppercase",
          )}
        >
          {title ||
            (isSakuraCopy
              ? "コンテンツ"
              : isCyberCopy
                ? "Frequencies"
                : isTechieCopy
                  ? "PERFORMANCE_LOGS"
                  : "Performances")}
        </h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-10 group max-w-2xl">
        <Search
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            "text-foreground-subtle group-focus-within:text-accent",
            isTechieCopy && "text-accent-secondary group-focus-within:text-accent",
          )}
        />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={cn(
            "w-full h-12 pl-12 pr-4 bg-transparent border outline-none transition-all",
            "border-noir-border focus:border-accent/50 text-foreground placeholder:text-foreground-subtle",
            isCyberCopy ? "font-mono uppercase text-xs rounded-none" : "text-sm",
            isJournalCopy && "font-serif italic border-accent/20 bg-journal-paper shadow-sm rounded-lg",
            isTechieCopy &&
              "bg-noir-panel/20 border-noir-border focus:border-accent-secondary text-accent placeholder:text-accent-secondary/50 font-mono text-xs shadow-none rounded-lg focus:shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)]",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : isJournalCopy || isTechieCopy ? "8px" : "var(--theme-radius-md)" }}
        />
      </div>

      {/* Table Header */}
      <div
        className={cn(
          "grid grid-cols-[1fr_80px] md:grid-cols-[1fr_repeat(3,80px)] lg:grid-cols-[1fr_repeat(3,100px)] gap-4 px-4 md:px-6 py-4 border-b border-noir-border transition-all",
          isCyberCopy
            ? "text-accent/60 font-mono text-[9px] uppercase tracking-widest"
            : "text-foreground-muted font-bold text-[10px]",
          isJournalCopy && "border-accent/10 font-serif italic text-accent/70",
          isTechieCopy && "border-noir-border text-accent-secondary font-mono text-[10px] uppercase tracking-wider",
        )}
      >
        <div>{isSakuraCopy ? "記事" : isCyberCopy ? "ARTICLE" : "Post"}</div>
        <div className="text-right">{isSakuraCopy ? "ビュー" : isCyberCopy ? "VIEWS" : "Views"}</div>
        <div className="text-right hidden md:block">
          {isSakuraCopy ? "コメント" : isCyberCopy ? "COMMENTS" : "Comments"}
        </div>
        <div className="text-right hidden md:block">
          {isSakuraCopy ? "いいね" : isCyberCopy ? "REACTIONS" : "Reactions"}
        </div>
      </div>

      {/* List */}
      <div
        className={cn(
          "divide-y divide-noir-border",
          isJournalCopy && "divide-accent/10",
          isTechieCopy && "divide-noir-border",
        )}
      >
        {isLoading ? (
          <div
            className={cn(
              "py-20 text-center animate-pulse text-foreground-subtle font-mono text-xs",
              isTechieCopy && "text-accent-secondary",
            )}
          >
            {getLoadingMessage()}
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className={cn(
                "grid grid-cols-[1fr_80px] md:grid-cols-[1fr_repeat(3,80px)] lg:grid-cols-[1fr_repeat(3,100px)] gap-4 px-4 md:px-6 py-8 items-center transition-all group",
                "hover:bg-noir-hover",
                isJournalCopy && "hover:bg-accent/5",
                isTechieCopy && "hover:bg-noir-panel/30 hover:shadow-[inset_2px_0_0_0_var(--accent)]",
              )}
            >
              <div className="flex flex-col gap-1 pr-4">
                <Link
                  href={`/u/${post.authorUsername}/${post.slug}`}
                  className={cn(
                    "font-bold line-clamp-1 group-hover:underline decoration-1 underline-offset-4 text-foreground",
                    isCyberCopy
                      ? "font-mono uppercase text-sm tracking-tight"
                      : isTechieCopy
                        ? "text-foreground font-sans font-bold group-hover:text-accent no-underline group-hover:no-underline transition-colors"
                        : fontFamily === "serif"
                          ? "font-serif text-xl italic"
                          : "text-lg",
                    isJournalCopy && "text-journal-ink-muted",
                  )}
                >
                  {post.title}
                </Link>
                <div
                  className={cn(
                    "text-[10px] flex items-center gap-2 text-foreground-subtle",
                    isCyberCopy ? "font-mono uppercase" : "",
                    isTechieCopy && "font-mono text-foreground/50",
                  )}
                >
                  <span className={isTechieCopy ? "text-accent-secondary" : ""}>
                    {Math.floor(post.readingTimeMinutes || 5 || 0)} min read
                  </span>
                  <span className={isTechieCopy ? "text-noir-border" : ""}>•</span>
                  <span>{post.authorName}</span>
                </div>
              </div>

              <div
                className={cn(
                  "text-right font-bold text-sm text-foreground",
                  isCyberCopy ? "font-mono" : "",
                  isTechieCopy && "font-mono text-accent",
                )}
              >
                {post.viewsCount}
              </div>
              <div
                className={cn(
                  "text-right font-bold text-sm text-foreground-muted hidden md:block",
                  isCyberCopy ? "font-mono" : "",
                  isTechieCopy && "font-mono text-foreground/50",
                )}
              >
                {post.commentsCount || 0}
              </div>
              <div
                className={cn(
                  "text-right font-bold text-sm text-foreground-muted hidden md:block",
                  isCyberCopy ? "font-mono" : "",
                  isTechieCopy && "font-mono text-foreground/50",
                )}
              >
                {post.likesCount || 0}
              </div>
            </div>
          ))
        ) : (
          <div
            className={cn(
              "py-20 text-center text-foreground-subtle font-mono text-xs",
              isTechieCopy && "text-accent-secondary",
            )}
          >
            {getNoResultsMessage()}
          </div>
        )}
      </div>

      <div className="mt-12 text-center pb-20">
        <p
          className={cn(
            "text-[10px] font-mono",
            isCyberCopy ? "text-accent/30 uppercase" : "text-foreground-subtle",
            isJournalCopy && "font-serif italic capitalize",
            isTechieCopy && "text-accent-secondary/50 uppercase tracking-widest",
          )}
        >
          {isSakuraCopy
            ? "すべてのデータが表示されました 🌸"
            : isJournalCopy
              ? "End of the records."
              : isTechieCopy
                ? "// END_OF_LOG"
                : "You've reached the end!"}
        </p>
      </div>
    </div>
  );
}
