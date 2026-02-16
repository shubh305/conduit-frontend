"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/features/studio/components/TiptapEditor";
import { toast } from "sonner";
import { useState, use, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getPost, updatePost, schedulePost } from "@/features/blog/api";
import { Post, TiptapContent } from "@/features/blog/types";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { SettingsSidebar } from "@/features/studio/components/SettingsSidebar";
import { useThemeLabel } from "@/components/theme";
import { getEditorContainerClasses } from "@/lib/theme-variants";
import { calculateReadingStats, generateSlug } from "@/features/blog/utils";
import { ThemePage } from "@/components/theme/ThemePage";
import { CoverImageManager } from "@/features/studio/components/CoverImageManager";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTenantId = searchParams.get("tenant") || searchParams.get("tenantId");
  const { theme, config } = useTheme();
  const { isCyberCopy, isTechieCopy, isJournalCopy } = useThemeHelpers();
  const t = useThemeLabel();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<TiptapContent>({ type: "doc", content: [] });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageAttribution, setFeaturedImageAttribution] = useState<{ name: string; url: string } | null>(null);

  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastSavedJsonRef = useRef("");
  const isSlugManuallyEdited = useRef(false);
  const isPublishingRef = useRef(false);

  const [wordCount, setWordCount] = useState(0);
  const [paragraphsCount, setParagraphsCount] = useState(0);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(1);

  const previewLabel = t("preview");
  const draftLabel = t("saveDraft");
  const publishLabel = t("publish");
  const savingLabel = t("saving");

  const getActiveTenantId = useCallback(() => {
    return queryTenantId || user?.tenantId || (user?.tenants && user.tenants.length > 0 ? user.tenants[0].id : null);
  }, [user, queryTenantId]);

  const activeTenantId = getActiveTenantId();

  const handleSave = useCallback(
    async (isAuto = false) => {
      const tenantId = getActiveTenantId();
      if (isPublishingRef.current || !post || !post.id || !tenantId || isSaving) return;

      const currentSaveJson = JSON.stringify({ title, content, featuredImage, slug, tags });
      if (currentSaveJson === lastSavedJsonRef.current) return;

      setIsSaving(true);
      try {
        await updatePost(
          post.id,
          {
            title,
            content,
            featuredImage: featuredImage || undefined,
            featuredImageAttribution: featuredImageAttribution || undefined,
            slug,
            tags,
            wordCount,
            paragraphsCount,
            readingTimeMinutes,
            status: post.status,
          },
          tenantId,
        );

        lastSavedJsonRef.current = currentSaveJson;
        setLastSaved(new Date());
        if (!isAuto) {
          toast.success(t("storyUpdated"));
        }
      } catch (error) {
        console.error("Failed to save", error);
        if (!isAuto) toast.error("Failed to sync.");
      } finally {
        setIsSaving(false);
      }
    },
    [
      post,
      title,
      content,
      featuredImage,
      featuredImageAttribution,
      slug,
      tags,
      getActiveTenantId,
      wordCount,
      paragraphsCount,
      readingTimeMinutes,
      t,
      isSaving,
    ],
  );

  const handlePublish = async () => {
    const tenantId = getActiveTenantId();
    if (!post || !post.id || !tenantId) return;

    if (tags.length === 0) {
      toast.warning(t("addTagWarning"));
      setIsSidebarOpen(true);
      return;
    }

    setIsSaving(true);
    isPublishingRef.current = true;
    try {
      const { post: updatedPost } = await updatePost(
        post.id,
        {
          title: title.trim() || "[Untitled]",
          content,
          featuredImage: featuredImage || undefined,
          status: "published",
          publishedAt: post.publishedAt || new Date().toISOString(),
          slug,
          tags,
          wordCount,
          paragraphsCount,
          readingTimeMinutes,
        },
        tenantId,
      );

      if (updatedPost) {
        setPost(updatedPost);
      }

      toast.success(t("storyPublished"));
      router.push("/studio/posts");
    } catch (error) {
      console.error("Failed to publish", error);
      toast.error(t("broadcastFailure"));
    } finally {
      setIsSaving(false);
      if (!post) isPublishingRef.current = false;
    }
  };

  const handlePreview = () => {
    if (!activeTenantId || !slug) return;
    const username = user?.username || "user";
    window.open(`/u/${username}/${slug}?preview=true`, "_blank");
  };

  useEffect(() => {
    async function loadPost() {
      try {
        const tenantId = getActiveTenantId();
        const { post } = await getPost(id, tenantId || undefined);
        if (post) {
          setPost(post);
          setTitle(post.title || "");
          setContent(post.content || { type: "doc", content: [] });
          setFeaturedImage(post.featuredImage || null);
          setFeaturedImageAttribution(post.featuredImageAttribution || null);
          setSlug(post.slug || "");
          setTags(post.tags || []);

          lastSavedJsonRef.current = JSON.stringify({
            title: post.title || "",
            content: post.content || { type: "doc", content: [] },
            featuredImage: post.featuredImage || null,
            slug: post.slug || "",
            tags: post.tags || [],
          });
        } else {
          setError("Post not found");
        }
      } catch (error) {
        console.error("Failed to load post", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadPost();
  }, [id, getActiveTenantId]);

  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/login?redirect=/studio/editor/" + id);
  }, [isAuthLoading, user, router, id]);

  useEffect(() => {
    if (isLoading || isAuthLoading || !post) return;

    const stats = calculateReadingStats(content);
    setWordCount(stats.wordCount);
    setParagraphsCount(stats.paragraphsCount);
    setReadingTimeMinutes(stats.readingTimeMinutes);

    if (title && !isSlugManuallyEdited.current && !slug) {
      setSlug(generateSlug(title));
    }

    const timer = setTimeout(() => handleSave(true), 5000);
    return () => clearTimeout(timer);
  }, [title, content, featuredImage, slug, tags, handleSave, isLoading, isAuthLoading, post]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="p-20 font-mono text-foreground-subtle text-center animate-pulse bg-noir-bg min-h-screen">
        {t("receivingTransmission")}
      </div>
    );
  }

  if (error || !post || !user) {
    return (
      <div className="p-20 font-mono text-red-500 text-center bg-noir-bg min-h-screen">
        {t("failure")}: {error || "TRANS_NOT_FOUND"}
      </div>
    );
  }

  const syncStatusText = isSaving ? t("syncing") : lastSaved ? `${t("saved")} ${lastSaved.toLocaleTimeString()}` : "";

  return (
    <ThemePage className="fixed inset-0 h-[100dvh] w-full md:relative md:h-full md:inset-auto z-0 overflow-hidden">
      <div className="flex flex-col items-center justify-start h-full w-full p-0 pt-[env(safe-area-inset-top)] md:pt-8 md:p-8 bg-black/20 overflow-hidden relative">
        <div
          className={cn(
            "flex flex-col w-full max-w-5xl editor-container md:rounded-3xl overflow-hidden shadow-2xl flex-1 min-h-0 border-none",
            getEditorContainerClasses(theme),
            isCyberCopy && "md:rounded-none",
            isTechieCopy && "md:rounded-xl bg-[var(--editor-bg)]/95 shadow-[var(--editor-glow)]",
            "pb-20 md:pb-0",
          )}
          style={{ backgroundColor: theme === "journal" ? "var(--journal-paper)" : undefined }}
        >
          <header
            className={cn(
              "flex items-center justify-between px-4 md:px-12 py-2 md:py-6 border-b border-[var(--editor-border)] bg-[var(--editor-bg)] shrink-0",
              theme === "journal" && "bg-noir-bg border-accent/10",
            )}
          >
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/studio/posts"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full text-foreground/60 hover:text-accent hover:bg-accent/10 transition-all group border border-transparent hover:border-accent/20",
                )}
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-bold uppercase tracking-widest",
                    post.status === "published"
                      ? "text-emerald-500"
                      : post.status === "scheduled"
                        ? "text-sky-500"
                        : "text-amber-500",
                  )}
                >
                  {post.status === "draft" ? t("draft") : post.status === "scheduled" ? t("scheduled") : t("published")}
                </span>
                <span className={cn("font-mono text-[9px] md:text-[10px] mt-0.5 block uppercase text-foreground/40")}>
                  {syncStatusText}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="hidden md:flex gap-2">
                <Button
                  onClick={handlePreview}
                  variant="ghost"
                  className={cn(
                    "px-4 md:px-6 h-8 md:h-9 text-[10px] md:text-xs uppercase font-bold tracking-wider",
                    isCyberCopy
                      ? "text-accent border border-accent/20 hover:bg-accent/10"
                      : theme === "terminal"
                        ? "text-accent border border-accent/30 hover:bg-accent hover:text-black font-mono"
                        : "text-foreground-subtle hover:text-accent hover:bg-accent/5",
                  )}
                  style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
                >
                  {previewLabel} <ExternalLink size={14} className="ml-2" />
                </Button>
                <Button
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className={cn(
                    "px-4 md:px-6 h-8 md:h-9 text-[10px] md:text-xs uppercase font-bold tracking-wider",
                    isCyberCopy
                      ? "bg-noir-panel border border-accent/20 text-accent hover:bg-accent/5"
                      : theme === "terminal"
                        ? "bg-black border border-accent/40 text-accent hover:bg-accent/10 font-mono"
                        : "bg-foreground/5 hover:bg-foreground/10 text-foreground border-none",
                  )}
                  style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
                >
                  {isSaving ? savingLabel : draftLabel}
                </Button>
                <Button
                  onClick={() => {
                    handleSave();
                    setIsSidebarOpen(true);
                  }}
                  disabled={isSaving}
                  className={cn(
                    "px-4 md:px-8 h-8 md:h-9 text-[10px] md:text-xs uppercase transition-all shadow-none gap-1.5 md:gap-2 font-bold",
                    isCyberCopy
                      ? "bg-accent text-noir-bg rounded-none hover:bg-accent/90 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                      : isTechieCopy
                        ? "bg-accent text-noir-bg rounded-none hover:bg-accent-secondary shadow-[0_0_12px_rgba(var(--accent-rgb),0.2)]"
                        : isJournalCopy
                          ? "rounded-lg bg-[#8B4513] text-[#fdf5e6] hover:bg-[#A0522D] font-serif shadow-md hover:shadow-lg border border-transparent"
                          : theme === "terminal"
                            ? "bg-accent text-black font-mono uppercase font-black hover:bg-accent/90 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                            : "bg-accent hover:bg-accent/80 text-noir-bg",
                  )}
                  style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
                >
                  <Settings size={14} className="shrink-0" />
                  <span className="hidden sm:inline">{t("settings")}</span>
                </Button>
              </div>
            </div>
          </header>

          <div className="flex flex-col px-4 md:px-12 pt-4 md:pt-8 shrink-0">
            <CoverImageManager
              value={featuredImage}
              attribution={featuredImageAttribution}
              onChange={(url, attr) => {
                setFeaturedImage(url);
                setFeaturedImageAttribution(attr || null);
              }}
              tenantId={activeTenantId || undefined}
              variant="editor"
            />

            <Input
              placeholder={t("articleTitlePlaceholder")}
              className={cn(
                "text-2xl md:text-4xl font-bold bg-transparent border-none h-auto focus:ring-0 w-full mb-2 md:mb-4 px-4",
                isCyberCopy
                  ? "placeholder:text-foreground-subtle/20 text-foreground uppercase tracking-tighter font-mono"
                  : isTechieCopy
                    ? "font-mono uppercase tracking-tighter text-foreground placeholder:text-noir-border"
                    : theme === "terminal"
                      ? "font-mono uppercase tracking-tighter text-accent placeholder:text-accent/10 terminal-glow"
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
            tenantId={activeTenantId || undefined}
            title={title}
            onTitleChange={setTitle}
            featuredImage={featuredImage}
            onFeaturedImageChange={setFeaturedImage}
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
          tenantId={activeTenantId || undefined}
          postTitle={title}
          authorUsername={user.username}
          onPublish={handlePublish}
          readingTimeMinutes={readingTimeMinutes}
          wordCount={wordCount}
          paragraphsCount={paragraphsCount}
          onSchedule={async date => {
            const tenantId = getActiveTenantId();
            if (!post || !post.id || !tenantId) return;

            if (tags.length === 0) {
              toast.warning(t("addTagWarningSchedule"));
              setIsSidebarOpen(true);
              return;
            }

            setIsSaving(true);
            try {
              await updatePost(
                post.id,
                {
                  title,
                  content,
                  featuredImage: featuredImage || undefined,
                  slug,
                  tags,
                  status: "scheduled",
                  scheduledAt: date,
                  wordCount,
                  paragraphsCount,
                  readingTimeMinutes,
                },
                tenantId,
              );
              await schedulePost(post.id, date, tenantId);
              toast.success("Post scheduled successfully!");
              router.push("/studio/posts");
            } catch (e) {
              console.error(e);
              toast.error("Failed to schedule.");
            } finally {
              setIsSaving(false);
            }
          }}
          scheduledAt={post.scheduledAt}
          isPublishing={isSaving}
          status={post.status}
        />
        {/* Mobile Action Bar */}
        <div
          className={cn(
            "md:hidden fixed bottom-0 left-0 right-0 z-[120] p-4 flex gap-3 border-t backdrop-blur-md",
            "bg-[var(--editor-bg)]/90 border-[var(--editor-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
            "pb-[calc(1rem+env(safe-area-inset-bottom))]",
          )}
        >
          <Button
            variant="outline"
            onClick={handlePreview}
            className={cn(
              "flex-1 h-12 text-[10px] font-black uppercase tracking-widest",
              isCyberCopy ? "rounded-none border-accent/30 text-accent" : "rounded-xl border-foreground/10",
            )}
          >
            {previewLabel}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave()}
            disabled={isSaving}
            className={cn(
              "flex-1 h-12 text-[10px] font-black uppercase tracking-widest",
              isCyberCopy ? "rounded-none border-accent/30 text-accent" : "rounded-xl border-foreground/10",
            )}
          >
            {isSaving ? savingLabel : "Save Draft"}
          </Button>
          <Button
            onClick={() => setIsSidebarOpen(true)}
            disabled={isSaving}
            className={cn(
              "flex-1 h-12 text-[10px] font-black uppercase tracking-widest bg-accent text-noir-bg",
              isCyberCopy ? "rounded-none" : "rounded-xl",
            )}
          >
            {publishLabel}
          </Button>
        </div>
      </div>
    </ThemePage>
  );
}
