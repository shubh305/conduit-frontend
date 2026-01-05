"use client";

import Link from "next/link";
import { Bell, Edit3, Menu, Compass } from "lucide-react";
import { WIP_LIMITS } from "@/lib/wip-limits";
import { usePathname } from "next/navigation";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { UserNavWidget } from "./UserNavWidget";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/features/search/components/SearchInput";

interface TopNavigationProps {
  onToggleSidebar?: () => void;
  onToggleRightSidebar?: () => void;
}

export function TopNavigation({ onToggleSidebar, onToggleRightSidebar }: TopNavigationProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isTechieCopy } = useThemeHelpers();
  const router = useRouter();
  const pathname = usePathname();

  const isStudioRoute = pathname.startsWith("/studio");
  const showRightSidebarToggle = pathname === "/" || pathname.startsWith("/search");

  const getWriteLabel = () => {
    if (isCyberCopy) return "NEW_NODE";
    if (isSakuraCopy) return "新規ブログ";
    if (isRoninCopy) return "New Territory";
    if (isOctaneCopy) return "Initialize";
    if (isJournalCopy) return "New Entry";
    return "New Blog";
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
        "fixed top-0 left-0 right-0 h-16 border-b z-40 flex items-center justify-between px-4 md:px-8 transition-colors duration-500",
        "bg-noir-nav border-noir-border backdrop-blur",
        isTechieCopy && "border-none shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-shadow duration-500",

        "theme-header-accent",
      )}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
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

        {/* Brand Logo - Theme-aware */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={cn(
              "w-8 h-8 border flex items-center justify-center border-noir-border bg-noir-hover",
              config.fontFamily === "mono" ? "" : "transition-transform group-hover:-rotate-3",
            )}
            style={{ borderRadius: "var(--theme-radius-sm)" }}
          >
            <span
              className={cn(
                "font-bold text-sm text-accent",
                config.fontFamily === "mono" ? "font-mono" : "font-serif italic text-lg",
              )}
            >
              {isSakuraCopy ? "導" : "C"}
            </span>
          </div>
          <span
            className={cn(
              "font-bold tracking-tight hidden md:block text-foreground",
              config.fontFamily === "mono" ? "font-mono tracking-widest text-lg" : "font-serif italic text-xl",
            )}
          >
            {isSakuraCopy ? "コンジット" : isRoninCopy ? "浪人" : isJournalCopy ? "Journal" : "CONDUIT"}
          </span>
        </Link>

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
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4 md:gap-6">
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

        {!WIP_LIMITS.showNotifications ? null : (
          <button className="transition-colors relative text-foreground-muted hover:text-foreground">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-signal-red rounded-full border border-noir-bg" />
          </button>
        )}

        {/* Right Sidebar Toggle (Mobile only) */}
        {showRightSidebarToggle && (
          <button
            onClick={onToggleRightSidebar}
            className="xl:hidden p-2 rounded-md transition-colors text-foreground-muted hover:text-foreground hover:bg-noir-hover cursor-pointer"
            style={{ borderRadius: "var(--theme-radius-md)" }}
            aria-label="Toggle Search and Discovery"
          >
            <Compass size={20} strokeWidth={1.5} />
          </button>
        )}

        <div className="pl-2 hidden md:block">
          <UserNavWidget />
        </div>
      </div>
    </header>
  );
}
