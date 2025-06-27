"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PenTool, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/studio" },
  { icon: FileText, label: "Posts", href: "/studio/posts" },
  { icon: PenTool, label: "New Post", href: "/studio/editor" },
  { icon: Settings, label: "Settings", href: "/studio/settings" },
];

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-noir-panel border-r border-noir-border flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-noir-border">
        <Link href="/" className="font-sans text-xl font-bold text-white tracking-tight uppercase block">
          CONDUIT
        </Link>
        <span className="font-mono text-[10px] text-gray-500 block mt-1 tracking-widest">
          STUDIO TERMINAL
        </span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors",
                isActive 
                  ? "bg-noir-bg text-white border-l-2 border-signal-red" 
                  : "text-gray-400 hover:text-white hover:bg-noir-hover border-l-2 border-transparent"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-noir-border">
        <button className="flex items-center gap-3 px-4 py-3 font-mono text-sm text-gray-500 hover:text-signal-red transition-colors w-full text-left">
          <LogOut size={16} />
          DISCONNECT
        </button>
      </div>
    </aside>
  );
}
