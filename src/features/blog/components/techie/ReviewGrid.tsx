"use client";

import Link from "next/link";
import Image from "next/image";
import { FeedItem } from "@/features/feed/types";
import { cn, getMediaUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare } from "lucide-react";

interface ReviewGridProps {
  posts: FeedItem[];
  className?: string;
}

export function ReviewGrid({ posts, className }: ReviewGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {posts.map((post) => {
        const score = (((parseInt(post.postId.substring(0, 8), 16) % 30) + 70) / 10).toFixed(1);
        return (
          <div key={post.postId} className="group flex flex-col h-full bg-noir-panel/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-all duration-500 relative rounded-xl overflow-hidden border-none text-foreground/70">
             {/* Card Glint Effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Image Container */}
            <Link href={`/${post.postSlug}`} className="relative aspect-[16/10] overflow-hidden block border-b border-white/5">
               {post.featuredImage ? (
                  <Image
                  src={getMediaUrl(post.featuredImage) || ""}
                  alt={post.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
                  />
              ) : (
                  <div className="w-full h-full bg-noir-panel/30 flex items-center justify-center font-mono text-[10px] text-accent/20 uppercase font-black">
                      DATA_MISSING
                  </div>
              )}
              
              {/* Score Badge (Deterministic) */}
              <div className="absolute top-2 right-2 bg-accent/20 backdrop-blur-md px-1.5 py-1 flex items-center shadow-sm">
                  <span className="text-accent font-mono text-[9px] font-black">{score}</span>
              </div>
              
              {/* Category Pill */}
               <div className="absolute bottom-2 left-2">
                   <Badge variant="secondary" className="bg-noir-bg/80 backdrop-blur-sm text-foreground/60 border border-white/5 text-[9px] font-mono uppercase tracking-[0.2em] rounded-none hover:bg-noir-panel transition-colors">
                       {post.tags?.[0] || "SPEC"}
                   </Badge>
               </div>

               <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.02)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.02)_1px,transparent_1px)] bg-[length:12px_12px] pointer-events-none" />
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2 text-[8px] font-mono text-foreground/30 uppercase tracking-[0.2em]">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span className="opacity-30 italic">{"//"}</span>
                  <span>PROC_v4</span>
              </div>
              <Link href={`/${post.postSlug}`} className="block mb-2 group-hover:text-accent/80 transition-all">
                  <h3 className="text-lg font-black text-white leading-tight line-clamp-2 uppercase tracking-tight">
                      {post.title}
                  </h3>
              </Link>
              
              <p className="text-foreground/50 text-sm line-clamp-2 mb-6 leading-relaxed font-sans">
                  {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-foreground/40 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                      <span className="text-accent/50">{post.authorName?.split(' ')[0] || "USER"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1.5">
                          <ThumbsUp size={10} className="text-accent/30" /> {post.likesCount}
                       </span>
                       <span className="flex items-center gap-1.5">
                          <MessageSquare size={10} className="text-accent/30" /> {post.commentsCount}
                       </span>
                  </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
