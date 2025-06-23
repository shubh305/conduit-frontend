"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PostContent } from "@/features/blog/components/PostContent";

import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";

interface ArticleLayoutProps {
    post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
    tenant: { name: string; slug?: string; id: string };
}

import { useState } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { MoreFromAuthor } from "./MoreFromAuthor";
import { mockPosts } from "@/features/blog/data/mock-blogs";

// ... imports

export function CyberArticleLayout({ post, tenant }: ArticleLayoutProps) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    return (
        <main className="min-h-screen bg-[#050505] text-gray-300 pb-20 overflow-x-hidden">
            {/* Cyber Header*/}
            <div className="border-b border-white/10 min-h-[400px] flex flex-col relative justify-end pb-12 px-8 md:px-24">
                {/* Background Grid */}

                <div className="relative z-10 max-w-5xl mx-auto w-full">                    
                     <Link
                        href={`/${tenant.slug || tenant.id}`}
                        className="flex items-center gap-2 font-mono text-xs text-signal-green hover:text-white transition-colors mb-8 w-fit"
                    >
                        <ArrowLeft size={14} />
                        BACK_TO_FEED
                    </Link>

                    {/* Tags */}
                    <div className="flex gap-2 mb-6">
                        {post.tags.map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] text-signal-green border border-signal-green/30 px-2 py-0.5 uppercase">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-7xl font-sans font-bold text-white mb-8 leading-tight tracking-tight break-words max-w-4xl">
                        {post.title}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-white/10 pt-8 mt-8 w-full">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Author</span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-mono text-signal-green">
                                    {post.authorName.charAt(0)}
                                </div>
                                <span className="text-white font-mono text-sm uppercase tracking-wider">{post.authorName}</span>
                            </div>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Published</span>
                            <span className="text-white font-mono text-sm">{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Read Time</span>
                            <span className="text-white font-mono text-sm">{post.readingTimeMinutes} MIN</span>
                        </div>
                    </div>
                    
                    <FeedActionBar 
                        postId={post.postId} 
                        initialLikes={post.likesCount}
                        initialComments={post.commentsCount}
                        className="mt-6 border-t border-white/10 pt-4 w-full"
                        onCommentClick={() => setIsCommentsOpen(true)}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-0">
                <article className="max-w-5xl mx-auto py-12 md:py-24">
                     {post.featuredImage && (
                        <div className="w-full aspect-video border border-white/10 mb-16 relative group">
                             <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/50 z-20" />
                             <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/50 z-20" />
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/50 z-20" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/50 z-20" />

                             <Image 
                                src={post.featuredImage} 
                                alt={post.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                     )}

                    <div className="prose prose-invert prose-lg md:prose-xl prose-p:font-mono prose-headings:font-sans prose-headings:font-bold max-w-none prose-a:text-signal-green px-4 md:px-0 leading-relaxed text-gray-300">
                        <PostContent content={post.content} />
                    </div>
                </article>
            </div>

            {/* Comments Drawer */}
            <CommentSection 
                postId={post.postId} 
                isOpen={isCommentsOpen} 
                onClose={() => setIsCommentsOpen(false)} 
            />

            {/* Recommendations */}
            <MoreFromAuthor 
                authorName={post.authorName}
                currentPostId={post.postId}
                tenantSlug={post.tenantSlug}
                posts={mockPosts[post.tenantSlug] || []}
            />
        </main>
    );
}
