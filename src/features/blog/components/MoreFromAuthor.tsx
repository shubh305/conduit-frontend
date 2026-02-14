"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getMediaUrl, getPostUrl } from "@/lib/utils";
import Link from "next/link";
import { Hand, ArrowRight } from "lucide-react";
import { useThemeLabel } from "@/components/theme";
import { useMoreFromAuthor } from "@/features/blog/hooks/useMoreFromAuthor";

interface MoreFromAuthorProps {
  authorName: string;
  currentPostId: string;
  tenantSlug: string;
  tenantId: string;
  currentTenantSlug?: string;
  className?: string;
  gridClassName?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  compact?: boolean;
}

export function MoreFromAuthor({
  authorName,
  currentPostId,
  tenantSlug,
  tenantId,
  currentTenantSlug,
  className,
  gridClassName,
  hideHeader = false,
  hideFooter = false,
  compact = false,
}: MoreFromAuthorProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isJournalCopy, isDarkMode } = useThemeHelpers();
  const t = useThemeLabel();
  const { posts, isLoading } = useMoreFromAuthor(tenantId, currentPostId);

  if (isLoading) return null;
  if (posts.length === 0) return null;

  return (
    <div className={cn("py-12 md:py-24 border-t border-noir-border bg-noir-bg transition-all duration-700", className)}>
      <div className="container mx-auto px-2 md:px-6 max-w-7xl">
        {!hideHeader && (
          <div
            className={cn(
              "flex items-baseline justify-between border-b border-noir-border pb-2",
              compact ? "mb-6" : "mb-12",
            )}
          >
            <h3
              className={cn(
                "font-black uppercase tracking-tight",
                compact ? "text-lg" : "text-2xl",
                isCyberCopy
                  ? "text-accent font-display italic"
                  : isJournalCopy
                    ? "font-serif italic text-3xl font-normal tracking-normal normal-case"
                    : config.fontFamily === "serif"
                      ? "font-serif italic"
                      : "font-sans",
              )}
            >
              {isSakuraCopy
                ? `${authorName} の他の記事`
                : isJournalCopy
                  ? `More from ${authorName}`
                  : `More from ${authorName}`}
            </h3>
            <div className="font-mono text-[10px] text-foreground-subtle uppercase tracking-[0.4em] hidden sm:block opacity-40">
              {isSakuraCopy
                ? "推薦記録"
                : isCyberCopy
                  ? "DATA_RECALL_V09"
                  : isJournalCopy
                    ? "From the Archives"
                    : "Recommendations"}
            </div>
          </div>
        )}

        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10", gridClassName)}>
          {posts.map(post => {
            const href = getPostUrl({
              ...post,
              postSlug: post.slug,
              tenantSlug,
              authorUsername: post.authorUsername,
            });

            return (
              <Link
                key={post.id}
                href={href}
                className={cn(
                  "group block h-full",
                  isJournalCopy && "hover:-translate-y-1 transition-transform duration-500",
                )}
              >
                <article
                  className={cn(
                    "flex flex-col h-full transition-all shadow-lg overflow-hidden",
                    isJournalCopy
                      ? "bg-white/60 border border-black/5 hover:border-accent/40 hover:shadow-xl hover:bg-white/80"
                      : "bg-noir-panel/30 border border-noir-border hover:border-accent hover:shadow-accent/5",
                    compact ? "p-0 rounded-lg" : "p-1 rounded-xl",
                    isJournalCopy && "rounded-sm",
                  )}
                >
                  {/* Image */}
                  {post.featuredImage && (
                    <div
                      className={cn(
                        "relative bg-noir-bg transition-all duration-700 shrink-0 overflow-hidden",
                        compact ? "aspect-[30/12]" : "aspect-[21/9] sm:aspect-[16/10]",
                        isCyberCopy
                          ? "rounded-none"
                          : isJournalCopy
                            ? "rounded-sm border-b border-black/5"
                            : compact
                              ? "rounded-t-lg"
                              : "rounded-xl",
                      )}
                    >
                      <Image
                        src={getMediaUrl(post.featuredImage) || "/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className={cn(
                          "object-cover transition-all duration-700 group-hover:scale-110",
                          isDarkMode
                            ? "opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                            : isJournalCopy
                              ? "opacity-90 group-hover:opacity-100 sepia-[0.3]"
                              : "opacity-90 group-hover:opacity-100",
                        )}
                      />
                      {isJournalCopy && <div className="absolute inset-0 bg-journal-paper/10 mix-blend-multiply" />}
                    </div>
                  )}

                  {/* Content */}
                  <div className={cn("flex flex-col flex-1", compact ? "px-2 py-2" : "p-3 sm:p-5")}>
                    <div className={cn("flex items-center gap-2", compact ? "mb-1" : "mb-2 sm:mb-4")}>
                      <div
                        className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-[9px] font-bold border border-noir-border bg-noir-bg shadow-sm",
                          isCyberCopy ? "rounded-none" : "rounded-full",
                          isJournalCopy && "bg-white border-black/10 text-black font-serif",
                        )}
                      >
                        {post.authorName.charAt(0)}
                      </div>
                      <span
                        className={cn(
                          "text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-foreground-subtle group-hover:text-accent transition-colors",
                          isCyberCopy ? "font-mono" : isJournalCopy ? "font-serif text-black/60" : "font-sans",
                        )}
                      >
                        {post.authorName}
                      </span>
                    </div>

                    <h4
                      className={cn(
                        "font-bold leading-tight text-foreground transition-all group-hover:translate-x-1",
                        compact
                          ? "text-[10px] sm:text-sm mb-1 sm:mb-2 line-clamp-2"
                          : "text-xs sm:text-lg mb-2 sm:mb-3 line-clamp-2",
                        isCyberCopy
                          ? "font-mono uppercase tracking-tighter"
                          : isJournalCopy
                            ? "font-serif text-black/90 font-medium"
                            : config.fontFamily === "serif"
                              ? "font-serif italic"
                              : "font-sans",
                      )}
                    >
                      {post.title}
                    </h4>

                    {!compact && (
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs text-foreground-muted leading-relaxed opacity-80 flex-1 hidden xs:line-clamp-2 sm:line-clamp-3 mb-4",
                          config.fontFamily === "serif" ? "font-serif" : "font-sans",
                        )}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div
                      className={cn(
                        "flex items-center justify-between text-[7px] sm:text-[9px] font-mono text-foreground-subtle uppercase tracking-widest mt-auto",
                        compact
                          ? "pt-1 sm:pt-2 border-t border-noir-border/50"
                          : "pt-2 sm:pt-4 border-t border-noir-border",
                      )}
                    >
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className="flex items-center gap-1 sm:gap-1.5 hover:text-accent transition-colors">
                          <Hand size={10} className="opacity-50 sm:hidden" />
                          <Hand size={12} className="opacity-50 hidden sm:block" />
                          {post.likesCount || 0}
                        </span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 sm:gap-2 font-black transition-all group-hover:text-accent group-hover:gap-3">
                          {isSakuraCopy ? "次" : "SEE"} <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {!hideFooter && (
          <div className={cn("text-center", compact ? "mt-8" : "mt-20")}>
            <Link
              href={currentTenantSlug && tenantSlug === currentTenantSlug ? "/" : `/${tenantSlug}`}
              className={cn(
                "inline-flex items-center gap-3 border font-black uppercase tracking-[0.3em] transition-all shadow-xl hover:-translate-y-1",
                "bg-noir-panel border-noir-border text-foreground hover:border-accent hover:text-accent hover:shadow-accent/10",
                compact ? "px-6 py-3 text-[9px]" : "px-10 py-4 text-[10px]",
                isCyberCopy ? "rounded-none" : "rounded-full",
              )}
            >
              {t("accessAllFromAuthor").replace("{name}", authorName)}
              <ArrowRight size={14} className="animate-pulse" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Added Image import
import Image from "next/image";
