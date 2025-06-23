"use client";

import React from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserMenu } from "@/features/auth/components/UserMenu";

export function CyberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-gray-300 font-sans selection:bg-signal-green selection:text-black overflow-x-hidden flex flex-col">
      
      {/* GLOBAL GRID BACKGROUND */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* HEADER - Grid Row 1 */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center h-full px-6 border-r border-white/10 w-48 shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-signal-green/10 border border-signal-green flex items-center justify-center">
               <span className="font-mono font-bold text-signal-green">C</span>
             </div>
             <span className="font-sans font-bold text-white tracking-wide">CONDUIT</span>
          </div>
        </div>

        {/* Navigation spacer or future nav items */}
        <div className="flex-1" />

        {/* Action / User Menu */}
        <div className="flex items-center h-full px-6 gap-4 border-l border-white/10">
           <UserMenu />
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 bg-[#050505] relative z-10 w-full min-h-0">
        <div className="max-w-[1920px] mx-auto h-full"> 
           {children}
        </div>
      </div>
      
      {/* GLOBAL OVERLAYS */}
      <ThemeToggle />
    </div>
  );
}
