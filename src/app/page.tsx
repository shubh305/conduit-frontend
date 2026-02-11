"use client";

import { getGlobalFeed } from "@/features/feed/api";
import { FeedList } from "@/features/feed/components/FeedList";
import { FEED_CATEGORIES } from "@/features/feed/constants";
import { FeedItem } from "@/features/feed/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLabels } from "@/features/theme/ThemeProvider";

export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const feed = searchParams.get("feed");

  const [initialItems, setInitialItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLabel } = useLabels();

  // Sync state with props during render to avoid "cascading renders" from useEffect.
  // This immediately schedules a re-render with the updated state before the browser paints.
  const [prevParams, setPrevParams] = useState({ category, feed });
  if (prevParams.category !== category || prevParams.feed !== feed) {
    setPrevParams({ category, feed });
    setIsLoading(true);
    setInitialItems([]);
  }

  useEffect(() => {
    let tag: string | undefined;
    if (category && category !== "all") {
      const catDef = FEED_CATEGORIES.find(c => c.id === category);
      if (catDef && catDef.tags.length > 0) {
        tag = catDef.tags[0];
      }
    }

    const feedType = feed === "following" ? "following" : "global";

    getGlobalFeed({ tag, limit: 12, type: feedType })
      .then(response => {
        setInitialItems(response.data || []);
      })
      .catch(error => {
        console.error("Failed to fetch feed", error);
        setInitialItems([]);
      })
      .finally(() => setIsLoading(false));
  }, [category, feed]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-foreground-muted font-mono text-xs uppercase tracking-widest animate-pulse">
          {getLabel("loading")}
        </div>
      </main>
    );
  }

  const feedType = feed === "following" ? "following" : "global";
  return (
    <main className="min-h-screen">
      <FeedList items={initialItems} feedType={feedType} />
    </main>
  );
}
