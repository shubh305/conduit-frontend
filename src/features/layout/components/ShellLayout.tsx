"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { Home, Search, Bookmark, User } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { NavigationSidebar } from "./NavigationSidebar";
import { AuxiliarySidebar } from "./AuxiliarySidebar";
import { cn } from "@/lib/utils";
import { TopNavigation } from "./TopNavigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface ShellLayoutProps {
  children: React.ReactNode;
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isFullScreenRoute = ['/login', '/signup', '/forgot-password'].some(route => pathname.startsWith(route));

  if (isFullScreenRoute) {
    return <>{children}</>;
  }



  return (
    <div className={cn(
        "min-h-screen transition-colors duration-500 bg-[#050505]",
        theme === 'cyber' ? "bg-[#050505] text-gray-300" : "bg-white md:bg-[#121212] text-white" 
    )}>
      {theme === 'cyber' && (
          <div 
            className="fixed inset-0 pointer-events-none z-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
      )}

      {/* Unified Sidebars */}
      <Suspense fallback={<div className="w-20 lg:w-64 hidden md:block bg-[#050505] border-r border-white/10" />}>
          <NavigationSidebar isOpen={isSidebarOpen} />
      </Suspense>
      <AuxiliarySidebar />
      
      {/* Unified Top Header for all themes */}
      <TopNavigation onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Grid Layout */}
      <div className="flex justify-center min-h-screen">
          {/* Left Sidebar Spacer - dynamically sized */}
          <div className={cn(
              "hidden md:block shrink-0 transition-all duration-300",
              isSidebarOpen ? "w-64" : "w-20"
          )} />

          {/* Center Content */}
          <main className={cn(
             "flex-1 min-w-0 px-4 md:px-8 py-8 transition-all duration-300 xl:border-r w-full",
              theme === 'cyber' ? "pt-24 xl:border-white/10" : "pt-24 bg-white md:bg-[#121212] xl:border-white/10"
          )}>
             {children}
          </main>

          {/* Right Sidebar Spacer - matched with fixed sidebar width */}
          <div className="hidden xl:block w-80 shrink-0" />
      </div>
      
      {/* Mobile Nav */}
       <div className={cn(
           "md:hidden fixed bottom-0 left-0 right-0 border-t px-6 py-3 flex justify-between items-center z-50",
           theme === 'cyber' ? "bg-black border-white/10" : "bg-white border-black/10"
       )}>
           <Link href="/" className={cn("flex flex-col items-center gap-1", theme === 'cyber' ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black")}>
              <Home size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wide">Home</span>
           </Link>
           <Link href="/explore" className={cn("flex flex-col items-center gap-1", theme === 'cyber' ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black")}>
              <Search size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wide">Search</span>
           </Link>
           <Link href="/me/library" className={cn("flex flex-col items-center gap-1", theme === 'cyber' ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black")}>
              <Bookmark size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wide">Library</span>
           </Link>
           <Link href={`/u/alice`} className={cn("flex flex-col items-center gap-1", theme === 'cyber' ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black")}>
              <User size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wide">Profile</span>
           </Link>
       </div>

        <div className="fixed bottom-8 right-8 z-50 hidden md:block">
            <ThemeToggle />
        </div>
    </div>
  );
}
