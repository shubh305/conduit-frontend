"use client";

import { FeedItem } from "../types";
import { FeedCard } from "./FeedCard";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useState, useMemo } from "react";
import { CyberFeedHeader } from "./CyberFeedHeader";
import { FEED_CATEGORIES } from "../constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockFollowingItems } from "@/features/feed/data/mock-following";

export function FeedList({ items: initialItems, classicHeader, blogDescription, blogTitle }: { items: FeedItem[], classicHeader?: React.ReactNode, blogDescription?: string, blogTitle?: string }) {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // 1. Get Active Category & Feed Type from URL
  const activeCategoryId = searchParams.get("category") || "all";
  const feedType = (searchParams.get("feed") as 'foryou' | 'following') || 'foryou';

  // 2. Pagination State
  const [visibleCount, setVisibleCount] = useState(6);

  // 3. Determine Source Items
  const sourceItems = feedType === 'following' ? mockFollowingItems : initialItems;

  // 4. Filter Items Logic
  const filteredItems = useMemo(() => {
    if (activeCategoryId === 'all') return sourceItems;
    
    const categoryDef = FEED_CATEGORIES.find(c => c.id === activeCategoryId);
    if (!categoryDef) return sourceItems;

    return sourceItems.filter(item => 
      item.tags.some(tag => categoryDef.tags.includes(tag.toLowerCase()))
    );
  }, [sourceItems, activeCategoryId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // 5. Split for Cyber Layout
  const featured = filteredItems[0];
  const rest = filteredItems.slice(1);
  const visibleItems = (theme === 'cyber' ? rest : filteredItems).slice(0, visibleCount);
  const hasMore = visibleCount < (theme === 'cyber' ? rest.length : filteredItems.length);

  // --- CYBER THEME RENDER ---
  if (theme === 'cyber') {
    return (
      <div className="flex flex-col min-h-screen">
        <CyberFeedHeader featured={featured} blogDescription={blogDescription} blogTitle={blogTitle} />
        
        <div className="flex flex-1">            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                   {visibleItems.map((item) => (
                     <FeedCard key={item.postId} item={item} />
                   ))}
                   {filteredItems.length === 0 && (
                       <div className="col-span-full p-12 text-center text-gray-500 font-mono text-sm">
                           NO_DATA_FOUND_IN_SECTOR
                       </div>
                   )}
                </div>

                {hasMore && (
                    <div className="p-8 flex justify-center border-t border-white/10">
                        <button 
                            onClick={handleLoadMore}
                            className="bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase px-8 py-4 border border-white/10 tracking-widest transition-colors flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 bg-signal-green rounded-full animate-pulse" />
                            LOAD_MORE_DATA
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- CLASSIC THEME RENDER ---
  const activeCategoryDef = FEED_CATEGORIES.find(c => c.id === activeCategoryId);

  return (
    <div className="max-w-7xl mx-auto p-8 md:p-12 lg:p-24">
       {classicHeader ? classicHeader : (
         <header className="mb-12 space-y-4 border-b border-white/10 pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase text-white">
              {activeCategoryId === 'all' ? 'Conduit' : activeCategoryDef?.label || 'Conduit'}
            </h1>
            {activeCategoryId !== 'all' && (
                <Link 
                    href="/?category=all"
                    className="hidden md:block text-sm font-mono text-gray-400 hover:text-white uppercase border-b border-transparent hover:border-white transition-all"
                >
                    [CLEAR_FILTER]
                </Link>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-lg md:text-xl font-mono text-gray-500 max-w-2xl">
                {`// The OctaneBrew Publishing Network`}
                <br />
                {activeCategoryId === 'all' 
                    ? "Discover stories from engineering, design, and culture."
                    : `Browsing transmissions in sector: ${activeCategoryDef?.label}`
                }
            </p>
          </div>
        </header>
       )}
      
       {/* Content Area */}
       <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
        {activeCategoryId === 'all' && filteredItems[0] && feedType === 'foryou' && (
            <div className="py-12">
                 <div className="mb-4 text-xs font-mono text-white uppercase tracking-wide border border-white w-fit px-2 py-0.5 font-bold">
                    Featured Transmission
                </div>
                <FeedCard item={filteredItems[0]} />
            </div>
        )}

        {((activeCategoryId === 'all' && feedType === 'foryou') ? filteredItems.slice(1) : filteredItems).map((item) => (
          <FeedCard key={item.postId} item={item} />
        ))}

         {filteredItems.length === 0 && (
             <div className="py-12 text-center text-gray-500 font-mono">
                 No transmissions found in sector {activeCategoryId}.
                 <Link href="/?category=all" className="block mx-auto mt-4 text-white underline hover:text-gray-300">
                     Return to All
                 </Link>
             </div>
         )}
      </div>

       {hasMore && (
        <div className="mt-12 text-center">
            <button 
                onClick={handleLoadMore}
                className="text-white hover:underline font-mono text-sm uppercase hover:text-gray-300"
            >
                Load Older Posts
            </button>
        </div>
       )}
    </div>
  );
}
