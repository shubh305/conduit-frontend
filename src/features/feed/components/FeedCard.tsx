"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FeedItem } from "../types";
import { cn, getPostUrl } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { ThemeVariant, cardVariants, getHeadingClasses } from "@/lib/theme-variants";
import { PostMeta, PostHeroImage, PostTags, PostAuthor, PostActions, PostCardContent } from "../../blog/components/base/PostCardParts";
import { TechieFeedCard } from "./TechieFeedCard"
import { JournalFeedCard } from "./JournalFeedCard"
import { RoninFeedCard } from "./RoninFeedCard"

const CARD_LAYOUT_THEMES = ["cyber", "sakura", "ronin", "octane", "journal", "techie"]

export function FeedCard({
  item,
  className,
  onRemove,
  variant = "default",
}: {
  item: FeedItem
  className?: string
  onRemove?: () => void
  variant?: "default" | "compact"
}) {
  const { theme, config } = useTheme()
  const { isDarkMode, isTerminalCopy, isTechieCopy, isJournalCopy, isRoninCopy } = useThemeHelpers()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isTechieCopy) {
    return <TechieFeedCard item={item} variant={variant} className={className} />
  }

  if (isJournalCopy) {
    return <JournalFeedCard item={item} variant={variant} className={className} />
  }

  if (isRoninCopy) {
    return <RoninFeedCard item={item} variant={variant} className={className} />
  }

  const postUrl = getPostUrl(item)
  const themeVariant = theme as ThemeVariant
  const useCardLayout = (CARD_LAYOUT_THEMES as readonly string[]).includes(theme)

  if (variant === "compact") {
    return (
      <CompactLayout
        item={item}
        className={className}
        postUrl={postUrl}
        theme={themeVariant}
        isDarkMode={isDarkMode}
        onRemove={onRemove}
      />
    )
  }

  if (useCardLayout) {
    return (
      <CardLayout
        item={item}
        className={className}
        postUrl={postUrl}
        theme={themeVariant}
        isDarkMode={isDarkMode}
        onRemove={onRemove}
      />
    )
  }

  return (
    <RowLayout
      item={item}
      className={className}
      postUrl={postUrl}
      theme={themeVariant}
      isTerminalCopy={isTerminalCopy}
      isDarkMode={isDarkMode}
      fontFamily={config.fontFamily}
      onRemove={onRemove}
    />
  )
}

function CompactLayout({
  item,
  className,
  postUrl,
  theme,
  isDarkMode,
  onRemove,
}: {
  item: FeedItem
  className?: string
  postUrl: string
  theme: ThemeVariant
  isDarkMode: boolean
  onRemove?: () => void
}) {
  const v = cardVariants[theme]

  return (
    <div
      className={cn(
        "group relative flex flex-row items-center gap-2 md:gap-4 p-2 md:p-4 transition-all duration-300 overflow-hidden w-full min-h-[90px] md:h-32",
        v.base,
        v.border,
        v.radius,
        v.hover,
        className,
      )}
    >
      {item.featuredImage && (
        <Link href={postUrl} className="shrink-0 w-24 md:w-32 h-24 md:h-full relative overflow-hidden rounded-md block">
          <PostHeroImage
            data={item}
            theme={theme}
            isDarkMode={isDarkMode}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 md:py-1">
        <div className="space-y-1">
          <PostMeta data={item} theme={theme} />
          <Link href={postUrl} className="block group/title">
            <h3
              className={cn(
                "text-sm md:text-lg font-bold leading-tight transition-colors line-clamp-2",
                getHeadingClasses(theme),
                "group-hover/title:text-accent",
              )}
            >
              {item.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-3 md:mt-auto w-full gap-4">
          <div className="truncate shrink-0">
            <PostAuthor data={item} theme={theme} />
          </div>
          <div className="ml-auto shrink-0 transition-transform active:scale-95">
            <PostActions
              data={item}
              onRemove={onRemove}
              compact
              className="border-none pt-0 mt-0 bg-accent/5 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full flex gap-3 md:gap-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardLayout({
  item,
  className,
  postUrl,
  theme,
  isDarkMode,
  onRemove,
}: {
  item: FeedItem;
  className?: string;
  postUrl: string;
  theme: ThemeVariant;
  isDarkMode: boolean;
  onRemove?: () => void;
}) {
  const v = cardVariants[theme];
  const { isRoninCopy, isJournalCopy, isOctaneCopy } = useThemeHelpers()

  if (isJournalCopy) {

    return (
      <div
        className={cn(
          "group relative block w-full h-full p-5 transition-all duration-300 overflow-hidden",
          v.base,
          v.border,
          v.radius,
          v.hover,
          isJournalCopy && "journal-page-curl",
          className,
        )}
      >
        <PostCardContent>
          <PostMeta data={item} theme={theme} />

          {item.featuredImage && (
            <Link href={postUrl} className="block mb-4">
              <PostHeroImage data={item} theme={theme} isDarkMode={isDarkMode} />
            </Link>
          )}

          <div className="flex-1 flex flex-col justify-end">
            <Link href={postUrl} className="block group/title">
              <h3
                className={cn(
                  "text-xl md:text-2xl font-bold mb-4 leading-tight transition-colors",
                  getHeadingClasses(theme),
                  "group-hover/title:text-accent",
                )}
              >
                {item.title}
              </h3>
            </Link>

            <PostTags data={item} theme={theme} />
            <PostAuthor data={item} theme={theme} />

            <div className="relative z-20">
              <PostActions data={item} onRemove={onRemove} />
            </div>
          </div>
        </PostCardContent>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative block w-full h-[400px] md:h-[440px] p-6 transition-all duration-300 overflow-hidden",
        v.base,
        v.border,
        v.radius,
        v.hover,
        isRoninCopy && "ronin-ink-splatter",
        className,
      )}
    >
      <Link href={postUrl} className="absolute inset-0 z-0" aria-label={item.title} />
      <PostCardContent>
        <div className="relative z-10 pointer-events-none">
          <PostMeta data={item} theme={theme} />
          {item.featuredImage && <PostHeroImage data={item} theme={theme} isDarkMode={isDarkMode} />}
        </div>
        <div className="flex-1 flex flex-col justify-end relative z-10 pointer-events-none">
          <h3
            className={cn(
              "text-xl md:text-2xl font-bold mb-4 leading-tight group-hover:text-accent transition-colors",
              getHeadingClasses(theme),
              isOctaneCopy && "octane-header-accent",
              isRoninCopy && "ronin-slash",
            )}
          >
            {item.title}
          </h3>
          <PostTags data={item} theme={theme} />
          <PostAuthor data={item} theme={theme} />
        </div>
        <div className="relative z-20">
          <PostActions data={item} onRemove={onRemove} />
        </div>
      </PostCardContent>
    </div>
  );
}

function RowLayout({
  item,
  className,
  postUrl,
  theme,
  isTerminalCopy,
  isDarkMode,
  fontFamily,
  onRemove,
}: {
  item: FeedItem
  className?: string
  postUrl: string
  theme: ThemeVariant
  isTerminalCopy: boolean
  isDarkMode: boolean
  fontFamily: string
  onRemove?: () => void
}) {
  const { config } = useTheme();
  return (
    <div
      className={cn(
        "group grid grid-cols-1 gap-8 py-12 border-b items-start transition-colors relative",
        item.featuredImage && "md:grid-cols-[1fr_300px]",
        isTerminalCopy
          ? "border-accent/20 hover:bg-black/50 font-mono text-accent"
          : "border-noir-border hover:bg-noir-hover",
        className,
      )}
    >
      <Link href={postUrl} className="absolute inset-0 z-0" aria-label={item.title} />

      <div className="flex flex-col gap-4 h-full justify-between relative z-10 pointer-events-none">
        <PostCardContent>
          <div>
            <PostMeta data={item} theme={theme} />
            <h3
              className={cn(
                "text-3xl font-black group-hover:underline decoration-2 underline-offset-4 transition-all leading-tight mt-2",
                isTerminalCopy ? "text-accent font-mono tracking-tight" : "text-foreground",
                !isTerminalCopy && (config.fontFamily === "serif" ? "font-serif" : "font-sans"),
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "text-lg line-clamp-3 leading-relaxed max-w-2xl mt-4",
                isTerminalCopy ? "text-accent/80 font-mono text-sm uppercase tracking-wide" : "text-foreground-muted",
                !isTerminalCopy && (config.fontFamily === "serif" ? "font-serif" : "font-sans"),
              )}
            >
              {item.excerpt}
            </p>
            <div className="mt-4">
              <PostTags data={item} theme={theme} />
            </div>
          </div>
          <div className="mt-auto relative z-20 pointer-events-auto">
            <PostActions data={item} onRemove={onRemove} />
          </div>
        </PostCardContent>
      </div>

      {item.featuredImage && (
        <div className="relative z-10 pointer-events-none">
          <PostHeroImage data={item} theme={theme} isDarkMode={isDarkMode} className="aspect-[3/2]" />
        </div>
      )}
    </div>
  );
}
