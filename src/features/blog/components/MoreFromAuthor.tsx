"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Post } from "@/features/blog/types";
import { Star, MessageCircle, Hand } from "lucide-react";

interface MoreFromAuthorProps {
  authorName: string;
  currentPostId: string;
  tenantSlug: string;
  posts: Post[];
}

export function MoreFromAuthor({ authorName, currentPostId, tenantSlug, posts }: MoreFromAuthorProps) {
  const { theme } = useTheme();

  const relatedPosts = posts
    .filter(post => post.authorName === authorName && post.id !== currentPostId)
    .slice(0, 4);

  if (relatedPosts.length === 0) return null;

  return (
    <div className={cn(
      "py-16 border-t",
      theme === 'cyber' ? "bg-black border-white/10" : "bg-noir-panel border-noir-border"
    )}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h3 className={cn(
          "text-xl font-bold mb-10",
          theme === 'cyber' ? "text-white font-mono" : "text-white font-sans"
        )}>
          More from {authorName}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedPosts.map(post => (
            <Link key={post.id} href={`/${tenantSlug}/${post.slug}`} className="group block h-full">
              <article className="flex flex-col h-full">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden mb-4 relative bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                         {/* Author Avatar (mock) */}
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-700">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`} alt={post.authorName} className="w-full h-full object-cover" />
                        </div>
                        <span className={cn(
                             "font-medium",
                             theme === 'cyber' ? "text-gray-300" : "text-gray-300"
                        )}>{post.authorName}</span>
                    </div>

                    <h4 className={cn(
                        "text-lg font-bold leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4",
                        theme === 'cyber' ? "text-white font-mono" : "text-white font-sans"
                    )}>
                        {post.title}
                    </h4>

                    <p className={cn(
                        "text-sm line-clamp-2 mb-4 flex-1",
                        theme === 'cyber' ? "text-gray-400" : "text-gray-400 font-serif"
                    )}>
                        {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className={cn(
                        "flex items-center justify-between text-xs mt-auto pt-4 border-t",
                        theme === 'cyber' ? "border-white/10 text-gray-500" : "border-gray-800 text-gray-500"
                    )}>
                        <div className="flex items-center gap-4">
                             <span className="flex items-center gap-1">
                                 <Star size={12} className={theme === 'cyber' ? "text-signal-green" : "text-yellow-500"} fill="currentColor" />
                                 {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                             </span>
                             <span className="flex items-center gap-1">
                                 <Hand size={12} />
                                 {(post.likesCount || 0)} 
                             </span>
                             <span className="flex items-center gap-1">
                                 <MessageCircle size={12} />
                                 {post.commentsCount || 0}
                             </span>
                        </div>
                        <div>
                             <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                                 Read more
                             </span>
                        </div>
                    </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
             <Link 
                href={`/${tenantSlug}`} 
                className={cn(
                    "inline-flex items-center px-6 py-3 border text-sm font-medium rounded-full transition-colors",
                    theme === 'cyber' 
                        ? "border-white/20 text-white hover:bg-white/10 hover:border-white/40" 
                        : "border-gray-700 text-white hover:border-white hover:bg-white/5"
                )}
             >
                 See all from {authorName}
             </Link>
        </div>
      </div>
    </div>
  );
}
