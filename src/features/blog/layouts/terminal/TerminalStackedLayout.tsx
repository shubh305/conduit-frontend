"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { LayoutProps } from "../types";
import { cn, getMediaUrl } from "@/lib/utils";
import {
  TERMINAL_HOVER_CONTAINER,
  TERMINAL_HOVER_TEXT,
  TERMINAL_HOVER_TEXT_MUTED
} from "./styles";

/**
 * Terminal Stacked Layout
 */
export function TerminalStackedLayout({ posts, tenantSlug }: LayoutProps) {
  return (
    <div className="w-full h-full font-mono flex flex-col">
      {/* Command header */}
      <div className="border border-accent bg-black p-3 mb-6">
        <div className="flex items-center justify-between text-xs text-accent/70">
          <span>grep -r &quot;.*&quot; ./posts</span>
          <span>Found {posts.length} entries</span>
        </div>
      </div>

      {/* Stacked Cards Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pb-16">
        {posts.length === 0 ? (
          <div className="py-12 text-center text-accent/30 italic text-sm border border-dashed border-accent/20">
            [EMPTY_DIRECTORY] No posts found
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id} className="group relative">
              {/* Decorative connector line between posts */}
              {index !== posts.length - 1 && <div className="absolute left-4 -bottom-8 w-px h-8 bg-accent/20" />}

              <StackedPostCard post={post} tenantSlug={tenantSlug} />
            </div>
          ))
        )}
      </div>

      {/* Bottom prompt */}
      <div className="mt-8 pt-4 border-t border-accent/20 text-accent text-xs">
        <span className="animate-pulse">_Cursor waiting for input...</span>
      </div>
    </div>
  );
}

interface PostData {
  id: string;
  slug: string;
  title: string;
  publishedAt?: string;
  featuredImage?: string;
  readingTimeMinutes?: number;
  excerpt?: string;
  authorUsername?: string;
  likesCount?: number;
  commentsCount?: number;
  tags?: string[];
}

// Internal maximal card component for this layout
function StackedPostCard({ post, tenantSlug }: { post: PostData; tenantSlug: string }) {
  const postLink = `/${tenantSlug}/${post.slug}`;
  const imageUrl = getMediaUrl(post.featuredImage);

  const formattedDate = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return new Date(post.publishedAt || Date.now()).toLocaleDateString();
  }, [post.publishedAt]);

  const postYear = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return new Date(post.publishedAt || Date.now()).getFullYear();
  }, [post.publishedAt]);

  return (
    <Link
      href={postLink}
      className={cn(
        "block border border-accent p-1 transition-all relative overflow-hidden group mb-4",
        TERMINAL_HOVER_CONTAINER,
      )}
    >
      {/* Background Image (faded/grayscale) */}
      {imageUrl && (
        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none mix-blend-screen">
          <div
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          {/* CRT Scanline overlay for image */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
        </div>
      )}

      {/* Card Header (File path style) */}
      <div className="flex items-center justify-between bg-accent/10 p-2 mb-4 border-b border-accent/20 relative z-10 backdrop-blur-[2px] group-hover:bg-black/20 group-hover:border-black/10">
        <div className={cn("text-xs font-bold", TERMINAL_HOVER_TEXT)}>
          ./posts/{postYear}/{post.slug}.md
        </div>
        <div className={cn("text-[10px] uppercase", TERMINAL_HOVER_TEXT_MUTED)}>
          {post.readingTimeMinutes ? `${post.readingTimeMinutes} KB` : "4 KB"}
        </div>
      </div>

      <div className="px-4 pb-4 relative z-10">
        {/* Title */}
        <h2 className={cn("text-2xl md:text-3xl font-bold mb-3 drop-shadow-md", TERMINAL_HOVER_TEXT)}>{post.title}</h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className={cn(
              "text-sm md:text-base mb-4 leading-relaxed border-l-2 border-accent/20 pl-4 bg-black/40 p-2 backdrop-blur-sm",
              TERMINAL_HOVER_TEXT_MUTED,
            )}
          >
            {post.excerpt}
          </p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs font-mono border-t border-accent/10 pt-4 bg-black/40 p-2 group-hover:bg-transparent group-hover:border-black/10">
          <div>
            <span className={cn("block opacity-50 text-[9px] uppercase tracking-wider", TERMINAL_HOVER_TEXT_MUTED)}>
              Author
            </span>
            <span className={TERMINAL_HOVER_TEXT}>@{post.authorUsername || "root"}</span>
          </div>
          <div>
            <span className={cn("block opacity-50 text-[9px] uppercase tracking-wider", TERMINAL_HOVER_TEXT_MUTED)}>
              Date
            </span>
            <span className={TERMINAL_HOVER_TEXT}>{formattedDate}</span>
          </div>
          <div>
            <span className={cn("block opacity-50 text-[9px] uppercase tracking-wider", TERMINAL_HOVER_TEXT_MUTED)}>
              Tags
            </span>
            <span className={cn("truncate block", TERMINAL_HOVER_TEXT)}>
              {post.tags?.length ? post.tags.map((t: string) => `#${t}`).join(" ") : "none"}
            </span>
          </div>
          <div className="text-right">
            <span className={cn("block opacity-50 text-[9px] uppercase tracking-wider", TERMINAL_HOVER_TEXT_MUTED)}>
              Interaction
            </span>
            <span className={TERMINAL_HOVER_TEXT}>
              ♥ {post.likesCount || 0} | ◎ {post.commentsCount || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
