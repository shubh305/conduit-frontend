"use client";

import Link from "next/link";
import { Settings, LogOut, LayoutDashboard, UserIcon } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { LogIn, UserPlus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function UserNavWidget() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const userInitial = user?.username?.[0]?.toUpperCase() || "A";

  return (
       <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
              <div className={cn(
                  "w-8 h-8 flex items-center justify-center transition-all",
                  theme === 'cyber' 
                     ? "bg-white/10 hover:bg-signal-green hover:text-black text-gray-300" 
                     : "bg-[#121212] border border-white/10 text-white hover:bg-white/10"
              )}>
                  <span className="font-mono text-xs font-bold">{userInitial}</span>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
             align="end" 
             className={cn(
                 "w-56 rounded-none border",
                 theme === 'cyber' 
                    ? "bg-black border-signal-green text-gray-300"
                    : "bg-[#121212] border-white/10 text-white"
             )}
          >
             {user ? (
                 <>
                    <div className="px-2 py-1.5 text-xs font-mono opacity-50 uppercase tracking-widest">
                        @{user.username}
                    </div>
                    <DropdownMenuSeparator className={theme === 'cyber' ? "bg-white/20" : "bg-white/10"} />
                    
                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href={`/u/${user.username}`} className="flex items-center gap-2">
                        <UserIcon size={14} />
                        <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
        
                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href="/me/library" className="flex items-center gap-2">
                        <BookmarkIcon size={14} />
                        <span>Library</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard size={14} />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>

                    
                    <DropdownMenuSeparator className={theme === 'cyber' ? "bg-white/20" : "bg-white/10"} />
                    
                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href="/studio/settings" className="flex items-center gap-2">
                        <Settings size={14} />
                        <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                        onClick={logout}
                        className="text-red-500 focus:text-red-400 rounded-none focus:bg-red-900/10 cursor-pointer">
                        <div className="flex items-center gap-2">
                        <LogOut size={14} />
                        <span>Sign out</span>
                        </div>
                    </DropdownMenuItem>
                 </>
             ) : (
                 <>
                    <div className="px-2 py-1.5 text-xs font-mono opacity-50 uppercase tracking-widest">
                        GUEST
                    </div>
                    <DropdownMenuSeparator className={theme === 'cyber' ? "bg-white/20" : "bg-white/10"} />
                    
                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href="/login" className="flex items-center gap-2">
                        <LogIn size={14} />
                        <span>Sign In</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-none focus:bg-white/10 cursor-pointer">
                        <Link href="/signup" className="flex items-center gap-2">
                        <UserPlus size={14} />
                        <span>Sign Up</span>
                        </Link>
                    </DropdownMenuItem>
                 </>
             )}

          </DropdownMenuContent>
       </DropdownMenu>
  );
}

function BookmarkIcon({size}: {size: number}) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
}
