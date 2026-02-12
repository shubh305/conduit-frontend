"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getRootUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getGlobalFeed } from "@/features/feed/api";
import { Profile } from "@/features/profile/types";
import { searchUsers } from "@/features/search/api";
import { useThemeLabel } from "@/components/theme";

function SectionTitle({ children }: { children: React.ReactNode }) {
  const { isCyberCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isTechieCopy } = useThemeHelpers();

  if (isTechieCopy) {
    return (
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
        <h3 className="text-xl font-sans font-black text-white uppercase tracking-tighter italic">{children}</h3>
      </div>
    );
  }

  return (
    <h3
      className={cn(
        "mb-4 font-bold uppercase tracking-widest",
        isCyberCopy
          ? "text-xs font-mono text-accent"
          : isRoninCopy
            ? "text-sm font-serif text-accent border-b border-accent/30 pb-2 w-full tracking-normal ronin-slash"
            : isOctaneCopy
              ? "text-sm font-sans text-accent border-b border-accent/30 pb-2 w-full tracking-wide octane-header-accent"
              : isJournalCopy
                ? "text-lg font-serif font-black italic text-journal-ink border-b-2 border-double border-accent/30 pb-2 w-full tracking-tight normal-case"
                : "text-xs font-bold uppercase text-accent border-b border-border-primary pb-2 w-full tracking-widest",
      )}
      style={{
        borderColor: isJournalCopy ? undefined : "var(--border-primary)",
      }}
    >
      {children}
    </h3>
  );
}

export function AuxiliarySidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <Suspense
      fallback={
        <Wrapper isOpen={isOpen} className={cn(!isOpen && "hidden xl:flex")}>
          <div className="animate-pulse h-20 bg-noir-hover rounded" />
        </Wrapper>
      }
    >
      <Wrapper isOpen={isOpen} className={cn(!isOpen && "translate-x-full xl:translate-x-0 xl:flex")}>
        {/* Mobile Header */}
        <div className="flex xl:hidden items-center justify-between mb-8 pb-4 border-b border-border-primary">
          <span className="font-black tracking-tighter uppercase text-xl">Discovery</span>
          <button onClick={onClose} className="p-2 -mr-2 text-foreground-muted hover:text-foreground cursor-pointer">
            ✕
          </button>
        </div>
        <AuxiliarySidebarContent />
      </Wrapper>
    </Suspense>
  );
}

function Wrapper({ children, className, isOpen }: { children: React.ReactNode; className?: string; isOpen?: boolean }) {
  const { config } = useTheme();
  const { isTerminalCopy, isJournalCopy, isTechieCopy } = useThemeHelpers();

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen fixed right-0 top-0 xl:top-16 w-80 z-[170] xl:z-30 px-6 py-8 h-screen xl:h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar transition-all duration-500",
        !isOpen && "translate-x-full xl:translate-x-0",
        isTerminalCopy
          ? "border-l border-accent/20 bg-black text-accent font-mono"
          : isTechieCopy
            ? "border-none shadow-[-10px_0_30px_rgba(0,0,0,0.4)] bg-noir-bg backdrop-blur-xl"
            : isJournalCopy
              ? "bg-[#FDF5E6] border-l-4 border-double border-accent/20 custom-scrollbar shadow-2xl"
              : cn("border-l border-border-primary shadow-2xl", config.isDark ? "bg-bg-sidebar" : "bg-white"),
        className,
      )}
      style={{
        backgroundColor:
          isTerminalCopy || isTechieCopy || isJournalCopy
            ? isJournalCopy
              ? "#FDF5E6"
              : isTerminalCopy
                ? "#000000"
                : undefined
            : "var(--bg-sidebar)",
        borderColor: isTerminalCopy || isTechieCopy || isJournalCopy ? undefined : "var(--border-primary)",
      }}
    >
      {children}
      {/* Journal Texture Overlay */}
      {isJournalCopy && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply -z-10" />
      )}
    </aside>
  );
}

export function AuxiliarySidebarContent() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const { isTerminalCopy, isJournalCopy, isTechieCopy } = useThemeHelpers();

  const t = useThemeLabel();
  const recommendedLabel = t("recommended");
  const signalSourcesLabel = t("signalSources");

  const recommendedTitle = isTechieCopy ? "optimized_paths" : recommendedLabel;
  const signalSourcesTitle = isTechieCopy ? "peer_nodes" : signalSourcesLabel;
  const noTagsText = t("noTags");
  const noUsersText = t("noUsers");
  // Sync right sidebar: ShellLayout handles the state centrally

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getGlobalFeed({ limit: 50 })
      .then(res => {
        if (res.data) {
          const uniqueTags = new Set<string>();
          res.data.forEach(item => item.tags?.forEach(t => uniqueTags.add(t)));
          setTags(Array.from(uniqueTags).slice(0, 10));
        }
      })
      .catch(() => {});
  }, []);

  const [whoToFollow, setWhoToFollow] = useState<Profile[]>([]);

  useEffect(() => {
    searchUsers("")
      .then(res => {
        if (res && res.users) {
          setWhoToFollow(res.users.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const getProfileUrl = (username: string) => {
    if (typeof window === "undefined") return `/u/${username}`;
    return `${getRootUrl()}u/${username}`;
  };

  return (
    <>
      {/* Recommended Topics */}
      <div
        className={cn(
          "mb-8 md:mb-10",
          isTerminalCopy ? "border border-accent p-2" : "",
          isTechieCopy && "mb-12 widget",
        )}
        data-widget={isTechieCopy || isTerminalCopy ? "true" : undefined}
      >
        <SectionTitle>{recommendedTitle}</SectionTitle>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const isActive = query === tag;
              return (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className={cn(
                    "px-0 py-1 text-xs font-medium transition-all inline-block mr-4 mb-2 border-b border-transparent cursor-pointer",
                    isTerminalCopy
                      ? "px-3 py-1.5 border border-transparent text-accent hover:text-white hover:bg-accent/20 hover:border-accent !rounded-none"
                      : isActive
                        ? "text-accent border-accent"
                        : "text-foreground-muted hover:text-accent hover:border-accent/30",
                    isJournalCopy && [
                      "px-3 py-1.5 font-serif normal-case tracking-normal italic text-journal-ink-muted border border-accent/20 bg-journal-parchment/30 hover:bg-journal-parchment hover:text-journal-ink rounded-full",
                      isActive && "bg-journal-ink text-journal-paper border-journal-ink",
                    ],
                    isTechieCopy && [
                      "px-3 py-1.5 bg-noir-panel/40 text-accent uppercase tracking-widest hover:bg-accent/10 shadow-sm border border-accent/20 hover:border-accent/80 group-hover:scale-[1.02]",
                      isActive &&
                        "bg-accent/20 text-accent border-accent/80 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]",
                    ],
                  )}
                  style={{
                    borderRadius: isTerminalCopy || isTechieCopy ? "0" : isJournalCopy ? "9999px" : "0",
                  }}
                  data-tag="true"
                >
                  {isTerminalCopy ? `[#${tag}]` : isJournalCopy ? tag : `# ${tag}`}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-wider">{noTagsText}</div>
        )}
      </div>

      {/* Signal Sources / Who to Follow */}
      <div
        className={cn(
          "",
          isTerminalCopy ? "rounded-none border border-accent p-2" : "",
          isTechieCopy && "widget rounded-none",
        )}
        data-widget={isTechieCopy || isTerminalCopy ? "true" : undefined}
      >
        <SectionTitle>{signalSourcesTitle}</SectionTitle>
        {whoToFollow.length > 0 ? (
          <div className="flex flex-col gap-4 md:gap-6">
            {whoToFollow.map(user => (
              <Link key={user.username} href={getProfileUrl(user.username)}>
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 group cursor-pointer transition-all duration-300",
                    isTechieCopy &&
                      "bg-noir-panel/30 p-2 md:p-3 shadow-md hover:bg-noir-panel/50 hover:shadow-lg border-l-2 border-transparent hover:border-accent/80",
                    !isTerminalCopy &&
                      !isTechieCopy &&
                      !isJournalCopy &&
                      "bg-bg-panel border border-border-primary p-2 md:p-3 rounded-sm hover:border-accent hover:shadow-sm",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center font-mono text-xs font-bold border",
                        isTerminalCopy
                          ? "bg-black text-accent border-accent rounded-none"
                          : "bg-bg-primary text-foreground border-border-primary",
                        isJournalCopy &&
                          "font-serif bg-journal-parchment text-journal-ink border-accent/20 rounded-full",
                        isTechieCopy &&
                          "w-8 h-8 md:w-10 md:h-10 bg-black rounded-none text-accent border border-white/5 group-hover:border-accent/40 transition-all",
                      )}
                      style={{
                        borderRadius:
                          isTerminalCopy || isTechieCopy || (!isJournalCopy && !isTerminalCopy && !isTechieCopy)
                            ? "2px"
                            : "50%",
                      }}
                    >
                      {user.displayName ? user.displayName[0] : user.username[0]}
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <div
                        className={cn(
                          "text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] truncate transition-colors max-w-[120px]",
                          isTerminalCopy
                            ? "text-accent group-hover:text-white group-hover:underline"
                            : "text-foreground-muted group-hover:text-foreground",
                          isJournalCopy &&
                            "font-serif normal-case text-journal-ink tracking-normal group-hover:text-accent/80",
                          isTechieCopy && "text-white font-black group-hover:text-accent/90",
                        )}
                      >
                        {isTerminalCopy ? `${user.username}` : user.displayName || user.username}
                      </div>
                      <div
                        className={cn(
                          "text-[9px] truncate font-mono text-foreground-subtle uppercase tracking-widest max-w-[120px]",
                          isTerminalCopy ? "text-accent/50" : "",
                          isJournalCopy && "font-serif italic text-accent/60",
                          isTechieCopy && "text-accent/50",
                        )}
                      >
                        {isTerminalCopy ? `PID: ${(user.id || "0000").substring(0, 4)}` : `@${user.username}`}
                      </div>
                    </div>
                  </div>
                  {isTechieCopy ? (
                    <div className="w-6 h-6 flex items-center justify-center border border-white/5 text-accent/40 group-hover:text-accent hover:bg-white/5 transition-all">
                      <ArrowUpRight size={10} strokeWidth={3} />
                    </div>
                  ) : (
                    <button
                      className={cn(
                        "w-6 h-6 flex items-center justify-center border transition-all cursor-pointer",
                        isTerminalCopy
                          ? "border-transparent text-accent group-hover:text-white"
                          : "border-noir-border text-foreground-muted hover:text-accent hover:border-accent",
                        isJournalCopy &&
                          "border-accent/10 text-accent/50 hover:bg-journal-parchment hover:text-accent rounded-full",
                      )}
                      style={{ borderRadius: isTerminalCopy ? "0" : "var(--theme-radius-sm)" }}
                    >
                      <ArrowUpRight size={12} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-wider">{noUsersText}</div>
        )}
      </div>
      <div
        className={cn(
          "mt-auto pt-8 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest opacity-50",
          isTerminalCopy ? "text-accent/30" : "",
          isJournalCopy && "font-serif normal-case italic opacity-70",
        )}
      >
        <span>v.2.0.4</span>
        {isTerminalCopy ? "" : <span>Legal</span>}
        {isTerminalCopy ? "" : <span>API</span>}
      </div>
    </>
  );
}
