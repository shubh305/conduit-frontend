"use client";

import { FeedItem } from "../types";
import { SakuraFeedCard } from "./SakuraFeedCard";
import { SakuraHero } from "./SakuraHero";
import { ThemePage } from "@/components/theme";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SakuraFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
  currentTenantSlug?: string;
}

interface Petal {
  id: number;
  left: string;
  duration: string;
  delay: string;
  opacity: number;
  scale: number;
}

export function SakuraFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText,
  currentTenantSlug,
}: SakuraFeedLayoutProps) {
  const featured = items[0];
  const gridItems = items.slice(1);
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatedPetals = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${8 + Math.random() * 12}s`,
      delay: `${Math.random() * 10}s`,
      opacity: 0.2 + Math.random() * 0.4,
      scale: 0.5 + Math.random() * 1,
    }));

    const timer = setTimeout(() => {
      setPetals(generatedPetals);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemePage className="max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-20 flex flex-col items-center gap-12 relative overflow-hidden bg-noir-bg">
      {/* 1. Atmospheric Layer - Falling Petals */}
      <div className="sakura-petals-container">
        {petals.map(petal => (
          <div
            key={petal.id}
            className="sakura-petal"
            style={{
              left: petal.left,
              animationDuration: petal.duration,
              animationDelay: petal.delay,
              opacity: petal.opacity,
              transform: `scale(${petal.scale})`,
            }}
          />
        ))}
      </div>

      {/* 2. Header */}
      <header className="text-center max-w-3xl mx-auto mb-4 relative z-20 flex flex-col items-center">
        <div className="mb-6">
          <span className="text-xs font-sans font-medium text-accent uppercase tracking-[0.3em] mb-4 block">
            Spring Transmission
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground italic tracking-tight mb-6">
            {blogTitle || "SAKURA_BLOOM"}
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto" />
        </div>

        {blogDescription && (
          <p className="font-sans text-foreground-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            {blogDescription}
          </p>
        )}
      </header>

      {/* 3. Main Content */}
      <main className="w-full flex flex-col gap-24 relative z-20">
        {featured && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <SakuraHero item={featured} currentTenantSlug={currentTenantSlug} />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
          {gridItems.map((item, idx) => (
            <div
              key={item.postId}
              className={cn("animate-in fade-in slide-in-from-bottom-8 duration-1000")}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <SakuraFeedCard item={item} currentTenantSlug={currentTenantSlug} />
            </div>
          ))}
        </div>

        {/* Footer Action */}
        {hasMore && (
          <div className="mt-16 flex flex-col items-center py-12">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="group relative px-20 py-4 bg-white text-accent font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-accent/10 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 uppercase text-xs tracking-[0.2em]">
                {isLoadingMore ? "Gathering..." : loadMoreText || "Next Bloom"}
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Decorative Watermark */}
      <div className="absolute bottom-20 right-[-5%] font-serif text-[20vw] text-accent/5 pointer-events-none select-none italic transform -rotate-12 z-0">
        桜
      </div>
    </ThemePage>
  );
}
