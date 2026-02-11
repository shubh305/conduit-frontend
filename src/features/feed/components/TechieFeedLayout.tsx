"use client";

import { FeedItem } from "../types";
import { TechieFeedCard } from "./TechieFeedCard";
import { TechieHero } from "./TechieHero";
import { ThemePage } from "@/components/theme";

interface TechieFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
}

export function TechieFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText,
}: TechieFeedLayoutProps) {
  const featured = items[0];
  const gridItems = items.slice(1);

  return (
    <ThemePage className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col gap-8">
      {/* 1. Header (Ultra-Compact Header) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 bg-accent" />
            <h1 className="text-4xl lg:text-5xl font-sans font-black text-white uppercase tracking-tighter leading-none">
              {blogTitle || "TRANS_LOG_SYS"}
            </h1>
          </div>
          {blogDescription && (
            <p className="text-[9px] font-mono text-foreground-muted uppercase tracking-[0.3em]">
              {"//"} {blogDescription}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-accent">
          <span className="animate-pulse">●</span>
          <span>NODES: {items.length}</span>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col gap-8 min-w-0">
        {featured && <TechieHero item={featured} />}

        {/* Posts Grid (Fixed 3-column technical layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridItems.map(item => (
            <TechieFeedCard key={item.postId} item={item} />
          ))}
        </div>

        {/* Footer / Load More */}
        {hasMore && (
          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="w-full h-px bg-accent/20 flex justify-center items-center">
              <div className="px-3 bg-noir-bg text-[9px] font-mono text-accent/30 uppercase tracking-[0.5em]">
                EOL_V2.2
              </div>
            </div>
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-10 py-2.5 bg-noir-panel border border-accent/30 hover:border-accent text-accent font-mono text-[9px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent/5 disabled:opacity-50 cursor-pointer"
            >
              {isLoadingMore ? "BUFFERING..." : loadMoreText || "FETCH_DATA"}
            </button>
          </div>
        )}
      </main>
    </ThemePage>
  );
}
