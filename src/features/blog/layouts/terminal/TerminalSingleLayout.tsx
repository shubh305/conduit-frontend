"use client";

import Link from "next/link";
import { LayoutProps } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getMediaUrl } from "@/lib/utils";

/**
 * Terminal Single Layout (single-row equivalent)
 * CLI Metaphor: `cat post.md | less`
 * 
 * Single featured post with navigation to prev/next.
 */
export function TerminalSingleLayout({ posts, tenantSlug }: LayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPost = posts[currentIndex];

  if (!currentPost) {
    return (
      <div className="w-full font-mono border border-accent/30 bg-black p-8 text-center text-accent/30">
        [NO_FILES_FOUND]
      </div>
    );
  }

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1;

  return (
    <div className="w-full h-full font-mono flex flex-col">
      {/* less-style header */}
      <div className="border border-accent bg-black p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-accent/70">
          <span>cat {currentPost.slug}.md | less</span>
          <span>
            {currentIndex + 1}/{posts.length}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="border border-accent/30 bg-black flex-1 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative overflow-hidden group mb-0">
         {/* Background Image (faded/grayscale) */}
         {getMediaUrl(currentPost.featuredImage) && (
           <div className="absolute inset-0 z-0 opacity-30 transition-opacity pointer-events-none mix-blend-screen">
               <div 
                 className="absolute inset-0 bg-cover bg-center grayscale"
                 style={{ backgroundImage: `url(${getMediaUrl(currentPost.featuredImage)})` }}
               />
               {/* CRT Scanline overlay for image */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
           </div>
         )}

         <div className="relative z-10 flex flex-col h-full">
        {/* File info header */}
        <div className="px-6 py-3 border-b border-accent/20 text-[10px] text-foreground-muted flex justify-between">
          <span>-rw-r--r-- root wheel {currentPost.readingTimeMinutes || 5}KB</span>
          <span>
            {new Date(currentPost.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Post content - scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
          <h1 className="text-4xl md:text-7xl font-bold text-accent uppercase tracking-tighter mb-10 leading-none">
            # {currentPost.title}
          </h1>

          {currentPost.excerpt && (
            <p className="text-foreground-muted text-base md:text-2xl leading-relaxed mb-12 max-w-6xl line-clamp-none opacity-80">
              {currentPost.excerpt}
            </p>
          )}

          {/* Author */}
          <div className="text-xs text-accent/60 mb-8">
            {`// Author: @${currentPost.authorUsername || "unknown"}`}
          </div>

          {/* Read link */}
          <Link
            href={`/${tenantSlug}/${currentPost.slug}`}
            className="inline-block border border-accent bg-accent/10 hover:bg-accent hover:text-black px-6 py-2 text-sm font-bold uppercase transition-colors"
          >
            [EXECUTE_READ]
          </Link>
        </div>

        {/* Navigation footer */}
        <div className="px-6 py-4 border-t border-accent/20 flex items-center justify-between mt-auto">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={!hasPrev}
            className="flex items-center gap-2 text-xs text-accent disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
          >
            <ChevronLeft size={14} />
            :prev
          </button>

          <div className="text-[10px] text-foreground-muted">
            Press n/p to navigate • q to quit
          </div>

          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!hasNext}
            className="flex items-center gap-2 text-xs text-accent disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
          >
            :next
            <ChevronRight size={14} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
