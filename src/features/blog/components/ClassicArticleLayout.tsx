"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { PostContent } from "@/features/blog/components/PostContent";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { MoreFromAuthor } from "./MoreFromAuthor";
import { useSearchParams } from "next/navigation";
import { cn, getMediaUrl, formatDate } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";

interface ArticleLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
  isPreview?: boolean;
}

export function ClassicArticleLayout({ post, tenant, isPreview: isPreviewProp }: ArticleLayoutProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { config } = useTheme();
  const { isDarkMode } = useThemeHelpers();
  const searchParams = useSearchParams();
  const isPreview = isPreviewProp || searchParams.get("preview") === "true";

  const isProfessional = config.id === "professional";

  return (
    <main className="min-h-screen bg-noir-bg text-foreground pb-20 transition-all duration-700">
      {/* Editorial Header */}
      <div className="border-b border-noir-border py-6 bg-noir-panel/50 backdrop-blur-md sticky top-0 z-[40]">
        <div className="container mx-auto px-6 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            {!isPreview && (
              <Link
                href={`/${tenant.slug || tenant.id}`}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-subtle hover:text-accent transition-all group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>{isProfessional ? "BACK_TO_ARCHIVE" : "BACK TO BLOG"}</span>
              </Link>
            )}
            <div className="h-4 w-px bg-noir-border hidden sm:block" />
            <span className="font-mono text-[9px] text-foreground-subtle uppercase tracking-[0.3em] hidden sm:block">
              {tenant.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-foreground-subtle uppercase transition-all hidden md:block">
              {post.readingTimeMinutes} min pulse
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-4 md:mt-20 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <article className="feed-container">
          <header className="mb-8 md:mb-16 space-y-6 md:space-y-10">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-mono text-[8px] md:text-[9px] text-accent uppercase tracking-widest border border-accent/20 px-2.5 py-0.5 md:px-3 md:py-1 bg-accent/5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1
              className={cn(
                "text-3xl md:text-7xl font-black leading-[1.1] tracking-tighter text-foreground transition-all",
                config.fontFamily === "serif" ? "font-serif italic" : "font-sans",
              )}
            >
              {post.title}
            </h1>

            <div
              className={cn(
                "flex flex-col md:flex-row md:items-center gap-6 md:gap-12 border-l-2 md:border-l-4 border-accent pl-5 md:pl-8 py-1 md:py-2 transition-all",
                isProfessional ? "bg-noir-panel/30 mr-2 rounded-r-2xl" : "",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground-subtle text-[10px] uppercase font-mono tracking-widest">
                  {isProfessional ? "SIG_AUTHOR" : "Author"}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] text-accent font-bold">
                    {post.authorName.charAt(0)}
                  </div>
                  <span className="text-foreground font-bold text-sm">
                    {post.authorName}{" "}
                    <span className="text-xs text-foreground-subtle font-mono opacity-50">
                      (@{post.authorUsername})
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground-subtle text-[10px] uppercase font-mono tracking-widest">
                  Published
                </span>
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <Calendar size={14} className="opacity-40" />
                  {formatDate(post.publishedAt)}
                </div>
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
              className="border-t border-b border-noir-border py-6 shadow-sm"
              onCommentClick={() => setIsCommentsOpen(true)}
            />
          </header>

          {post.featuredImage && (
            <div
              className={cn(
                "w-full aspect-[21/9] bg-noir-panel border border-noir-border mb-20 overflow-hidden shadow-2xl transition-all duration-1000 hover:shadow-accent/5 relative group",
                isProfessional ? "rounded-3xl" : "rounded-xl",
              )}
            >
              <Image
                src={getMediaUrl(post.featuredImage) || ""}
                alt={post.title}
                fill
                className={cn(
                  "object-cover transition-all duration-1000 group-hover:scale-105",
                  isDarkMode && "opacity-80 grayscale-[30%] group-hover:grayscale-0",
                )}
              />
              {post.featuredImageAttribution && (
                <div className="absolute bottom-4 left-4 z-20">
                  <a
                    href={post.featuredImageAttribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-[8px] uppercase font-bold tracking-widest bg-noir-bg/60 text-foreground backdrop-blur-md hover:text-accent transition-all opacity-100 md:opacity-0 group-hover:opacity-100 rounded-full"
                  >
                    Photo by {post.featuredImageAttribution.name} on Unsplash
                  </a>
                </div>
              )}
            </div>
          )}

          <div
            className={cn(
              "max-w-3xl mx-auto transition-all",
              "prose prose-invert prose-lg md:prose-xl",
              "prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter",
              "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
              config.fontFamily === "serif"
                ? "prose-p:font-serif prose-p:leading-[1.9] prose-headings:font-serif"
                : "prose-p:font-sans",
            )}
          >
            <PostContent content={post.content} />
          </div>
        </article>
      </div>

      <CommentSection
        postId={post.postId}
        tenantId={tenant.id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {!isPreview && (
        <div className="mt-32 bg-noir-panel/20 border-t border-noir-border">
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
