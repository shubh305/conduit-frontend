"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PostContent } from "@/features/blog/components/PostContent";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { useSearchParams, useRouter } from "next/navigation";
import { cn, getMediaUrl, formatDate } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { useTableOfContents } from "@/features/blog/hooks/useTableOfContents";
import { TechieMoreFromAuthor } from "./techie/TechieMoreFromAuthor";

interface ArticleLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
  isPreview?: boolean;
}

export function TechieArticleLayout({ post, tenant, isPreview: isPreviewProp }: ArticleLayoutProps) {
  const router = useRouter();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { focusMode } = useTheme();
  const { isDarkMode } = useThemeHelpers();
  const searchParams = useSearchParams();
  const isPreview = isPreviewProp || searchParams.get("preview") === "true";

  const { toc, activeId, contentRef } = useTableOfContents(post.content);

  return (
    <main className="min-h-screen bg-noir-bg text-foreground pb-20 font-sans selection:bg-accent selection:text-noir-bg">
      {/* 
        ROW 1: HEADER 
      */}
      <div className="border-b border-white/10 bg-noir-bg">
        <div className="container mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Header Left: Content */}
            <div className="p-4 sm:p-8 lg:p-16 flex flex-col justify-center gap-6 sm:gap-8 relative overflow-hidden">
              {/* Background Grid Decoration */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-primary)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-noir-panel/50 rounded-sm border border-white/10 w-fit backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]" />
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
                  Transmission Recieved
                </span>
              </div>

              {!isPreview && (
                <button
                  onClick={() => router.push(`/${tenant.slug || tenant.id}`)}
                  className="lg:hidden inline-flex items-center gap-2 group text-[10px] font-mono text-accent hover:text-white transition-colors"
                >
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-black tracking-tighter italic uppercase text-xs">INDEX.SYS</span>
                  <span className="text-[8px] text-accent/40 tracking-[0.2em] opacity-50 uppercase truncate max-w-[150px]">
                    {tenant.name}
                  </span>
                </button>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-black leading-[1.1] tracking-tight text-white uppercase shadow-lg break-words">
                {post.title}
              </h1>

              {/* Author & Meta Block */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-t border-white/5 pt-6 sm:pt-8 mt-auto">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-noir-panel flex items-center justify-center border border-accent/20 group-hover:border-accent transition-colors z-10 relative">
                      <span className="font-mono font-bold text-accent text-lg">{post.authorName.charAt(0)}</span>
                    </div>
                    <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-accent/40 uppercase tracking-wider mb-0.5">Author</div>
                    <div className="text-sm font-sans font-bold text-white group-hover:text-accent/80 transition-colors uppercase">
                      {post.authorName}
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/5 hidden sm:block" />

                <div className="flex items-center gap-8 text-[10px] font-mono text-foreground/50">
                  <div>
                    <span className="text-accent/40 uppercase mr-2.5">Date:</span>
                    <span className="text-white/80">{formatDate(post.publishedAt)}</span>
                  </div>
                  <div>
                    <span className="text-accent/40 uppercase mr-2.5">Read:</span>
                    <span className="text-white/80">{post.readingTimeMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Right: Cover Image */}
            <div className="relative h-[200px] lg:h-auto border-l lg:border-l border-white/5 overflow-hidden group shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-noir-panel/20 z-10 group-hover:bg-transparent transition-colors duration-700" />

              {/* Tech HUD overlay */}
              <div className="absolute top-4 right-4 z-20 flex gap-1">
                <div className="w-1 h-1 bg-accent" />
                <div className="w-1 h-1 bg-accent/50" />
                <div className="w-1 h-1 bg-accent/20" />
              </div>
              <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-accent/50 tracking-widest">
                IMG_RAW: {post.postId.substring(0, 8)}
              </div>

              {post.featuredImage ? (
                <Image
                  src={getMediaUrl(post.featuredImage) || ""}
                  alt={post.title}
                  fill
                  className={cn(
                    "object-cover transition-all duration-1000 scale-100 group-hover:scale-105 opacity-80 group-hover:opacity-100",
                    isDarkMode && "grayscale-[20%] group-hover:grayscale-0",
                  )}
                />
              ) : (
                <div className="w-full h-full bg-noir-bg flex items-center justify-center">
                  <span className="font-mono text-noir-panel text-6xl font-bold opacity-20">NO_SIGNAL</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 
        ROW 2: CONTENT)
      */}
      <div className="container mx-auto max-w-[1800px] border-x border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] relative">
          {/* Sticky Sidebar (Left) */}
          <aside className="hidden lg:block border-r border-white/5 bg-noir-bg">
            <div className="sticky top-20 p-8 space-y-12">
              {/* Back Nav */}
              {!isPreview && (
                <button
                  onClick={() => router.push(`/${tenant.slug || tenant.id}`)}
                  className="group flex items-center gap-3 text-xs font-mono text-accent hover:text-white transition-colors text-left"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <span className="block font-black tracking-tighter italic uppercase text-sm">INDEX.SYS</span>
                    <span className="block text-[8px] text-accent/40 tracking-[0.2em] mt-0.5 opacity-50 uppercase">
                      {tenant.name}
                    </span>
                  </div>
                </button>
              )}

              {/* Related Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="border-l-2 border-accent/40 pl-4">
                  <h3 className="text-accent/60 font-mono text-[10px] uppercase font-bold mb-4 flex items-center gap-2 tracking-widest">
                    RELATED TAGS
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] text-foreground/40 hover:text-accent transition-colors block truncate hover:translate-x-1 duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Table of Contents */}
              {toc.length > 0 && (
                <div className="border-l-2 border-white/5 pl-4 hover:border-accent/40 transition-colors group/toc">
                  <h3 className="text-accent/60 font-mono text-[10px] uppercase font-bold mb-4 flex items-center gap-2 tracking-widest">
                    INDEX_PROTOCOL
                  </h3>
                  <nav className="flex flex-col gap-2">
                    {toc.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "font-mono text-[10px] truncate transition-all duration-300 block hover:translate-x-1 uppercase",
                          item.level === 3 && "pl-3",
                          activeId === item.id ? "text-accent font-black" : "text-foreground/30 hover:text-accent/80",
                        )}
                        onClick={e => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Metadata */}
              <div className="border-l-2 border-white/5 pl-4 hover:border-accent/40 transition-colors">
                <h3 className="text-accent/60 font-mono text-[10px] uppercase font-bold mb-4 flex items-center gap-2 tracking-widest">
                  METADATA
                </h3>
                <div className="space-y-3 text-[10px] font-mono text-foreground/50">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-accent/40 uppercase">ID</span>
                    <span className="font-bold text-white/80">{post.postId.substring(0, 8)}d</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-accent/40 uppercase">WORDS</span>
                    <span className="font-bold text-white/80">
                      {post.readingTimeMinutes ? Math.round(post.readingTimeMinutes * 230) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Content Area (Right) */}
          <div className="p-6 sm:p-12 lg:p-20 relative">
            <div
              ref={el => {
                contentRef.current = el;
              }}
              className={cn(
                "prose prose-invert prose-lg mx-auto transition-all duration-700",
                "prose-headings:font-sans prose-headings:font-black prose-headings:text-white prose-headings:tracking-tighter prose-headings:uppercase prose-headings:scroll-mt-24",
                "prose-p:text-foreground/80 prose-p:font-sans prose-p:leading-8 prose-p:text-lg prose-p:mb-8",
                "prose-a:text-accent prose-a:no-underline hover:prose-a:underline hover:prose-a:text-white prose-a:transition-colors",
                "prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:ml-0 prose-blockquote:text-xl prose-blockquote:font-sans prose-blockquote:not-italic prose-blockquote:text-white prose-blockquote:tracking-wide prose-blockquote:my-12",
                "prose-code:text-accent prose-code:bg-noir-panel/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm prose-code:border prose-code:border-white/10",
                "prose-pre:bg-noir-bg prose-pre:border prose-pre:border-white/5 prose-pre:rounded-sm prose-pre:p-6",
                "prose-li:marker:text-accent/50 prose-li:text-foreground/80",
                "prose-img:rounded-sm prose-img:border prose-img:border-white/5 prose-img:shadow-2xl",
                "prose-hr:border-white/5 prose-hr:my-16",
                focusMode ? "max-w-[1400px]" : "max-w-[800px]",
              )}
            >
              <PostContent content={post.content} />
            </div>

            <FeedActionBar
              postId={post.postId}
              slug={post.postSlug}
              tenantId={tenant.id}
              authorUsername={post.authorUsername}
              initialLikes={post.likesCount}
              initialComments={post.commentsCount}
              className={cn(
                "mt-20 border-t border-white/5 py-12 mx-auto opacity-80 transition-all duration-700",
                focusMode ? "max-w-[1400px]" : "max-w-[800px]",
              )}
              onCommentClick={() => setIsCommentsOpen(true)}
            />
          </div>
        </div>
      </div>

      <CommentSection
        postId={post.postId}
        tenantId={tenant.id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {!isPreview && (
        <TechieMoreFromAuthor currentPostId={post.postId} tenantSlug={tenant.slug || tenant.id} tenantId={tenant.id} />
      )}
    </main>
  );
}
