"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { getLabel } from "@/lib/theme/labels";
import { Button } from "@/components/ui/button";
import { useFollowUser } from "../hooks/useFollowUser";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMounted } from "@/hooks/use-mounted";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: "sm" | "default" | "lg";
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, className, onFollowChange, size = "default" }: FollowButtonProps) {
  const { theme } = useTheme();
  const { isCyberCopy, isTechieCopy } = useThemeHelpers();

  const {
    isFollowing,
    isLoading,
    toggleFollow,
  } = useFollowUser({
    userId,
    initialIsFollowing,
    onFollowChange,
  });

  const { user } = useAuth();
  const mounted = useMounted();

  const isClassic =
    !isCyberCopy &&
    !isTechieCopy &&
    theme !== "sakura" &&
    theme !== "ronin" &&
    theme !== "octane" &&
    theme !== "journal" &&
    theme !== "terminal";

  // Don't show follow button for self
  if (!mounted || (user && user.id === userId)) {
    return null;
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFollow();
      }}
      disabled={isLoading}
      size={size === "default" ? undefined : size}
      className={cn(
        "transition-all uppercase tracking-[0.2em] font-black shadow-xl",
        size === "sm" ? "text-[9px] h-7 px-3" : "text-[10px] h-9 px-6",
        isFollowing
          ? "bg-transparent border border-noir-border text-foreground hover:border-red-500 hover:text-red-500"
          : "bg-foreground text-noir-bg hover:bg-accent hover:shadow-accent/20",
        isClassic && size === "default" && "px-10 h-10",
        (isCyberCopy || isTechieCopy) && "rounded-none",
        isTechieCopy &&
          isFollowing &&
          "border-[var(--accent)]/50 text-[var(--accent)] hover:border-red-500 hover:text-red-500",
        isTechieCopy && !isFollowing && "bg-[var(--accent)] text-black hover:bg-white",
        isLoading && "opacity-70 cursor-wait",
        className,
      )}
    >
      {isLoading ? <Loader2 className="animate-spin w-3 h-3 mr-2" /> : null}
      {isFollowing ? getLabel("unfollowButton", theme) : getLabel("followButton", theme)}
    </Button>
  );
}
