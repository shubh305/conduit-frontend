"use client";

import { FeedItem } from "../types";
import { ThemePage } from "@/components/theme";
import { OctaneFeedCard } from "./OctaneFeedCard";
import { OctaneHero } from "./OctaneHero";

interface OctaneFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
}

export function OctaneFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText
}: OctaneFeedLayoutProps) {
  const featured = items[0];
  const gridItems = items.slice(1);

  return (
    <ThemePage className="min-h-screen bg-[#080808] text-white selection:bg-[#E65100] selection:text-white">
      {/* 1. Racing Header / Dashboard */}
      <header className="relative w-full border-b-4 border-[#333] bg-[#111] overflow-hidden">
        {/* Carbon Fiber Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 50% 50%, #222 1px, transparent 1px)`, 
               backgroundSize: '4px 4px' 
             }} 
        />
        {/* 4. Active Border Effect */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#E65100] group-hover:w-full transition-all duration-500 ease-out z-20" />
        
        <div className="max-w-[1800px] mx-auto px-6 py-12 md:py-16 relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="absolute inset-x-8 top-8 h-[2px] bg-[#333] flex justify-between">
            <div className="w-12 h-1 bg-[#E65100]" />
            <div className="w-1/2 h-[1px] bg-[#222]" />
            <div className="w-12 h-1 bg-[#333]" />
          </div>
          <div className="absolute bottom-8 right-8 text-[#E65100] font-mono text-xs tracking-widest animate-pulse">
            {"// SYSTEM_READY"}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <div className="w-12 h-2 bg-[#E65100] skew-x-[-20deg]" />
               <div className="w-4 h-2 bg-[#E65100]/50 skew-x-[-20deg]" />
               <div className="w-2 h-2 bg-[#333] skew-x-[-20deg]" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase font-sans text-white drop-shadow-lg">
              {blogTitle || "OCTANE_MAG"}
            </h1>
            <p className="text-[#999] font-mono text-sm uppercase tracking-[0.2em] flex items-center gap-4">
              <span className="text-[#E65100]">{"///"}</span>
              {blogDescription || "High Performance Journalism"}
            </p>
          </div>

          {/* RPM / Stats Detail */}
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-xs text-[#555]">
             <div className="flex items-center gap-2">
                <span>SYS.RPM</span>
                <span className="text-[#E65100] font-bold">8500</span>
             </div>
             <div className="flex items-center gap-2">
                <span>TURBO</span>
                <div className="w-24 h-1 bg-[#222] rounded-full overflow-hidden">
                   <div className="w-[80%] h-full bg-[#E65100]" />
                </div>
             </div>
             <div className="flex items-center gap-2">
                <span>TEMP</span>
                <span className="text-white">OPTIMAL</span>
             </div>
          </div>
        </div>
      </header>

      {/* 2. Main Grid */}
      <main className="max-w-[1800px] mx-auto w-full p-6 md:p-12 gap-12 flex flex-col">
         {featured && (
            <div className="w-full mb-8">
               <OctaneHero item={featured} />
            </div>
         )}
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {gridItems.map((item, idx) => (
               <div key={item.postId} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <OctaneFeedCard item={item} />
               </div>
            ))}
         </div>

         {/* 3. Load More / Pit Stop */}
         {hasMore && (
            <div className="mt-16 flex justify-center pb-20">
               <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="group relative px-16 py-5 bg-[#111] border border-[#333] text-white font-black italic uppercase tracking-widest skew-x-[-10deg] hover:bg-[#E65100] hover:border-[#E65100] hover:text-white transition-all duration-300"
               >
                  <div className="skew-x-[10deg] flex items-center gap-3">
                     {isLoadingMore ? (
                        <span>REFUELING...</span>
                     ) : (
                        <>
                           <span>{loadMoreText || "NEXT LAP"}</span>
                           <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </>
                     )}
                  </div>
               </button>
            </div>
         )}
      </main>
    </ThemePage>
  );
}
