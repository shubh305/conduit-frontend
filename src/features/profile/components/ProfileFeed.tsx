"use client";

import { FeedItem } from "@/features/feed/types";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProfileFeedProps {
  posts: FeedItem[];
}

export function ProfileFeed({ posts }: ProfileFeedProps) {
  const [activeTab, setActiveTab] = useState<'published' | 'about'>('published');

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* Left Column (Main Feed) */}
      <div className="flex-1">
         {/* Tabs */}
         <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('published')}
              className={cn(
                "pb-4 text-sm font-mono uppercase tracking-wider transition-colors whitespace-nowrap",
                activeTab === 'published' 
                  ? "border-b-2 border-white text-white" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              Transmissions ({posts.length})
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={cn(
                "pb-4 text-sm font-mono uppercase tracking-wider transition-colors whitespace-nowrap",
                activeTab === 'about'
                  ? "border-b-2 border-white text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              About
            </button>
         </div>

         {activeTab === 'published' ? (
           <div className="space-y-8">
             {posts.map(post => (
               <FeedCard key={post.postId} item={post} />
             ))}
             {posts.length === 0 && (
               <div className="p-12 border border-dashed border-white/10 text-center text-gray-500 font-mono text-sm">
                  NO_DATA_AVAILABLE
               </div>
             )}
           </div>
         ) : (
           <div className="p-8 border border-white/10 bg-white/5 font-mono text-gray-400 text-sm">
              User identity details restricted.
           </div>
         )}
      </div>
    </div>
  );
}
