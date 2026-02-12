"use client";

import { FeedItem } from "../types";
import { JournalFeedCard } from "./JournalFeedCard";
import { JournalHero } from "./JournalHero";
import { ThemePage } from "@/components/theme";
import { cn } from "@/lib/utils";

interface JournalFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
  currentTenantSlug?: string;
}

export function JournalFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText,
  currentTenantSlug,
}: JournalFeedLayoutProps) {
  const featured = items[0];
  const gridItems = items.slice(1);

  return (
    <ThemePage className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Paper Texture Body Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply z-[-1]" />

      {/* 1. Header (Elegant Editorial Header) */}
      <header className="flex flex-col items-center text-center gap-2 pb-8 border-b-2 border-double border-noir-border/40">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-serif font-bold text-accent/40 uppercase tracking-[0.4em] mb-1">
            The Conduit Archive
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-foreground italic leading-none tracking-tighter">
            {blogTitle || "Literary_Stream"}
          </h1>
          {blogDescription && (
            <p className="text-lg md:text-xl font-serif italic text-accent/60 mt-2 max-w-2xl px-6">{blogDescription}</p>
          )}
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col gap-8 min-w-0">
        {featured && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <JournalHero item={featured} currentTenantSlug={currentTenantSlug} />
          </div>
        )}

        {/* Posts Grid (Elegant Editorial Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridItems.map((item, idx) => (
            <div
              key={item.postId}
              className={cn("animate-in fade-in slide-in-from-bottom-4 duration-700")}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <JournalFeedCard item={item} currentTenantSlug={currentTenantSlug} />
            </div>
          ))}
        </div>

        {/* Footer / Load More (Stylized as a "Next Edition") */}
        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-8">
            <div className="w-full flex items-center gap-4">
              <div className="flex-1 h-px bg-noir-border/30" />
              <span className="text-[10px] font-serif italic text-accent/30 uppercase tracking-[0.3em]">
                EndOfEdition
              </span>
              <div className="flex-1 h-px bg-noir-border/30" />
            </div>

            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="group relative px-12 py-4 bg-accent border-2 border-accent/20 hover:bg-journal-ink-muted text-noir-bg hover:text-white font-serif italic text-lg shadow-md hover:shadow-xl transition-all duration-300 rounded-sm cursor-pointer"
            >
              {isLoadingMore ? "Gathering Entries..." : loadMoreText || "Request Next Edition"}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-noir-border/20 transition-all m-1" />
            </button>
          </div>
        )}
      </main>
    </ThemePage>
  );
}
