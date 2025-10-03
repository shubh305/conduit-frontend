"use client";

import { useEffect, useState, useCallback, use } from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { getList, deleteList, removeItemFromList } from "@/features/lists/api";
import { ReadingList } from "@/features/lists/types";
import { FeedItem } from "@/features/feed/types";
import { getGlobalFeed } from "@/features/feed/api";
import { ThemePage, getHeadingClasses } from "@/components/theme";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Lock, Pencil } from "lucide-react"
import { cn, getPostUrl } from "@/lib/utils";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ListDialog } from "@/features/lists/components/ListDialog";
import { TerminalDirectory, TerminalListItem } from "@/components/terminal/TerminalDirectory";
import Link from "next/link"

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { theme } = useTheme();
  const helpers = useThemeHelpers()
  const { isJournalCopy, isCyberCopy, isTerminalCopy } = helpers

  const [list, setList] = useState<ReadingList | null>(null)
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchListDetails = useCallback(async () => {
    setLoading(true)
    try {
      const listData = await getList(id)
      setList(listData)

      if (listData && listData.items && listData.items.length > 0) {

        const postsRes = await getGlobalFeed({ limit: 100 })
        if (postsRes && postsRes.data) {
          const postsMap = new Map();
          postsRes.data.forEach((p: FeedItem) => {
            if (p.postSlug) postsMap.set(p.postSlug, p);
            postsMap.set(p.postId, p);
          });

          const orderedItems = listData.items
            .map((item: ReadingList["items"][number]) => postsMap.get(item.postId))
            .filter((item: FeedItem | undefined) => item !== undefined) as FeedItem[];

          setItems(orderedItems);
        }
      } else {
        setItems([])
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load list")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (user && id) {
      fetchListDetails()
    }
  }, [user, id, fetchListDetails])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteList(id)
      toast.success("List deleted")
      router.push("/me/library")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete list")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleRemovePost = async (postId: string) => {
    try {
      await removeItemFromList(id, postId)
      toast.success("Removed from list")
      setItems(prev => prev.filter(item => item.postId !== postId))
      if (list) {
        setList({
          ...list,
          items: list.items.filter((i: ReadingList["items"][number]) => i.postId !== postId),
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to remove post")
    }
  }

  const handleUpdateSuccess = (updatedList: ReadingList) => {
    setList(updatedList)
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className={cn("animate-pulse font-mono", isCyberCopy ? "text-accent" : "text-muted-foreground")}>
          {isCyberCopy ? "LOADING_DATA..." : "Loading..."}
        </div>
      </div>
    )
  }

  if (!list) return <div className="p-20 text-center text-muted-foreground">List not found</div>

  // Terminal Theme Special Handling
  if (isTerminalCopy) {
    const terminalItems = items.map(item => ({
      id: item.postId,
      permissions: "-r--r--r--",
      user: item.authorUsername || "root",
      size: "1024",
      date: new Date(item.publishedAt).toLocaleDateString(),
      name: item.title,
      link: getPostUrl(item),
      extraInfo: item.tags.join(", "),
      actions: null,
    }))

    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen bg-black p-4 md:p-8">
        <TerminalDirectory
          path={`/home/${user?.username}/library/lists/${list.name.toLowerCase().replace(/\s+/g, "_")}`}
          items={terminalItems as TerminalListItem[]}
          totalItems={items.length}
          username={user?.username || "guest"}
          isLoading={loading}
          command={`ls ${list.name}`}
          renderTabs={() => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-accent font-mono text-xs"
            >
              cd ..
            </Button>
          )}
        />
      </div>
    )
  }

  return (
    <ThemePage>
      <div className="max-w-4xl mx-auto py-8 px-6 pb-20">
        <Link
          href="/me/library"
          className={cn(
            "flex items-center gap-2 mb-8 text-sm font-medium transition-colors w-fit",
            isJournalCopy
              ? "font-serif italic text-muted-foreground hover:text-foreground"
              : isCyberCopy
                ? "font-mono text-accent hover:text-white uppercase tracking-widest"
                : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft size={16} />
          {isJournalCopy ? "Back to Archives" : isCyberCopy ? "RETURN_TO_INDEX" : "Back to library"}
        </Link>

        <header className="mb-12 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1
                  className={cn(
                    "text-4xl md:text-5xl font-black leading-tight",
                    getHeadingClasses(theme),
                    isJournalCopy && "font-serif italic text-foreground",
                  )}
                >
                  {list.name}
                </h1>
                {list.isPrivate && <Lock size={20} className="text-muted-foreground/60" />}
                {list.isSystem && (
                  <span
                    className={cn(
                      "text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-accent/20",
                      isJournalCopy && "font-serif italic text-foreground border-foreground/20",
                    )}
                  >
                    Default
                  </span>
                )}
              </div>

              {list.description && (
                <p
                  className={cn(
                    "text-xl max-w-2xl leading-relaxed",
                    isJournalCopy ? "font-serif text-journal-ink-muted italic" : "text-muted-foreground",
                  )}
                >
                  {list.description}
                </p>
              )}

              <div
                className={cn(
                  "flex items-center gap-2 text-sm text-muted-foreground/70 pt-2",
                  isJournalCopy && "font-serif italic",
                )}
              >
                <span>{items.length} stories</span>
                <span>•</span>
                <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!list.isSystem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className={cn(
                    "h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-colors",
                    isJournalCopy && "hover:bg-noir-hover",
                  )}
                >
                  <Trash2 size={18} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditDialog(true)}
                className={cn(
                  "h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors",
                  isJournalCopy && "text-foreground hover:bg-noir-hover",
                )}
              >
                <Pencil size={18} />
              </Button>
            </div>
          </div>

          {isJournalCopy && (
            <div className="absolute -bottom-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          )}
          {!isJournalCopy && !isCyberCopy && (
            <div className="absolute -bottom-6 left-0 h-1 w-20 bg-accent rounded-full" />
          )}
        </header>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {items.map(item => (
            <FeedCard
              key={item.postSlug || item.postId}
              item={item}
              variant="compact"
              onRemove={() => handleRemovePost(item.postId)}
            />
          ))}

          {items.length === 0 && (
            <div
              className={cn(
                "py-24 text-center rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4",
                isJournalCopy
                  ? "border-foreground/10 bg-journal-paper text-journal-ink-muted font-serif italic"
                  : "border-muted bg-muted/30",
              )}
            >
              <p className="text-xl">This list is empty</p>
              <Button variant="outline" onClick={() => router.push("/")} className={cn(isJournalCopy && "font-serif")}>
                Read some stories
              </Button>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete list"
        description="Are you sure you want to delete this list? This action cannot be undone."
        isDeleting={isDeleting}
      />

      <ListDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialData={list}
        onSuccess={handleUpdateSuccess}
      />
    </ThemePage>
  )
}
