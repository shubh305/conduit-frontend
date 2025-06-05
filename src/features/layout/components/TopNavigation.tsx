"use client";

import Link from "next/link";
import { Bell, Edit3, Menu, Search } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { UserNavWidget } from "./UserNavWidget";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
    onToggleSidebar?: () => void;
}

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopNavigation({ onToggleSidebar }: TopNavigationProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 h-16 border-b z-40 flex items-center justify-between px-6 transition-colors duration-500",
        theme === 'cyber' 
            ? "bg-[#050505]/95 border-white/10 backdrop-blur" 
            : "bg-[#121212]/95 border-white/10 backdrop-blur"
    )}>
        {/* Left Side */}
        <div className="flex items-center gap-4">
             <button 
                onClick={onToggleSidebar}
                className={cn(
                    "p-2 rounded-md transition-colors",
                    theme === 'cyber' 
                        ? "text-gray-400 hover:text-white hover:bg-white/10" 
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                )}
             >
                <Menu size={20} />
             </button>

             {/* Brand Logo */}
             <Link href="/" className="flex items-center gap-2 group">
                {theme === 'cyber' ? (
                    // Cyber Logo
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center">
                            <span className="font-mono font-bold text-signal-green text-sm">C</span>
                         </div>
                         <span className="font-mono font-bold tracking-widest text-lg text-white hidden md:block">
                            CONDUIT
                         </span>
                    </div>
                ) : (
                    // Classic Logo
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-white flex items-center justify-center transition-transform group-hover:-rotate-3">
                            <span className="text-black font-serif font-bold text-lg italic">C</span>
                         </div>
                         <span className="font-serif font-bold text-xl italic tracking-tight text-white hidden md:block">
                            Conduit
                         </span>
                    </div>
                )}
             </Link>

             {theme === 'cyber' && (
                <div className="font-mono text-xs text-signal-green tracking-widest animate-pulse hidden md:block ml-4">
                    {`// NETWORK_ONLINE`}
                </div>
             )}
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-gray-500" />
                </div>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..." 
                    className={cn(
                        "w-full py-1.5 pl-10 pr-4 text-sm bg-transparent border rounded-full transition-all outline-none",
                        theme === 'cyber' 
                            ? "border-white/10 text-white placeholder:text-gray-600 focus:border-signal-green focus:bg-white/5" 
                            : "border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:bg-white/5"
                    )}
                />
            </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4 md:gap-6">
            <Link href="/studio/editor">
                <Button variant="ghost" className={cn(
                    "hidden md:flex items-center gap-2",
                    theme === 'cyber' ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/10"
                )}>
                    <Edit3 size={18} />
                    <span className={cn("text-xs tracking-wider", theme === 'cyber' ? "font-mono" : "font-sans font-bold")}>WRITE</span>
                </Button>
            </Link>

            <button className={cn(
                "transition-colors relative",
                "text-gray-400 hover:text-white"
            )}>
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black" />
            </button>
            
            <div className="pl-2">
                 <UserNavWidget />
            </div>
        </div>
    </header>
  );
}
