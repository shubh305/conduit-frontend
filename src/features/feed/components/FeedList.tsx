"use client";

import { FeedItem } from "../types";
import { FeedCard } from "./FeedCard"
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { useState, useEffect } from "react";
import { CyberFeedHeader } from "./CyberFeedHeader";
import { FEED_CATEGORIES } from "../constants"
import { useSearchParams } from "next/navigation";
import { getGlobalFeed } from "../api";
import { cn } from "@/lib/utils";
import { TerminalFeedLayout } from "./TerminalFeedLayout";
import { TechieFeedLayout } from "./TechieFeedLayout"
import { JournalFeedLayout } from "./JournalFeedLayout"
import { RoninFeedLayout } from "./RoninFeedLayout"
import { SakuraFeedLayout } from "./SakuraFeedLayout"
import { ThemePage, useThemeLabel } from "@/components/theme";
import { OctaneFeedLayout } from "./OctaneFeedLayout"
import { ProfessionalFeedLayout } from "./ProfessionalFeedLayout"

const GRID_THEMES = ["cyber", "sakura", "ronin", "journal", "octane", "techie"] as const

export function FeedList({
  items: initialItems,
  blogDescription,
  blogTitle,
}: {
  items: FeedItem[];
  blogDescription?: string;
  blogTitle?: string;
}) {
  const { theme } = useTheme();
  const { isTerminalCopy, isCyberCopy, isSakuraCopy, isJournalCopy, isTechieCopy, isRoninCopy } = useThemeHelpers();

  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("category") || "all";

  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialItems.length >= 12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = useThemeLabel();
  const loadMoreText = t("loadMore");
  const loadingText = t("loading");
  const noDataText = t("noData");

  const useGridLayout = (GRID_THEMES as readonly string[]).includes(theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(initialItems.length >= 12);
  }, [initialItems]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const catDef = FEED_CATEGORIES.find(c => c.id === activeCategoryId);
      const tag = catDef?.tags[0];

      const nextPage = page + 1;
      const response = await getGlobalFeed({ tag, page: nextPage, limit: 12 });

      if (response.data.length > 0) {
        setItems(prev => [...prev, ...response.data]);
        setPage(nextPage);
        if (response.data.length < 12) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Failed to load more", e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (mounted && isTerminalCopy) {
    return <TerminalFeedLayout items={items} blogDescription={blogDescription} blogTitle={blogTitle} />;
  }

  if (mounted && useGridLayout) {
    const featured = items[0];
    const rest = items.slice(1);

    if (mounted && isTechieCopy) {
      return (
        <TechieFeedLayout
          items={items}
          blogTitle={blogTitle}
          blogDescription={blogDescription}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          loadMoreText={loadMoreText}
        />
      );
    }

    if (mounted && isJournalCopy) {
      return (
        <JournalFeedLayout
          items={items}
          blogTitle={blogTitle}
          blogDescription={blogDescription}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          loadMoreText={loadMoreText}
        />
      );
    }
    if (mounted && isRoninCopy) {
      return (
        <RoninFeedLayout
          items={items}
          blogTitle={blogTitle}
          blogDescription={blogDescription}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          loadMoreText={loadMoreText}
        />
      );
    }
    if (mounted && isSakuraCopy) {
      return (
        <SakuraFeedLayout
          items={items}
          blogTitle={blogTitle}
          blogDescription={blogDescription}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          loadMoreText={loadMoreText}
        />
      );
    }

    if (mounted && theme === "octane") {
      return (
        <OctaneFeedLayout
          items={items}
          blogTitle={blogTitle}
          blogDescription={blogDescription}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          loadMoreText={loadMoreText}
        />
      );
    }

    return (
      <ThemePage className="flex flex-col min-h-screen">
        {isCyberCopy && <CyberFeedHeader featured={featured} blogDescription={blogDescription} blogTitle={blogTitle} />}

        {isTechieCopy && (
          <div className="max-w-[1600px] mx-auto w-full px-6 py-12 border-b border-noir-border">
            <h1 className="text-4xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter">
              {blogTitle || "Transmission_Stream"}
            </h1>
            <p className="text-foreground-muted font-mono text-xs uppercase tracking-widest mt-2">
              {blogDescription || "// Sector Data Active"}
            </p>
          </div>
        )}

        <div className="flex flex-1">
          <div className="flex-1 flex flex-col">
            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 max-w-[1600px] mx-auto w-full gap-6",
                isSakuraCopy && "p-6 md:p-12 lg:p-20 gap-8",
                isJournalCopy && "p-6 md:p-10 gap-8 mt-12",
                isTechieCopy && "p-6 lg:p-12 gap-10",
                !isSakuraCopy && !isJournalCopy && !isTechieCopy && "p-4 md:p-8",
              )}
            >
              {/* Featured Item in Grid */}
              <div className={cn(isTechieCopy && "col-span-full")}>
                <FeedCard item={featured} variant={isTechieCopy ? "default" : "default"} />
              </div>

              {rest.map(item => (
                <FeedCard key={item.postId} item={item} />
              ))}

              {items.length === 0 && (
                <div className="col-span-full p-20 text-center text-foreground-subtle font-mono text-xs uppercase tracking-widest animate-pulse">
                  {noDataText}
                </div>
              )}
            </div>

            {hasMore && (
              <div className={cn("p-12 flex justify-center", isCyberCopy ? "border-t border-noir-border" : "")}>
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={cn(
                    "font-mono text-[10px] uppercase px-12 py-4 tracking-widest transition-all flex items-center gap-3",
                    isCyberCopy
                      ? "bg-noir-panel border border-noir-border text-foreground hover:bg-noir-hover"
                      : "bg-accent text-noir-bg hover:shadow-lg hover:shadow-accent/20 rounded-full",
                    isJournalCopy &&
                      "bg-accent text-bg-primary hover:bg-accent-secondary font-serif italic normal-case tracking-normal px-8 py-3 rounded-md shadow-md",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      isCyberCopy ? "bg-accent" : "bg-noir-bg",
                      isJournalCopy && "bg-journal-paper/50",
                    )}
                  />
                  {isLoadingMore ? `${loadingText}...` : loadMoreText}
                </button>
              </div>
            )}
          </div>
        </div>
      </ThemePage>
    );
  }

  return (
    <ProfessionalFeedLayout
      items={items}
      blogTitle={blogTitle}
      blogDescription={blogDescription}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={handleLoadMore}
      loadMoreText={loadMoreText}
    />
  );
}
