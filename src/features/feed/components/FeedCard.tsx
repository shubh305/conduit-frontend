"use client";

import Link from "next/link";
import { FeedItem } from "../types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { FeedActionBar } from "./FeedActionBar";

export function FeedCard({ item, className }: { item: FeedItem; className?: string }) {
  const { theme } = useTheme();

  // Date Format
  const dateFormatted = new Date(item.publishedAt).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric"
  });

  const cyberDateFormatted = new Date(item.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).toUpperCase();

  // ---------------------------------------------------------
  // CYBER THEME: Vertical "Bracket" Layout
  // ---------------------------------------------------------
  if (theme === 'cyber') {
    return (
      <Link 
        href={`/${item.tenantSlug}/${item.postSlug}`}
        className="group relative block w-full h-full p-6 border-r border-b border-white/10 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex flex-col gap-6 h-full">
          {/* Meta Header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wide">
             <span>{cyberDateFormatted}</span>
             <span>{item.tenantName}</span>
          </div>

          {/* Hero Image Section */}
          {item.featuredImage && (
            <div className="relative w-full aspect-video group-hover:scale-[1.01] transition-transform duration-500 ease-out">
               <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-500/50 z-20" />
               <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-500/50 z-20" />
               <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-500/50 z-20" />
               <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-500/50 z-20" />
               
               {/* Image Inner */}
               <div className="absolute inset-[4px] overflow-hidden bg-noir-bg border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.featuredImage} 
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
               </div>
            </div>
          )}

          {/* Title Section */}
          <div className="flex-1 flex flex-col justify-end">
             <h3 className="text-xl md:text-2xl font-sans font-bold text-white mb-4 leading-tight group-hover:text-signal-green transition-colors">
                {item.title}
             </h3>

             {/* Tags */}
             <div className="flex flex-wrap gap-2 mb-4">
               {item.tags.slice(0, 3).map(tag => (
                 <span key={tag} className="text-[10px] font-mono text-signal-green border border-signal-green/30 px-1.5 py-0.5 uppercase bg-signal-green/5">
                   #{tag}
                 </span>
               ))}
             </div>
             
             <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase mb-4">
                <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-signal-green transition-colors" />
                BY {item.authorName}
             </div>

             {/* Action Bar */}
             <FeedActionBar 
                 postId={item.postId} 
                 initialLikes={item.likesCount} 
                 initialComments={item.commentsCount}
                 className="pt-4 border-t border-white/5" 
             />
          </div>
        </div>
      </Link>
    );
  }

  // ---------------------------------------------------------
  // CLASSIC THEME: Noir Row Layout
  // ---------------------------------------------------------
  return (
    <Link 
      href={`/${item.tenantSlug}/${item.postSlug}`}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 py-12 border-b border-white/10 items-start hover:bg-white/[0.02] transition-colors",
        className
      )}
    >
      {/* LEFT COLUMN: Content */}
      <div className="flex flex-col gap-4 h-full justify-between">
        <div>
            {/* Meta Row */}
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-wide">
            <span>{dateFormatted}</span>
            </div>

            {/* Title */}
            <h3 className="font-sans text-3xl font-black text-white group-hover:underline decoration-2 underline-offset-4 transition-all leading-tight mt-2">
            {item.title}
            </h3>

            {/* Excerpt */}
            <p className="font-serif text-lg text-gray-400 line-clamp-3 leading-relaxed max-w-2xl mt-4">
            {item.excerpt}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs">
            {item.tags.map(tag => (
                <span key={tag} className="text-gray-500 group-hover:text-white uppercase transition-colors">#{tag}</span>
            ))}
            </div>
        </div>

        <FeedActionBar 
            postId={item.postId} 
            initialLikes={item.likesCount}
            initialComments={item.commentsCount} 
            className="md:max-w-xl"
        />
      </div>

      {/* RIGHT COLUMN: Image */}
      {item.featuredImage && (
        <div className="w-full aspect-[3/2] overflow-hidden bg-noir-bg border border-white/10 group-hover:border-white/30 transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.featuredImage} 
            alt={item.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
      )}
    </Link>
  );
}
