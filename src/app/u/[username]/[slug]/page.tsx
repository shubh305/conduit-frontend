"use client";

import { use } from "react";
import { ArticlePageWrapper } from "@/features/blog/components/ArticlePageWrapper";
import { usePostLoader } from "@/features/blog/hooks/usePostLoader";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { TerminalLoader } from "@/features/blog/components/TerminalLoader";

export default function PublicPostPage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = use(params);
  const { loading, error, data } = usePostLoader(username, slug);
  const { isTerminalCopy, isJournalCopy, isRoninCopy, isCyberCopy, isSakuraCopy } = useThemeHelpers();

  if (loading) {
    if (isTerminalCopy) {
      return <TerminalLoader />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground/50 font-mono animate-pulse">
        {isJournalCopy ? "Opening journal..." : isRoninCopy ? "Unsheathing..." : isCyberCopy ? "ESTABLISHING_UPLINK..." : isSakuraCopy ? "読み込み中..." : "Loading..."}
      </div>
    );
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-mono tracking-widest uppercase">{error || "404 NOT FOUND"}</div>;
  }

  return <ArticlePageWrapper post={data.post} tenant={data.tenant} />;
}
