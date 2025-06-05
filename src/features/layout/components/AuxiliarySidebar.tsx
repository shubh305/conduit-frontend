"use client";

import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";

// Helper Components
function SectionTitle({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
      <h3 className={cn(
          "mb-4 font-bold uppercase tracking-widest",
          theme === 'cyber' 
            ? "text-xs font-mono text-signal-green" 
            : "text-sm font-serif lowercase italic text-white border-b border-white/10 pb-2 w-full tracking-normal"
      )}>
          {children}
      </h3>
  );
}

function Wrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  const { theme } = useTheme();
  return (
     <aside className={cn(
        "hidden xl:flex flex-col min-h-screen fixed right-0 top-16 w-80 z-30 px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar transition-colors duration-500",
        theme === 'cyber' 
            ? "border-l border-white/10 bg-[#050505]" 
            : "border-l border-white/10 bg-[#121212]",
        className
     )}>
        {children}
     </aside>
  );
}

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, Suspense } from "react";
import { mockPosts } from "@/features/blog/data/mock-blogs";
import { mockRecommendedUsers } from "@/features/auth/data/mock-user";

export function AuxiliarySidebar() {
  return (
    <Suspense fallback={<Wrapper><div className="animate-pulse h-20 bg-white/5 rounded" /></Wrapper>}>
       <AuxiliarySidebarContent />
    </Suspense>
  );
}

function AuxiliarySidebarContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const query = searchParams.get('q');

  // Sync local state with URL query if present
  useEffect(() => {
    if (query && query !== searchTerm) {

        setSearchTerm(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Aggregate tags from all posts dynamically
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(mockPosts).flat().forEach(post => {
        post.tags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).slice(0, 10); // Take top 10 unique tags
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Use mock data for Signal Sources
  const whoToFollow = mockRecommendedUsers;

  return (
    <Wrapper>
       {/* Search */}
       <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
             <Search size={16} className={theme === 'cyber' ? "text-gray-500" : "text-gray-400"} strokeWidth={2} />
          </div>
          <input 
             type="text" 
             placeholder="SEARCH" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             onKeyDown={handleSearch}
             className={cn(
                "w-full py-2 pl-8 pr-4 bg-transparent outline-none text-xs font-mono uppercase tracking-wide transition-all",
                theme === 'cyber' 
                    ? "border-b border-white/20 text-white focus:border-signal-green placeholder:text-gray-600" 
                    : "border-b border-white/10 text-white focus:border-white placeholder:text-gray-500"
             )}
          />
       </div>

       {/* Recommended Topics */}
       <div className="mb-12">
          <SectionTitle>Recommended</SectionTitle>
          <div className="flex flex-wrap gap-2">
             {allTags.map(tag => {
                const isActive = query === tag;
                return (
                    <Link 
                       key={tag} 
                       href={`/search?q=${encodeURIComponent(tag)}`}
                       className={cn(
                          "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all",
                          theme === 'cyber'
                            ? isActive 
                                ? "border-signal-green text-signal-green bg-signal-green/10"
                                : "border-white/20 text-gray-400 hover:border-signal-green hover:text-signal-green"
                            : isActive
                                ? "bg-white text-black border-white"
                                : "border-white/20 text-gray-400 hover:bg-white hover:text-black hover:border-white"
                       )}
                    >
                       #{tag}
                    </Link>
                );
             })}
          </div>
       </div>

       {/* Signal Sources */}
       <div>
          <SectionTitle>Signal Sources</SectionTitle>
          <div className="flex flex-col gap-6">
             {whoToFollow.map(user => (
                <Link key={user.username} href={`/u/${user.username}`}>
                    <div className="flex items-start justify-between gap-3 group">
                    <div className="flex gap-3">
                        <div className={cn(
                            "w-8 h-8 shrink-0 flex items-center justify-center font-mono text-xs font-bold border",
                            theme === 'cyber' 
                                ? "bg-white/10 text-white border-white/20" 
                                : "bg-[#1A1A1A] text-white border-white/20"
                        )}>
                            {/* Use first char of name */}
                            {user.displayName ? user.displayName[0] : user.username[0]}
                        </div>
                        <div className="min-w-0">
                            <div className={cn(
                                "text-xs font-bold uppercase tracking-wide truncate transition-colors",
                                "text-gray-400 group-hover:text-white"
                            )}>{user.displayName || user.username}</div>
                            <div className={cn(
                                "text-[10px] truncate font-mono",
                                theme === 'cyber' ? "text-gray-600" : "text-gray-500"
                            )}>@{user.username}</div>
                        </div>
                    </div>
                    <button className={cn(
                        "w-6 h-6 flex items-center justify-center border transition-all",
                        theme === 'cyber' 
                            ? "border-white/20 text-gray-500 hover:text-signal-green hover:border-signal-green"
                            : "border-white/20 text-gray-500 hover:bg-white hover:text-black hover:border-white"
                    )}>
                        <ArrowUpRight size={12} strokeWidth={2} />
                    </button>
                    </div>
                </Link>
             ))}
          </div>
       </div>

       {/* Footer */}
       <div className="mt-auto pt-8 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest opacity-50">
          <span>v.2.0.4</span>
          <span>Legal</span>
          <span>API</span>
       </div>
    </Wrapper>
  );
}
