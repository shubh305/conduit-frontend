"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Compass, Bookmark, PenSquare, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/features/auth/data/mock-user";
import { useTheme } from "@/features/theme/ThemeProvider";
import { FEED_CATEGORIES } from "@/features/feed/constants";

interface NavigationSidebarProps {
  isOpen?: boolean;
}

export function NavigationSidebar({ isOpen = true }: NavigationSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  
  const currentCategory = searchParams.get('category') || 'all';
  const currentFeed = searchParams.get('feed') || 'foryou';
  const isHome = pathname === '/';

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Library", icon: Bookmark, href: "/me/library" },
    { label: "Stories", icon: PenSquare, href: "/studio/posts" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  ];

  if (theme === 'cyber') {
    return (
       <aside className={cn(
           "hidden md:flex flex-col fixed left-0 top-16 z-30 pt-8 pb-8 justify-between border-r border-white/10 bg-[#050505] overflow-y-auto no-scrollbar transition-all duration-300 h-[calc(100vh-4rem)]",
           isOpen ? "w-64" : "w-20"
       )}>
         <div className="px-4 space-y-8">
             {/* Main Nav */}
             <div className="space-y-1">
                 <div className={cn("text-[10px] font-mono text-gray-600 mb-4 px-4 hidden lg:block uppercase tracking-widest", !isOpen && "lg:hidden")}>
                    {/* SYSTEM_NAV */}
                 </div>
                 {navItems.map((item) => {
                   const isActive = pathname === item.href;
                   return (
                     <Link 
                        key={item.href} 
                        href={item.href}
                        className={cn(
                           "flex items-center gap-4 px-4 py-2 transition-all font-mono text-xs uppercase tracking-wider group relative overflow-hidden",
                           isActive ? "text-signal-green bg-white/5" : "text-gray-500 hover:text-white",
                           !isOpen && "justify-center px-0"
                        )}
                        title={!isOpen ? item.label : undefined}
                     >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-signal-green" />}
                        <item.icon size={16} className={cn("shrink-0", isActive && "text-signal-green")} />
                        <span className={cn("relative z-10", isOpen ? "hidden lg:block" : "hidden")}>{item.label}</span>
                     </Link>
                   );
                 })}
             </div>

             {/* Feed Source & Channels */}
             {isOpen && (
                 <>
                    {/* Feed Source */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono text-gray-600 mb-2 px-4 hidden lg:block uppercase tracking-widest">
                            {/* SOURCE */}
                        </div>
                        {[
                            { id: 'foryou', label: 'FOR_YOU' },
                            { id: 'following', label: 'FOLLOWING' }
                        ].map(feed => (
                            <Link 
                                key={feed.id}
                                href={`/?feed=${feed.id}`}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                                    (isHome && currentFeed === feed.id) ? "text-signal-green font-bold" : "text-gray-500 hover:text-white"
                                )}
                            >
                                <span className="hidden lg:block">[{feed.label}]</span>
                                <span className="lg:hidden">{feed.label[0]}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Channels */}
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono text-gray-600 mb-2 px-4 hidden lg:block uppercase tracking-widest">
                            {/* CHANNELS */}
                        </div>
                        {FEED_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                            <Link
                                key={cat.id}
                                href={`/?category=${cat.id}`}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors truncate",
                                    (isHome && currentCategory === cat.id) ? "text-signal-green" : "text-gray-500 hover:text-white"
                                )}
                            >
                                <span className="hidden lg:block truncate">{cat.label}</span>
                                <span className="lg:hidden">{cat.label[0]}</span>
                            </Link>
                        ))}
                    </div>
                 </>
             )}
         </div>

         <div className="px-4 border-t border-white/10 pt-4 mt-4">
             <Link 
                href={`/u/${mockUser.username}`}
                className={cn(
                   "flex items-center gap-4 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                   pathname.includes(`/u/${mockUser.username}`) ? "text-signal-green" : "text-gray-500 hover:text-white",
                   !isOpen && "justify-center px-0"
                )}
             >
                <div className="w-4 h-4 rounded-none border border-current flex items-center justify-center shrink-0">
                   <div className="w-2 h-2 bg-current" />
                </div>
                <span className={cn("hidden lg:block", !isOpen && "lg:hidden")}>{mockUser.username}</span>
             </Link>
         </div>
       </aside>
    );
  }

  // Classic Mode
  return (
    <aside className={cn(
        "hidden md:flex flex-col fixed left-0 top-16 border-r border-white/10 bg-[#121212] z-30 pt-8 pb-8 justify-between overflow-y-auto no-scrollbar transition-all duration-300 h-[calc(100vh-4rem)]",
        isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col px-4 space-y-8">
        {/* Navigation */}
        <nav className="space-y-1">
           {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 className={cn(
                    "flex items-center gap-4 px-4 py-2 transition-all group relative border border-transparent rounded-sm",
                    isActive 
                        ? "bg-white text-black font-medium" 
                        : "text-gray-400 hover:text-white hover:bg-white/10",
                    !isOpen && "justify-center px-0"
                 )}
                 title={!isOpen ? item.label : undefined}
               >
                 <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                 <span className={cn("hidden lg:block text-sm font-sans tracking-wide", !isOpen && "lg:hidden")}>
                    {item.label}
                 </span>
               </Link>
             );
           })}
        </nav>

        {/* Source & Channels */}
        {isOpen && (
            <>
                <div className="space-y-2">
                    <h3 className="px-4 text-xs font-serif italic text-gray-500 hidden lg:block">Source</h3>
                    {[
                        { id: 'foryou', label: 'For You' },
                        { id: 'following', label: 'Following' }
                    ].map(feed => (
                        <Link 
                            key={feed.id}
                            href={`/?feed=${feed.id}`}
                            className={cn(
                                "flex items-center gap-4 px-4 py-1.5 text-sm transition-colors",
                                (isHome && currentFeed === feed.id) ? "text-white font-bold" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", (isHome && currentFeed === feed.id) ? "bg-white" : "bg-transparent border border-gray-600")} />
                                <span className="hidden lg:block">{feed.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="px-4 text-xs font-serif italic text-gray-500 hidden lg:block">Channels</h3>
                    {FEED_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                            <Link
                            key={cat.id}
                            href={`/?category=${cat.id}`}
                            className={cn(
                                "flex items-center gap-4 px-4 py-1.5 text-sm transition-colors",
                                (isHome && currentCategory === cat.id) ? "text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <span className="w-1.5 h-px bg-current shrink-0 opacity-50" />
                            <span className="hidden lg:block capitalize">{cat.label.toLowerCase()}</span>
                        </Link>
                    ))}
                </div>
            </>
        )}
      </div>

      <div className="flex flex-col px-4 pt-4 mt-auto border-t border-white/10">
         <Link 
            href={`/u/${mockUser.username}`}
            className={cn(
               "flex items-center gap-3 px-4 py-2 transition-all border border-transparent hover:border-white/20 text-gray-400 hover:text-white rounded-sm",
               pathname.includes(`/u/${mockUser.username}`) ? "bg-white/10 text-white" : "",
               !isOpen && "justify-center px-0"
            )}
         >
             <div className="w-6 h-6 bg-[#1A1A1A] border border-white/20 flex items-center justify-center rounded-full overflow-hidden">
                 <User size={14} className="text-white" />
             </div>
             <span className={cn("hidden lg:block text-sm font-medium", !isOpen && "lg:hidden")}>{mockUser.username}</span>
         </Link>
      </div>
    </aside>
  );
}
