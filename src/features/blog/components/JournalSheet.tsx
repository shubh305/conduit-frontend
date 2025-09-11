"use client"

import Image from "next/image"
import { Clock, ArrowLeft } from "lucide-react"
import { FeedActionBar } from "@/features/feed/components/FeedActionBar"
import { PostContent } from "@/features/blog/components/PostContent"
import { FeedItem } from "@/features/feed/types"
import { TiptapContent } from "@/features/blog/types"
import { cn, getMediaUrl } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface JournalSheetProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  isLoading?: boolean;
  onShowRecommendations?: () => void;
  onShowComments?: () => void;
  className?: string;
  disableInitialAnimation?: boolean;
  isStatic?: boolean;
}

export const JournalSheet = forwardRef<HTMLDivElement, JournalSheetProps>(
  (
    { post, isLoading = false, onShowRecommendations, onShowComments, className, disableInitialAnimation, isStatic },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 bg-[var(--journal-paper)] relative flex flex-col h-full shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] rounded-r-xl overflow-hidden",
          className,
        )}
      >
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply pointer-events-none z-10 bg-[url('/images/themes/journal-bg.png')] bg-cover" />
        <div className="absolute inset-0 opacity-[0.1] mix-blend-multiply pointer-events-none z-10 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        {/* Content Scroller */}
        <div
          className={cn(
            "flex-1 px-12 md:px-20 lg:px-32 pt-24 pb-20 selection:bg-accent/20 selection:text-foreground",
            isStatic ? "overflow-hidden" : "overflow-y-auto custom-scrollbar relative z-20",
          )}
        >
          {isLoading ? (
            /* Loading Skeleton (Pulsing) */
            <div className="max-w-5xl mx-auto opacity-50 animate-pulse">
              <div className="h-12 bg-black/10 w-2/3 mb-[2rem] rounded" />
              <div className="h-4 bg-black/10 w-1/4 mb-[3rem] rounded" />
              <div className="space-y-[1rem]">
                <div className="h-4 bg-black/5 w-full rounded" />
                <div className="h-4 bg-black/5 w-full rounded" />
                <div className="h-4 bg-black/5 w-3/4 rounded" />
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {/* Journal Navigation */}
              <div className="mb-12 flex items-center justify-between">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 group text-accent hover:text-journal-ink transition-colors font-serif italic"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm border-b border-accent/20 group-hover:border-journal-ink/40">
                    Back to Blog
                  </span>
                </button>

                <div className="text-[10px] uppercase tracking-[0.3em] text-accent/40 font-serif">
                  Sheet Ref: {post.postId?.substring(0, 8) || "00000000"}
                </div>
              </div>

              {/* Header Section */}
              <header className="mb-[1.5rem] relative">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent/5 border border-accent/10 rounded-sm text-[10px] uppercase tracking-widest font-serif text-accent/70 hover:bg-accent/10 transition-colors cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Retro Stamp Date */}
                <div className="absolute top-0 right-0 md:-right-4 rotate-3 z-20">
                  <div className="border-[3px] border-journal-accent/30 p-2 md:p-3 rounded-sm flex flex-col items-center bg-journal-paper shadow-sm font-serif min-w-[80px]">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-journal-accent/50 mb-1 border-b border-journal-accent/10 w-full text-center pb-1">
                      RECORDED
                    </span>
                    <div className="flex flex-col items-center leading-none py-1">
                      <span className="text-3xl font-black text-journal-ink">
                        {post.publishedAt ? new Date(post.publishedAt).getDate() : "--"}
                      </span>
                      <span className="text-xs uppercase font-bold text-journal-accent/80 mt-1">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleString("default", { month: "short" })
                          : "---"}
                      </span>
                      <span className="text-[9px] text-journal-accent/40 mt-1">
                        {post.publishedAt ? new Date(post.publishedAt).getFullYear() : "----"}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-[2rem] leading-[1.1] tracking-tight pr-40 md:pr-48 relative z-30">
                  {post.title}
                </h1>

                <div className="flex items-center gap-6 text-accent/80 font-serif italic text-base md:text-lg border-b border-accent/20 pb-[2rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground text-journal-paper flex items-center justify-center font-black not-italic shadow-md">
                      {post.authorName?.charAt(0) || "?"}
                    </div>
                    <span className="font-bold underline decoration-accent/30 underline-offset-4 cursor-pointer">
                      {post.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-accent" />
                    <span>{post.readingTimeMinutes} minute journey</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <motion.div
                  initial={disableInitialAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-[3rem] relative group"
                >
                  <div className="absolute -inset-2 bg-foreground/5 rounded-sm blur-xl transition-all group-hover:bg-foreground/10" />
                  <div className="relative aspect-[16/10] bg-foreground rounded-sm shadow-2xl overflow-hidden border-2 border-foreground">
                    <Image
                      src={getMediaUrl(post.featuredImage) || ""}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover opacity-90 transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent mix-blend-multiply opacity-50" />
                  </div>
                  {post.featuredImageAttribution && (
                    <p className="mt-[0.75rem] text-[10px] font-serif italic text-accent/60 text-right">
                      Photographed by: {post.featuredImageAttribution.name}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Article Content - The "Written Page" */}
              <article className="prose prose-stone prose-xl max-w-none font-serif text-foreground leading-loose mt-12 p-2 md:p-4 lg:p-6 rounded-sm prose-headings:font-bold prose-headings:text-foreground prose-headings:font-serif prose-p:mb-8 prose-img:rounded-sm prose-img:shadow-lg prose-img:border-4 prose-img:border-white prose-blockquote:border-l-4 prose-blockquote:border-accent/20 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground-muted prose-strong:text-foreground prose-strong:font-bold drop-shadow-sm">
                <PostContent content={post.content} />
              </article>

              {/* Post Footer / Navigation */}
              <footer className="mt-12 pt-8 border-t-2 border-accent/10 flex flex-col items-center pb-8 gap-8">
                <p className="font-serif italic text-accent/50 tracking-widest uppercase text-xs">
                  — End of Transcription —
                </p>

                {onShowRecommendations && (
                  <button
                    onClick={onShowRecommendations}
                    className="px-8 py-3 bg-foreground text-journal-paper font-serif italic hover:bg-accent transition-colors shadow-lg hover:shadow-xl rounded-sm flex items-center gap-2 group"
                  >
                    <span>More from {post.authorName}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                )}
              </footer>
            </div>
          )}
        </div>

        {/* Page Turning Indicator (Edge Shadow) */}
        <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/20 to-transparent shadow-[inset_-2px_0_0_rgba(0,0,0,0.1)]" />

        {/* Floating Vertical Action Bar - Right Edge Tab Style */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
          <div className="bg-journal-paper shadow-[2px_0_10px_rgba(0,0,0,0.1),inset_1px_0_0_rgba(255,255,255,0.8)] border-l border-y border-accent/10 py-6 px-3 rounded-l-xl flex items-center justify-center translate-x-1 group-hover:translate-x-0 transition-transform duration-500">
            <FeedActionBar
              postId={post.postId}
              slug={post.postSlug}
              authorUsername={post.authorUsername}
              initialLikes={post.likesCount}
              initialComments={post.commentsCount}
              initialIsLiked={post.isLiked}
              onCommentClick={onShowComments}
              layout="vertical"
              compact={true}
              className="mt-0 gap-8"
            />
          </div>
          {/* Tab Puller handle visual */}
          <div className="w-1 h-32 bg-accent/5 rounded-l-full absolute -left-1 opacity-40" />
        </div>
      </div>
    );
  },
);

JournalSheet.displayName = "JournalSheet"
