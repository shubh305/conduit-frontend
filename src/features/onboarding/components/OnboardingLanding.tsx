"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getRootDomain, getBlogHomeUrl } from "@/lib/utils";
import { ArrowUpRight, ChevronDown, ChevronUp, FileText, Layout, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateBlogModal } from "./CreateBlogModal";
import { getMyTenants } from "@/features/blog/api";
import { ThemePage, ThemeButton, useThemeLabel } from "@/components/theme";
import { getLabel, getHeadingClasses, getSubtitleClasses, ThemeVariant } from "@/lib/theme-variants";
import { AnimatePresence, motion } from "framer-motion";

export interface UserBlog {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  postsCount: number;
}

export function OnboardingLanding() {
  const { theme, config } = useTheme();
  const {
    isCyberCopy,
    isTerminalCopy,
    isSakuraCopy,
    isJournalCopy,
    isDarkMode,
    isTechieCopy,
    isOctaneCopy,
    isProfessionalCopy,
  } = useThemeHelpers();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isBlogsOpen, setIsBlogsOpen] = useState(true);
  const [blogs, setBlogs] = useState<UserBlog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dashboardTitle = getLabel("dashboardTitle", theme as ThemeVariant);
  const t = useThemeLabel();
  const dashboardSubtitle = t("dashboardSubtitle");
  const createBlogLabel = t("createBlog");
  const yourBlogsLabel = t("yourBlogs");
  const editorLabel = t("editor");
  const studioLabel = t("studio");
  const loadingLabel = t("loading");

  const cleanUrlParam = (param: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete(param);
    window.history.replaceState({}, "", newUrl.toString());
  };

  useEffect(() => {
    const createParam = searchParams.get("create");
    const actionParam = searchParams.get("action");

    if (createParam === "true" || actionParam === "new-blog") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCreateModalOpen(true);
      cleanUrlParam(createParam ? "create" : "action");
    } else if (actionParam === "write") {
      if (blogs.length > 0) {
        router.push(`/studio/editor?tenantId=${blogs[0].id}`);
      } else if (!isLoading && user) {
        if (user.tenants && user.tenants.length > 0) {
          router.push(`/studio/editor?tenantId=${user.tenants[0].id}`);
        } else {
          setIsCreateModalOpen(true);
        }
      }
      cleanUrlParam("action");
    }
  }, [searchParams, blogs, user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard");
    } else if (user) {
      getMyTenants()
        .then(tenants => {
          const mappedBlogs: UserBlog[] = tenants.map(t => ({
            id: t.id || t._id || "",
            name: t.name,
            subdomain: t.slug,
            logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${t.slug}`,
            postsCount: 0,
          }));
          setBlogs(mappedBlogs);
        })
        .catch((err: unknown) => console.error("Failed to load blogs", err));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <ThemePage className="flex items-center justify-center">
        <div className="font-mono text-accent animate-pulse uppercase tracking-[0.2em]">{loadingLabel}</div>
      </ThemePage>
    );
  }

  return (
    <ThemePage className="max-w-7xl mx-auto px-0 md:px-12 py-0">
      {isCyberCopy && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {isSakuraCopy && (
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />
      )}

      <div
        className={cn(
          "relative z-10 max-w-5xl mx-auto mysites-container px-0 md:my-10",
          (isOctaneCopy || isCyberCopy || isTechieCopy) && "border-none shadow-none bg-transparent",
        )}
      >
        {/* Terminal System Status Bar */}
        {isTerminalCopy && (
          <div className="flex justify-between items-center mb-10 pb-2 border-b border-accent/20 text-[10px] uppercase tracking-widest text-accent/50 font-mono">
            <div className="flex gap-4">
              <span>CPU: 12%</span>
              <span>MEM: 1.4GB / 32GB</span>
              <span>TEMP: 34°C</span>
            </div>
            <div className="flex gap-4">
              <span>SYS_TIME: {currentTime}</span>
              <span className="animate-pulse text-accent">● ALIVE</span>
            </div>
          </div>
        )}

        <header
          className={cn(
            "flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-12 border-b transition-all border-noir-border",
            "px-4 md:px-6 lg:px-12 py-6 md:py-10",
            "mb-2 md:mb-1",
            isTerminalCopy && "border-accent/30",
            isJournalCopy && "border-accent/20",
          )}
        >
          <div className="space-y-2 md:space-y-6">
            <h1
              className={cn(
                "font-black leading-[0.9] tracking-tighter",
                isTechieCopy ? "text-4xl md:text-5xl lg:text-7xl" : "text-4xl md:text-6xl lg:text-8xl",
                getHeadingClasses(theme as ThemeVariant),
              )}
            >
              {isSakuraCopy && (
                <span className="text-3xl font-normal opacity-70 font-sans block mb-4">コミュニティを築く</span>
              )}
              {isTerminalCopy ? (
                <span className="terminal-scanline-text terminal-glow">{dashboardTitle}</span>
              ) : (
                dashboardTitle
              )}
            </h1>
            <p
              className={cn(
                getSubtitleClasses(theme as ThemeVariant),
                isTerminalCopy && "text-accent/60",
                isJournalCopy && "text-accent/80",
              )}
            >
              {isTerminalCopy
                ? `[SYS_OK] KERNEL_ROOT @ ${user?.username || "GUEST"} // UPLINK_ACTIVE`
                : dashboardSubtitle}
            </p>
          </div>

          {/* Create Blog Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={cn(
              "group flex items-center gap-3 transition-all shrink-0 p-1 bg-noir-panel border shadow-2xl hover:border-accent cursor-pointer",
              "my-4 md:my-0",
              isCyberCopy ? "rounded-none pr-8 border-noir-border" : "rounded-full pr-8 border-noir-border",
              isTerminalCopy && "rounded-full border-accent bg-black pr-8 hover:bg-accent hover:text-black",
              isJournalCopy &&
                "rounded-xl border-accent/20 bg-journal-paper pr-8 shadow-sm hover:shadow-md hover:border-accent/40",
              isProfessionalCopy &&
                "rounded-lg bg-white border-noir-border pr-8 shadow-sm hover:shadow-md hover:border-accent",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center transition-all bg-accent text-noir-bg",
                isCyberCopy ? "w-12 h-12 rounded-none" : "w-10 h-10 rounded-full",
                isTerminalCopy && "bg-transparent text-accent group-hover:text-black",
                isJournalCopy && "w-10 h-10 rounded-lg bg-accent text-journal-paper shadow-inner",
              )}
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="text-left">
              <span
                className={cn(
                  "font-bold block uppercase tracking-wider text-xs",
                  isJournalCopy && "font-serif capitalize tracking-normal italic text-accent",
                )}
              >
                {createBlogLabel}
              </span>
            </div>
          </button>
        </header>

        {/* Your Blogs Section */}
        <section className="px-4 md:px-10 lg:px-12 py-1 md:py-8">
          <div
            className="flex items-center justify-between cursor-pointer select-none group mb-4 md:mb-8 px-4 md:px-6"
            onClick={() => setIsBlogsOpen(!isBlogsOpen)}
          >
            <h2
              className={cn(
                "font-mono uppercase tracking-[0.3em] text-xs transition-colors",
                isBlogsOpen ? "text-accent" : "text-foreground-subtle group-hover:text-foreground",
                isTerminalCopy && !isBlogsOpen && "text-accent/60 group-hover:text-accent",
                isJournalCopy && "font-serif capitalize tracking-widest italic text-lg text-journal-ink-muted",
              )}
            >
              {yourBlogsLabel}
            </h2>
            <div
              className={cn(
                "flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all px-3 py-2 md:px-4 md:py-1.5 bg-noir-panel border border-noir-border hover:border-accent shadow-sm",
                isCyberCopy ? "rounded-none" : "rounded-full",
                isTerminalCopy && "bg-black border-accent text-accent",
                isJournalCopy &&
                  "rounded-lg border-accent/20 bg-journal-paper text-accent italic font-serif capitalize tracking-normal hover:bg-noir-hover/20",
              )}
            >
              <span className="hidden xs:inline">
                {isBlogsOpen
                  ? isSakuraCopy
                    ? "Close (閉じる)"
                    : t("collapseSection")
                  : isSakuraCopy
                    ? "Open (開く)"
                    : t("expandSection")}
              </span>
              {isBlogsOpen ? <ChevronUp size={14} className="text-accent" /> : <ChevronDown size={14} />}
            </div>
          </div>

          <AnimatePresence>
            {isBlogsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 pt-1">
                  {blogs.length === 0 ? (
                    <EmptyBlogsState
                      isCyberCopy={isCyberCopy}
                      isTerminalCopy={isTerminalCopy}
                      isSakuraCopy={isSakuraCopy}
                      isJournalCopy={isJournalCopy}
                    />
                  ) : (
                    blogs.map(blog => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        editorLabel={editorLabel}
                        studioLabel={studioLabel}
                        isCyberCopy={isCyberCopy}
                        isTerminalCopy={isTerminalCopy}
                        isJournalCopy={isJournalCopy}
                        isDarkMode={isDarkMode}
                        fontFamily={config.fontFamily}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(newBlog: UserBlog) => setBlogs([...blogs, newBlog])}
      />
    </ThemePage>
  );
}

interface EmptyBlogsStateProps {
  isCyberCopy: boolean;
  isTerminalCopy: boolean;
  isSakuraCopy: boolean;
  isJournalCopy: boolean;
}

function EmptyBlogsState({ isCyberCopy, isTerminalCopy, isSakuraCopy, isJournalCopy }: EmptyBlogsStateProps) {
  return (
    <div
      className={cn(
        "border border-dashed p-16 flex flex-col items-center justify-center text-center transition-all",
        "border-noir-border bg-noir-panel/30 backdrop-blur-sm",
        isCyberCopy ? "rounded-none" : "rounded-3xl",
        isTerminalCopy && "rounded-2xl border-accent/30 bg-black",
        isJournalCopy && "rounded-2xl border-accent/20 bg-noir-hover/10",
      )}
    >
      <div
        className={cn(
          "w-20 h-20 mb-6 bg-noir-hover border-2 border-noir-border flex items-center justify-center",
          isCyberCopy ? "rounded-none" : "rounded-2xl",
          isTerminalCopy && "border-accent/30 bg-black rounded-lg",
          isJournalCopy && "rounded-xl border-accent/20 bg-journal-paper shadow-inner",
        )}
      >
        <Layout size={32} className={cn("text-foreground-subtle/20", isTerminalCopy && "text-accent/20")} />
      </div>
      <p
        className={cn(
          "text-foreground-subtle text-[10px] font-mono uppercase tracking-[0.3em] max-w-xs leading-loose animate-pulse",
          isTerminalCopy && "text-accent/60",
        )}
      >
        {isSakuraCopy
          ? "発信地が検出されません。ノードを初期化してください。"
          : "No transmission detected. Initialize a node to begin."}
      </p>
    </div>
  );
}

interface BlogCardProps {
  blog: UserBlog;
  editorLabel: string;
  studioLabel: string;
  isCyberCopy: boolean;
  isTerminalCopy: boolean;
  isJournalCopy: boolean;
  isDarkMode: boolean;
  fontFamily: string;
}

function BlogCard({
  blog,
  editorLabel,
  studioLabel,
  isCyberCopy,
  isTerminalCopy,
  isJournalCopy,
  isDarkMode,
  fontFamily,
}: BlogCardProps) {
  return (
    <div
      className={cn(
        "border flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-6 transition-all group",
        "bg-noir-panel border-noir-border hover:border-accent shadow-xl",
        "p-4 md:p-6",
        isCyberCopy ? "rounded-none" : "rounded-2xl",
        isTerminalCopy && "bg-black border-accent/20 hover:border-accent/60",
        isJournalCopy && "bg-journal-paper border-accent/20 rounded-xl shadow-lg hover:shadow-xl journal-page-curl",
      )}
    >
      <div className="flex items-center gap-6">
        <div
          className={cn(
            "w-16 h-16 overflow-hidden border shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-inner bg-noir-bg",
            isCyberCopy ? "rounded-none border-accent/20" : "rounded-2xl border-noir-border",
            isTerminalCopy && "rounded-xl border-accent/10 grayscale contrast-150 brightness-75",
            isJournalCopy && "rounded-lg border-accent/10 bg-white",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.logo}
            alt={blog.name}
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isDarkMode ? "opacity-60 group-hover:opacity-100" : "opacity-90 group-hover:opacity-100",
              isTerminalCopy && "opacity-40",
            )}
          />
        </div>
        <div>
          <h3
            className={cn(
              "text-xl font-bold mb-1 transition-colors group-hover:text-accent",
              isCyberCopy ? "font-mono uppercase" : fontFamily === "serif" ? "font-serif italic" : "font-sans",
              isTerminalCopy && "font-mono text-accent",
            )}
          >
            {blog.name}
          </h3>
          <div className={cn("text-xs font-mono text-accent/70 tracking-tighter", isTerminalCopy && "text-accent/50")}>
            {blog.subdomain}.{getRootDomain()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0 pt-2 lg:pt-0 border-t border-noir-border/30 lg:border-none">
        <div className="grid grid-cols-2 gap-2 flex-1 md:flex md:flex-row md:items-center md:gap-2 md:w-auto">
          <Link href={`/studio/editor?tenantId=${blog.id}`} className="w-full md:w-auto">
            <ThemeButton
              themeVariant="ghost"
              className="w-full gap-2 px-2 py-1 h-8 md:h-9 text-[9px] md:text-xs whitespace-nowrap"
            >
              <FileText size={12} className="md:w-3.5 md:h-3.5" />
              <span>{editorLabel}</span>
            </ThemeButton>
          </Link>
          <Link href={`/studio/config?tab=transmissions&tenantId=${blog.id}`} className="w-full md:w-auto">
            <ThemeButton
              themeVariant={isJournalCopy ? "ghost" : "primary"}
              className="w-full gap-2 px-2 py-1 h-8 md:h-9 text-[9px] md:text-xs whitespace-nowrap"
            >
              <Layout size={12} className="md:w-3.5 md:h-3.5" />
              <span>{studioLabel}</span>
            </ThemeButton>
          </Link>
        </div>
        <a
          href={getBlogHomeUrl(blog.subdomain)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "h-8 w-8 md:h-9 md:w-9 flex items-center justify-center transition-all border border-noir-border hover:border-accent hover:text-accent bg-noir-bg cursor-pointer shrink-0",
            isCyberCopy ? "rounded-none" : "rounded-full",
            isTerminalCopy && "bg-black border-accent text-accent rounded-full",
            isJournalCopy && "rounded-lg border-accent/20 bg-transparent text-accent hover:bg-accent/5",
          )}
          title="Open Site"
        >
          <ArrowUpRight size={14} className="md:w-4 md:h-4" />
        </a>
      </div>
    </div>
  );
}
