"use client";

import { FeedItem } from "../types";
import { RoninFeedCard } from "./RoninFeedCard";
import { RoninHero } from "./RoninHero";
import { ThemePage } from "@/components/theme";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RoninFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
}

interface Leaf {
  id: number;
  left: string;
  duration: string;
  delay: string;
  opacity: number;
}

export function RoninFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText
}: RoninFeedLayoutProps) {
  const featured = items[0];
  const gridItems = items.slice(1);
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generatedLeaves = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${10 + Math.random() * 10}s`,
      delay: `${Math.random() * 15}s`,
      opacity: 0.1 + Math.random() * 0.3
    }));

    const timer = setTimeout(() => {
      setLeaves(generatedLeaves);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemePage className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-10 relative overflow-hidden bg-black text-gray-200">
      {/* 1. Atmospheric Layer */}
      <div className="ronin-leaves-container z-0">
        {leaves.map(leaf => (
          <div
            key={leaf.id}
            className="ronin-leaf"
            style={{
              left: leaf.left,
              animationDuration: leaf.duration,
              animationDelay: leaf.delay,
              opacity: leaf.opacity,
            }}
          />
        ))}
      </div>

      {/* 2. Header ( Minimalist Ronin Transmission ) */}
      <header className="text-center max-w-2xl mx-auto mb-4 relative z-20 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-[10px] font-mono font-bold text-[#ff4655] uppercase tracking-[0.6em] animate-pulse">
            SIGNAL_ESTABLISHED
          </span>
          <h1 className="ronin-cinematic-title text-2xl md:text-3xl text-white/90">{blogTitle || "RONIN_TRANS"}</h1>
        </div>

        <p className="font-noto text-gray-400 text-sm md:text-base leading-relaxed italic animate-in fade-in duration-1000 delay-300">
          {blogDescription || "Securing the northern transmission. A new warrior rises from the edge of the world."}
        </p>

        {/* Minimal Status indicator */}
        <div className="mt-6 flex items-center gap-3 py-0.5 px-3 border border-white/5 bg-white/[0.02] rounded-full">
          <div className="w-1 h-1 rounded-full bg-[#ff4655] shadow-[0_0_8px_#ff4655]" />
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em]">CHANNEL_{items.length}</span>
        </div>
      </header>

      {/* 3. Main Content (Centered and Elegant) */}
      <main className="w-full flex flex-col gap-16 relative z-20">
        {featured && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-1500 ease-out-expo">
            <RoninHero item={featured} />
          </div>
        )}

        {/* Grid Section - 3 Column like the snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-2">
          {gridItems.map((item, idx) => (
            <div
              key={item.postId}
              className={cn("animate-in fade-in slide-in-from-bottom-8 duration-1000")}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <RoninFeedCard item={item} index={idx} />
            </div>
          ))}
        </div>

        {/* Footer Action */}
        {hasMore && (
          <div className="mt-12 flex flex-col items-center py-8 border-t border-white/5">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="group relative px-16 py-4 bg-transparent overflow-hidden cursor-pointer"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[1px] bg-[#ff4655]/60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1px] bg-[#ff4655]/60" />

              <span className="relative z-10 text-white/40 font-noto font-bold uppercase text-[9px] tracking-[0.4em] transition-all group-hover:text-white group-hover:tracking-[0.5em]">
                {isLoadingMore ? "解読中..." : loadMoreText || "NEXT_VANGUARD"}
              </span>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[1px] bg-[#ff4655]/40 group-hover:w-full transition-all duration-700" />
            </button>
          </div>
        )}
      </main>
    </ThemePage>
  );
}
