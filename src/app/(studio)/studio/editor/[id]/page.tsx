"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/features/studio/components/TiptapEditor";
import { toast } from "sonner";
import { useState, use, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, PanelRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getPost, updatePost, schedulePost } from "@/features/blog/api";
import { Post, TiptapContent } from "@/features/blog/types";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { cn, getMediaUrl } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { SettingsSidebar } from "@/features/studio/components/SettingsSidebar";
import { useThemeLabel } from "@/components/theme/ThemeLabel";
import { getRoundedClass } from "@/lib/theme-variants";
import { calculateReadingStats, generateSlug } from "@/features/blog/utils";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTenantId = searchParams.get("tenant") || searchParams.get("tenantId")
  const { theme, config } = useTheme();
  const { isCyberCopy } = useThemeHelpers();
  const t = useThemeLabel();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState<Post | null>(null);


  const [title, setTitle] = useState("");
  const [content, setContent] = useState<TiptapContent>({ type: "doc", content: [] });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);


  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastSavedJsonRef = useRef("");
  const isSlugManuallyEdited = useRef(false);


  const [wordCount, setWordCount] = useState(0);
  const [paragraphsCount, setParagraphsCount] = useState(0);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(1);

  const getActiveTenantId = useCallback(() => {
    return queryTenantId || user?.tenantId || (user?.tenants && user.tenants.length > 0 ? user.tenants[0].id : null);
  }, [user, queryTenantId]);

  const generateExcerpt = (content: TiptapContent): string => {
    try {
      const texts: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const traverse = (node: any) => {
        if (node.text) texts.push(node.text);
        if (node.content) node.content.forEach(traverse);
      };
      content.content.forEach(traverse);
      return texts.join(" ").slice(0, 160) + "...";
    } catch {
      return "";
    }
  };

  const activeTenantId = getActiveTenantId();

  const handleSave = useCallback(
    async (isAuto = false) => {
      const tenantId = getActiveTenantId();
      if (!post || !post.id || !tenantId) return;

      const currentSaveJson = JSON.stringify({ title, content, featuredImage, slug, tags });
      if (currentSaveJson === lastSavedJsonRef.current) return;

      setIsSaving(true);
      try {
        const excerpt = generateExcerpt(content);
        await updatePost(
          post.id,
          {
            title,
            content,
            excerpt,
            featuredImage: featuredImage || undefined,
            slug,
            tags,
            wordCount,
            paragraphsCount,
            readingTimeMinutes,
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
      slug,
      tags,
      getActiveTenantId,
      wordCount,
      paragraphsCount,
      readingTimeMinutes,
      t,
    ],
  );

  const handlePublish = async () => {
    const tenantId = getActiveTenantId();
    if (!post || !post.id || !tenantId) return;

    if (tags.length === 0) {
      toast.warning(t("addTagWarning"), {
        action: {
          label: t("addTags"),
          onClick: () => setIsSidebarOpen(true),
        },
      });
      setIsSidebarOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const excerpt = generateExcerpt(content);
      await updatePost(
        post.id,
        {
          title,
          content,
          excerpt,
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
      toast.success(t("storyPublished"));
      router.push("/studio/posts");
    } catch (error) {
      console.error("Failed to publish", error);
      toast.error(t("broadcastFailure"));
    } finally {
      setIsSaving(false);
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
    if (!isAuthLoading && !user) router.push("/login");
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (isLoading || isAuthLoading || !post) return


    const stats = calculateReadingStats(content)
    setWordCount(stats.wordCount)
    setParagraphsCount(stats.paragraphsCount)
    setReadingTimeMinutes(stats.readingTimeMinutes)


    if (title && !isSlugManuallyEdited.current && !slug) {
      setSlug(generateSlug(title))
    }

    const timer = setTimeout(() => handleSave(true), 5000)
    return () => clearTimeout(timer)
  }, [title, content, featuredImage, slug, tags, handleSave, isLoading, isAuthLoading, post])

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

  return (
    <div className={cn("flex flex-col h-[calc(100vh-0rem)] bg-noir-bg text-foreground")}>
      <header className="flex items-center justify-between px-6 h-16 border-b border-noir-border shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/studio/posts" className="text-foreground-subtle hover:text-accent transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                post.status === "published"
                  ? "text-emerald-500"
                  : post.status === "scheduled"
                    ? "text-sky-500"
                    : "text-amber-500",
              )}
            >
              {post.status === "draft" ? t("draft") : post.status === "scheduled" ? t("scheduled") : t("published")}
            </span>
            {lastSaved && (
              <span className="text-[10px] uppercase font-mono mt-0.5 text-foreground-subtle">
                {isSaving ? t("syncing") : t("saved")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePreview}
            variant="ghost"
            className="h-9 text-xs uppercase gap-2 hidden md:flex text-foreground-subtle hover:text-accent hover:bg-noir-hover"
          >
            {t("preview")} <ExternalLink size={14} />
          </Button>

          <div className="w-px h-6 mx-2 bg-noir-border" />

          <Button
            onClick={() => setIsSidebarOpen(true)}
            variant="ghost"
            className="h-9 text-xs uppercase gap-2 px-3 text-foreground-subtle hover:text-accent hover:bg-noir-hover"
          >
            <span className="flex items-center gap-2">
              <PanelRight size={16} />
              {t("settings")}
            </span>
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isSaving}
            className={cn(
              "px-6 h-9 text-xs uppercase transition-all shadow-none font-bold",
              isCyberCopy
                ? "bg-foreground text-noir-bg hover:bg-accent font-mono rounded-none"
                : "bg-accent text-noir-bg",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "var(--theme-radius-full)" }}
          >
            {isSaving ? "..." : t("publish")}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-3xl mx-auto py-12 px-6 flex flex-col gap-6 min-h-full">
          {featuredImage && (
            <div
              className={cn(
                "w-full aspect-video overflow-hidden relative mb-4 group cursor-pointer border border-noir-border",
                getRoundedClass(theme, "lg"),
              )}
              onClick={() => setIsSidebarOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getMediaUrl(featuredImage)} className="w-full h-full object-cover" alt="cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-widest text-white">
                {t("changeCover")}
              </div>
            </div>
          )}

          <Input
            placeholder={t("articleTitlePlaceholder")}
            className={cn(
              "text-4xl md:text-5xl font-bold bg-transparent border-none px-0 h-auto focus:ring-0 leading-tight resize-none shadow-none",
              isCyberCopy
                ? "placeholder:text-foreground-subtle/20 text-foreground font-mono uppercase tracking-tighter"
                : config.fontFamily === "serif"
                  ? "font-serif italic"
                  : "font-sans",
            )}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <TiptapEditor
            className="flex-1 min-h-[50vh] text-lg leading-relaxed"
            content={content}
            onChange={setContent}
            tenantId={activeTenantId || undefined}
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
        tenantId={activeTenantId || undefined}
        postTitle={title}
        authorUsername={user.username}
        onPublish={handlePublish}
        onSchedule={async date => {
          const tenantId = getActiveTenantId();
          if (!post || !post.id || !tenantId) return;

          if (tags.length === 0) {
            toast.warning(t("addTagWarningSchedule"), {
              action: {
                label: t("addTags"),
                onClick: () => setIsSidebarOpen(true),
              },
            });
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
        readingTimeMinutes={readingTimeMinutes}
        wordCount={wordCount}
        paragraphsCount={paragraphsCount}
      />
    </div>
  );
}
