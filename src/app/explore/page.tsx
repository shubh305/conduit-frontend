"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { Compass } from "lucide-react";

export default function ExplorePage() {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      {/* Header */}
      <header className={cn(
        "mb-8 md:mb-12 border-b pb-8",
        theme === 'cyber' ? "border-white/10" : "border-white/10"
      )}>
        <h1 className={cn(
            "text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4",
            theme === 'cyber' ? "text-gray-100 font-mono" : "text-white font-sans"
        )}>
           Explore
        </h1>
        <p className={cn(
            "text-lg font-mono",
            theme === 'cyber' ? "text-signal-green" : "text-gray-500"
        )}>
            {`// DISCOVER.TRENDING`}
        </p>
      </header>

      {/* Featured Grid (First 2 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {mockFeedItems.slice(8, 10).map(item => (
             <div key={item.postId} className="md:col-span-1">
                 <FeedCard item={item} />
             </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6 opacity-70">
          <Compass size={16} />
          <span className="font-mono text-sm uppercase tracking-wider">Trending Now</span>
      </div>

      {/* Remaining Items List */}
      <div className="flex flex-col gap-0 divide-y divide-white/10">
         {mockFeedItems.slice(0, 8).map(item => (
             <FeedCard key={item.postId} item={item} />
         ))}
      </div>
    </div>
  );
}
