"use client";

import Link from "next/link";
import { LayoutProps } from "../types";
import { cn, getMediaUrl, getPostUrl } from "@/lib/utils";
import {
  TERMINAL_HOVER_CONTAINER,
  TERMINAL_HOVER_TEXT,
  TERMINAL_HOVER_TEXT_MUTED
} from "./styles";

/**
 * Terminal Grid Layout
 * CLI Metaphor: `ls -la | column`
 *
 * Multi-column grid of terminal-style cards showing posts as file entries.
 */
export function TerminalGridLayout({ posts, tenantSlug, currentTenantSlug }: LayoutProps) {
  // Deterministic stats from post ID
  const getStats = (id: string, index: number) => {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1) + index;
    return {
      size: ((hash % 90) + 10) * 100,
      user: "root",
    };
  };

  return (
    <div className="w-full h-full font-mono flex flex-col">
      {/* Command header */}
      <div className="border border-accent bg-black p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-accent/70">
          <span>ls -la /posts | column -c 3</span>
          <span>total {posts.length}</span>
        </div>
      </div>

      {/* Multi-column grid of cards */}
      <div className="border border-accent/30 bg-black flex-1 overflow-y-auto custom-scrollbar p-4 shadow-[0_0_15px_rgba(34,197,94,0.05)] w-[98%] mx-auto">
        {posts.length === 0 ? (
          <div className="py-12 text-center text-accent/30 italic text-sm">[EMPTY_DIRECTORY]</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => {
              const stats = getStats(post.id, index);
              const imageUrl = getMediaUrl(post.featuredImage);

              return (
                <Link
                  key={post.id}
                  href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
                  // Dark background with border glow and shadow on hover - specific for cards
                  className={cn(
                    "group relative border border-accent/30 bg-black/80 p-6 transition-all flex flex-col min-h-[240px] overflow-hidden",
                    TERMINAL_HOVER_CONTAINER,
                  )}
                >
                  {/* Background Image (faded/grayscale) */}
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
                  {/* File metadata row */}
                  <div className={cn("flex items-center justify-between text-[10px] mb-2", TERMINAL_HOVER_TEXT_MUTED)}>
                    <span>-rw-r--r--</span>
                    <span>{stats.size}B</span>
                  </div>

                  {/* Title */}
                  <h3 className={cn("text-lg md:text-xl font-bold uppercase line-clamp-2 mb-3", TERMINAL_HOVER_TEXT)}>
                    {post.title}
                  </h3>

                  {/* Excerpt (truncated) */}
                  {post.excerpt && (
                    <p className={cn("text-[11px] line-clamp-2 flex-1", TERMINAL_HOVER_TEXT_MUTED)}>{post.excerpt}</p>
                  )}

                  {/* Footer */}
                  <div
                    className={cn(
                      "mt-auto pt-2 text-[10px] border-t border-accent/10 flex justify-between",
                      TERMINAL_HOVER_TEXT_MUTED,
                    )}
                  >
                    <span>@{post.authorUsername || "root"}</span>
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                          })
                        : "---"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom prompt */}
        <div className="mt-6 text-accent text-xs">
          <span className="animate-pulse">
            root@conduit:/posts$ <span className="inline-block w-2 h-3 bg-accent ml-1 align-middle" />
          </span>
        </div>
      </div>
    </div>
  );
}
