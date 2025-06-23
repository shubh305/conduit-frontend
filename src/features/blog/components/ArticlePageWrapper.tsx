"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { ClassicArticleLayout } from "./ClassicArticleLayout";
import { CyberArticleLayout } from "./CyberArticleLayout";

import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";

interface ArticlePageWrapperProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
}

export function ArticlePageWrapper({ post, tenant }: ArticlePageWrapperProps) {
  const { theme } = useTheme();

  if (theme === 'cyber') {
    return <CyberArticleLayout post={post} tenant={tenant} />;
  }

  return <ClassicArticleLayout post={post} tenant={tenant} />;
}
