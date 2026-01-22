"use client";

import { PostsList, type Tab } from "@/features/studio/components/PostsList";
import { getPosts, deletePost } from "@/features/blog/api";
import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Post, PostStatus } from "@/features/blog/types";
import { useTheme, useStudioLabels } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { getHeadingClasses, ThemePage } from "@/components/theme"
import { getSubtitleClasses, ThemeVariant } from "@/lib/theme-variants"
import { useSearchParams } from "next/navigation";

export default function PostsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams();
  const currentTenantId = searchParams.get("tenantId") || user?.tenants?.[0]?.id;
  const { theme } = useTheme()
  const { getLabel } = useStudioLabels();
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<Tab>("published");
  const [cachedPosts, setCachedPosts] = useState<Record<Tab, Post[]>>({
    published: [],
    drafts: [],
    scheduled: [],
    unlisted: [],
    deleted: [],
  });
  const [fetchedTabs, setFetchedTabs] = useState<Set<Tab>>(new Set());

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const title = getLabel("posts")
  const subtitle = getLabel("publications_desc")
  const loadingText = getLabel("loading")

  const mapTabToStatus = useCallback((tab: Tab): PostStatus => {
    if (tab === "drafts") return "draft";
    if (tab === "deleted") return "deleted";
    return tab as PostStatus;
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!user) return;
    try {
      const tenants = user.tenants || [];
      const tenantIds = tenants.map(t => t.id).filter(Boolean);
      const tabs: Tab[] = ["published", "drafts", "scheduled", "unlisted", "deleted"];

      const countsMap: Record<string, number> = {};

      await Promise.all(
        tabs.map(async tab => {
          let total = 0;
          const statusParam = mapTabToStatus(tab);
          for (const tId of tenantIds) {
            const res = await getPosts(tId, {
              author: user.id,
              status: statusParam,
              limit: 1,
            });
            total += res.meta?.total || 0;
          }
          countsMap[tab] = total;
        }),
      );

      setCounts(countsMap);
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  }, [user, mapTabToStatus]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      if (fetchedTabs.has(activeTab)) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const tenants = user.tenants || [];
        const tenantIds = tenants.map(t => t.id).filter(Boolean);

        if (tenantIds.length === 0) {
          setCachedPosts(prev => ({ ...prev, [activeTab]: [] }));
          setFetchedTabs(prev => new Set(prev).add(activeTab));
          setLoading(false);
          return;
        }

        const statusParam = mapTabToStatus(activeTab);

        const results = await Promise.all(
          tenantIds.map(async tId => {
            const res = await getPosts(tId, {
              author: user.id,
              status: statusParam,
              page: 1,
              limit: 50,
            });
            return res.data || [];
          }),
        );

        const allPosts = results
          .flat()
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime(),
          );

        setCachedPosts(prev => ({ ...prev, [activeTab]: allPosts }));
        setFetchedTabs(prev => new Set(prev).add(activeTab));
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return

    const targetPost = cachedPosts[activeTab].find(p => p.id === deleteTargetId);
    const activeTenantId = targetPost?.tenantId || user?.tenantId || (user?.tenants && user.tenants[0]?.id)

    if (!activeTenantId) {
      toast.error("Could not determine context for this post.")
      return
    }

    setIsDeleting(true)
    try {
      await deletePost(deleteTargetId, activeTenantId);
      toast.success(getLabel("delete_success"));

      setCachedPosts(prev => {
        const updatedCurrentTab = prev[activeTab].filter(p => p.id !== deleteTargetId);
        return { ...prev, [activeTab]: updatedCurrentTab };
      });

      setFetchedTabs(prev => {
        const next = new Set(prev);
        next.delete("deleted");
        return next;
      });

      fetchCounts();

      setDeleteTargetId(null);
    } catch (err) {
      console.error("Failed to delete post:", err)
      toast.error("Failed to delete post.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRestore = async (id: string) => {
    setCachedPosts(prev => {
      const updatedDeletedTab = prev.deleted.filter(p => p.id !== id);
      return { ...prev, deleted: updatedDeletedTab };
    });

    setFetchedTabs(new Set());
    fetchCounts();
  };

  return (
    <ThemePage className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 md:pb-10 border-b border-noir-border transition-all">
        <div className="flex-1">
          <div className="flex items-center justify-between md:block">
            <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tighter", getHeadingClasses(theme))}>{title}</h1>
            <Link
              href={`/studio/editor${currentTenantId ? `?tenantId=${currentTenantId}` : ""}`}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-accent text-noir-bg shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Link>
          </div>
          <p className={cn("text-xs md:text-sm mt-2 max-w-xl", getSubtitleClasses(theme as ThemeVariant))}>
            {subtitle}
          </p>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={`/studio/editor${currentTenantId ? `?tenantId=${currentTenantId}` : ""}`}
            className={cn(
              "px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-accent text-noir-bg transition-all hover:opacity-90",
              theme === "cyber" || theme === "techie" ? "rounded-none" : "rounded-full",
            )}
          >
            {getLabel("new_post_btn")}
          </Link>
        </div>
      </header>

      <div className="mt-12">
        {loading ? (
          <div className="py-32 text-center text-accent animate-pulse font-mono tracking-[0.3em] uppercase text-xs">
            {loadingText}...
          </div>
        ) : (
          <PostsList
            posts={cachedPosts[activeTab]}
            counts={counts}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onDelete={id => setDeleteTargetId(id)}
            onRestore={handleRestore}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title={getLabel("delete_title")}
        description={getLabel("delete_desc")}
        isDeleting={isDeleting}
      />
    </ThemePage>
  );
}
