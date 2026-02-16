"use client";

import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Sparkles, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PostContent } from "@/features/blog/components/PostContent";
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { MoreFromAuthor } from "./MoreFromAuthor";
import { useBlogNavigation } from "@/features/blog/hooks/useBlogNavigation";
import { useSearchParams } from "next/navigation";
import { cn, getMediaUrl } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";

interface ArticleLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
  isPreview?: boolean;
}

export function CyberArticleLayout({ post, tenant, isPreview: isPreviewProp }: ArticleLayoutProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // New state
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isDarkMode } = useThemeHelpers();
  const searchParams = useSearchParams();
  const { navigateToBlogHome } = useBlogNavigation(tenant.slug);
  const isPreview = isPreviewProp || searchParams.get("preview") === "true";

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-700",
        isSakuraCopy ? "bg-[#fffafa] text-stone-900" : "bg-noir-bg text-foreground",
      )}
    >
      {/* Immersive Header */}
      <div
        className={cn(
          "border-b border-noir-border min-h-[300px] md:min-h-[350px] flex flex-col relative justify-end pb-12 sm:pb-16 px-8 md:px-20 transition-all",
          isSakuraCopy && "bg-gradient-to-br from-noir-bg via-noir-bg to-accent/10",
        )}
      >
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              "absolute top-20 right-[10%] w-[500px] h-[500px] blur-[150px] rounded-full transition-opacity opacity-20",
              isCyberCopy ? "bg-accent" : "bg-accent/40",
            )}
          />
          {isCyberCopy && (
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          )}
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto w-full py-8 md:py-24">
          {!isPreview && (
            <button
              onClick={navigateToBlogHome}
              className={cn(
                "flex items-center gap-2 mb-10 w-fit transition-all hover:text-accent group",
                isCyberCopy
                  ? "font-mono text-[10px] text-accent uppercase tracking-[0.3em]"
                  : "text-sm text-foreground-subtle",
              )}
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {isSakuraCopy
                ? "フィードに戻る"
                : isRoninCopy
                  ? "Return (帰還)"
                  : isCyberCopy
                    ? "BACK_TO_FEED"
                    : "Back to Blog"}
            </button>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className={cn(
                  "text-[9px] uppercase tracking-widest px-3 py-1 font-bold border transition-colors",
                  isCyberCopy
                    ? "font-mono text-accent border-accent/20 bg-accent/5"
                    : "font-sans text-foreground-subtle border-noir-border bg-noir-panel",
                )}
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1
            className={cn(
              "font-black text-foreground mb-8 md:mb-12 leading-[1.0] tracking-tighter break-words max-w-5xl transition-all",
              isCyberCopy
                ? "text-4xl sm:text-5xl md:text-6xl font-display italic uppercase"
                : config.fontFamily === "serif" || isRoninCopy
                  ? "text-4xl sm:text-5xl md:text-6xl font-serif italic"
                  : "text-4xl sm:text-5xl md:text-7xl font-sans",
              isRoninCopy && "md:text-6xl uppercase tracking-widest",
            )}
          >
            {post.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-noir-border pt-10 mt-10 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-foreground-subtle uppercase tracking-[0.2em]">
                {isSakuraCopy ? "著者" : isRoninCopy ? "Author (作者)" : "Author"}
              </span>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-7 h-7 flex items-center justify-center text-[10px] font-bold border border-noir-border bg-noir-panel shadow-sm",
                    isCyberCopy ? "rounded-none" : "rounded-full",
                  )}
                >
                  {post.authorName.charAt(0)}
                </div>
                <span
                  className={cn(
                    "text-foreground font-bold text-xs uppercase tracking-widest",
                    isCyberCopy ? "font-mono" : "font-sans",
                  )}
                >
                  {post.authorName}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-foreground-subtle uppercase tracking-[0.2em]">
                {isSakuraCopy ? "公開日" : isRoninCopy ? "Date (日付)" : "Published"}
              </span>
              <div className="flex items-center gap-2 text-foreground font-mono text-xs font-bold">
                <Calendar size={14} className="opacity-40" />
                {new Date(post.publishedAt).toLocaleDateString(isSakuraCopy ? "ja-JP" : "en-US")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-foreground-subtle uppercase tracking-[0.2em]">
                {isSakuraCopy ? "読了時間" : isRoninCopy ? "Time (時間)" : "Read Time"}
              </span>
              <div className="flex items-center gap-2 text-foreground font-mono text-xs font-bold uppercase tracking-widest">
                <Clock size={14} className="opacity-40" />
                {post.readingTimeMinutes} {isSakuraCopy ? "分" : "MIN"}
              </div>
            </div>

            {/* Summary Trigger */}
            <div className="flex flex-col gap-2 relative">
              <span className="text-[9px] font-mono text-foreground-subtle uppercase tracking-[0.2em]">
                {isSakuraCopy ? "AI要約" : "Intel"}
              </span>
              {post.summary ? (
                <>
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-widest group hover:text-white transition-colors cursor-pointer"
                  >
                    <Zap size={14} className="group-hover:fill-accent transition-all" />
                    <span>
                      {showSummary ? (isSakuraCopy ? "閉じる" : "CLOSING") : isSakuraCopy ? "表示" : "ACCESS"}
                    </span>
                  </button>
                </>
              ) : (
                <span className="text-xs text-foreground-subtle font-mono">--</span>
              )}
            </div>
          </div>

          <FeedActionBar
            postId={post.postId}
            slug={post.postSlug}
            tenantId={tenant.id}
            authorUsername={post.authorUsername}
            authorId={post.authorId}
            initialLikes={post.likesCount}
            initialIsLiked={post.isLiked}
            initialIsFollowing={post.isFollowing}
            initialComments={post.commentsCount}
            className="mt-10 border-t border-noir-border pt-6 w-full"
            onCommentClick={() => setIsCommentsOpen(true)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        <article
          className={cn("mx-auto py-12 md:py-32 px-8 md:px-20 transition-all duration-700", {
            "max-w-4xl": !useTheme().focusMode,
            "max-w-[1400px]": useTheme().focusMode,
          })}
        >
          {post.featuredImage && (
            <div
              className={cn(
                "w-full aspect-video border border-noir-border mb-20 relative overflow-hidden shadow-2xl transition-all duration-1000 group",
                isCyberCopy ? "rounded-none" : "rounded-3xl",
              )}
            >
              {/* Corner Accents for Cyber */}
              {isCyberCopy && (
                <>
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-accent/40 z-20 group-hover:w-12 group-hover:h-12 transition-all" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-accent/40 z-20 group-hover:w-12 group-hover:h-12 transition-all" />
                </>
              )}

              <Image
                src={getMediaUrl(post.featuredImage) || ""}
                alt={post.title}
                fill
                className={cn(
                  "object-cover transition-all duration-1000",
                  isCyberCopy || isSakuraCopy || isRoninCopy ? "grayscale group-hover:grayscale-0" : "",
                  isDarkMode ? "opacity-80 group-hover:opacity-100" : "opacity-95 group-hover:opacity-100",
                  "group-hover:scale-105",
                )}
              />
              {post.featuredImageAttribution && (
                <div className="absolute bottom-4 left-4 z-20">
                  <a
                    href={post.featuredImageAttribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest bg-noir-bg/60 text-foreground backdrop-blur-md hover:text-accent transition-all opacity-100 md:opacity-0 group-hover:opacity-100",
                      isCyberCopy ? "rounded-none border-l-2 border-accent" : "rounded-full",
                    )}
                  >
                    Photo by {post.featuredImageAttribution.name} on Unsplash
                  </a>
                </div>
              )}
            </div>
          )}

          <div
            className={cn(
              "prose prose-invert prose-lg md:prose-2xl max-w-none transition-all leading-relaxed text-foreground/90",
              "prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter",
              "prose-p:font-sans prose-p:leading-[1.8]",
              isCyberCopy
                ? "prose-headings:font-display prose-headings:uppercase prose-p:font-mono prose-a:text-accent"
                : "prose-a:text-accent prose-headings:font-sans",
              config.fontFamily === "serif" && "prose-p:font-serif prose-headings:font-serif italic",
            )}
          >
            <PostContent content={post.content} />
          </div>
        </article>
      </div>

      {/* Comments Drawer */}
      <CommentSection
        postId={post.postId}
        tenantId={tenant.id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {/* Recommendations */}
      {!isPreview && (
        <div className="bg-noir-panel/30 border-t border-noir-border">
          <MoreFromAuthor
            authorName={post.authorName}
            currentPostId={post.postId}
            tenantSlug={tenant.slug || tenant.id}
            tenantId={tenant.id}
            currentTenantSlug={tenant.slug}
          />
        </div>
      )}

      {/* AI Summary*/}
      <AnimatePresence>
        {showSummary && post.summary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummary(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(10px)" }}
              className={cn(
                "z-[101] p-10 backdrop-blur-2xl overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col",
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-[700px] max-h-[80vh]",
                isSakuraCopy
                  ? "bg-noir-bg/90 border border-stone-200 text-stone-900 rounded-3xl"
                  : "bg-noir-bg/90 border border-accent/40 text-white shadow-[0_0_60px_rgba(var(--accent-rgb),0.3)]",
                isCyberCopy && "rounded-none border-t-4 border-b-4",
                isRoninCopy && "rounded-3xl border-2",
              )}
            >
              {!isSakuraCopy && isCyberCopy && (
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen" />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className={cn("flex items-center gap-3", isSakuraCopy ? "text-stone-600" : "text-accent")}>
                    <Sparkles size={18} />
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">
                      {isSakuraCopy ? "AI要約データ" : "NEURAL_SYNTHESIS"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSummary(false)}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center transition-all rounded-full cursor-pointer",
                      isSakuraCopy
                        ? "text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                        : "text-accent/40 hover:text-accent hover:bg-accent/10 border border-accent/10",
                    )}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p
                  className={cn(
                    "text-base md:text-xl leading-relaxed italic border-l-2 pl-8 my-8 py-2",
                    isCyberCopy || isRoninCopy ? "font-mono" : "font-sans",
                    isSakuraCopy ? "border-stone-200 text-stone-800" : "border-accent/30 text-white/90",
                  )}
                >
                  {post.summary}
                </p>

                <div className="mt-12 flex justify-between items-center opacity-40">
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    {isSakuraCopy ? "人工知能によって生成" : "SYT_INTEL_STREAM"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {isSakuraCopy ? "完了" : "EXEC_DONE"}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
