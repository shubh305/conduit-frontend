"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { ClassicArticleLayout } from "./ClassicArticleLayout";
import { CyberArticleLayout } from "./CyberArticleLayout";
import { JournalArticleLayout } from "./JournalArticleLayout";
import { TerminalPostLayout } from "./TerminalPostLayout";
import { TechieArticleLayout } from "./TechieArticleLayout"
import { FeedItem } from "@/features/feed/types";
import { TiptapContent, Tenant } from "@/features/blog/types"
import { useEffect } from "react";
import { useLibrary } from "@/features/library/context/LibraryContext";
import { ThemePage, useThemeLabel } from "@/components/theme";

interface ArticlePageWrapperProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number; status?: string }
  tenant: Tenant
  nextPost?: FeedItem
  isPreview?: boolean
}

const IMMERSIVE_THEMES = ["cyber", "sakura", "ronin"] as const;

export function ArticlePageWrapper({ post, tenant, nextPost, isPreview }: ArticlePageWrapperProps) {
  const { theme } = useTheme();
  const { addToHistory } = useLibrary();

  useEffect(() => {
    addToHistory(post);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.postId]);

  const { isJournalCopy, isTerminalCopy, isTechieCopy } = useThemeHelpers()
  const isImmersive = IMMERSIVE_THEMES.includes(theme as (typeof IMMERSIVE_THEMES)[number]);

  return (
    <ThemePage className="min-h-screen transition-all duration-500">
      {post.status === "draft" && <DraftBanner />}

      {isJournalCopy ? (
        <JournalArticleLayout key={post.postId} post={post} tenant={tenant} nextPost={nextPost} isPreview={isPreview} />
      ) : isTerminalCopy ? (
        <TerminalPostLayout key={post.postId} post={post} tenant={tenant} nextPost={nextPost} isPreview={isPreview} />
      ) : isTechieCopy ? (
        <TechieArticleLayout key={post.postId} post={post} tenant={tenant} isPreview={isPreview} />
      ) : isImmersive ? (
        <CyberArticleLayout key={post.postId} post={post} tenant={tenant} isPreview={isPreview} />
      ) : (
        <ClassicArticleLayout key={post.postId} post={post} tenant={tenant} isPreview={isPreview} />
      )}
    </ThemePage>
  )
}

function DraftBanner() {
  const t = useThemeLabel();
  const draftText = t("draft");
  return <div className="bg-accent text-noir-bg text-center py-2.5 text-[10px] font-black uppercase tracking-[0.3em] sticky top-0 z-[100] shadow-xl">{draftText}</div>;
}
