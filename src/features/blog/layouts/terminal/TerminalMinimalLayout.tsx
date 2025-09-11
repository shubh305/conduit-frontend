"use client";

import Link from "next/link";
import { cn, getMediaUrl } from "@/lib/utils";
import { 
  TERMINAL_HOVER_CONTAINER, 
  TERMINAL_HOVER_TEXT, 
  TERMINAL_HOVER_TEXT_MUTED
} from "./styles";
import { LayoutProps } from "../types";

/**
 * Terminal Minimal Layout
 * CLI Metaphor: `ls -1` (single column, more info than just names)
 * 
 * Clean stacked list showing title, date, author - minimal but informative.
 */
export function TerminalMinimalLayout({ posts, tenantSlug }: LayoutProps) {
  return (
    <div className="w-full h-full font-mono flex flex-col">
      {/* Command header */}
      <div className="border border-accent bg-black p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-accent/70">
          <span>ls -1 /posts</span>
          <span>{posts.length} items</span>
        </div>
      </div>

      {/* Stacked minimal list */}
      <div className="border border-accent/30 bg-black flex-1 overflow-y-auto custom-scrollbar shadow-[0_0_15px_rgba(34,197,94,0.05)]">
        {posts.length === 0 ? (
          <div className="py-12 text-center text-accent/30 italic text-sm">
            [EMPTY]
          </div>
        ) : (
          <div className="divide-y divide-accent/10">
            {posts.map((post, index) => {
              const imageUrl = getMediaUrl(post.featuredImage);
              return (
                <Link
                  key={post.id}
                  href={`/${tenantSlug}/${post.slug}`}
                  className={cn("block px-6 py-4 group relative overflow-hidden", TERMINAL_HOVER_CONTAINER)}
                >
                   {/* Background Image (faded/grayscale) on Hover */}
                   {imageUrl && (
                     <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none mix-blend-screen">
                         <div 
                           className="absolute inset-0 bg-cover bg-center grayscale"
                           style={{ backgroundImage: `url(${imageUrl})` }}
                         />
                         {/* CRT Scanline overlay for image */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                     </div>
                   )}
                  
                  <div className="relative z-10">
                {/* Row with metadata */}
                <div className="flex items-start gap-4">
                  {/* Index number */}
                  <span className={cn("text-xs font-mono w-6 shrink-0 pt-0.5", TERMINAL_HOVER_TEXT_MUTED)}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className={cn("text-foreground transition-colors font-bold uppercase truncate mb-1", TERMINAL_HOVER_TEXT)}>
                      {post.title}
                    </h3>

                    {/* Metadata row */}
                    <div className={cn("flex items-center gap-4 text-[11px]", TERMINAL_HOVER_TEXT_MUTED)}>
                      <span>@{post.authorUsername || "root"}</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })
                          : "---"}
                      </span>
                      {post.readingTimeMinutes && (
                        <span>{post.readingTimeMinutes}min</span>
                      )}
                    </div>

                    {/* Optional excerpt */}
                    {post.excerpt && (
                      <p className={cn("text-[11px] mt-2 line-clamp-1", TERMINAL_HOVER_TEXT_MUTED)}>
                        {`// ${post.excerpt}`}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className={cn("text-[10px] shrink-0 text-right", TERMINAL_HOVER_TEXT_MUTED)}>
                    {post.likesCount !== undefined && (
                      <div>♥ {post.likesCount}</div>
                    )}
                    {post.commentsCount !== undefined && (
                      <div>◯ {post.commentsCount}</div>
                    )}
                  </div>
                </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom prompt */}
        <div className="px-6 py-3 text-accent text-xs border-t border-accent/20">
          <span className="animate-pulse">
            $ <span className="inline-block w-2 h-3 bg-accent ml-1 align-middle" />
          </span>
        </div>
      </div>
    </div>
  );
}
