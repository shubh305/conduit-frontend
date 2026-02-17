"use client";

import Image from "next/image";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Bookmark, LayoutDashboard } from "lucide-react";
import { WIP_LIMITS } from "@/lib/wip-limits";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { useThemeLabel } from "@/components/theme";
import { getJapaneseSubLabel } from "@/lib/theme-variants";
import { getFollowingUsers } from "@/features/profile/api";
import { Profile } from "@/features/profile/types";
import { useEffect, useState, useCallback } from "react";
import { getRootUrl, isRootSite } from "@/lib/utils";

interface NavigationSidebarProps {
  isOpen?: boolean;
}

export function NavigationSidebar({ isOpen = true }: NavigationSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, config } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const currentFeed = searchParams.get("feed") || "foryou";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isHome = pathname === "/";

  const isCyberCopy = theme === "cyber";
  const isSakuraCopy = theme === "sakura";
  const isRoninCopy = theme === "ronin";
  const isTerminalCopy = theme === "terminal";
  const isTechieCopy = theme === "techie";

  const t = useThemeLabel();
  const homeLabel = t("home");
  const libraryLabel = t("library");
  const mySitesLabel = t("mySites");
  const forYouLabel = t("forYou");
  const followingLabel = t("following");

  // Navigation items including Home
  const navItems = [
    { id: "home", label: homeLabel, icon: Home, href: getRootUrl() },
    { id: "library", label: libraryLabel, icon: Bookmark, href: "/me/library" },
    { id: "mySites", label: mySitesLabel, icon: LayoutDashboard, href: "/dashboard" },
  ];

  const isWalkthrough = pathname === "/walkthrough";

  const filteredNavItems = navItems.filter(item => {
    if (isWalkthrough) return true;
    if (item.href === "/me/library" || item.href === "/dashboard") {
      return !!user;
    }
    return true;
  });

  const feedItems = [
    { id: "foryou", label: forYouLabel },
    { id: "following", label: followingLabel },
  ];

  const sourceTitle = isCyberCopy
    ? "/* SOURCE */"
    : isSakuraCopy
      ? "Source"
      : isRoninCopy
        ? "Origin"
        : isTerminalCopy
          ? ">> sources"
          : "Source";

  const [followedUsers, setFollowedUsers] = useState<Profile[]>([]);

  const [prevUserId, setPrevUserId] = useState(user?.id);
  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    if (!user) {
      setFollowedUsers([]);
    }
  }

  const refreshFollowingList = useCallback(() => {
    if (user) {
      getFollowingUsers()
        .then(res => setFollowedUsers(res.users))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshFollowingList();
    }
  }, [refreshFollowingList, user]);

  useEffect(() => {
    const handleFollowChange = () => {
      refreshFollowingList();
    };

    window.addEventListener("follow-status-changed", handleFollowChange);
    return () => window.removeEventListener("follow-status-changed", handleFollowChange);
  }, [refreshFollowingList]);

  return (
    <aside
      key={mounted ? (typeof window !== "undefined" ? window.location.hostname : "ssr") : "mounting"}
      className={cn(
        "flex flex-col fixed left-0 top-0 md:top-16 z-[170] md:z-30 pt-4 md:pt-8 pb-8 justify-between border-r overflow-y-auto no-scrollbar transition-all duration-300 h-screen md:h-[calc(100vh-4rem)] cursor-pointer",
        "bg-bg-sidebar border-border-primary sidebar-nav",
        isTechieCopy && "border-none shadow-[10px_0_30px_rgba(0,0,0,0.4)]",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0",
        "md:flex",
      )}
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderColor: "var(--border-primary)",
      }}
    >
      <div className="flex md:hidden items-center justify-between px-6 py-4 border-b border-border-primary mb-6">
        <span className="font-black tracking-tighter uppercase text-xl text-foreground">MENU</span>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("close-sidebar"))}
          className="p-2 -mr-2 text-foreground-muted hover:text-foreground cursor-pointer"
        >
          ✕
        </button>
      </div>

      {isWalkthrough && (
        <div
          data-tour-id="nav-section-home"
          className="px-6 py-4 border-b border-accent/20 bg-accent/5 mb-4 hidden md:block group"
        >
          <div className="text-[8px] font-mono text-accent/60 uppercase tracking-[0.2em]">Active_Territory</div>
          <div className="text-sm font-black uppercase tracking-tighter text-accent group-hover:animate-pulse">
            Home_Network
          </div>
        </div>
      )}
      <div className="px-4 space-y-8 flex-1">
        {/* Main Nav */}
        <div className="space-y-1">
          <div
            className={cn(
              "text-[10px] mb-4 px-4 uppercase tracking-widest text-foreground-subtle",
              config.fontFamily === "mono" ? "font-mono" : "font-sans",
              isOpen ? "block" : "hidden",
            )}
          >
            {/* SYSTEM_NAV */}
          </div>
          {filteredNavItems.map(item => {
            const isPlatformHome = item.id === "home";
            const isRoot = mounted && isRootSite();

            const isActive = isPlatformHome ? isRoot && (pathname === "/" || pathname === "") : pathname === item.href;

            const japaneseLabel = getJapaneseSubLabel(item.id, theme);
            const isExternal = item.href.startsWith("http");

            const LinkComponent = (isExternal || isPlatformHome ? "a" : Link) as React.ElementType;
            const extraProps = isExternal || isPlatformHome ? {} : { href: item.href };

            return (
              <LinkComponent
                key={item.href}
                id={`nav-${item.id}`}
                data-tour-id={item.id}
                href={item.href}
                {...extraProps}
                className={cn(
                  "flex items-center gap-4 px-4 py-2 transition-all group relative overflow-hidden cursor-pointer",
                  config.fontFamily === "mono"
                    ? "font-mono text-xs uppercase tracking-wider"
                    : "font-sans text-sm tracking-wide font-medium",
                  isActive
                    ? "text-accent bg-accent/10"
                    : theme === "journal"
                      ? "text-journal-ink-muted hover:text-journal-ink hover:bg-journal-ink/5"
                      : "text-foreground-muted hover:text-foreground hover:bg-foreground/5",
                  !isOpen && "justify-center px-0",
                )}
                style={{ borderRadius: "var(--theme-radius-sm)" }}
                title={!isOpen ? item.label : undefined}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />}
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-accent" : "text-foreground-subtle group-hover:text-foreground",
                  )}
                />
                <span
                  className={cn(
                    "relative z-10 transition-opacity duration-300",
                    isOpen ? "flex items-center gap-2" : "hidden",
                  )}
                >
                  <span className="block leading-none">{item.label}</span>
                  {japaneseLabel && (
                    <span
                      className={cn(
                        isRoninCopy
                          ? "text-[11px] text-accent font-serif italic align-baseline opacity-70"
                          : "block transform -translate-y-0.5",
                        isSakuraCopy
                          ? "text-[9px] text-foreground-muted font-normal"
                          : !isRoninCopy && "text-[11px] text-accent font-serif italic",
                        isRoninCopy && "before:content-['/'] before:mr-1 before:opacity-40",
                      )}
                    >
                      {japaneseLabel}
                    </span>
                  )}
                </span>
              </LinkComponent>
            );
          })}
        </div>

        {/* Feed Source */}
        {isOpen && (WIP_LIMITS.showForYou || WIP_LIMITS.showFollowing) && (
          <div className="space-y-1">
            <div
              className={cn(
                "text-[10px] mb-2 px-4 uppercase tracking-widest text-foreground-subtle",
                config.fontFamily === "mono" ? "font-mono" : "font-serif lowercase italic tracking-normal",
                isOpen ? "block" : "hidden",
              )}
            >
              {sourceTitle}
            </div>
            {feedItems
              .filter(feed => {
                if (feed.id === "foryou") return WIP_LIMITS.showForYou;
                if (feed.id === "following") return WIP_LIMITS.showFollowing;
                return true;
              })
              .map(feed => {
                const feedKey = feed.id === "foryou" ? "forYou" : "following";
                const japaneseLabel = getJapaneseSubLabel(feedKey, theme);
                return (
                  <Link
                    key={feed.id}
                    href={`/?feed=${feed.id}`}
                    className={cn(
                      "flex items-center gap-4 px-4 py-1.5 transition-colors cursor-pointer",
                      config.fontFamily === "mono" ? "font-mono text-xs uppercase tracking-wider" : "text-sm",
                      isHome && currentFeed === feed.id
                        ? "text-accent font-bold"
                        : theme === "journal"
                          ? "text-journal-ink-muted hover:text-journal-ink hover:bg-journal-ink/5"
                          : "text-foreground-muted hover:text-foreground",
                    )}
                    style={{ borderRadius: "var(--theme-radius-sm)" }}
                  >
                    {isCyberCopy ? (
                      <span className="hidden lg:block">[{feed.label}]</span>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isHome && currentFeed === feed.id
                              ? "bg-accent"
                              : "bg-transparent border border-foreground-subtle",
                          )}
                        />
                        <span
                          className={cn(
                            "transition-opacity duration-300",
                            isOpen ? "flex items-center gap-2" : "hidden",
                          )}
                        >
                          <span className="block leading-none">{feed.label}</span>
                          {japaneseLabel && (
                            <span
                              className={cn(
                                isRoninCopy
                                  ? "text-[11px] text-accent font-serif italic align-baseline opacity-70"
                                  : "block transform",
                                isSakuraCopy
                                  ? "text-[9px] text-foreground-muted font-normal"
                                  : !isRoninCopy && "text-[11px] text-accent font-serif italic",
                                isRoninCopy && "before:content-['/'] before:mr-1 before:opacity-40",
                              )}
                            >
                              {japaneseLabel}
                            </span>
                          )}
                        </span>
                      </>
                    )}
                    <span className="lg:hidden">{feed.label[0]}</span>
                  </Link>
                );
              })}
          </div>
        )}

        {/* Followed Users */}
        {isOpen && user && followedUsers.length > 0 && (
          <div className="space-y-1 mt-8">
            <div
              className={cn(
                "text-[10px] mb-2 px-4 uppercase tracking-widest text-foreground-subtle",
                config.fontFamily === "mono" ? "font-mono" : "font-serif lowercase italic tracking-normal",
                isOpen ? "block" : "hidden",
              )}
            >
              {followingLabel}
            </div>
            {followedUsers.map((profile, idx) => (
              <Link
                key={`${profile.id || profile.username || "followed"}-${idx}`}
                href={`/u/${profile.username}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-1.5 transition-colors cursor-pointer group",
                  config.fontFamily === "mono" ? "font-mono text-xs uppercase tracking-wider" : "text-sm",
                  theme === "journal"
                    ? "text-journal-ink-muted hover:text-journal-ink hover:bg-journal-ink/5"
                    : "text-foreground-muted hover:text-foreground hover:bg-foreground/5",
                )}
                style={{ borderRadius: "var(--theme-radius-sm)" }}
              >
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.username}
                      width={20}
                      height={20}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-bold text-accent">
                      {(profile.username || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className={cn("leading-tight truncate", isOpen ? "block" : "hidden")}>
                  {profile.displayName || profile.username}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
