"use client";

import Link from "next/link";
import { cn, getPostUrl } from "@/lib/utils";
import { 
  TERMINAL_HOVER_CONTAINER, 
  TERMINAL_HOVER_TEXT, 
  TERMINAL_HOVER_TEXT_MUTED
} from "@/features/blog/layouts/terminal/styles";

export interface TerminalPostEntry {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string;
  readingTimeMinutes?: number;
  authorUsername?: string;
  likesCount?: number;
  commentsCount?: number;
  tags?: string[];
}

interface TerminalPostCardProps {
  post: TerminalPostEntry;
  tenantSlug: string;
  currentTenantSlug?: string;
  variant?: "full" | "compact" | "minimal";
  showExcerpt?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Terminal-style post card.
 * Displays posts as POSIX file entries (ls -la style)
 */
export function TerminalPostCard({
  post,
  tenantSlug,
  currentTenantSlug,
  variant = "full",
  showExcerpt = false,
  actions,
  className,
}: TerminalPostCardProps) {
  const date = new Date(post.publishedAt);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const size = post.readingTimeMinutes ? `${post.readingTimeMinutes * 1024}` : "4096";

  const permissions = "-rw-r--r--";
  const user = post.authorUsername || "root";

  const postLink = getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug);

  if (variant === "minimal") {
    return (
      <Link
        href={postLink}
        className={cn("block font-mono text-sm py-1 px-2 transition-colors group", TERMINAL_HOVER_CONTAINER, className)}
      >
        <span className={cn("font-bold", TERMINAL_HOVER_TEXT)}>{post.title}</span>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={postLink}
        className={cn(
          "grid grid-cols-[80px_60px_1fr] md:grid-cols-[100px_80px_1fr] gap-2 font-mono text-xs py-1.5 px-2 transition-colors items-center group",
          TERMINAL_HOVER_CONTAINER,
          className,
        )}
      >
        <span className={cn(TERMINAL_HOVER_TEXT_MUTED)}>{permissions}</span>
        <span className={cn(TERMINAL_HOVER_TEXT_MUTED)}>{size}</span>
        <span className={cn("font-bold truncate", TERMINAL_HOVER_TEXT)}>{post.title}</span>
      </Link>
    );
  }

  // Full variant
  return (
    <div className={cn("group", className)}>
      <Link
        href={postLink}
        className={cn(
          "grid grid-cols-1 md:grid-cols-[100px_minmax(60px,100px)_60px_140px_1fr_80px] gap-2 md:gap-4 font-mono text-xs py-2 px-2 transition-colors items-center",
          TERMINAL_HOVER_CONTAINER,
        )}
      >
        {/* Permissions */}
        <span className={cn("hidden md:block", TERMINAL_HOVER_TEXT_MUTED)}>{permissions}</span>

        {/* User */}
        <span className={cn("hidden md:block truncate text-accent/60", TERMINAL_HOVER_TEXT_MUTED)}>{user}</span>

        {/* Size */}
        <span className={cn("hidden md:block", TERMINAL_HOVER_TEXT_MUTED)}>{size}</span>

        {/* Date */}
        <span className={cn("hidden md:block", TERMINAL_HOVER_TEXT_MUTED)}>{dateStr}</span>

        {/* Title (Name) */}
        <span className={cn("font-bold truncate", TERMINAL_HOVER_TEXT)}>{post.title}</span>

        {/* Stats */}
        <span className={cn("text-[10px] hidden md:block text-right", TERMINAL_HOVER_TEXT_MUTED)}>
          {post.likesCount ?? 0}↑ {post.commentsCount ?? 0}💬
        </span>

        {/* Mobile metadata */}
        <div className={cn("md:hidden text-[10px] flex flex-wrap gap-2", TERMINAL_HOVER_TEXT_MUTED)}>
          <span>{dateStr}</span>
          <span>{user}</span>
          <span>{size}B</span>
        </div>
      </Link>

      {/* Excerpt as comment */}
      {showExcerpt && post.excerpt && (
        <div className="pl-4 text-[10px] text-foreground-muted/60 italic font-mono truncate">
          {`// ${post.excerpt}`}
        </div>
      )}

      {/* Actions slot */}
      {actions && <div className="pl-4 mt-1">{actions}</div>}
    </div>
  );
}
