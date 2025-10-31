"use client";

import { cn } from "@/lib/utils";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { getGlobalFeed } from "@/features/feed/api";
import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import { FeedItem } from "@/features/feed/types";
import { ThemePage, useThemeLabel, getHeadingClasses } from "@/components/theme";
import { useTheme } from "@/features/theme/ThemeProvider";

export default function ExplorePage() {
  const { theme } = useTheme();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme-aware labels
  const t = useThemeLabel();
  const pageTitle = t("explore");
  const loadingText = t("loading");
  const trendingText = t("trending");

  useEffect(() => {
    getGlobalFeed({ limit: 10 })
      .then(res => {
        setItems(res.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch explore feed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-foreground-subtle font-mono animate-pulse">{loadingText}...</div>;
  }

  const featured = items.slice(0, 2);
  const trending = items.slice(2);

  return (
    <ThemePage className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 md:mb-12 border-b border-noir-border pb-8">
        <h1
          className={cn(
            "text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-foreground",
            getHeadingClasses(theme),
          )}
        >
          {pageTitle}
        </h1>
        <p className="text-lg font-mono text-accent">
          {"// "} {trendingText}
        </p>
      </header>

      {/* Featured Grid (First 2 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {featured.map(item => (
          <div key={item.postId} className="md:col-span-1">
            <FeedCard item={item} />
          </div>
        ))}
      </div>

      {/* Section Header */}
      {trending.length > 0 && (
        <div className="flex items-center gap-2 mb-6 text-foreground-muted">
          <Compass size={16} />
          <span className="font-mono text-sm uppercase tracking-wider">{trendingText}</span>
        </div>
      )}

      {/* Remaining Items List */}
      <div className="flex flex-col gap-0 divide-y divide-noir-border">
        {trending.map(item => (
          <FeedCard key={item.postId} item={item} />
        ))}
      </div>
    </ThemePage>
  );
}
