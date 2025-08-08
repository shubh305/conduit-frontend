"use client";

import { Post } from "@/features/blog/types";
import { Button } from "@/components/ui/button";
import { Edit2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils";

export function PostsTable({ posts, onDelete }: { posts: Post[]; onDelete?: (id: string) => void; onRestore?: (id: string) => void }) {
  const { config } = useTheme();
  const { isCyberCopy, isRoninCopy } = useThemeHelpers()
  const { getLabel } = useStudioLabels()

  return (
    <div
      className={cn(
        "overflow-x-auto border transition-all duration-500",
        "border-noir-border bg-noir-bg shadow-xl",
        isCyberCopy ? "rounded-none" : isRoninCopy ? "rounded-sm border-accent/20" : "rounded-2xl",
      )}
    >
      <table className="w-full text-left">
        <thead
          className={cn(
            "border-b font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
            "bg-noir-panel border-noir-border text-foreground-subtle",
          )}
        >
          <tr>
            <th className="px-8 py-5 font-bold">{getLabel("table_title")}</th>
            <th className="px-8 py-5 font-bold">{getLabel("table_status")}</th>
            <th className="px-8 py-5 font-bold">{getLabel("table_stats")}</th>
            <th className="px-8 py-5 font-bold">{getLabel("table_date")}</th>
            <th className="px-8 py-5 font-bold text-right">{getLabel("table_actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-noir-border">
          {posts.map(post => (
            <tr key={post.id} className="transition-all hover:bg-noir-hover group">
              <td className="px-8 py-6">
                <div
                  className={cn(
                    "font-black text-foreground transition-colors group-hover:text-accent",
                    isCyberCopy
                      ? "font-mono uppercase tracking-tighter"
                      : isRoninCopy
                        ? "font-serif tracking-normal text-lg"
                        : config.fontFamily === "serif"
                          ? "font-serif italic text-lg"
                          : "font-sans text-base",
                  )}
                >
                  {post.title}
                </div>
                <div className="font-mono text-[9px] text-foreground-subtle mt-1 uppercase tracking-widest opacity-50">
                  /{post.slug}
                </div>
              </td>
              <td className="px-8 py-6">
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase px-3 py-1 border transition-all shadow-sm",
                    post.status === "published"
                      ? "border-accent/40 text-accent bg-accent/5 font-bold"
                      : "border-noir-border text-foreground-subtle bg-noir-panel/50",
                    isCyberCopy ? "rounded-none" : "rounded-full",
                  )}
                >
                  {post.status === "published" ? getLabel("status_published") : getLabel("status_draft")}
                </span>
              </td>
              <td className="px-8 py-6 font-mono text-[10px] text-foreground-subtle tracking-widest uppercase">
                {post.viewsCount.toLocaleString()} {getLabel("stats_views")}
              </td>
              <td className="px-8 py-6 font-mono text-[10px] text-foreground-subtle tracking-tighter uppercase whitespace-nowrap">
                {new Date(post.publishedAt).toLocaleDateString("en-US")}
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Link href={`/studio/editor/${post.id}?tenant=${post.tenantId}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 hover:text-accent hover:bg-accent/5"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Button>
                  </Link>
                  <Link
                    href={
                      post.tenantSlug
                        ? `/${post.tenantSlug}/${post.slug}`
                        : post.authorUsername
                          ? `/u/${post.authorUsername}/${post.slug}`
                          : `/${post.slug}`
                    }
                    target="_blank"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 hover:text-accent hover:bg-accent/5"
                      title="View"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                    title="Delete"
                    onClick={() => onDelete?.(post.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
