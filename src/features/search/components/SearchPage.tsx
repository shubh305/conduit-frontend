"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Bookmark, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { mockTenants } from "@/features/blog/data/mock-blogs";
import { Button } from "@/components/ui/button";

type Tab = "top" | "posts" | "publications" | "people" | "notes";

export function SearchPageContainer() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<Tab>("top");
  const tabs: Tab[] = ["top", "posts", "publications", "people", "notes"];

  return (
    <div className={cn(
        "min-h-screen transition-colors",
        theme === 'cyber' ? "bg-[#050505] text-gray-300" : "bg-[#121212] text-white"
    )}>
      {/* Header Area */}
      <div className="pt-8 pb-4 border-b border-white/5 px-4 md:px-0">
          <div className="max-w-3xl mx-auto">
             <div className="flex items-baseline gap-3 mb-8">
                <span className={cn(
                    "text-4xl md:text-5xl font-bold tracking-tight",
                    theme === 'cyber' ? "text-gray-500 font-mono tracking-tighter" : "text-gray-500 font-sans"
                )}>
                    Results for
                </span>
                <span className={cn(
                    "text-4xl md:text-5xl font-bold",
                    theme === 'cyber' ? "text-white font-mono tracking-tighter" : "text-white font-serif"
                )}>
                    {query}
                </span>
             </div>

             {/* Tabs */}
             <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-4 text-sm capitalize transition-colors border-b-2 whitespace-nowrap",
                            activeTab === tab 
                                ? (theme === 'cyber' ? "border-signal-green text-signal-green font-mono" : "border-white text-white font-medium font-sans") 
                                : "border-transparent text-gray-500 hover:text-gray-300"
                        )}
                    >
                        {tab}
                    </button>
                ))}
             </div>
          </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 md:px-0 py-8">
         <SearchResults query={query} tab={activeTab} />
      </div>
    </div>
  );
}


import { useLibrary } from "@/features/library/context/LibraryContext";

function SearchResults({ query, tab }: { query: string, tab: Tab }) {
  const { theme } = useTheme();
  const { togglePost, isPostSaved, toggleUser, isUserFollowed, togglePub, isPubFollowed } = useLibrary();

  if (!query) return null;

  const searchQuery = query.toLowerCase();

  // 1. Filter Posts
  const posts = mockFeedItems.filter(post => 
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
  );

  // 2. Filter Publications
  const publications = Object.values(mockTenants).filter(pub => 
      pub.name.toLowerCase().includes(searchQuery) || 
      pub.description?.toLowerCase().includes(searchQuery)
  );

  // 3. Filter People (from feed authors)
  const uniqueAuthors = Array.from(new Set(mockFeedItems.map(item => item.authorName))).map(name => {
      const post = mockFeedItems.find(p => p.authorName === name);
      return {
          id: post?.tenantSlug || "u1",
          name: name,
          username: post?.tenantSlug || "user",
          bio: "Writer on Conduit",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` 
      };
  });
  const people = uniqueAuthors.filter(p => p.name.toLowerCase().includes(searchQuery));


  const hasResults = posts.length > 0 || publications.length > 0 || people.length > 0;

  return (
    <div className="space-y-12">
        {(tab === 'top' || tab === 'posts') && (
            <div className="flex flex-col gap-10">
                {posts.length === 0 && tab === 'posts' && (
                    <div className="text-gray-500 text-center py-10">No stories found.</div>
                )}
                
                {posts.map(post => {
                    const isSaved = isPostSaved(post.postId);
                    return (
                        <div key={post.postId} className="group flex justify-between gap-8 cursor-pointer">
                            <div className="flex-1 space-y-3">
                                {/* Author Line */}
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-5 h-5 flex items-center justify-center text-[10px] font-bold",
                                        theme === 'cyber' ? "bg-white/10 text-signal-green rounded-none" : "bg-gray-800 rounded-full text-white"
                                    )}>
                                        {post.authorName[0]}
                                    </div>
                                    <span className={cn("text-xs font-bold", theme === 'cyber' ? "text-gray-400 font-mono" : "text-white")}>
                                        {post.authorName}
                                    </span>
                                    <span className="text-gray-600 text-xs">·</span>
                                    <span className={cn("text-xs", theme === 'cyber' ? "text-gray-600 font-mono" : "text-gray-500")}>
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Title & Excerpt */}
                                <Link href={`/${post.tenantSlug}/${post.postSlug}`} className="block space-y-2">
                                    <h2 className={cn(
                                        "text-xl md:text-2xl font-bold leading-tight decoration-2 underline-offset-4 group-hover:underline",
                                        theme === 'cyber' 
                                            ? "text-gray-100 font-mono tracking-tight decoration-signal-green/50" 
                                            : "text-white font-serif tracking-tight decoration-white/30"
                                    )}>
                                        {post.title}
                                    </h2>
                                    <p className={cn(
                                        "text-sm line-clamp-3 leading-relaxed",
                                        theme === 'cyber' ? "text-gray-500 font-mono" : "text-gray-400 font-serif"
                                    )}>
                                        {post.excerpt}
                                    </p>
                                </Link>

                                {/* Meta / Actions */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className={cn("px-2 py-1 rounded", theme === 'cyber' ? "bg-white/5 text-gray-400 font-mono rounded-none" : "bg-gray-800 text-gray-300 rounded-full")}>
                                            {post.tags?.[0] || 'Story'}
                                    </span>
                                    <span>5 min read</span>
                                    </div>
                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 items-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePost(post.postId);
                                            }}
                                            className="hover:text-white transition-colors"
                                        >
                                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? (theme === 'cyber' ? "text-signal-green" : "text-white") : ""} />
                                        </button>
                                        <MoreHorizontal size={18} className="hover:text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Image */}
                            {post.featuredImage && (
                                <div className={cn(
                                    "hidden sm:block w-32 h-32 md:w-48 md:h-32 shrink-0 overflow-hidden",
                                    theme === 'cyber' ? "rounded-none border-2 border-transparent group-hover:border-signal-green/50 transition-colors opacity-80 group-hover:opacity-100" : "rounded-lg border border-white/10"
                                )}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )}

        {/* PUBLICATIONS TAB */}
        {(tab === 'top' || tab === 'publications') && publications.length > 0 && (
             <div className="space-y-6">
                 {tab === 'top' && <h3 className="font-bold text-white mb-4">Publications</h3>}
                 {publications.map(pub => {
                     const isFollowed = isPubFollowed(pub.id);
                     return (
                         <div key={pub.id} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-none">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-sm bg-gray-800 overflow-hidden">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${pub.slug}`} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                     <div className="font-bold text-white">{pub.name}</div>
                                     <div className="text-xs text-gray-500">{pub.description}</div>
                                 </div>
                             </div>
                             <Button 
                                variant="secondary" 
                                size="sm" 
                                className={cn("h-8 text-xs w-20", isFollowed && "bg-white/20 text-white")}
                                onClick={() => togglePub(pub.id)}
                             >
                                {isFollowed ? "Following" : "Follow"}
                            </Button>
                         </div>
                     );
                 })}
             </div>
        )}

        {/* PEOPLE TAB */}
        {(tab === 'top' || tab === 'people') && people.length > 0 && (
             <div className="space-y-6">
                 {tab === 'top' && <h3 className="font-bold text-white mb-4 mt-8">People</h3>}
                 {people.map(person => {
                     const isFollowed = isUserFollowed(person.id);
                     return (
                         <div key={person.id} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-none">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={person.avatar} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                     <div className="font-bold text-white">{person.name}</div>
                                     <div className="text-xs text-gray-500 line-clamp-1">{person.bio}</div>
                                 </div>
                             </div>
                             <Button 
                                variant="secondary" 
                                size="sm" 
                                className={cn("h-8 text-xs w-20", isFollowed && "bg-white/20 text-white")}
                                onClick={() => toggleUser(person.id)}
                            >
                                {isFollowed ? "Following" : "Follow"}
                             </Button>
                         </div>
                     );
                 })}
             </div>
        )}

        {!hasResults && (
            <div className="text-center text-gray-500 py-12">
                No results found for &quot;{query}&quot;.<br/>
                Try searching for existing posts like &quot;rust&quot; or &quot;design&quot;.
            </div>
        )}
    </div>
  );
}
