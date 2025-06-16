"use client";

import { Post } from "@/features/blog/types";
import { Button } from "@/components/ui/button";
import { Edit2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function PostsTable({ posts }: { posts: Post[] }) {
  const { theme } = useTheme();

  return (
    <div className={cn(
        "overflow-x-auto border",
        theme === 'cyber' ? "border-noir-border bg-noir-bg" : "border-white/10 bg-[#121212]"
    )}>
      <table className="w-full text-left">
        <thead className={cn(
            "border-b font-mono text-xs uppercase",
            theme === 'cyber' ? "bg-noir-panel border-noir-border text-gray-500" : "bg-[#1A1A1A] border-white/10 text-gray-300 font-bold"
        )}>
          <tr>
            <th className="px-6 py-4 font-normal tracking-wider">Title</th>
            <th className="px-6 py-4 font-normal tracking-wider">Status</th>
            <th className="px-6 py-4 font-normal tracking-wider">Stats</th>
            <th className="px-6 py-4 font-normal tracking-wider">Date</th>
            <th className="px-6 py-4 font-normal tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className={cn("divide-y", theme === 'cyber' ? "divide-noir-border" : "divide-white/10")}>
          {posts.map((post) => (
            <tr key={post.id} className={cn("transition-colors", theme === 'cyber' ? "hover:bg-noir-hover" : "hover:bg-white/5")}>
              <td className="px-6 py-4">
                <div className={cn("font-bold", theme === 'cyber' ? "font-sans text-white" : "font-serif text-white text-lg")}>
                    {post.title}
                </div>
                <div className="font-mono text-xs text-gray-500 mt-1">/{post.slug}</div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "font-mono text-[10px] uppercase px-2 py-1 border",
                  theme === 'cyber' 
                    ? (post.status === 'published' ? 'border-signal-green text-signal-green' : 'border-gray-500 text-gray-500')
                    : (post.status === 'published' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10')
                )}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-400">
                {post.viewsCount.toLocaleString()} views
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", theme === 'cyber' ? "text-white" : "text-gray-400 hover:text-white")} title="Edit">
                    <Edit2 size={14} />
                  </Button>
                  <Link href={`/alice/${post.slug}`} target="_blank">
                     <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", theme === 'cyber' ? "text-white" : "text-gray-400 hover:text-white")} title="View">
                        <ExternalLink size={14} />
                     </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-signal-red" title="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
