"use client";

import { PostsList } from "@/features/studio/components/PostsList";
import { getPosts, deletePost } from "@/features/blog/api";
import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/features/blog/types";
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
  const { getLabel } = useStudioLabels()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)


  const title = getLabel("posts")
  const subtitle = getLabel("publications_desc")
  const loadingText = getLabel("loading")


  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return

      setLoading(true)
      try {
        const tenants = user.tenants || []
        const tenantIds = tenants.map(t => t.id).filter(Boolean)

        if (tenantIds.length === 0) {
          setPosts([])
          setLoading(false)
          return
        }

        const promises = tenantIds.map(async tId => {
          const [standard, deleted] = await Promise.all([
            getPosts(tId, { author: user.id }),
            getPosts(tId, { author: user.id, status: "deleted" }),
          ])
          return [...(standard.data || []), ...(deleted.data || [])]
        })

        const results = await Promise.all(promises)
        const deduplicated = Array.from(new Map(results.flat().map(p => [p.id, p])).values())
        const allPosts = deduplicated.sort(
          (a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime(),
        )

        setPosts(allPosts)
      } catch (err) {
        console.error("Failed to fetch posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [user])

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return

    const targetPost = posts.find(p => p.id === deleteTargetId)
    const activeTenantId = targetPost?.tenantId || user?.tenantId || (user?.tenants && user.tenants[0]?.id)

    if (!activeTenantId) {
      toast.error("Could not determine context for this post.")
      return
    }

    setIsDeleting(true)
    try {
      await deletePost(deleteTargetId, activeTenantId)
      toast.success(getLabel("delete_success"))
      setPosts(prev => prev.map(p => (p.id === deleteTargetId ? { ...p, deletedAt: new Date().toISOString() } : p)))
      setDeleteTargetId(null)
    } catch (err) {
      console.error("Failed to delete post:", err)
      toast.error("Failed to delete post.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRestore = (id: string) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, deletedAt: undefined } : p)))
  }

  return (
    <ThemePage className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 md:pb-10 border-b border-noir-border transition-all">
        <div className="flex-1">
          <div className="flex items-center justify-between md:block">
            <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tighter", getHeadingClasses(theme))}>{title}</h1>
            {/* Mobile New Post Action */}
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
          <PostsList posts={posts} onDelete={id => setDeleteTargetId(id)} onRestore={handleRestore} />
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
