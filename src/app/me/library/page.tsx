"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { getMyLists } from "@/features/lists/api";
import { ReadingList } from "@/features/lists/types";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Bookmark, History, Pencil } from "lucide-react";
import { ListDialog } from "@/features/lists/components/ListDialog";
import { cn, getPostUrl } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { ThemePage, getHeadingClasses } from "@/components/theme";
import { getCardClasses } from "@/lib/theme-variants"
import { useLibrary } from "@/features/library/context/LibraryContext";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { TerminalDirectory, TerminalListItem } from "@/components/terminal/TerminalDirectory";
import { FeedItem } from "@/features/feed/types";
import { ThemedButton } from "@/components/ui/themed-button"

export default function LibraryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const { isCyberCopy, isSakuraCopy, isOctaneCopy, isTerminalCopy, isJournalCopy } = useThemeHelpers()
  const { readingHistory } = useLibrary()
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"lists" | "history">("lists")
  const [lists, setLists] = useState<ReadingList[]>([])
  const [loading, setLoading] = useState(true);
  const [showListDialog, setShowListDialog] = useState(false);
  const [editingList, setEditingList] = useState<ReadingList | undefined>(undefined);

  useEffect(() => {
    if (user && activeTab === "lists") {
      fetchLists()
    } else {
      setLoading(false)
    }
  }, [user, activeTab]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await getMyLists();
      setLists(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleListSuccess = (list: ReadingList) => {
    if (editingList) {
      setLists(prev => prev.map(l => (l._id === list._id ? list : l)));
    } else {
      setLists(prev => [list, ...prev]);
    }
    setEditingList(undefined);
  };

  const handleEditList = (e: React.MouseEvent | React.BaseSyntheticEvent, list: ReadingList) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    setEditingList(list);
    setShowListDialog(true);
  };

  if (authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-pulse font-mono text-accent">LOADING_PROFILE...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Sign in to view your library</h2>
          <Button onClick={() => router.push("/login")}>Sign in</Button>
        </div>
      </div>
    );
  }

  // Terminal Layout Check
  if (isTerminalCopy) {
    return (
      <>
        <TerminalLibraryLayout
          items={activeTab === "history" ? readingHistory : []}
          lists={lists}
          loading={loading}
          activeTab={activeTab === "history" ? "history" : "lists"}
          setActiveTab={tab => setActiveTab(tab as "lists" | "history")}
          username={user?.username || "guest"}
          onEditList={handleEditList}
          onNewList={() => {
            setEditingList(undefined)
            setShowListDialog(true)
          }}
        />
        <ListDialog
          open={showListDialog}
          onOpenChange={setShowListDialog}
          onSuccess={handleListSuccess}
          initialData={editingList}
        />
      </>
    )
  }

  return (
    <ThemePage className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <header className={cn("flex items-center justify-between mb-12", isJournalCopy && "border-accent/20")}>
          <div className="flex flex-col gap-4">
            <span
              className={cn(
                "text-[10px] font-mono text-accent uppercase tracking-[0.3em]",
                isJournalCopy && "font-serif italic capitalize tracking-widest text-foreground",
              )}
            >
              {isJournalCopy ? "The Archives" : "// USER.ARCHIVES"}
            </span>
            <h1
              className={cn(
                "text-5xl md:text-7xl font-black leading-none",
                getHeadingClasses(theme),
                isJournalCopy && "font-serif font-bold italic",
              )}
            >
              {isSakuraCopy ? "ライブラリ" : isOctaneCopy ? "DATABASE" : "Your Library"}
            </h1>
          </div>

          {activeTab === "lists" && (
            <ThemedButton
              onClick={() => {
                setEditingList(undefined);
                setShowListDialog(true);
              }}
              className="px-6"
            >
              <Plus size={18} className="mr-2" />
              {isCyberCopy ? "NEW_INDEX" : "New list"}
            </ThemedButton>
          )}
        </header>

        {/* Tabs */}
        <div className={cn("flex items-center gap-8 mb-12", isJournalCopy && "border-accent/20")}>
          <button
            onClick={() => setActiveTab("lists")}
            className={cn(
              "pb-4 text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "lists" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              isJournalCopy && "font-serif tracking-wide",
              isJournalCopy && activeTab === "lists" && "border-accent text-accent italic",
              isJournalCopy && activeTab !== "lists" && "text-journal-ink-muted hover:text-foreground",
            )}
          >
            <Bookmark size={16} />
            {isSakuraCopy ? "リスト" : "Your lists"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "pb-4 text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "history" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              isJournalCopy && "font-serif tracking-wide",
              isJournalCopy && activeTab === "history" && "border-accent text-accent italic",
              isJournalCopy && activeTab !== "history" && "text-journal-ink-muted hover:text-foreground",
            )}
          >
            <History size={16} />
            {isSakuraCopy ? "履歴" : "History"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted/20 rounded-xl" />
            ))}
          </div>
        ) : activeTab === "lists" ? (
          <div className="grid grid-cols-1 gap-6">
            {lists.map(list => (
              <div
                key={list._id}
                onClick={() => router.push(`/me/library/list/${list._id}`)}
                className={cn(
                  "group p-8 relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.01]",
                  getCardClasses(theme),
                  isJournalCopy && "border-double border-4",
                )}
              >
                {isJournalCopy && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply -z-10" />
                )}

                <div className="flex justify-between items-start">
                  <div className="space-y-3 relative z-10 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3
                          className={cn(
                            "text-2xl font-bold",
                            isCyberCopy && "font-mono",
                            isJournalCopy && "font-serif text-foreground",
                          )}
                        >
                          {list.name}
                        </h3>
                        {list.isPrivate && (
                          <Lock size={16} className={cn("text-muted-foreground", isJournalCopy && "text-accent/60")} />
                        )}
                        {list.isSystem && (
                          <span
                            className={cn(
                              "text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider font-bold",
                              isJournalCopy && "font-serif italic",
                            )}
                          >
                            Default
                          </span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-opacity border-none relative z-20 cursor-pointer",
                          isJournalCopy && "text-foreground hover:bg-noir-hover",
                        )}
                        onClick={e => handleEditList(e, list)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </div>

                    {list.description && (
                      <p
                        className={cn(
                          "text-muted-foreground max-w-xl",
                          isJournalCopy && "font-serif text-journal-ink-muted",
                        )}
                      >
                        {list.description}
                      </p>
                    )}

                    <div
                      className={cn(
                        "flex items-center gap-4 pt-4 text-sm font-medium text-muted-foreground",
                        isJournalCopy && "font-serif italic text-accent/80",
                      )}
                    >
                      <span>{list.items?.length || 0} stories</span>
                    </div>
                  </div>

                  <div className="flex -space-x-3 relative z-10">
                    {(list.items || []).slice(0, 3).map((item, i) => (
                      <div
                        key={item.postId + i}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden",
                          isJournalCopy && "border-journal-paper shadow-sm",
                        )}
                      >
                        <div
                          className={cn(
                            "w-full h-full bg-gradient-to-br from-gray-200 to-gray-300",
                            isJournalCopy && "from-noir-hover to-accent/20",
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {lists.length === 0 && (
              <div
                className={cn(
                  "text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/30",
                  isJournalCopy && "border-accent/30 bg-noir-hover/10 font-serif text-journal-ink-muted",
                )}
              >
                <p className="text-muted-foreground mb-4">You haven&apos;t created any lists yet.</p>
                <Button
                  variant="outline"
                  onClick={() => setShowListDialog(true)}
                  className={cn(isJournalCopy && "font-serif border-accent/20 text-foreground hover:bg-noir-hover")}
                >
                  Create your first list
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {(activeTab === "history" ? readingHistory : []).map(item => (
              <div key={item.postId}>
                <FeedCard item={item} variant="compact" />
              </div>
            ))}

            {(activeTab === "history" ? readingHistory : []).length === 0 && (
              <div
                className={cn(
                  "py-32 text-center border border-dashed border-noir-border rounded-2xl bg-noir-panel/30",
                  isJournalCopy && "border-accent/30 bg-noir-hover/10",
                )}
              >
                <p
                  className={cn(
                    "font-mono text-foreground-subtle uppercase tracking-[0.3em] text-[10px]",
                    isJournalCopy && "font-serif italic text-journal-ink-muted capitalize tracking-normal text-base",
                  )}
                >
                  No items found
                </p>
              </div>
            )}
          </div>
        )}

        <ListDialog
          open={showListDialog}
          onOpenChange={setShowListDialog}
          onSuccess={handleListSuccess}
          initialData={editingList}
        />
      </div>
    </ThemePage>
  );
}


interface TerminalLibraryLayoutProps {
  items: FeedItem[]
  lists: ReadingList[]
  loading: boolean
  activeTab: "history" | "lists"
  setActiveTab: (tab: "history" | "lists") => void
  username: string
  onEditList?: (e: React.MouseEvent | React.BaseSyntheticEvent, list: ReadingList) => void
  onNewList?: () => void
}

function TerminalLibraryLayout({ items, lists, loading, activeTab, setActiveTab, username, onEditList, onNewList }: TerminalLibraryLayoutProps) {
  const listItems =
    activeTab === "lists"
      ? lists.map(l => ({
          id: l._id,
          permissions: "drwx------",
          user: username,
          size: "4096",
          date: new Date(l.createdAt).toLocaleDateString(),
          name: l.name,
          link: `/me/library/list/${l._id}`,
          extraInfo: `${l.items?.length || 0} items`,
          actions: (
            <div className="flex items-center gap-2">
              <button onClick={e => onEditList?.(e, l)} className="text-[10px] text-accent/60 hover:text-accent border border-accent/20 px-1 hover:bg-accent/10 transition-colors" title="EDIT_LIST">
                [EDIT]
              </button>
              {l.isPrivate ? <Lock size={10} className="text-accent/40" /> : null}
            </div>
          ),
        }))
      : items.map(item => ({
          id: item.postId,
          permissions: "-r--r--r--",
          user: item.authorUsername || "root",
          size: "1024",
          date: new Date(item.publishedAt).toLocaleDateString(),
          name: item.title,
          link: getPostUrl(item),
          extraInfo: item.tags.join(", "),
          actions: null,
        }));

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-black p-4 md:p-8">
      <TerminalDirectory
        path={`/home/${username}/library/${activeTab}`}
        command="ls -la"
        items={listItems as TerminalListItem[]}
        totalItems={listItems.length}
        username={username}
        isLoading={loading}
        renderTabs={() => (
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("lists")}
                className={cn(activeTab === "lists" ? "text-accent border-b border-accent" : "text-muted-foreground")}
              >
                [lists]
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(activeTab === "history" ? "text-accent border-b border-accent" : "text-muted-foreground")}
              >
                [history]
              </button>
            </div>
            {activeTab === "lists" && onNewList && (
              <button
                onClick={onNewList}
                className="ml-4 text-xs bg-accent text-black px-2 py-0.5 hover:bg-white transition-colors flex items-center gap-1 font-bold"
              >
                <Plus size={12} />
                NEW_LIST
              </button>
            )}
          </div>
        )}
      />
    </div>
  )
}
