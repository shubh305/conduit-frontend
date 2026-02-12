"use client";

import { getStudioLabel } from "@/features/theme/studio-labels"
import { Post } from "@/features/blog/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, MoreHorizontal, Trash2, ExternalLink, Pencil, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, formatDate, getExcerptFromTiptap } from "@/lib/utils";
import { WIP_LIMITS } from "@/lib/wip-limits";
import { useAuth } from "@/features/auth/AuthProvider";
import { restorePost } from "@/features/blog/api";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { TerminalDirectory, TerminalListItem } from "@/components/terminal/TerminalDirectory";
import { useThemeLabel } from "@/components/theme"
import {
  getTabButtonClasses,
  getPostItemClasses,
  getPostStatusBadgeClasses,
  getPostActionMenuClasses,
  getHeadingClasses,
} from "@/lib/theme-variants"

export type Tab = "drafts" | "published" | "scheduled" | "unlisted" | "deleted";

interface PostsListProps {
  posts: Post[];
  counts: Record<string, number>;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export function PostsList({ posts, counts, activeTab, onTabChange, onDelete, onRestore }: PostsListProps) {
  const { theme } = useTheme();
  const { isCyberCopy, isSakuraCopy, isTerminalCopy, isJournalCopy, isTechieCopy, fontFamily } = useThemeHelpers();
  const { user } = useAuth();

  const filteredPosts = posts;

  const t = useThemeLabel();
  const noDataTitle = t("noData");
  const noDataDesc = t("noDataDesc");

  const handleRestore = async (id: string, tenantId?: string) => {
    try {
      await restorePost(id, tenantId);
      toast.success(getStudioLabel("delete_success", theme));
      onRestore?.(id);
    } catch {
      toast.error("Failed to restore");
    }
  };

  const tabs: Tab[] = (["published", "drafts", "scheduled", "unlisted", "deleted"] as Tab[]).filter(
    t => t !== "unlisted" || WIP_LIMITS.showUnlistedFilter,
  );

  const statusLabels: Record<Tab, string> = {
    published: t("statusPublished"),
    drafts: t("statusDrafts"),
    scheduled: t("statusScheduled"),
    unlisted: t("statusUnlisted"),
    deleted: t("statusDeleted"),
  };

  // --- TERMINAL LAYOUT ---
  if (isTerminalCopy) {
    const terminalItems = filteredPosts.map((post): TerminalListItem => {
      const perms = post.status === "published" ? "-rwxr-xr-x" : "-rw-------";
      const size = ((post.excerpt?.length || 0) + 1024).toString();
      const date = formatDate(post.status === "published" ? post.publishedAt : post.updatedAt || post.createdAt);

      return {
        id: post.id,
        permissions: perms,
        user: user?.username || "user",
        size: size,
        date: date,
        name: post.title || "untitled.md",
        link: `/studio/editor/${post.id}${post.tenantId ? `?tenant=${post.tenantId}` : ""}`,
        actions: (
          <div className="flex justify-end gap-2">
            {post.deletedAt ? (
              <button
                onClick={() => handleRestore(post.id, post.tenantId)}
                className="text-emerald-500 hover:underline"
              >
                [RESTORE]
              </button>
            ) : (
              <button onClick={() => onDelete?.(post.id)} className="text-red-500 hover:underline">
                [RM]
              </button>
            )}
          </div>
        ),
      };
    });

    return (
      <TerminalDirectory
        path={`/home/${user?.username || "user"}/posts/${activeTab}`}
        command="$ ls -la --status="
        items={terminalItems}
        totalItems={filteredPosts.length}
        username={user?.username || "user"}
        renderTabs={() => (
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "hover:text-white hover:bg-accent hover:text-black px-1 transition-colors",
                  activeTab === tab ? "bg-accent/20 text-accent font-bold" : "text-foreground-muted",
                )}
              >
                [{tab}]
              </button>
            ))}
          </div>
        )}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Tabs / Filter Navigation */}
      <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-12 overflow-x-auto no-scrollbar pb-2 md:-mx-4 md:px-4">
        {tabs.map(tab => {
          const count = counts[tab] || 0;
          const isSelected = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(getTabButtonClasses(theme, isSelected), "cursor-pointer")}
            >
              <span>{statusLabels[tab]}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "flex items-center justify-center min-w-[1.25rem] h-5 rounded-full text-[10px] px-1.5 font-bold",
                    isSelected ? "bg-noir-bg/20 text-noir-bg" : "bg-noir-hover text-foreground-muted",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List / Posts Grid */}
      <div className="flex flex-col">
        {filteredPosts.length === 0 ? (
          <div
            className={cn(
              "py-20 md:py-40 flex flex-col items-center justify-center border border-dashed bg-noir-hover/30",
              isCyberCopy || isTechieCopy ? "rounded-none border-accent/20" : "rounded-[2rem] border-noir-border",
              isJournalCopy && "bg-accent/5 border-accent/10",
            )}
          >
            <div
              className={cn(
                "w-16 h-16 flex items-center justify-center mb-6 border border-noir-border bg-noir-bg text-foreground-subtle shadow-sm",
                isCyberCopy || isTechieCopy ? "rounded-none border-accent/30" : "rounded-2xl",
              )}
            >
              {activeTab === "scheduled" ? (
                <RefreshCw size={28} className="animate-spin-slow" />
              ) : (
                <LayoutDashboard size={28} />
              )}
            </div>
            <h3
              className={cn(
                "text-2xl font-bold mb-3 tracking-tight text-foreground text-center px-6",
                getHeadingClasses(theme),
              )}
            >
              {noDataTitle}
            </h3>
            <p
              className={cn(
                "text-sm max-w-xs text-center text-foreground-subtle leading-relaxed",
                isCyberCopy || isTechieCopy
                  ? "font-mono uppercase tracking-wider text-[10px]"
                  : isJournalCopy
                    ? "font-serif italic"
                    : "",
              )}
            >
              {noDataDesc}
            </p>
          </div>
        ) : (
          <div className={cn("divide-y divide-noir-border/50", (isJournalCopy || isTechieCopy) && "divide-accent/10")}>
            {filteredPosts.map((post, index) => (
              <div
                key={post.id || `post-${index}`}
                className={cn(
                  getPostItemClasses(theme),
                  "border-b border-noir-border/30 last:border-none px-0 md:px-4",
                )}
              >
                <div className="flex-1 pr-4 md:pr-10">
                  <div className="flex flex-col h-full">
                    <Link
                      href={
                        post.status === "published"
                          ? `/u/${post.authorUsername || user?.username || "user"}/${post.slug}`
                          : `/studio/editor/${post.id}${post.tenantId ? `?tenant=${post.tenantId}` : ""}`
                      }
                      className="block group/title mb-2"
                    >
                      <h3
                        className={cn(
                          "text-xl md:text-2xl font-bold tracking-tight text-foreground transition-all",
                          "group-hover/title:text-accent group-hover/title:underline decoration-1 underline-offset-8",
                          getHeadingClasses(theme),
                        )}
                      >
                        {post.title || (isCyberCopy ? "UNTITLED_STREAM" : "Untitled Post")}
                      </h3>
                    </Link>

                    <p
                      className={cn(
                        "text-base mb-6 line-clamp-2 text-foreground-subtle leading-relaxed max-w-3xl",
                        isCyberCopy || isTechieCopy
                          ? "font-mono text-xs uppercase opacity-70"
                          : fontFamily === "serif"
                            ? "font-serif italic"
                            : "",
                      )}
                    >
                      {post.status === "published"
                        ? post.excerpt ||
                          getExcerptFromTiptap(post.content) ||
                          "No preview available for this published entry."
                        : post.excerpt ||
                          getExcerptFromTiptap(post.content) ||
                          (post.content?.content
                            ? "Draft content available in secure editor environment..."
                            : "No synchronization preview available for this entry.")}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div
                        className={cn(
                          "flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground-subtle",
                          isCyberCopy || isTechieCopy ? "font-mono" : "",
                        )}
                      >
                        <span
                          className={cn(
                            "px-2 py-0.5 border border-noir-border bg-noir-bg/50",
                            isCyberCopy || isTechieCopy
                              ? "text-accent border-accent/20"
                              : isJournalCopy
                                ? "font-serif italic capitalize tracking-normal border-accent/10"
                                : "rounded-sm",
                          )}
                        >
                          {post.tenantName || post.tenantSlug || "Default Site"}
                        </span>
                        <span className="opacity-20 text-foreground">•</span>
                        <span className={cn(getPostStatusBadgeClasses(theme, post.status || ""), "cursor-pointer")}>
                          {post.status}
                        </span>
                        <span className="opacity-20 text-foreground">•</span>
                        <span
                          className={
                            isJournalCopy || isTechieCopy ? "font-serif italic capitalize tracking-normal" : ""
                          }
                        >
                          {formatDate(
                            post.status === "published" ? post.publishedAt : post.updatedAt || post.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all scale-100 md:scale-95 group-hover:scale-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-foreground-subtle hover:text-foreground hover:bg-accent/10 rounded-full"
                      >
                        <MoreHorizontal size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 p-2 bg-noir-panel border-noir-border text-foreground shadow-2xl"
                      style={{ borderRadius: isCyberCopy || isTechieCopy ? "0" : "var(--theme-radius-lg)" }}
                    >
                      {!post.deletedAt && (
                        <>
                          <DropdownMenuItem asChild className={getPostActionMenuClasses(theme)}>
                            <Link
                              href={`/studio/editor/${post.id}${post.tenantId ? `?tenant=${post.tenantId}` : ""}`}
                              className="flex items-center gap-3"
                            >
                              <Pencil size={16} />
                              <span className="font-bold">
                                {isCyberCopy ? "MODIFY_SIGNAL" : isSakuraCopy ? "編集" : "Edit entry"}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className={getPostActionMenuClasses(theme)}>
                            <Link
                              href={`/u/${post.authorUsername || user?.username || "user"}/${post.slug}`}
                              className="flex items-center gap-3"
                            >
                              <ExternalLink size={16} />
                              <span className="font-bold">{isCyberCopy ? "VIEW_UPLINK" : "View live"}</span>
                            </Link>
                          </DropdownMenuItem>
                          <div className="h-[1px] bg-noir-border/50 my-1 mx-2" />
                        </>
                      )}

                      {post.deletedAt ? (
                        <DropdownMenuItem
                          onClick={() => handleRestore(post.id, post.tenantId)}
                          className={cn(
                            getPostActionMenuClasses(theme),
                            "flex items-center gap-3 text-emerald-500 hover:text-emerald-500 focus:text-noir-bg focus:bg-emerald-500",
                          )}
                        >
                          <RefreshCw size={16} />
                          <span className="font-bold">{isCyberCopy ? "RESTORE_SIGNAL" : "Restore"}</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onDelete?.(post.id)}
                          className={cn(
                            getPostActionMenuClasses(theme),
                            "flex items-center gap-3 text-red-500 hover:text-red-500 focus:text-noir-bg focus:bg-red-500",
                          )}
                        >
                          <Trash2 size={16} />
                          <span className="font-bold">{isCyberCopy ? "TERMINATE_BROADCAST" : "Delete"}</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
