"use client";

import { cn, getMediaUrl } from "@/lib/utils";
import { ThemeVariant } from "@/lib/theme-variants";
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import Image from "next/image"

interface PostCardPartsProps {
  data: {
    title: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: string;
    authorName: string;
    authorUsername?: string;
    authorId?: string;
    tags: string[];
    readingTimeMinutes?: number;
    likesCount?: number;
    commentsCount?: number;
    tenantName?: string;
    tenantSlug?: string;
    id?: string;
    postId?: string;
    slug?: string;
    postSlug?: string;
    tenantId?: string;
    isLiked?: boolean;
    isFollowing?: boolean;
  };
  theme: ThemeVariant;
  isDarkMode?: boolean;
  isFlat?: boolean;
}

// =============================================================================
// Header
// =============================================================================

export function PostMeta({ data, theme, isFlat }: PostCardPartsProps) {
  const isCyber = theme === "cyber";
  const isSakura = theme === "sakura";
  const isRonin = theme === "ronin";
  const isOctane = theme === "octane";
  const isJournal = theme === "journal";
  const isTerminal = theme === "terminal";
  const isTechie = theme === "techie"

  const dateFormatted = new Date(data.publishedAt || new Date()).toLocaleDateString("en-US", {
    month: isSakura ? "long" : "short",
    day: "numeric",
    year: isTechie ? undefined : "numeric",
  });

  const prefix = isSakura ? "送信先" : isRonin ? "領 (Domain): " : isJournal ? "in " : "";
  const tenantName = data.tenantName || "";

  if (isTechie) {
    return (
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-foreground/50">
        <span className="text-accent-secondary">{dateFormatted}</span>
        <span>{"//"}</span>
        <span>{data.readingTimeMinutes || 5} MIN</span>
        {tenantName && (
          <>
            <span>{"//"}</span>
            <span className="text-foreground">{tenantName}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between text-[10px] uppercase tracking-wide",
        isFlat
          ? isCyber
            ? "text-accent/70"
            : "text-white/80"
          : isCyber
            ? "font-mono text-foreground-subtle"
            : isRonin
              ? "font-serif text-foreground-muted"
              : isOctane
                ? "font-sans text-accent font-semibold"
                : isJournal
                  ? "font-serif text-accent/60 italic tracking-normal lowercase flex items-center gap-2 mb-1"
                  : isTerminal
                    ? "font-mono text-accent/60 mb-2"
                    : "font-sans text-foreground-muted underline decoration-accent/20 underline-offset-4 mb-2",
      )}
    >
      <span>{dateFormatted}</span>
      {tenantName && !isCyber && (
        <span>
          {prefix}
          {tenantName}
        </span>
      )}
      {isFlat && data.readingTimeMinutes && <span>{data.readingTimeMinutes} MIN READ</span>}
    </div>
  );
}

// =============================================================================
// Hero Image
// =============================================================================

export function PostHeroImage({ data, theme, isDarkMode, isFlat, className }: PostCardPartsProps & { className?: string }) {
  if (!data.featuredImage) return null;

  const isCyber = theme === "cyber";
  const isSakura = theme === "sakura";
  const isRonin = theme === "ronin";
  const isOctane = theme === "octane";
  const isJournal = theme === "journal";
  const isTerminal = theme === "terminal";
  const isTechie = theme === "techie"

  const imgUrl = getMediaUrl(data.featuredImage);

  if (isFlat) {
    return (
      <div className={cn("absolute inset-0 z-0 bg-black", className)}>
        {/* Dual Orientation Gradient: Darkens top for meta/heading and bottom for author */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
        <Image
          src={imgUrl || ""}
          alt={data.title}
          fill
          className={cn(
            "object-cover transition-all duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-60",
            (isCyber || isTerminal || isRonin || isTechie) && "grayscale group-hover:grayscale-0",
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative w-full aspect-video transition-all duration-500 ease-out",
        (isSakura || isOctane || isJournal) && "rounded-lg overflow-hidden",
        isJournal && "shadow-[0_4px_20px_rgba(var(--accent-rgb),0.05)] border border-accent/5",
        isRonin && "overflow-hidden",
        className,
      )}
    >
      {/* Cyber Corner Accents*/}
      {isCyber && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-accent/30 z-20" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-accent/30 z-20" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-accent/30 z-20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-accent/30 z-20" />
        </>
      )}

      {/* Techie */}
      {isTechie && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,12,16,0)_50%,rgba(0,0,0,0.4)_100%),linear-gradient(90deg,rgba(var(--accent-rgb),0.06)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.06)_1px,transparent_1px)] bg-[length:100%_100%,20px_20px,20px_20px] pointer-events-none z-10 border-b border-noir-border" />
      )}

      <div
        className={cn(
          "absolute inset-[4px] overflow-hidden bg-noir-bg border border-noir-border transition-transform duration-500 group-hover:scale-[1.01]",
          (isSakura || isOctane || isTechie) && "inset-0 border-none",
          isOctane && "rounded",
        )}
      >
        <Image
          src={imgUrl || ""}
          alt={data.title}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            isDarkMode ? "opacity-80 group-hover:opacity-100" : "opacity-90 group-hover:opacity-100",
            (isCyber || isTerminal || isRonin || isTechie) && "grayscale group-hover:grayscale-0",
            isJournal && "sepia-[0.2] contrast-[1.05] brightness-[1.02] group-hover:sepia-0",
            isRonin && "ronin-image",
            isOctane && "octane-image",
            isTerminal && "contrast-125 brightness-90",
            isTechie && "grayscale-[30%] contrast-110",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

// =============================================================================
// Tag List
// =============================================================================

export function PostTags({ data, theme, isFlat }: PostCardPartsProps) {
  const isCyber = theme === "cyber";
  const isRonin = theme === "ronin";
  const isOctane = theme === "octane";
  const isJournal = theme === "journal";
  const isTerminal = theme === "terminal";
  const isTechie = theme === "techie"

  if (isTechie) {
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
        {data.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-[10px] text-accent-secondary font-mono lowercase hover:text-accent hover:underline transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {data.tags.slice(0, 3).map(tag => (
        <span
          key={tag}
          className={cn(
            "text-[10px] px-1.5 py-0.5 uppercase",
            isFlat
              ? "bg-white/20 text-white backdrop-blur-md border border-white/30"
              : isCyber
                ? "font-mono text-accent border border-accent/30 bg-accent/5"
                : isRonin
                  ? "font-serif text-accent border-b border-accent/30"
                  : isOctane
                    ? "font-sans text-accent border border-accent/60 bg-accent/5 font-semibold tracking-wider transition-colors hover:bg-accent hover:text-white"
                    : isJournal
                      ? "font-serif text-accent border-b border-accent/20 italic tracking-wide lowercase pt-0 pb-0.5 mb-1"
                      : isTerminal
                        ? "font-mono text-accent/60 group-hover:text-accent underline decoration-accent/30 mb-1"
                        : "font-sans font-bold text-accent uppercase tracking-wider bg-transparent p-0 border-0",
          )}
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

// =============================================================================
// Author Line
// =============================================================================

export function PostAuthor({ data, theme, isFlat }: PostCardPartsProps) {
  const isCyber = theme === "cyber";
  const isSakura = theme === "sakura";
  const isRonin = theme === "ronin";
  const isOctane = theme === "octane";
  const isJournal = theme === "journal";
  const isTerminal = theme === "terminal";
  const isTechie = theme === "techie"

  const prefix = isSakura ? "著者：" : isRonin ? "作者 (Author): " : isOctane ? "" : isJournal ? "by " : "BY ";
  
  if (isFlat) {
    return (
        <div className="flex items-center gap-2 text-[10px] uppercase text-white/80 font-bold tracking-widest mt-auto">
            <span>{data.authorName}</span>
        </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[10px] uppercase mb-4",
        isCyber
          ? "font-mono text-foreground-subtle"
          : isRonin
            ? "font-serif text-foreground-muted"
            : isOctane
              ? "font-sans text-foreground-muted font-medium tracking-wider"
              : isTerminal
                ? "font-mono text-accent/60"
                : isTechie
                  ? "font-mono text-accent-secondary"
                  : "font-sans text-foreground-muted",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 transition-colors",
          isCyber
            ? "bg-foreground-subtle group-hover:bg-accent"
            : isRonin
              ? "bg-accent"
              : isOctane
                ? "bg-accent-warm shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"
                : isTerminal
                  ? "bg-accent"
                  : isTechie
                    ? "bg-accent"
                    : "bg-accent rounded-full",
        )}
      />
      {prefix}
      {data.authorName}
    </div>
  )
}

// =============================================================================
// Post Actions (Liked, Comments)
// =============================================================================

export function PostActions({
  data,
  isFlat,
  className,
  compact,
  onRemove,
  interactive = { likes: false, comments: false, share: true, save: true, more: true },
  layout = "horizontal",
}: Omit<PostCardPartsProps, "theme"> & {
  className?: string
  compact?: boolean
  onRemove?: () => void
  interactive?: { likes?: boolean; comments?: boolean; share?: boolean; save?: boolean; more?: boolean }
  layout?: "horizontal" | "vertical"
}) {
  return (
    <FeedActionBar
      postId={data.postId || data.id || ""}
      slug={data.postSlug || data.slug || ""}
      tenantId={data.tenantId}
      authorUsername={data.authorUsername}
      authorId={data.authorId}
      initialLikes={data.likesCount || 0}
      initialIsLiked={data.isLiked}
      initialIsFollowing={data.isFollowing}
      initialComments={data.commentsCount || 0}
      interactive={interactive}
      compact={compact}
      layout={layout}
      onRemove={onRemove}
      className={cn("pt-4 border-t border-noir-border/30", isFlat && "border-white/20 text-white/90", className)}
    />
  );
}

// =============================================================================
// Card Root
// =============================================================================

export function PostCardContent({ isFlat, children }: { isFlat?: boolean; children: React.ReactNode }) {
    return (
        <div className={cn("flex flex-col gap-6 h-full", isFlat ? "justify-end relative z-20" : "")}>
            {children}
        </div>
    );
}
