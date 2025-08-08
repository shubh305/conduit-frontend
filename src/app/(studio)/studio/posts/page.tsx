"use client";

import { PostsList } from "@/features/studio/components/PostsList";
import { getPosts, deletePost } from "@/features/blog/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { useEffect, useState } from "react";
import { Post } from "@/features/blog/types";
import { useTheme, useStudioLabels } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { getHeadingClasses, ThemePage } from "@/components/theme"
import { getSubtitleClasses, ThemeVariant } from "@/lib/theme-variants"

export default function PostsPage() {
  const { user } = useAuth()
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
    <ThemePage className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-noir-border transition-all">
        <div>
          <h1 className={cn("text-4xl font-bold tracking-tighter", getHeadingClasses(theme))}>{title}</h1>
          <p className={cn("text-sm mt-2", getSubtitleClasses(theme as ThemeVariant))}>{subtitle}</p>
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
  )
}
