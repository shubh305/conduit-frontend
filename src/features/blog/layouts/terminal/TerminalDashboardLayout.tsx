"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutProps } from "../types";
import { cn, getMediaUrl, getPostUrl } from "@/lib/utils";
import { 
  TERMINAL_HOVER_CONTAINER, 
  TERMINAL_HOVER_TEXT, 
  TERMINAL_HOVER_TEXT_MUTED,
  TERMINAL_HOVER_TEXT_ACCENT
} from "./styles";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Terminal Dashboard Layout (Magazine equivalent)
 * CLI Metaphor: `htop` / System Monitor
 * 
 * Bento-style panels showing posts as "processes" with simulated resource usage.
 * Matches the 4-column bento grid pattern from the standard Magazine layout.
 */
export function TerminalDashboardLayout({ posts, tenantSlug, currentTenantSlug }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Take current page posts for the dashboard
  const displayPosts = posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

  // Deterministic "resource" calculation from post ID
  const getMetrics = (id: string, index: number) => {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1) + index;
    return {
      cpu: ((hash % 30) + 5).toFixed(1),
      mem: ((hash % 20) + 2).toFixed(1),
      pid: 1000 + (hash % 9000),
    };
  };

  // Bento grid classes - matching Magazine layout's 4-column pattern
  const getGridClasses = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-1 md:row-span-2"; // Tall Left
      case 1:
        return "md:col-span-2 md:row-span-2"; // Big Hero Center
      case 2:
        return "md:col-span-1 md:row-span-1"; // Small Top Right
      case 3:
        return "md:col-span-1 md:row-span-2"; // Tall Right Sidebar
      case 4:
        return "md:col-span-2 md:row-span-1"; // Wide Bottom Left
      case 5:
        return "md:col-span-1 md:row-span-1"; // Small Bottom Middle
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono">
      {/* htop-style header bar */}
      <div className="border border-accent bg-black p-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex gap-6 text-accent">
            <span>CPU: [████████░░] 78%</span>
            <span>MEM: [██████░░░░] 62%</span>
            <span>SWP: [░░░░░░░░░░] 0%</span>
          </div>
          <div className="text-foreground-muted">Tasks: {posts.length} | Load: 0.42</div>
        </div>
      </div>

      {/* Bento Dashboard - 4 columns matching Magazine */}
      <div className="border border-accent/30 bg-black flex-1 p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] overflow-y-auto custom-scrollbar">
        {displayPosts.length === 0 ? (
          <div className="py-12 text-center text-accent/30 italic text-sm">[NO_PROCESSES_RUNNING]</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-full">
            {displayPosts.map((post, index) => {
              const metrics = getMetrics(post.id, index);
              const isLarge = [0, 1, 3].includes(index);
              const imageUrl = getMediaUrl(post.featuredImage);

              return (
                <Link
                  key={post.id}
                  href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
                  className={cn(
                    "group relative border border-accent/30 bg-black/80 p-4 transition-all flex flex-col overflow-hidden",
                    TERMINAL_HOVER_CONTAINER,
                    getGridClasses(index),
                  )}
                >
                  {/* Background Image (faded/grayscale) - only for large cards or if available */}
                  {imageUrl && (
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none mix-blend-screen">
                      <div
                        className="absolute inset-0 bg-cover bg-center grayscale"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      {/* CRT Scanline overlay for image */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Process header */}
                    <div
                      className={cn(
                        "flex items-center justify-between text-[10px] mb-2 shrink-0",
                        TERMINAL_HOVER_TEXT_ACCENT,
                      )}
                    >
                      <span>PID:{metrics.pid}</span>
                      <span>
                        CPU:{metrics.cpu}% MEM:{metrics.mem}%
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={cn(
                        "font-bold uppercase line-clamp-3",
                        isLarge ? "text-xl md:text-3xl mb-4" : "text-base mb-2",
                        TERMINAL_HOVER_TEXT,
                      )}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt (large cards only) */}
                    {isLarge && post.excerpt && (
                      <p className={cn("text-xs line-clamp-3 flex-1 overflow-hidden", TERMINAL_HOVER_TEXT_MUTED)}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div
                      className={cn(
                        "mt-auto pt-2 text-[10px] border-t border-accent/10 truncate shrink-0",
                        TERMINAL_HOVER_TEXT_ACCENT,
                      )}
                    >
                      ./conduit --serve {post.slug}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="border-x border-b border-accent/30 bg-accent/5 px-4 py-2 text-[10px] text-accent/60 flex items-center justify-between">
        <div className="flex gap-4">
          <span>F1:Help F2:Setup F3:Search F10:Quit</span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4 text-accent">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-1 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft size={10} /> PREV_PAGE
          </button>
          <span className="opacity-50">
            PAGE {currentPage + 1} OF {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 hover:text-white disabled:opacity-20"
          >
            NEXT_PAGE <ChevronRight size={10} />
          </button>
        </div>

        <span>Uptime: 420:69:42</span>
      </div>
    </div>
  );
}
