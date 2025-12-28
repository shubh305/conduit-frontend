"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { PostContent } from "@/features/blog/components/PostContent";
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { MoreFromAuthor } from "./MoreFromAuthor";
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
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isDarkMode } = useThemeHelpers();
  const searchParams = useSearchParams();
  const isPreview = isPreviewProp || searchParams.get("preview") === "true";

  return (
    <main
      className={cn(
        "min-h-screen text-foreground transition-all duration-700",
        isRoninCopy || isSakuraCopy ? "bg-transparent" : "bg-noir-bg",
      )}
    >
      {/* Immersive Header */}
      <div
        className={cn(
          "border-b border-noir-border min-h-[400px] md:min-h-[500px] flex flex-col relative justify-end pb-12 sm:pb-20 px-6 md:px-24 transition-all",
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

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {!isPreview && (
            <Link
              href={`/${tenant.slug || tenant.id}`}
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
            </Link>
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
              "text-4xl sm:text-6xl md:text-8xl font-black text-foreground mb-8 md:mb-12 leading-[0.9] tracking-tighter break-words max-w-5xl transition-all",
              isCyberCopy
                ? "font-display italic uppercase"
                : config.fontFamily === "serif"
                  ? "font-serif italic"
                  : "font-sans",
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
          </div>

          <FeedActionBar
            postId={post.postId}
            slug={post.postSlug}
            tenantId={tenant.id}
            authorUsername={post.authorUsername}
            initialLikes={post.likesCount}
            initialIsLiked={post.isLiked}
            initialComments={post.commentsCount}
            className="mt-10 border-t border-noir-border pt-6 w-full"
            onCommentClick={() => setIsCommentsOpen(true)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-0">
        <article
          className={cn("mx-auto py-12 md:py-32 transition-all duration-700", {
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
                      "px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest bg-noir-bg/60 text-foreground backdrop-blur-md hover:text-accent transition-all opacity-0 group-hover:opacity-100",
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
          />
        </div>
      )}
    </main>
  );
}
