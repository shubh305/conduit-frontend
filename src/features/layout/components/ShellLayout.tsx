"use client"

import { Suspense, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import Link from "next/link"
import { Home, Search, Bookmark, LayoutDashboard } from "lucide-react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { NavigationSidebar } from "./NavigationSidebar"
import { AuxiliarySidebar } from "./AuxiliarySidebar"
import { StudioSidebar } from "@/features/studio/components/StudioSidebar"
import { cn } from "@/lib/utils";
import { TopNavigation } from "./TopNavigation"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { WIP_LIMITS } from "@/lib/wip-limits";
import { UserNavWidget } from "./UserNavWidget";
import { useThemeLabel } from "@/components/theme/ThemeLabel";
import { useAuth } from "@/features/auth/AuthProvider";

interface ShellLayoutProps {
  children: React.ReactNode
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const { focusMode, setFocusMode } = useTheme();
  const { isCyber, isDarkMode, isRoninCopy, isSakuraCopy, isJournalCopy, isTerminalCopy, isTechieCopy, fontFamily } =
    useThemeHelpers();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const t = useThemeLabel();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      setScrollProgress((window.scrollY / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode, setFocusMode]);

  useEffect(() => {
    if (focusMode) {
      document.documentElement.classList.add("focus-mode-active");
    } else {
      document.documentElement.classList.remove("focus-mode-active");
    }
    return () => document.documentElement.classList.remove("focus-mode-active");
  }, [focusMode]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      setIsSidebarOpen(mql.matches);
    };

    mql.addEventListener("change", onChange);

    requestAnimationFrame(() => {
      setMounted(true);
      // Set initial state based on current width
      setIsSidebarOpen(mql.matches);
    });

    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const checkDesktop = () => {
      const isDesktop = window.innerWidth >= 1280;
      setIsRightSidebarOpen(isDesktop);
    };

    checkDesktop();

    const onResize = () => checkDesktop();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => setIsSidebarOpen(false));
    }
  }, [pathname]);

  useEffect(() => {
    const handleClose = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      if (window.innerWidth < 1280) setIsRightSidebarOpen(false);
    };
    window.addEventListener("close-sidebar", handleClose);
    return () => window.removeEventListener("close-sidebar", handleClose);
  }, []);

  const isFullScreenRoute = ["/login", "/signup", "/forgot-password"].some(route => pathname.startsWith(route));
  const isPreview = searchParams.get("preview") === "true";

  if (isFullScreenRoute || isPreview) {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen transition-colors duration-500 text-foreground bg-noir-bg">
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="flex justify-center min-h-screen">
          <div className="hidden md:block shrink-0 transition-all duration-300 w-64" />
          <main className="flex-1 min-w-0 px-4 md:px-8 py-8 transition-all duration-300 xl:border-r w-full pt-24 xl:border-noir-border">
            {children}
          </main>
          <div className="hidden xl:block w-80 shrink-0" />
        </div>
      </div>
    );
  }

  const isProfilePage = pathname.startsWith("/u/");

  const isStudioRoute = pathname.startsWith("/studio");
  const isEditorRoute = pathname.startsWith("/studio/editor");
  const segments = pathname.split("/").filter(Boolean);
  const isPostView =
    segments.length === 2 &&
    ![
      "studio",
      "u",
      "me",
      "login",
      "signup",
      "settings",
      "search",
      "dashboard",
      "archives",
      "tag",
      "about",
      "feeds",
    ].includes(segments[0]) &&
    !["archives", "about", "tag"].includes(segments[1]);
  const isJournalImmersion = isJournalCopy && isPostView;

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-1000 ease-in-out text-foreground max-w-[100vw] overflow-x-hidden overscroll-behavior-none",
        isEditorRoute && "h-[100dvh] overflow-hidden overscroll-none",
        isRoninCopy || isSakuraCopy || isJournalCopy || isTerminalCopy || isTechieCopy
          ? "bg-transparent"
          : "bg-noir-bg",
        focusMode && (isSakuraCopy ? "bg-[#0a0508] focus-mode" : "bg-[#050505] focus-mode"),
      )}
    >
      {/* Immersive Void Overlay */}
      {focusMode && (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none z-10 animate-in fade-in duration-1000",
            isSakuraCopy
              ? "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(219,39,119,0.05)_100%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]",
          )}
        />
      )}
      {/* The Void Progress Line */}
      {focusMode && (
        <div
          className="fixed left-0 top-0 w-0.5 bg-accent/40 z-[110] transition-all duration-300"
          style={{ height: `${scrollProgress}%` }}
        />
      )}

      {/* Exit Void Button */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className={cn(
            "fixed top-8 left-8 z-[110] text-[10px] text-accent/30 hover:text-accent transition-all uppercase tracking-widest animate-in fade-in duration-1000",
            fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans",
          )}
        >
          [ Esc_to_Exit_Void ]
        </button>
      )}
      {/* Terminal Scanlines */}
      {isTerminalCopy && <div className="scanlines" />}
      {/* Grid background - Cyber only */}
      {isCyber && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      )}

      {/* Sakura watermark - via CSS utility */}
      <div className="theme-watermark" />

      {/* Unified Sidebars */}
      {/* Unified Sidebars - Desktop Only */}
      <Suspense fallback={<div className="w-20 lg:w-64 hidden md:block bg-noir-bg border-r border-noir-border" />}>
        {!isStudioRoute && !isProfilePage && !focusMode && (
          <div className="hidden md:block">
            <NavigationSidebar isOpen={isSidebarOpen} />
          </div>
        )}
        {isStudioRoute && !focusMode && <StudioSidebar isOpen={isSidebarOpen} />}
      </Suspense>

      <Suspense fallback={null}>
        {(pathname === "/" || pathname.startsWith("/search")) && (
          <AuxiliarySidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
        )}
      </Suspense>

      {/* Mobile Sidebars Backdrop */}
      {!focusMode && (isSidebarOpen || (isRightSidebarOpen && window.innerWidth < 1280)) && (
        <div
          className="fixed inset-0 bg-black/60 z-[165] md:hidden animate-in fade-in duration-300"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        />
      )}

      {/* Unified Top Header for all themes */}
      {!isStudioRoute && !focusMode && (
        <TopNavigation
          onToggleSidebar={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setIsRightSidebarOpen(false);
          }}
          onToggleRightSidebar={() => {
            setIsRightSidebarOpen(!isRightSidebarOpen);
            setIsSidebarOpen(false);
          }}
        />
      )}

      {/* Studio Mobile Header */}
      {isStudioRoute && !focusMode && !pathname.startsWith("/studio/editor") && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-noir-bg border-b border-noir-border flex items-center px-4 z-[180]">
          <button
            onClick={e => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="p-2 -ml-2 text-foreground-muted hover:text-foreground relative z-[190] cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
          <span className="ml-4 font-black uppercase tracking-tighter text-lg">STUDIO</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div
        className={cn(
          "flex justify-start md:justify-center",
          isEditorRoute ? "h-full min-h-0 flex-col overflow-hidden" : "min-h-screen",
          isStudioRoute ? (isSidebarOpen ? "md:pl-64" : "md:pl-20") : "",
          isJournalImmersion && "pl-0",
        )}
      >
        {/* Left Sidebar Spacer - dynamically sized */}
        {!isStudioRoute && !isProfilePage && (
          <div
            className={cn("hidden md:block shrink-0 transition-all duration-300", isSidebarOpen ? "w-64" : "w-20")}
          />
        )}

        {/* Center Content */}
        <main
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 xl:border-r w-full border-noir-border px-4 md:px-8 pt-20 md:pt-24 pb-24 md:pb-8",
            isTechieCopy && "xl:border-none",
            isStudioRoute && "pt-16 md:pt-0 border-none px-4 md:px-0 pb-0",
            isEditorRoute && "pt-0 md:pt-0 px-0 md:px-0 flex flex-col h-full overflow-hidden",
            isJournalImmersion && "h-screen pt-0 pb-0 mt-0 px-0 overflow-hidden bg-journal-parchment flex flex-col",
            isJournalCopy && "bg-journal-ink/5",

            !isDarkMode && !isJournalCopy && "bg-noir-panel md:bg-noir-bg",
            focusMode && "xl:border-none pt-16 md:pt-24 max-w-[1920px] mx-auto flex-none w-full px-6 md:px-12 lg:px-24",
          )}
        >
          {children}
        </main>

        {/* Right Sidebar Spacer - matched with fixed sidebar width */}
        {(pathname === "/" || pathname.startsWith("/search")) && <div className="hidden xl:block w-80 shrink-0" />}
      </div>

      {/* Mobile Nav */}
      {!pathname.startsWith("/studio/editor") && (
        <div
          className={cn(
            "md:hidden fixed bottom-0 left-0 right-0 border-t px-6 py-3 flex justify-between items-center z-[180]",
            "bg-noir-bg/95 backdrop-blur-xl border-noir-border shadow-[0_-4px_12px_rgba(0,0,0,0.5)]",
          )}
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Home size={20} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-wide">{t("home")}</span>
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Search size={20} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-wide">{t("search")}</span>
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <LayoutDashboard size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wide">{t("mySites")}</span>
            </Link>
          )}
          <Link
            href="/me/library"
            className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Bookmark size={20} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-wide">{t("library")}</span>
          </Link>
          <UserNavWidget variant="bottom-nav" />
        </div>
      )}

      {WIP_LIMITS.showBottomThemeToggle && (
        <div
          className={cn(
            "fixed bottom-8 right-8 z-50 hidden md:block transition-all duration-500",
            focusMode && "opacity-0 pointer-events-none",
          )}
        >
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}
