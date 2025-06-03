"use client";

import Link from "next/link";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Search, PenSquare, Bell } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-40 h-16 flex items-center px-4 md:px-8 justify-between">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-6">
         <Link href="/" className="text-3xl font-serif font-bold tracking-tight text-black">
           Conduit
         </Link>
         <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full w-64 text-gray-500">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-sm placeholder:text-gray-400 w-full text-black" 
            />
         </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-4 md:gap-6">
         <Link href="/studio/editor" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <PenSquare size={20} strokeWidth={1.5} />
            <span className="text-sm">Write</span>
         </Link>
         
         <button className="text-gray-500 hover:text-black">
            <Bell size={20} strokeWidth={1.5} />
         </button>

         <UserMenu />
      </div>
    </nav>
  );
}
