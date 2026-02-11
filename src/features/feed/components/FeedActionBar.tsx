"use client";

import { useLibrary } from "@/features/library/context/LibraryContext";
import { useTheme, useThemeHelpers, useLabels } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Bookmark, Heart, MessageCircle, Share, MoreHorizontal, Hand, UserPlus, UserMinus, Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { likePost, unlikePost } from "../api";
import { SaveToListMenu } from "@/features/lists/components/SaveToListMenu";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMounted } from "@/hooks/use-mounted";
import { useFollowUser } from "@/features/profile/hooks/useFollowUser";

interface FeedActionBarProps {
  postId: string;
  slug: string;
  tenantId?: string;
  authorUsername?: string;
  authorId?: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  initialComments?: number;
  initialIsFollowing?: boolean;
  className?: string;
  onCommentClick?: () => void;
  onRemove?: () => void;
  interactive?: boolean | { likes?: boolean; comments?: boolean; share?: boolean; save?: boolean; more?: boolean };
  compact?: boolean;
  layout?: "horizontal" | "vertical";
}

export function FeedActionBar({
  postId,
  slug,
  tenantId,
  authorUsername,
  authorId,
  initialLikes = 0,
  initialIsLiked = false,
  initialComments = 0,
  initialIsFollowing = false,
  className,
  onCommentClick,
  onRemove,
  interactive = true,
  compact = false,
  layout = "horizontal",
}: FeedActionBarProps) {
  const { user } = useAuth();
  const isInteractive = (key: keyof Exclude<FeedActionBarProps["interactive"], boolean | undefined>) => {
    if (typeof interactive === "boolean") return interactive;
    return interactive[key] !== false;
  };

  const { theme } = useTheme();
  const { isCyberCopy } = useThemeHelpers();
  const { getLabel } = useLabels();
  const { isPostSaved } = useLibrary();
  const mounted = useMounted();

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const { isFollowing, toggleFollow } = useFollowUser({
    userId: authorId || "",
    initialIsFollowing: initialIsFollowing,
  });

  const isSaved = isPostSaved(postId);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInteractive("likes")) return;

    const previousLiked = isLiked;
    const previousLikes = likes;

    setIsLiked(prev => !prev);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await unlikePost(postId, tenantId);
      } else {
        await likePost(postId, tenantId);
      }
    } catch {
      setIsLiked(previousLiked);
      setLikes(previousLikes);
      toast.error("Failed to update like");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/u/${authorUsername || "user"}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const getIconStyles = (key: keyof Exclude<FeedActionBarProps["interactive"], boolean | undefined>) => {
    const active = isInteractive(key);
    return cn(
      "flex items-center gap-1.5 focus:outline-none transition-all duration-300",
      active ? "cursor-pointer hover:text-accent/80 active:scale-95" : "cursor-default",
    );
  };

  const iconActive = "text-accent";
  const isVertical = layout === "vertical";

  return (
    <div
      className={cn(
        "flex",
        isVertical ? "flex-col items-center justify-center gap-6" : "items-center justify-between gap-3 md:gap-6 mt-4",
        compact && "mt-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          isVertical ? "flex-col items-center gap-6" : "items-center",
          compact ? "gap-2.5 md:gap-3" : "gap-4 md:gap-6",
        )}
      >
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className={cn(
            getIconStyles("likes"),
            isLiked ? iconActive : "text-foreground-subtle",
            isVertical && "flex-col gap-1.5",
          )}
        >
          {mounted && isCyberCopy ? (
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "scale-110" : ""} />
          ) : mounted && theme === "journal" ? (
            <Heart
              size={20}
              fill={isLiked ? "currentColor" : "none"}
              className={cn("text-journal-accent", isLiked ? "scale-110" : "")}
            />
          ) : (
            <Hand size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "scale-110" : ""} />
          )}
          <span className={cn("text-xs font-mono", theme === "journal" && "font-serif italic text-journal-accent")}>
            {likes}
          </span>
        </button>

        {/* Comments */}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (isInteractive("comments")) onCommentClick?.();
          }}
          className={cn(getIconStyles("comments"), "text-foreground-subtle", isVertical && "flex-col gap-1.5")}
        >
          <MessageCircle size={20} className={theme === "journal" ? "text-journal-accent" : ""} />
          <span className={cn("text-xs font-mono", theme === "journal" && "font-serif italic text-journal-accent")}>
            {initialComments}
          </span>
        </button>
      </div>

      <div
        className={cn(
          "flex",
          isVertical ? "flex-col items-center gap-6" : "items-center",
          compact ? "gap-4 md:gap-5" : "gap-6 md:gap-8",
        )}
      >
        {/* Share */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild disabled={!isInteractive("share")}>
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(getIconStyles("share"), "text-foreground-subtle")}
            >
              <Share size={20} className={theme === "journal" ? "text-journal-accent" : ""} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isVertical ? "center" : "end"}
            side={isVertical ? "right" : "bottom"}
            className="bg-noir-panel border-noir-border text-foreground"
            style={{ borderRadius: isCyberCopy ? "0" : "var(--theme-radius-md)" }}
          >
            <DropdownMenuItem
              onClick={handleShare}
              className="focus:bg-accent/10 focus:text-accent cursor-pointer text-xs uppercase font-mono tracking-widest"
            >
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save */}
        <SaveToListMenu
          postId={postId}
          trigger={
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(getIconStyles("save"), isSaved ? iconActive : "text-foreground-subtle")}
            >
              <Bookmark
                size={20}
                fill={isSaved ? "currentColor" : "none"}
                className={theme === "journal" ? "text-journal-accent" : ""}
              />
            </button>
          }
        />

        {/* More Options */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild disabled={!isInteractive("more")}>
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(getIconStyles("more"), "text-foreground-subtle")}
            >
              <MoreHorizontal size={20} className={theme === "journal" ? "text-journal-accent" : ""} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isVertical ? "center" : "end"}
            side={isVertical ? "right" : "bottom"}
            className="bg-noir-panel border-noir-border text-foreground"
            style={{ borderRadius: isCyberCopy ? "0" : "var(--theme-radius-md)" }}
          >
            {user && authorId && user.id !== authorId && (
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFollow();
                }}
                className="focus:bg-accent/10 focus:text-accent cursor-pointer text-xs uppercase font-mono tracking-widest gap-2"
              >
                {isFollowing ? <UserMinus size={14} /> : <UserPlus size={14} />}
                {isFollowing ? getLabel("unfollowButton") : getLabel("followButton")}
              </DropdownMenuItem>
            )}
            {onRemove && (
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-xs uppercase font-mono tracking-widest text-red-500"
              >
                Remove from list
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                toast.success("Report submitted. We will review this shortly.");
              }}
              className="focus:bg-accent/10 focus:text-accent cursor-pointer text-xs uppercase font-mono tracking-widest gap-2"
            >
              <Flag size={14} />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
