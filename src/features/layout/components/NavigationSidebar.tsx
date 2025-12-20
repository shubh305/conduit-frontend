"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Bookmark, LayoutDashboard } from "lucide-react";
import { WIP_LIMITS } from "@/lib/wip-limits";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { useThemeLabel } from "@/components/theme";
import { getJapaneseSubLabel } from "@/lib/theme-variants";

interface NavigationSidebarProps {
  isOpen?: boolean;
}

export function NavigationSidebar({ isOpen = true }: NavigationSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, config } = useTheme();
  const { user } = useAuth();

  const currentFeed = searchParams.get("feed") || "foryou";
  const isHome = pathname === "/";


  const isCyberCopy = theme === "cyber";
  const isSakuraCopy = theme === "sakura";
  const isRoninCopy = theme === "ronin";
  const isTerminalCopy = theme === "terminal";
  const isTechieCopy = theme === "techie"


  const t = useThemeLabel();
  const homeLabel = t("home");
  const libraryLabel = t("library");
  const mySitesLabel = t("mySites");
  const forYouLabel = t("forYou");
  const followingLabel = t("following");

  const navItems = [
    { id: "home", label: homeLabel, icon: Home, href: "/" },
    { id: "library", label: libraryLabel, icon: Bookmark, href: "/me/library" },
    { id: "mySites", label: mySitesLabel, icon: LayoutDashboard, href: "/dashboard" },
  ];


  const filteredNavItems = navItems.filter(item => {
    if (item.href === "/me/library" || item.href === "/studio/posts" || item.href === "/dashboard") {
      return !!user;
    }
    return true;
  });

  const feedItems = [
    { id: "foryou", label: forYouLabel },
    { id: "following", label: followingLabel },
  ];


  const sourceTitle = isCyberCopy ? "/* SOURCE */" : isSakuraCopy ? "Source" : isRoninCopy ? "Origin" : isTerminalCopy ? ">> sources" : "Source";

  return (
    <aside
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
            const isActive = pathname === item.href;
            const japaneseLabel = getJapaneseSubLabel(item.id, theme);
            return (
              <Link
                key={item.href}
                href={item.href}
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
                <item.icon size={16} className={cn("shrink-0", isActive && "text-accent")} />
                <span
                  className={cn(
                    "relative z-10 leading-tight transition-opacity duration-300",
                    isOpen ? "block" : "hidden",
                  )}
                >
                  <span className="block">{item.label}</span>
                  {japaneseLabel && (
                    <span
                      className={cn(
                        "block transform -translate-y-0.5",
                        isSakuraCopy
                          ? "text-[9px] text-foreground-muted font-normal"
                          : "text-[11px] text-accent font-serif italic",
                      )}
                    >
                      {japaneseLabel}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Feed Source */}
        {isOpen && WIP_LIMITS.showForYou && (
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
            {feedItems.map(feed => {
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
                      <span className={cn("leading-tight", isOpen ? "block" : "hidden")}>
                        <span className="block">{feed.label}</span>
                        {japaneseLabel && (
                          <span
                            className={cn(
                              "block transform",
                              isSakuraCopy
                                ? "text-[9px] text-foreground-muted font-normal"
                                : "text-[11px] text-accent font-serif italic",
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
      </div>
    </aside>
  );
}
