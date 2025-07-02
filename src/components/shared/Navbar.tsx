"use client";

import Link from "next/link";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { PenSquare, Bell } from "lucide-react";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { SearchInput } from "@/features/search/components/SearchInput";

export function Navbar() {
  const { isOctaneCopy } = useThemeHelpers();
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-40 h-16 flex items-center px-4 md:px-8 justify-between">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-3xl font-serif font-bold tracking-tight text-black">
          Conduit
        </Link>
        <div className="block w-full max-w-xs md:w-72">
          <SearchInput placeholder="Search..." className="bg-gray-50 border-transparent rounded-full" />
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/dashboard?create=true" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
          <PenSquare size={20} strokeWidth={1.5} />
          <span className="text-sm">{isOctaneCopy ? "Initialize" : "New Blog"}</span>
        </Link>

        <button className="text-gray-500 hover:text-black">
          <Bell size={20} strokeWidth={1.5} />
        </button>

        <UserMenu />
      </div>
    </nav>
  );
}
