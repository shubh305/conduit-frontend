"use client";
import { getPostUrl } from "@/lib/utils";

import Link from "next/link";
import { Post } from "@/features/blog/types";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { getHeadingClasses, ThemeVariant, cardVariants } from "@/lib/theme-variants";
import { PostMeta, PostHeroImage, PostTags, PostAuthor, PostCardContent, PostActions } from "./PostCardParts";


interface BasePostCardProps {
  post: Post;
  tenantSlug: string;
  currentTenantSlug?: string;
  orientation?: "vertical" | "horizontal";
  reversed?: boolean;
  className?: string;
  imageClassName?: string;
  themeConfig?: {
    fontFamily?: "sans" | "serif" | "mono";
    showBio?: boolean;
    showreadTime?: boolean;
    showDate?: boolean;
    showExcerpt?: boolean;
    showTags?: boolean;
    showImage?: boolean;
    cardStyle?: "minimal" | "bordered" | "flat";
  };
}

export function BasePostCard({
  post,
  tenantSlug,
  currentTenantSlug,
  orientation = "horizontal",
  reversed = false,
  className,
  imageClassName,
  themeConfig,
}: BasePostCardProps) {
  const { theme, config } = useTheme();
  const { isRoninCopy, isCyberCopy, isTerminalCopy, isDarkMode } = useThemeHelpers();

  const isFlat = themeConfig?.cardStyle === "flat";
  const isMinimal = themeConfig?.cardStyle === "minimal";
  const postUrl = getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug);
  const themeVariant = theme as ThemeVariant;

  const data = {
    ...post,
    postId: post.id,
    tenantId: post.tenantId,
    tenantSlug: tenantSlug,
    tenantName: post.tenantName || "",
  };

  const isTechieCopy = theme === "techie";
  // Deterministic Score Generation for Techie Theme
  const score = isTechieCopy ? (((parseInt(post.id.substring(0, 8), 16) % 30) + 70) / 10).toFixed(1) : null;

  const baseHeadingClasses = getHeadingClasses(themeVariant);
  const flatSafeHeadingClasses = isFlat
    ? baseHeadingClasses
        .split(" ")
        .filter(cls => !cls.startsWith("text-"))
        .join(" ")
    : baseHeadingClasses;

  // =========================================================================
  // CARD LAYOUT (Vertical / Bento / Grid)
  // =========================================================================
  if (orientation === "vertical") {
    const themeRadius = isCyberCopy || isRoninCopy ? "rounded-none" : "rounded-xl";

    let v = isFlat
      ? {
          base: isTerminalCopy
            ? "bg-black text-accent"
            : isTechieCopy
              ? "bg-noir-panel/60 text-white"
              : "bg-black text-white",
          border: isCyberCopy ? "border border-accent/20" : "border-none",
          radius: themeRadius,
          hover: isCyberCopy ? "hover:border-accent/50" : isTechieCopy ? "hover:bg-noir-panel/80" : "",
        }
      : cardVariants[themeVariant] || cardVariants.classic;

    if (isTechieCopy && !isFlat) {
      v = {
        base: "bg-noir-panel/30 text-foreground/70 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        border: "border-none",
        radius: "rounded-xl",
        hover: "hover:bg-noir-panel/50 hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)]",
      };
    }

    return (
      <Link
        href={postUrl}
        className={cn(
          "group relative flex flex-col w-full h-full p-4 md:p-6 transition-all duration-300 overflow-hidden",
          v.base,
          v.border,
          v.radius,
          v.hover,
          theme === "journal" && !isFlat && "journal-page-curl",
          isRoninCopy && "ronin-ink-splatter",
          isFlat ? "justify-end" : "justify-between",
        )}
      >
        <PostHeroImage
          data={data}
          theme={themeVariant}
          isDarkMode={isDarkMode}
          isFlat={isFlat}
          className={imageClassName}
        />

        <PostCardContent isFlat={isFlat}>
          {isTechieCopy && (
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
              style={{
                backgroundImage: "radial-gradient(var(--accent) 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
          )}
          <div className="flex flex-col h-full relative z-10">
            <PostMeta data={data} theme={themeVariant} isFlat={isFlat} />

            <div className={cn("flex-1 flex flex-col", isFlat ? "justify-end" : "justify-start")}>
              {/* Techie Score Badge for Vertical Layout */}
              {isTechieCopy && (
                <div className="mb-2">
                  <span className="text-xs font-mono font-bold text-accent bg-accent/20 px-1.5 py-1 rounded-sm shadow-sm">
                    {score}
                  </span>
                </div>
              )}

              <h3
                className={cn(
                  "font-bold mb-4 leading-tight group-hover:text-white/80 transition-colors",
                  flatSafeHeadingClasses,
                  isFlat
                    ? isTechieCopy
                      ? "text-xl md:text-2xl flat-card-title line-clamp-1"
                      : "text-2xl md:text-3xl flat-card-title line-clamp-1"
                    : "text-xl md:text-2xl",
                  themeVariant === "octane" && "octane-header-accent",
                  themeVariant === "ronin" && "ronin-slash",
                  isTechieCopy && "text-white uppercase tracking-tight group-hover:text-accent/80",
                )}
              >
                {post.title}
              </h3>

              {(isFlat ? themeConfig?.showExcerpt !== false : themeConfig?.showExcerpt !== false) && (
                <p
                  className={cn(
                    "line-clamp-2 mb-4 font-medium",
                    isFlat ? "text-sm flat-card-excerpt" : "text-base text-foreground-muted",
                    isTechieCopy && "font-sans leading-relaxed text-sm opacity-80",
                  )}
                >
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto space-y-4">
                <PostTags data={data} theme={themeVariant} isFlat={isFlat} />
                <PostAuthor data={data} theme={themeVariant} isFlat={isFlat} />
                <PostActions data={data} isFlat={isFlat} />
              </div>
            </div>
          </div>
        </PostCardContent>

        {isCyberCopy && isFlat && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-accent/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-accent/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-accent/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-accent/60" />
            {/* Scanline / Texture Overlay */}
            <div className="absolute inset-0 bg-cyber-scanline opacity-[0.03]" />
          </div>
        )}
      </Link>
    );
  }

  // =========================================================================
  // ROW LAYOUT (Horizontal)
  // =========================================================================
  const contentOrder = reversed ? "md:order-last" : "";
  const imageOrder = reversed ? "md:order-first" : "";

  return (
    <Link
      href={postUrl}
      className={cn(
        "group grid grid-cols-1 gap-8 py-12 border-b items-start transition-colors relative overflow-hidden",
        !className?.includes("grid-cols") && (isMinimal ? "md:grid-cols-[1fr_180px]" : "md:grid-cols-[1fr_300px]"),
        isTerminalCopy
          ? "border-accent/20 hover:bg-black/50 font-mono text-accent p-6"
          : isCyberCopy
            ? "border-noir-border/50 hover:bg-noir-hover/50 p-6 border group-hover:border-accent/30 transition-all font-mono"
            : isTechieCopy
              ? "bg-noir-panel/30 text-foreground/70 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-none rounded-xl hover:bg-noir-panel/50 hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-all font-sans p-6"
              : "border-noir-border hover:bg-noir-hover -mx-4 px-4",
        isMinimal && "py-3 gap-6 overflow-visible",
        isRoninCopy && "hover:bg-transparent",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4 h-full min-w-0 justify-between z-10", contentOrder)}>
        <PostCardContent>
          <div className="flex flex-col h-full">
            <div>
              <PostMeta data={data} theme={themeVariant} />

              <div className="flex items-center gap-3 mt-1">
                {isTechieCopy && (
                  <span className="text-xs font-mono font-bold text-accent border border-accent px-1.5 py-0.5 rounded-sm">
                    {score}
                  </span>
                )}
                <h3
                  className={cn(
                    "font-bold group-hover:underline decoration-2 underline-offset-4 transition-all leading-tight",
                    isMinimal
                      ? "text-lg"
                      : isTerminalCopy
                        ? "text-2xl font-mono uppercase tracking-tight"
                        : isCyberCopy
                          ? "text-2xl font-mono uppercase tracking-wide group-hover:text-accent"
                          : isRoninCopy
                            ? "text-3xl font-serif ronin-slash"
                            : isTechieCopy
                              ? "text-2xl font-sans font-bold text-white uppercase tracking-tight group-hover:text-accent no-underline group-hover:no-underline"
                              : config.fontFamily === "serif"
                                ? "text-3xl font-serif"
                                : "text-3xl font-sans",
                  )}
                >
                  {post.title}
                </h3>
              </div>

              {themeConfig?.showExcerpt !== false && (
                <p
                  className={cn(
                    "leading-relaxed max-w-2xl mt-2",
                    isMinimal ? "line-clamp-2 text-xs opacity-70" : "line-clamp-3",
                    isTerminalCopy
                      ? "text-accent/80 font-mono text-xs uppercase border-l-2 border-accent/20 pl-4"
                      : isCyberCopy
                        ? "font-mono text-sm text-foreground-muted border-l border-accent/20 pl-4"
                        : isTechieCopy
                          ? "text-foreground/70 font-sans text-base leading-7"
                          : "text-lg text-foreground-muted",
                    config.fontFamily === "serif" && "font-serif italic",
                  )}
                >
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="mt-auto pt-4 space-y-4">
              <PostTags data={data} theme={themeVariant} />
              <PostActions data={data} />
            </div>
          </div>
        </PostCardContent>
      </div>

      <div className={cn("flex flex-col gap-6 shrink-0", isMinimal ? "w-full md:w-[180px]" : imageOrder)}>
        <div className="relative group/image">
          {isTechieCopy && (
            <div className="absolute inset-0 border border-accent/20 z-20 pointer-events-none group-hover/image:border-accent/50 transition-colors" />
          )}
          <PostHeroImage
            data={data}
            theme={themeVariant}
            isDarkMode={isDarkMode}
            className={cn(
              "aspect-[3/2] w-full",
              imageClassName,
              isTechieCopy && "grayscale-[30%] group-hover:grayscale-0 transition-all duration-500",
            )}
          />
        </div>

        {isMinimal && <PostActions data={data} className="mt-0 pt-2 border-none" compact={true} />}
      </div>
    </Link>
  );
}
