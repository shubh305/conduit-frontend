"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostContent } from "@/features/blog/components/PostContent";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";

interface ArticleLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
}

import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { MoreFromAuthor } from "./MoreFromAuthor";
import { mockPosts } from "@/features/blog/data/mock-blogs";

export function ClassicArticleLayout({ post, tenant }: ArticleLayoutProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-noir-bg text-white pb-20">
      <div className="border-b border-noir-border py-4 bg-noir-panel">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl flex items-center gap-4">
          <Link 
            href={`/${tenant.slug || tenant.id}`}
            className="flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            BACK TO BLOG
          </Link>
          <div className="h-4 w-px bg-gray-800" />
          <span className="font-mono text-sm text-gray-500 uppercase tracking-wider">
            {tenant.name}
          </span>
        </div>
      </div>

      <article className="container mx-auto px-4 md:px-6 mt-12 max-w-3xl">
        <header className="mb-10 space-y-6">
          <div className="flex gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="font-mono text-xs text-signal-red border border-noir-border px-2 py-1 bg-noir-panel">
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-sans font-black leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 font-mono text-sm text-gray-500 border-l-2 border-signal-red pl-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs uppercase">Author</span>
              <span className="text-white">{post.authorName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs uppercase">Published</span>
              <span className="text-white">{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs uppercase">Read Time</span>
              <span className="text-white">{post.readingTimeMinutes} min</span>
            </div>
          </div>

          <FeedActionBar 
              postId={post.postId} 
              initialLikes={post.likesCount} 
              initialComments={post.commentsCount} 
              className="border-t border-b border-white/10 py-4"
              onCommentClick={() => setIsCommentsOpen(true)}
          />
        </header>

        {post.featuredImage && (
          <div className="w-full aspect-video bg-noir-panel border border-noir-border mb-12 overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <PostContent content={post.content} />
      </article>

      <CommentSection 
        postId={post.postId} 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
      />

      <MoreFromAuthor 
        authorName={post.authorName}
        currentPostId={post.postId}
        tenantSlug={tenant.slug || tenant.id}
        posts={mockPosts[tenant.slug || ''] || []}
      />
    </main>
  );
}
