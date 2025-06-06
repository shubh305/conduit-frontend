"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { mockUser } from "@/features/auth/data/mock-user";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, FileText, LogOut, Library } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Profile", icon: User, href: `/u/${mockUser.username}` },
    { label: "Library", icon: Library, href: "/me/library" },
    { label: "Stories", icon: FileText, href: "/studio/posts" },
    { label: "Settings", icon: Settings, href: "/studio/settings" },
    { label: "Sign out", icon: LogOut, href: "/login", className: "text-red-500 hover:bg-red-500/10" },
  ];

  // Cyber Trigger
  if (theme === 'cyber') {
    return (
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 group"
        >
          <div className="text-right hidden md:block">
            <div className="text-xs font-mono text-signal-green uppercase tracking-wider">{mockUser.username}</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">OPERATOR</div>
          </div>
          <div className="w-10 h-10 border border-white/20 bg-black relative overflow-hidden group-hover:border-signal-green transition-colors">
            <Image 
              src={mockUser.avatar || "/placeholder.png"} 
              alt="User" 
              fill 
              className="object-cover grayscale group-hover:grayscale-0 transition-all" 
            />
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-white" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/20 p-2 z-50 backdrop-blur-md">
            {/* Decorative Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-signal-green to-transparent opacity-50" />
            
            <div className="flex flex-col gap-1">
               {menuItems.map((item) => (
                 <Link 
                   key={item.label}
                   href={item.href}
                   onClick={() => setIsOpen(false)}
                   className={cn(
                     "flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 transition-colors",
                     item.className
                   )}
                 >
                   <item.icon size={14} />
                   {item.label}
                 </Link>
               ))}
            </div>
            {/* Status Footer */}
            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-gray-600 text-center">
               SESSION_ID: X92-B4
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classic Trigger
  return (
    <div className="relative" ref={menuRef}>
       <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-200 rounded-full w-10 h-10 relative overflow-hidden">
          <Image 
             src={mockUser.avatar || "/placeholder.png"} 
             alt="User" 
             fill 
             className="object-cover"
          />
       </button>

       {isOpen && (
         <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black border border-gray-100 shadow-xl rounded-lg overflow-hidden z-50 p-2">
            <div className="flex flex-col">
               {menuItems.map((item) => (
                 <Link 
                   key={item.label}
                   href={item.href}
                   onClick={() => setIsOpen(false)}
                   className={cn(
                     "flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors",
                     item.className
                   )}
                 >
                   <item.icon size={16} strokeWidth={1.5} />
                   {item.label}
                 </Link>
               ))}
               <div className="border-t border-gray-100 my-1"></div>
               <div className="px-4 py-2 text-xs text-slate-500">
                  {mockUser.email}
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
