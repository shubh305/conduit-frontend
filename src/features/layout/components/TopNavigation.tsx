"use client";

import NextImage from "next/image";
import { Bell, Edit3, Menu, Compass } from "lucide-react";
import { WIP_LIMITS } from "@/lib/wip-limits";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getRootUrl } from "@/lib/utils";
import { UserNavWidget } from "./UserNavWidget";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/features/search/components/SearchInput";
import { useAuth } from "@/features/auth/AuthProvider";
import { useState, useEffect } from "react";

interface TopNavigationProps {
  onToggleSidebar?: () => void;
  onToggleRightSidebar?: () => void;
}

export function TopNavigation({ onToggleSidebar, onToggleRightSidebar }: TopNavigationProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isTechieCopy } = useThemeHelpers();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Local state for AI mode to allow toggling from anywhere
  const [isAiActive, setIsAiActive] = useState(false);

  // Sync with URL on search page
  useEffect(() => {
    const fromUrl = searchParams.get("semantic") === "true";
    if (pathname === "/search") {
      setIsAiActive(fromUrl);
    }
  }, [searchParams, pathname]);

  const isStudioRoute = pathname.startsWith("/studio");
  const showRightSidebarToggle = pathname === "/" || pathname.startsWith("/search");

  const getWriteLabel = () => {
    if (isCyberCopy) return "NEW_NODE";
    if (isSakuraCopy) return "新規ブログ";
    if (isRoninCopy) return "New Territory";
    if (isOctaneCopy) return "Initialize";
    if (isJournalCopy) return "New Entry";
    return "New Post";
  };

  const onAiToggle = () => {
    const next = !isAiActive;
    setIsAiActive(next);

    // If we're already on the search page, navigate to update the results
    if (pathname === "/search") {
      const newParams = new URLSearchParams(searchParams.toString());
      if (next) {
        newParams.set("semantic", "true");
      } else {
        newParams.delete("semantic");
      }
      router.push(`${pathname}?${newParams.toString()}`);
    }
  };

  const getNetworkStatus = () => {
    if (isCyberCopy) return "// NETWORK_ONLINE";
    if (isSakuraCopy) return "接続中";
    if (isRoninCopy) return "Path of the Warrior";
    if (isJournalCopy) return "— In Session";
    return null;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 border-b z-[150] flex items-center justify-between px-2 md:px-8 transition-colors duration-500",
        "bg-noir-nav border-noir-border backdrop-blur-xl",
        isTechieCopy && "border-none shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-shadow duration-500",
        isJournalCopy && "bg-[var(--journal-paper)] border-accent/20",

        "theme-header-accent",
      )}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={onToggleSidebar}
            className={cn(
              "p-2 rounded-md transition-colors text-foreground-muted hover:text-foreground hover:bg-noir-hover cursor-pointer",
              isStudioRoute ? "block" : "hidden md:block",
            )}
            style={{ borderRadius: "var(--theme-radius-md)" }}
          >
            <Menu size={20} />
          </button>
        )}

        {/* Brand Logo - Theme-aware */}
        <a href={getRootUrl()} className="flex items-center gap-2 group">
          <div
            className={cn(
              "w-8 h-8 flex items-center justify-center relative",
              config.fontFamily === "mono" ? "" : "transition-transform group-hover:-rotate-3",
            )}
          >
            <NextImage src="/logo.svg" alt="Conduit Logo" width={32} height={32} className="object-contain" />
            {isSakuraCopy && (
              <span className="absolute inset-0 flex items-center justify-center font-serif text-[10px] font-bold text-accent drop-shadow-sm select-none pointer-events-none">
                導
              </span>
            )}
          </div>
          <span
            className={cn(
              "font-bold tracking-tight hidden md:block text-foreground",
              config.fontFamily === "mono" ? "font-mono tracking-widest text-lg" : "font-serif italic text-xl",
            )}
          >
            {isSakuraCopy ? "コンジット" : isRoninCopy ? "浪人" : isJournalCopy ? "Journal" : "CONDUIT"}
          </span>
        </a>
        {/* Network Status - Cyber/Sakura/Ronin only */}
        {getNetworkStatus() && (
          <div
            className={cn(
              "font-mono text-xs text-accent tracking-widest animate-pulse hidden md:block ml-4",
              isRoninCopy && "font-serif italic text-accent/80 tracking-normal",
            )}
          >
            {getNetworkStatus()}
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-[180px] xs:max-w-[260px] sm:max-w-xs md:max-w-md lg:max-w-lg mx-2 hidden md:block">
        <SearchInput
          placeholder={isSakuraCopy ? "検索..." : isRoninCopy ? "Seek..." : isJournalCopy ? "Search..." : "Search..."}
          className={cn("w-full bg-transparent px-2", isRoninCopy ? "rounded-sm px-0" : "rounded-full")}
          isAiActive={isAiActive}
          onAiToggle={onAiToggle}
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {WIP_LIMITS.showWriteButton && (
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard?action=write")}
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground hover:bg-noir-hover px-2 md:px-4"
          >
            <Edit3 size={18} />
            <span
              className={cn(
                "text-xs tracking-wider hidden sm:inline",
                config.fontFamily === "mono" ? "font-mono" : "font-sans font-bold",
              )}
            >
              {getWriteLabel()}
            </span>
          </Button>
        )}

        {!WIP_LIMITS.showNotifications ? null : (
          <button className="transition-colors relative text-foreground-muted hover:text-foreground">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-signal-red rounded-full border border-noir-bg" />
          </button>
        )}

        {/* Right Sidebar Toggle (Mobile only) */}
        {user && showRightSidebarToggle && (
          <button
            onClick={onToggleRightSidebar}
            className="xl:hidden p-2 rounded-md transition-colors text-foreground-muted hover:text-foreground hover:bg-noir-hover cursor-pointer"
            style={{ borderRadius: "var(--theme-radius-md)" }}
            aria-label="Toggle Search and Discovery"
          >
            <Compass size={20} strokeWidth={1.5} />
          </button>
        )}

        <div className={cn("pl-2", user ? "hidden md:block" : "block")}>
          <UserNavWidget />
        </div>
      </div>
    </header>
  );
}
