"use client";

import Link from "next/link";
import { cn, getMediaUrl, getPostUrl } from "@/lib/utils";
import {
  TERMINAL_HOVER_CONTAINER,
  TERMINAL_HOVER_TEXT,
  TERMINAL_HOVER_TEXT_MUTED
} from "./styles";
import { LayoutProps } from "../types";

/**
 * Terminal Split Layout
 * CLI Metaphor: `tmux split-pane -h`
 *
 * True two-pane layout: left pane shows list of posts, right pane shows selected post preview.
 * Both panes are equal width for proper split view.
 */
export function TerminalSplitLayout({ posts, tenantSlug, currentTenantSlug }: LayoutProps) {
  return (
    <div className="w-full h-full font-mono flex flex-col gap-4">
      {/* tmux-style header */}
      <div className="border border-accent bg-black p-3 shrink-0">
        <div className="flex items-center justify-between text-xs text-accent/70">
          <span>tmux: [split-view] {posts.length} windows</span>
          <span>&quot;{tenantSlug}&quot;</span>
        </div>
      </div>

      {/* Zig-zag Split Panes - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-1">
        {posts.length === 0 ? (
          <div className="border border-accent/30 bg-black py-12 text-center text-accent/30 italic text-sm">
            [EMPTY_SESSION]
          </div>
        ) : (
          posts.map((post, index) => {
            const isReversed = index % 2 !== 0;
            const imageUrl = getMediaUrl(post.featuredImage);

            return (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[350px]">
                {/* Image Pane */}
                <div
                  className={cn(
                    "border border-accent/30 bg-black relative overflow-hidden group",
                    isReversed ? "md:order-2" : "md:order-1",
                  )}
                >
                  {/* Pane header */}
                  <div className="px-3 py-1 border-b border-accent/20 text-[9px] text-accent/40 flex justify-between absolute top-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm">
                    <span>[pane:{index}.0] image_preview</span>
                  </div>

                  {imageUrl ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 transition-opacity"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-accent/20 text-xs">
                      [NO_SIGNAL]
                    </div>
                  )}
                </div>

                {/* Text Pane */}
                <Link
                  href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
                  className={cn(
                    "border border-accent/30 bg-black p-6 flex flex-col relative group transition-all",
                    TERMINAL_HOVER_CONTAINER,
                    isReversed ? "md:order-1" : "md:order-2",
                  )}
                >
                  {/* Pane header */}
                  <div className="px-3 py-1 border-b border-accent/20 text-[9px] text-accent/40 flex justify-between absolute top-0 left-0 right-0 shrink-0">
                    <span>[pane:{index}.1] data_stream</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "---"}</span>
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-center">
                    <div className={cn("text-[10px] mb-2 shrink-0", TERMINAL_HOVER_TEXT_MUTED)}>
                      -rw-r--r-- root wheel
                    </div>
                    <h3
                      className={cn("text-xl md:text-2xl font-bold uppercase mb-4 leading-tight", TERMINAL_HOVER_TEXT)}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className={cn("text-xs md:text-sm line-clamp-3 leading-relaxed", TERMINAL_HOVER_TEXT_MUTED)}>
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "mt-auto pt-4 text-[10px] border-t border-accent/10 flex justify-between",
                      TERMINAL_HOVER_TEXT_MUTED,
                    )}
                  >
                    <span>@{post.authorUsername || "root"}</span>
                    <span>./view_post --id={post.id.slice(-4)}</span>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* tmux status bar */}
      <div className="border border-accent/30 bg-accent/5 px-4 py-1 text-[10px] text-accent/60 flex justify-between shrink-0">
        <span>^B d:detach ^B &quot;:split ^B %:vsplit</span>
        <span>conduit-session @ {tenantSlug}</span>
      </div>
    </div>
  );
}
