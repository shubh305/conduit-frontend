"use client";

import { Post } from "@/features/blog/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Tab = "drafts" | "published" | "scheduled" | "unlisted";

export function PostsList({ posts }: { posts: Post[] }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("drafts");

  const filteredPosts = posts.filter(post => {
      if (activeTab === 'drafts') return post.status === 'draft';
      if (activeTab === 'published') return post.status === 'published';
      if (activeTab === 'scheduled') return false;
      return (post.status as string) === 'unlisted';
  });

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className={cn(
          "flex items-center gap-6 border-b mb-8 overflow-x-auto no-scrollbar",
          theme === 'cyber' ? "border-white/10" : "border-white/10"
      )}>
        {(['drafts', 'scheduled', 'published', 'unlisted'] as Tab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                    "pb-3 text-sm transition-all capitalize relative whitespace-nowrap",
                    theme === 'cyber' ? "font-mono tracking-wider uppercase text-xs" : "font-sans",
                    activeTab === tab 
                        ? (theme === 'cyber' ? "text-signal-green" : "text-white font-medium") 
                        : "text-gray-500 hover:text-gray-300"
                )}
            >
                {tab} 
                <span className="ml-2 opacity-50">
                    {tab === 'drafts' ? posts.filter(p => p.status === 'draft').length : ''}
                    {tab === 'published' ? posts.filter(p => p.status === 'published').length : ''}
                    {tab === 'scheduled' ? 0 : ''}
                </span>
                
                {activeTab === tab && (
                    <div className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5",
                        theme === 'cyber' ? "bg-signal-green" : "bg-white"
                    )} />
                )}
            </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col">
        {filteredPosts.length === 0 ? (
            <div className={cn(
                "py-12 text-center text-gray-500 text-sm",
                theme === 'cyber' ? "font-mono uppercase tracking-widest" : "font-sans"
            )}>
                NO TRANSMISSIONS FOUND IN {activeTab.toUpperCase()}
            </div>
        ) : (
            filteredPosts.map((post) => (
                <div 
                    key={post.id} 
                    className={cn(
                        "group py-6 border-b flex justify-between items-start transition-colors",
                         theme === 'cyber' 
                            ? "border-white/5 hover:bg-white/5" 
                            : "border-white/10 hover:bg-white/5"
                    )}
                >
                    <div className="flex-1 pr-8">
                        <Link href={`/studio/editor/${post.id}`} className="block">
                            <h3 className={cn(
                                "text-lg md:text-xl font-bold mb-2 tracking-tight",
                                theme === 'cyber' ? "text-gray-200 font-mono tracking-tighter" : "text-white font-serif"
                            )}>
                                {post.title || "Untitled Story"}
                            </h3>
                            <p className={cn(
                                "text-sm mb-2 line-clamp-1",
                                theme === 'cyber' ? "text-gray-500 font-mono" : "text-gray-400 font-serif"
                            )}>
                                {post.excerpt || "No description preview available..."}
                            </p>
                            <div className={cn(
                                "flex items-center gap-2 text-xs uppercase tracking-widest",
                                theme === 'cyber' ? "font-mono text-signal-green/70" : "font-sans text-gray-500"
                            )}>
                                <span>{post.status}</span>
                                <span>·</span>
                                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                <span>·</span>
                                <span>{post.readingTimeMinutes} min read</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                    <MoreHorizontal size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={cn(
                                theme === 'cyber' ? "bg-black border-signal-green/20 text-gray-300 rounded-none" : "bg-[#121212] border-white/10 text-white"
                            )}>
                                <DropdownMenuItem asChild className={theme === 'cyber' ? "focus:bg-signal-green/10 rounded-none" : ""}>
                                    <Link href={`/studio/editor/${post.id}`}>Edit Draft</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className={theme === 'cyber' ? "focus:bg-signal-green/10 rounded-none" : ""}>
                                    <Link href={`/u/alice/${post.slug}`}>View Public</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className={cn("text-red-500 focus:text-red-500", theme === 'cyber' ? "focus:bg-red-500/10 rounded-none" : "")}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
