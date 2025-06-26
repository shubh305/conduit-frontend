"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { mockTenants } from "@/features/blog/data/mock-blogs";

import { useLibrary } from "@/features/library/context/LibraryContext";

export function SearchSidebar() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  
  const { isUserFollowed, toggleUser, isPubFollowed, togglePub } = useLibrary();
    
  // 1. Tags
  const allTags = Array.from(new Set(mockFeedItems.flatMap(item => item.tags || [])));
  const relevantTags = allTags
    .filter(tag => tag.toLowerCase().includes(query))
    .slice(0, 10);

  // 2. People
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
  const relevantPeople = uniqueAuthors.filter(p => p.name.toLowerCase().includes(query));

  // 3. Pubs
  const relevantPubs = Object.values(mockTenants).filter(pub => 
      pub.name.toLowerCase().includes(query) || pub.description?.toLowerCase().includes(query)
  );

  return (
    <div className="flex flex-col gap-10">
        
        {/* Topics matching query */}
        {relevantTags.length > 0 && (
            <div>
                <h3 className={cn(
                    "mb-4 font-bold uppercase tracking-widest",
                    theme === 'cyber' ? "text-xs font-mono text-gray-400" : "text-sm font-sans text-white/50"
                )}>
                    Topics matching {query}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {relevantTags.map(tag => (
                        <Link 
                            key={tag} 
                            href={`/tag/${tag}`}
                            className={cn(
                                "px-3 py-2 text-xs transition-colors rounded-full",
                                theme === 'cyber' 
                                    ? "border border-white/20 text-gray-300 hover:border-signal-green hover:text-signal-green rounded-none font-mono"
                                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                            )}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* People matching query */}
        {relevantPeople.length > 0 && (
            <div>
                <h3 className={cn(
                    "mb-4 font-bold uppercase tracking-widest",
                    theme === 'cyber' ? "text-xs font-mono text-gray-400" : "text-sm font-sans text-white/50"
                )}>
                    People matching {query}
                </h3>
                <div className="flex flex-col gap-4">
                    {relevantPeople.map(person => {
                        const isFollowed = isUserFollowed(person.id);
                        return (
                            <div key={person.name} className="flex items-center justify-between group">
                                <Link href={`/u/${person.username}`} className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 flex items-center justify-center overflow-hidden",
                                        theme === 'cyber' ? "rounded-none bg-white/5 border border-white/10" : "rounded-full bg-gray-800"
                                    )}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={person.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className={cn(
                                            "text-sm font-bold leading-none mb-1",
                                            theme === 'cyber' ? "text-gray-200 group-hover:text-signal-green font-mono" : "text-white"
                                        )}>
                                            {person.name}
                                        </div>
                                        <div className="text-[10px] text-gray-500 line-clamp-1">
                                            {person.bio}
                                        </div>
                                    </div>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => toggleUser(person.id)}
                                    className={cn(
                                    "h-7 text-[10px] px-3 transition-colors",
                                    theme === 'cyber' 
                                        ? "rounded-none border-white/20 hover:border-signal-green hover:text-signal-green hover:bg-transparent text-gray-300"
                                        : "rounded-full border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white text-white",
                                    isFollowed && (theme === 'cyber' ? "bg-signal-green/10 text-signal-green border-signal-green" : "bg-white text-black")
                                )}>
                                    {isFollowed ? "Following" : "Follow"}
                                </Button>
                            </div>
                        );
                    })}
                </div>
                {relevantPeople.length > 3 && (
                    <Link href={`/search/people?q=${query}`} className={cn(
                        "block mt-4 text-xs hover:underline",
                        theme === 'cyber' ? "text-signal-green font-mono" : "text-emerald-400"
                    )}>
                        See all
                    </Link>
                )}
            </div>
        )}

        {/* Publications matching query */}
        {relevantPubs.length > 0 && (
            <div>
                <h3 className={cn(
                    "mb-4 font-bold uppercase tracking-widest",
                    theme === 'cyber' ? "text-xs font-mono text-gray-400" : "text-sm font-sans text-white/50"
                )}>
                    Publications matching {query}
                </h3>
                <div className="flex flex-col gap-4">
                    {relevantPubs.map(pub => {
                        const isFollowed = isPubFollowed(pub.id);
                        return (
                        <div key={pub.id} className="flex items-center justify-between group">
                            <Link href={`/pub/${pub.id}`} className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 flex items-center justify-center overflow-hidden",
                                    theme === 'cyber' ? "rounded-none bg-white/5 border border-white/10" : "rounded-sm bg-gray-800"
                                )}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${pub.slug}`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className={cn(
                                        "text-sm font-bold leading-none mb-1",
                                        theme === 'cyber' ? "text-gray-200 group-hover:text-signal-green font-mono" : "text-white"
                                    )}>
                                        {pub.name}
                                    </div>
                                </div>
                            </Link>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => togglePub(pub.id)}
                                className={cn(
                                "h-7 text-[10px] px-3 transition-colors",
                                theme === 'cyber' 
                                    ? "rounded-none border-white/20 hover:border-signal-green hover:text-signal-green hover:bg-transparent text-gray-300"
                                    : "rounded-full border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white text-white",
                                isFollowed && (theme === 'cyber' ? "bg-signal-green/10 text-signal-green border-signal-green" : "bg-white text-black")
                            )}>
                                {isFollowed ? "Following" : "Follow"}
                            </Button>
                        </div>
                    )})}
                </div>
            </div>
        )}

    </div>
  );
}
