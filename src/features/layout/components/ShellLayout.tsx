"use client"

import { Suspense, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/features/auth/AuthProvider"

import Link from "next/link"
import { Home, Search, Bookmark, User } from "lucide-react"
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { NavigationSidebar } from "./NavigationSidebar"
import { AuxiliarySidebar } from "./AuxiliarySidebar"
import { StudioSidebar } from "@/features/studio/components/StudioSidebar"
import { cn } from "@/lib/utils"
import { TopNavigation } from "./TopNavigation"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

interface ShellLayoutProps {
  children: React.ReactNode
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const { focusMode, setFocusMode } = useTheme()
  const { isCyber, isDarkMode, isRoninCopy, isSakuraCopy, isJournalCopy, isTerminalCopy, isTechieCopy, fontFamily } =
    useThemeHelpers()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      setScrollProgress((window.scrollY / total) * 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusMode, setFocusMode])

  useEffect(() => {
    if (focusMode) {
      document.documentElement.classList.add("focus-mode-active")
    } else {
      document.documentElement.classList.remove("focus-mode-active")
    }
    return () => document.documentElement.classList.remove("focus-mode-active")
  }, [focusMode])

  useEffect(() => {

    requestAnimationFrame(() => {
      setMounted(true)
    })
  }, [])

  const isFullScreenRoute = ["/login", "/signup", "/forgot-password"].some(route => pathname.startsWith(route))
  const isPreview = searchParams.get("preview") === "true"

  if (isFullScreenRoute || isPreview) {
    return <>{children}</>
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
    )
  }

  const isProfilePage = pathname.startsWith("/u/")

  const isStudioRoute = pathname.startsWith("/studio")
  const segments = pathname.split("/").filter(Boolean)
  const isPostView =
    segments.length === 2 &&
    ![
      "studio",
      "u",
      "me",
      "login",
      "signup",
      "settings",
      "explore",
      "search",
      "dashboard",
      "archives",
      "tag",
      "about",
      "feeds",
    ].includes(segments[0]) &&
    !["archives", "about", "tag"].includes(segments[1])
  const isJournalImmersion = isJournalCopy && isPostView

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500 text-foreground",
        isRoninCopy || isSakuraCopy || isJournalCopy || isTerminalCopy || isTechieCopy
          ? "bg-transparent"
          : "bg-noir-bg",
        focusMode && "bg-black focus-mode",
      )}
    >
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
      <Suspense fallback={<div className="w-20 lg:w-64 hidden md:block bg-noir-bg border-r border-noir-border" />}>
        {!isStudioRoute && !isProfilePage && !focusMode && <NavigationSidebar isOpen={isSidebarOpen} />}
        {isStudioRoute && !focusMode && <StudioSidebar />}
      </Suspense>

      {(pathname === "/" || pathname === "/explore" || pathname.startsWith("/search")) &&
        !isStudioRoute &&
        !focusMode && <AuxiliarySidebar />}

      {/* Unified Top Header for all themes */}
      {!isStudioRoute && !focusMode && <TopNavigation onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

      {/* Main Grid Layout */}
      <div
        className={cn("flex justify-center min-h-screen", isStudioRoute ? "pl-64" : "", isJournalImmersion && "pl-0")}
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
            "flex-1 min-w-0 transition-all duration-300 xl:border-r w-full border-noir-border px-4 md:px-8 pt-24 pb-8",
            isTechieCopy && "xl:border-none",
            isStudioRoute && "pt-0 border-none px-0 py-0",
            isJournalImmersion && "h-screen pt-0 pb-0 mt-0 px-0 overflow-hidden bg-journal-parchment flex flex-col",
            isJournalCopy && "bg-journal-ink/5",

            !isDarkMode && !isJournalCopy && "bg-noir-panel md:bg-noir-bg",
            focusMode && "xl:border-none pt-24 max-w-4xl mx-auto flex-none w-full",
          )}
        >
          {children}
        </main>

        {/* Right Sidebar Spacer - matched with fixed sidebar width */}
        {(pathname === "/" || pathname === "/explore" || pathname.startsWith("/search")) && (
          <div className="hidden xl:block w-80 shrink-0" />
        )}
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 border-t px-6 py-3 flex justify-between items-center z-50",
          "bg-noir-bg border-noir-border",
        )}
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wide">Home</span>
        </Link>
        <Link
          href="/explore"
          className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <Search size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wide">Search</span>
        </Link>
        <Link
          href="/me/library"
          className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <Bookmark size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wide">Library</span>
        </Link>
        <Link
          href={user ? `/u/${user.username}` : "/login"}
          className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <User size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wide">{user ? "Profile" : "Sign In"}</span>
        </Link>
      </div>

      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 hidden md:block transition-all duration-500",
          focusMode && "opacity-0 pointer-events-none",
        )}
      >
        <ThemeToggle />
      </div>
    </div>
  )
}
