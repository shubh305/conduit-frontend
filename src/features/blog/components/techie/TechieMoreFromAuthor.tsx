"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/features/blog/api";
import { Post } from "@/features/blog/types";
import { cn, getMediaUrl } from "@/lib/utils";

interface TechieMoreFromAuthorProps {
  currentPostId: string;
  tenantSlug: string;
  tenantId: string;
  className?: string;
}

export function TechieMoreFromAuthor({
  currentPostId,
  tenantSlug,
  tenantId,
  className,
}: TechieMoreFromAuthorProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts(tenantId, { limit: 5 });
        const filtered = data.filter((post) => post.id !== currentPostId).slice(0, 4);
        setPosts(filtered);
      } catch (e) {
        console.error("Failed to fetch more posts", e);
      }
    };

    if (tenantId) fetchPosts();
  }, [tenantId, currentPostId]);

  if (posts.length === 0) return null;

  return (
    <div className={cn("py-16 border-t border-white/5 bg-noir-bg", className)}>
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h3 className="text-accent font-mono text-lg uppercase tracking-wider flex items-center gap-2 italic font-black">
            <div className="w-1.5 h-1.5 bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] animate-pulse" />
            GO_EVEN_DEEPER
          </h3>
          <Link 
            href={`/${tenantSlug}`}
            className="text-[10px] font-mono text-accent/60 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group"
          >
            VIEW_ALL_TRANSMISSIONS <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            const score = (((parseInt(post.id.substring(0, 8), 16) % 30) + 70) / 10).toFixed(1);
            return (
              <Link 
                key={post.id} 
                href={`/${tenantSlug}/${post.slug}`} 
                className="group block bg-noir-panel/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden rounded-xl border-none"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-noir-panel/30 overflow-hidden border-b border-white/5">
                    {post.featuredImage ? (
                      <Image
                        src={getMediaUrl(post.featuredImage) || ""}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-accent/20 font-mono text-[10px] uppercase font-bold tracking-tighter">DATA_MISSING</div>
                    )}

                    {/* Category Label */}
                    <div className="absolute top-2 left-2">
                         <div className="bg-noir-bg/80 text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 backdrop-blur-sm text-foreground/50">
                             {(post.tags && post.tags[0]) || "SPEC"}
                         </div>
                    </div>
                    
                    {/* Industrial Score Badge */}
                    <div className="absolute bottom-2 right-2 bg-accent/20 backdrop-blur-md px-1.5 py-1 flex items-center shadow-sm">
                        <span className="text-accent font-mono text-[9px] font-black">{score}</span>
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.02)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.02)_1px,transparent_1px)] bg-[length:12px_12px] pointer-events-none" />
                </div>

                <div className="p-4 flex flex-col h-full">
                    <h4 className="text-white font-sans font-extrabold text-sm leading-tight mb-4 group-hover:text-accent/80 transition-all line-clamp-2 uppercase tracking-tight">
                      {post.title}
                    </h4>
                    <div className="mt-auto flex items-center justify-between text-[8px] font-mono text-foreground/40 pt-2 border-t border-white/5">
                       <span className="text-accent/50">{new Date(post.publishedAt).toLocaleDateString()}</span>
                       <span className="uppercase tracking-widest">{post.authorName?.split(' ')[0] || "USER"}</span>
                    </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
