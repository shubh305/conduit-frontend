"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { useState } from "react";
import { Bookmark, Clock } from "lucide-react";

import { useLibrary } from "@/features/library/context/LibraryContext";

export default function LibraryPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');
  const { savedPostIds } = useLibrary();

  // Dynamic Saved Items from Context
  const savedItems = mockFeedItems.filter(item => savedPostIds.includes(item.postId));
  
  // TODO: Implement history tracking. For now, show random items or empty
  const historyItems: typeof mockFeedItems = []; 

  const items = activeTab === 'saved' ? savedItems : historyItems;


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
           Library
        </h1>
        <p className={cn(
            "text-lg font-mono",
            theme === 'cyber' ? "text-signal-green" : "text-gray-500"
        )}>
            {`// USER.ARCHIVES`}
        </p>
      </header>

      {/* Tabs */}
      <div className={cn(
          "flex items-center gap-8 mb-8 border-b sticky top-0 bg-[#050505]/95 backdrop-blur z-10",
          theme === 'cyber' ? "border-white/10 bg-[#050505]/95" : "border-white/10 bg-[#121212]/95"
      )}>
         <button 
           onClick={() => setActiveTab('saved')}
           className={cn(
               "flex items-center gap-2 pb-4 text-sm font-mono uppercase tracking-wider transition-all border-b-2",
               activeTab === 'saved'
                 ? (theme === 'cyber' ? "text-signal-green border-signal-green" : "text-white border-white")
                 : "text-gray-500 border-transparent hover:text-gray-300"
           )}
         >
            <Bookmark size={16} />
            Saved Lists
         </button>
         <button 
           onClick={() => setActiveTab('history')}
           className={cn(
               "flex items-center gap-2 pb-4 text-sm font-mono uppercase tracking-wider transition-all border-b-2",
               activeTab === 'history'
                 ? (theme === 'cyber' ? "text-signal-green border-signal-green" : "text-white border-white")
                 : "text-gray-500 border-transparent hover:text-gray-300"
           )}
         >
            <Clock size={16} />
            Reading History
         </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-0 divide-y divide-white/10">
         {items.map(item => (
             <FeedCard key={item.postId} item={item} />
         ))}

         {items.length === 0 && (
            <div className="py-24 text-center">
                <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">
                    NO_DATA_FOUND_IN_ARCHIVE
                </p>
            </div>
         )}
      </div>
    </div>
  );
}
