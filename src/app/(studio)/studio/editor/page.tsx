"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TiptapEditor } from "@/features/studio/components/TiptapEditor";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ThemePage } from "@/components/theme/ThemePage"
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { useThemeLabel } from "@/components/theme";
import { getHeadingClasses, getEditorContainerClasses } from "@/lib/theme-variants"
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { ArticlePageWrapper } from "@/features/blog/components/ArticlePageWrapper";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent, Tenant } from "@/features/blog/types"
import { createPost, updatePost, schedulePost } from "@/features/blog/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { SettingsSidebar } from "@/features/studio/components/SettingsSidebar";
import { CoverImageManager } from "@/features/studio/components/CoverImageManager";
import { calculateReadingStats, generateSlug } from "@/features/blog/utils";

export default function EditorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, config } = useTheme();
  const { isCyberCopy, isTechieCopy, isJournalCopy } = useThemeHelpers();
  const toastShownRef = useRef<string | null>(null);

  const requestedTenantId = searchParams.get("tenant") || searchParams.get("tenantId");

  const isTerminalCopy = theme === "terminal";

  const { getLabel } = useStudioLabels();

  const newStoryLabel = getLabel("new_post_btn");
  const t = useThemeLabel();
  const previewLabel = t("preview");
  const draftLabel = t("saveDraft");
  const publishLabel = t("publish");
  const savingLabel = t("saving");
  const enterTitlePlaceholder = getLabel("editor_placeholder");
  const loadingText = t("loading");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/studio/editor");
    }
  }, [user, isLoading, router]);

  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<TiptapContent>({ type: "doc", content: [] });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [postId, setPostId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageAttribution, setFeaturedImageAttribution] = useState<{ name: string; url: string } | null>(null);

  const [wordCount, setWordCount] = useState(0);
  const [paragraphsCount, setParagraphsCount] = useState(0);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(1);

  const isSlugManuallyEdited = useRef(false);

  const getActiveTenantId = useCallback(() => {
    return (
      requestedTenantId || user?.tenantId || (user?.tenants && user.tenants.length > 0 ? user.tenants[0].id : null)
    );
  }, [user, requestedTenantId]);

  const tenantId = getActiveTenantId();

  useEffect(() => {
    const stats = calculateReadingStats(content);
    setWordCount(stats.wordCount);
    setParagraphsCount(stats.paragraphsCount);
    setReadingTimeMinutes(stats.readingTimeMinutes);

    if (title && !isSlugManuallyEdited.current) {
      setSlug(generateSlug(title));
    }
  }, [content, title]);
  useEffect(() => {
    if (!title && (!content.content || content.content.length === 0)) return;
    if (!tenantId) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        const payload = {
          title,
          content,
          status: "draft" as const,
          slug,
          tags,
          featuredImage: featuredImage || undefined,
          featuredImageAttribution: featuredImageAttribution || undefined,
        };
        if (postId) {
          await updatePost(postId, payload, tenantId);
          setLastSaved(new Date());
        } else {
          const { post } = await createPost(payload, tenantId);
          if (post) {
            setPostId(post.id);
            setLastSaved(new Date());
          }
        }
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        setIsSaving(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, postId, tenantId, slug, tags, featuredImage, featuredImageAttribution]);

  useEffect(() => {
    if (!isLoading && user) {
      if (!tenantId) {
        toast.error("No context found. Redirecting...");
        router.push("/dashboard?action=new-blog");
      } else {
        const isValid = user.tenants?.some(t => t.id === tenantId) || user.tenantId === tenantId;

        if (!isValid) {
          if (toastShownRef.current === tenantId) return;
          toastShownRef.current = tenantId;

          if (user.tenants && user.tenants.length > 0) {
            toast("Selected blog no longer exists. Switching to available blog.");
            router.replace(`/studio/editor?tenantId=${user.tenants[0].id}`);
          } else {
            toast.error("No blogs found. Please create one.");
            router.push("/dashboard?action=new-blog");
          }
        }
      }
    }
  }, [isLoading, user, tenantId, router]);

  if (!user || isLoading || (user && !tenantId)) {
    return (
      <div className="text-center py-20 font-mono text-foreground-subtle animate-pulse bg-noir-bg min-h-screen">
        {loadingText}
      </div>
    );
  }

  const handleSaveDraft = async () => {
    if (!tenantId) return;
    setIsSaving(true);
    try {
      const payload = {
        title,
        content,
        status: "draft" as const,
        slug,
        tags,
        featuredImage: featuredImage || undefined,
        featuredImageAttribution: featuredImageAttribution || undefined,
        wordCount,
        paragraphsCount,
        readingTimeMinutes,
      };
      if (postId) {
        await updatePost(postId, payload, tenantId);
        toast.success("Draft saved");
        setLastSaved(new Date());
      } else {
        const { post } = await createPost(payload, tenantId);
        if (post) {
          setPostId(post.id);
          toast.success("Draft created");
          setLastSaved(new Date());
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!tenantId) return;

    if (!tags || tags.length === 0) {
      toast.error("At least one tag is required to publish.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        content,
        status: "published" as const,
        slug,
        tags,
        featuredImage: featuredImage || undefined,
        featuredImageAttribution: featuredImageAttribution || undefined,
        wordCount,
        paragraphsCount,
        readingTimeMinutes,
      };

      if (postId) {
        await updatePost(postId, payload, tenantId);
      } else {
        const { post } = await createPost(payload, tenantId);
        if (post) {
          setPostId(post.id);
        }
      }

      toast.success("Published successfully!");
      setLastSaved(new Date());
      setIsSidebarOpen(false);
      setTimeout(() => router.push("/studio/posts"), 1000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to publish.");
    } finally {
      setIsSaving(false);
    }
  };

  const mockPreviewPost: FeedItem & { content: TiptapContent; readingTimeMinutes: number; status?: string } = {
    tenantId: tenantId || "",
    tenantSlug: user?.username || "my-blog",
    tenantName: user?.displayName || "My Blog",
    postId: postId || "preview-id",
    postSlug: slug || "preview-slug",
    title: title || "Untitled Draft",
    content: content,
    excerpt: "Story preview under generation...",
    featuredImage: featuredImage || undefined,
    featuredImageAttribution: featuredImageAttribution || undefined,
    tags: tags.length > 0 ? tags : ["preview", "draft"],
    authorName: user?.displayName || "You",
    authorUsername: user.username || "user",
    authorAvatar: user.avatar || undefined,
    publishedAt: new Date().toISOString(),
    viewsCount: 0,
    likesCount: 0,
    commentsCount: 0,
    readingTimeMinutes: readingTimeMinutes || 5,
    status: "draft",
  };

  const syncStatusText = isSaving
    ? getLabel("editor_sync_saving")
    : lastSaved
      ? `${getLabel("editor_sync_synced")} ${lastSaved.toLocaleTimeString()}`
      : getLabel("editor_sync_not_synced");

  if (isPreviewOpen) {
    return (
      <div className="fixed inset-0 z-[200] bg-noir-bg flex flex-col overflow-hidden">
        {/* Preview Control Bar */}
        <div className="fixed top-8 right-12 z-[210] flex gap-4">
          <Button
            onClick={() => setIsPreviewOpen(false)}
            variant="secondary"
            className={cn(
              "shadow-2xl border border-noir-border h-10 px-8 uppercase text-xs font-bold transition-all bg-noir-panel hover:bg-noir-hover",
              isCyberCopy ? "rounded-none font-mono" : "rounded-full",
            )}
          >
            {getLabel("retreat")}
          </Button>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ArticlePageWrapper
            post={mockPreviewPost}
            tenant={
              {
                id: tenantId!,
                name: user.displayName || "User",
                slug: user.username || "user",
                status: "active",
                plan: "free",
              } as Tenant
            }
            isPreview={true}
          />
        </div>
      </div>
    );
  }

  // Terminal Layout
  if (isTerminalCopy) {
    return (
      <div className="flex flex-col h-[calc(100vh-2rem)] w-full relative font-mono text-accent">
        {/* Main Terminal Window Frame */}
        <div className="flex-1 border-2 border-accent rounded-lg flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(74,246,38,0.15)] bg-black">
          {/* Top Bar */}
          <div className="bg-accent text-black px-4 py-2 flex justify-between items-center select-none shrink-0 text-sm font-bold">
            <div className="flex items-center gap-4">
              <span>[ {title || "No Name"} ]</span>
              <span>- VIM</span>
              <span className="opacity-60 hidden md:inline">[~/blog/posts/{slug || "new_story.md"}]</span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="hover:bg-black hover:text-accent px-3 py-0.5 transition-colors uppercase tracking-wider text-xs md:text-sm font-bold"
              >
                [ {previewLabel} ]
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="hover:bg-black hover:text-accent px-3 py-0.5 transition-colors uppercase tracking-wider text-xs md:text-sm font-bold"
              >
                [{isSaving ? getLabel("editor_sync_saving") : ` ${draftLabel} `}]
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hover:bg-black hover:text-accent px-3 py-0.5 transition-colors uppercase tracking-wider text-xs md:text-sm font-extrabold"
              >
                [ {publishLabel} ]
              </button>
              <Link
                href="/studio/posts"
                className="hover:bg-black hover:text-accent px-2 py-0.5 transition-colors uppercase tracking-wider text-xs md:text-sm ml-4"
              >
                [ X ]
              </Link>
            </div>
          </div>

          {/* Title Input Area */}
          <div className="border-b border-accent/20 p-6 shrink-0 bg-black">
            <Input
              placeholder={enterTitlePlaceholder}
              className="bg-transparent border-none text-4xl font-bold text-accent placeholder:text-accent/70 focus:ring-0 px-2 h-auto font-mono tracking-tight w-full"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Editor Content */}
          <div className="flex-1 relative min-h-0 bg-black">
            <TiptapEditor
              className="h-full border-none"
              content={content}
              onChange={setContent}
              tenantId={tenantId || undefined}
            />
          </div>
        </div>

        <SettingsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          slug={slug}
          tags={tags}
          featuredImage={featuredImage}
          onUpdate={updates => {
            if (updates.slug !== undefined) {
              setSlug(updates.slug);
              isSlugManuallyEdited.current = true;
            }
            if (updates.tags !== undefined) setTags(updates.tags);
            if (updates.featuredImage !== undefined) setFeaturedImage(updates.featuredImage);
          }}
          tenantId={tenantId || undefined}
          postTitle={title}
          authorUsername={user.username}
          onPublish={handlePublish}
          readingTimeMinutes={readingTimeMinutes}
          wordCount={wordCount}
          paragraphsCount={paragraphsCount}
          onSchedule={async date => {
            if (!tenantId) return;

            if (!tags || tags.length === 0) {
              toast.error("At least one tag is required to schedule.");
              return;
            }

            setIsSaving(true);
            try {
              const payload = {
                title,
                content,
                status: "scheduled" as const,
                slug,
                tags,
                featuredImage: featuredImage || undefined,
                featuredImageAttribution: featuredImageAttribution || undefined,
                scheduledAt: date,
                wordCount,
                paragraphsCount,
                readingTimeMinutes,
              };

              if (postId) {
                await updatePost(postId, payload, tenantId);
                await schedulePost(postId, date, tenantId);
              } else {
                const { post } = await createPost(payload, tenantId);
                if (post) setPostId(post.id);
              }

              toast.success("Post scheduled successfully!");
              setIsSidebarOpen(false);
              setTimeout(() => router.push("/studio/posts"), 1000);
            } catch (e) {
              console.error(e);
              toast.error("Failed to schedule.");
            } finally {
              setIsSaving(false);
            }
          }}
          isPublishing={isSaving}
          status="draft"
        />
      </div>
    );
  }

  // Standard Layout
  return (
    <ThemePage
      className={cn(
        "flex flex-col min-h-[calc(100vh-4rem)] p-4 md:p-8 text-foreground items-center justify-start",
        (isTechieCopy || isCyberCopy) && "theme-grid-overlay",
      )}
    >
      <div
        className={cn(
          "flex flex-col w-full max-w-5xl editor-container rounded-3xl overflow-hidden shadow-2xl h-[85vh]",
          getEditorContainerClasses(theme),
          isCyberCopy && "rounded-none",
          isTechieCopy && "rounded-xl bg-[var(--editor-bg)]/95 shadow-[var(--editor-glow)]",
        )}
        style={{ backgroundColor: theme === "journal" ? "var(--journal-paper)" : undefined }}
      >
        <header
          className={cn(
            "flex items-center justify-between px-8 md:px-12 py-8 border-b border-[var(--editor-border)] bg-[var(--editor-bg)] shrink-0",
            theme === "journal" && "bg-noir-bg border-accent/10",
          )}
        >
          <div className="flex items-center gap-4">
            <Link
              href="/studio/posts"
              className={cn("text-foreground-subtle hover:text-accent transition-colors flex items-center gap-2 group")}
              title={getLabel("editor_back")}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-mono group-hover:underline uppercase opacity-0 group-hover:opacity-60 transition-all">
                {getLabel("editor_back")}
              </span>
            </Link>
            <div>
              <h1 className={cn("font-bold text-xl tracking-tight uppercase", getHeadingClasses(theme))}>
                {newStoryLabel}
              </h1>
              <span className={cn("font-mono text-[10px] mt-1 block uppercase text-foreground-subtle")}>
                {syncStatusText}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsPreviewOpen(true)}
              className={cn(
                "h-9 px-6 text-xs uppercase transition-all",
                isCyberCopy ? "font-mono hover:bg-accent/10 text-accent/70" : "hover:bg-noir-hover",
                isJournalCopy &&
                  "text-accent/60 hover:bg-accent/5 hover:text-accent font-serif italic border border-transparent hover:border-accent/10",
                isTechieCopy &&
                  "font-mono text-accent border border-noir-border hover:border-accent hover:text-noir-bg hover:bg-accent",
              )}
              style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
            >
              {previewLabel}
            </Button>
            <Button
              onClick={handleSaveDraft}
              disabled={isSaving}
              variant="secondary"
              className={cn(
                "px-6 h-9 text-xs uppercase transition-all shadow-none border bg-transparent",
                isCyberCopy
                  ? "border-accent/30 text-accent hover:bg-accent/10 font-mono rounded-none"
                  : "border-noir-border text-foreground hover:bg-noir-hover",
                isJournalCopy && "border-accent/20 text-accent hover:bg-accent/5 font-serif italic",
                isTechieCopy && "border-accent-secondary/50 text-accent hover:bg-accent-secondary/10 font-mono",
              )}
              style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
            >
              {draftLabel}
            </Button>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              disabled={isSaving}
              className={cn(
                "px-8 h-9 text-xs uppercase transition-all shadow-none gap-2 font-bold",
                isCyberCopy
                  ? "bg-foreground text-noir-bg hover:bg-accent font-mono rounded-none"
                  : "bg-accent text-noir-bg",
                isJournalCopy &&
                  "bg-accent text-[#FDF5E6] hover:bg-journal-ink-muted hover:text-white font-serif italic shadow-sm hover:shadow-md",
                isTechieCopy && "bg-accent text-noir-bg hover:bg-accent-secondary hover:text-white font-mono",
              )}
              style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
            >
              <Settings size={14} />
              {isSaving ? savingLabel : publishLabel}
            </Button>
          </div>
        </header>

        <div className={cn("flex-1 flex flex-col gap-0 w-full overflow-y-auto overflow-x-hidden no-scrollbar")}>
          <div className="flex flex-col px-8 md:px-12 pt-10">
            <CoverImageManager
              value={featuredImage}
              attribution={featuredImageAttribution}
              onChange={(url, attr) => {
                setFeaturedImage(url);
                setFeaturedImageAttribution(attr || null);
              }}
              tenantId={tenantId || undefined}
              variant="editor"
            />

            <Input
              placeholder={enterTitlePlaceholder}
              className={cn(
                "text-4xl font-bold bg-transparent border-none px-0 h-auto focus:ring-0 w-full mb-8",
                isCyberCopy
                  ? "placeholder:text-foreground-subtle/20 text-foreground uppercase tracking-tighter font-mono"
                  : isTechieCopy
                    ? "font-mono uppercase tracking-tighter text-foreground placeholder:text-noir-border"
                    : config.fontFamily === "serif"
                      ? "font-serif italic"
                      : "font-sans",
              )}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <TiptapEditor
            className="flex-1 min-h-0"
            content={content}
            onChange={setContent}
            tenantId={tenantId || undefined}
          />
        </div>

        <SettingsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          slug={slug}
          tags={tags}
          featuredImage={featuredImage}
          onUpdate={updates => {
            if (updates.slug !== undefined) {
              setSlug(updates.slug);
              isSlugManuallyEdited.current = true;
            }
            if (updates.tags !== undefined) setTags(updates.tags);
            if (updates.featuredImage !== undefined) setFeaturedImage(updates.featuredImage);
          }}
          tenantId={tenantId || undefined}
          postTitle={title}
          authorUsername={user.username}
          onPublish={handlePublish}
          readingTimeMinutes={readingTimeMinutes}
          wordCount={wordCount}
          paragraphsCount={paragraphsCount}
          onSchedule={async date => {
            if (!tenantId) return;

            if (!tags || tags.length === 0) {
              toast.error("At least one tag is required to schedule.");
              return;
            }

            setIsSaving(true);
            try {
              const payload = {
                title,
                content,
                status: "scheduled" as const,
                slug,
                tags,
                featuredImage: featuredImage || undefined,
                featuredImageAttribution: featuredImageAttribution || undefined,
                scheduledAt: date,
                wordCount,
                paragraphsCount,
                readingTimeMinutes,
              };

              if (postId) {
                await updatePost(postId, payload, tenantId);
                await schedulePost(postId, date, tenantId);
              } else {
                const { post } = await createPost(payload, tenantId);
                if (post) setPostId(post.id);
              }

              toast.success("Post scheduled successfully!");
              setIsSidebarOpen(false);
              setTimeout(() => router.push("/studio/posts"), 1000);
            } catch (e) {
              console.error(e);
              toast.error("Failed to schedule.");
            } finally {
              setIsSaving(false);
            }
          }}
          isPublishing={isSaving}
          status="draft"
        />
      </div>
    </ThemePage>
  );
}
