"use client";

import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, FileText, LogOut, Library } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn, getMediaUrl } from "@/lib/utils";

export function UserMenu() {
  const { isCyberCopy, isSakuraCopy, isDarkMode } = useThemeHelpers();
  const { user, logout } = useAuth();
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

  if (!user) return null;

  const menuItems = [
    { label: "Profile", icon: User, href: `/u/${user.username}` },
    { label: "Library", icon: Library, href: "/me/library" },
    { label: "Stories", icon: FileText, href: "/studio/posts" },
    { label: "Settings", icon: Settings, href: "/studio/settings" },
    {
      label: "Sign out",
      icon: LogOut,
      href: "#",
      action: logout,
      className: "text-red-500 hover:bg-red-500/10 hover:text-red-400",
    },
  ];

  const rawAvatar = user.avatar;
  const avatar = getMediaUrl(rawAvatar) || "/placeholder-avatar.png";

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 group transition-all">
        <div className="text-right hidden md:block">
          <div
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest transition-colors",
              isCyberCopy ? "text-accent font-mono" : "text-foreground",
            )}
          >
            {user.username}
          </div>
          <div className="text-[8px] font-mono text-foreground-subtle uppercase tracking-widest opacity-60">
            {isSakuraCopy ? "ユーザー" : isCyberCopy ? "OPERATOR" : "Author"}
          </div>
        </div>
        <div
          className={cn(
            "w-10 h-10 border transition-all relative overflow-hidden group-hover:border-accent shadow-xl",
            "bg-noir-panel border-noir-border",
            isCyberCopy ? "rounded-none" : "rounded-full",
          )}
        >
          <Image
            src={avatar}
            alt="User"
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isDarkMode ? "grayscale group-hover:grayscale-0 opacity-80" : "opacity-100",
              "group-hover:scale-110",
            )}
          />
          {isCyberCopy && (
            <>
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-accent" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-accent" />
            </>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-3 w-64 p-2 z-[200] transition-all animate-in fade-in slide-in-from-top-2 duration-300",
            "bg-noir-panel border-noir-border border shadow-2xl backdrop-blur-md",
            isCyberCopy ? "rounded-none" : "rounded-2xl",
          )}
        >
          {isCyberCopy && (
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          )}

          <div className="flex flex-col gap-1">
            <div className="px-4 py-3 border-b border-noir-border mb-1">
              <div className="text-xs font-bold text-foreground">{user.displayName || user.username}</div>
              <div className="text-[10px] text-foreground-subtle font-mono truncate">{user.email}</div>
            </div>

            {menuItems.map(item => {
              let displayLabel = item.label;
              if (isSakuraCopy) {
                displayLabel =
                  {
                    Profile: "プロフィール",
                    Library: "ライブラリ",
                    Stories: "記事管理",
                    Settings: "設定",
                    "Sign out": "ログアウト",
                  }[item.label] || item.label;
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={e => {
                    if (item.action) {
                      e.preventDefault();
                      item.action();
                    }
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-xs transition-all",
                    "text-foreground-subtle hover:text-foreground hover:bg-noir-hover",
                    isCyberCopy ? "font-mono uppercase tracking-[0.2em] rounded-none" : "font-sans rounded-xl",
                    item.className,
                  )}
                >
                  <item.icon size={14} className="opacity-70 group-hover:opacity-100" />
                  {displayLabel}
                </Link>
              );
            })}
          </div>

          {/* Status Footer */}
          <div className="mt-2 pt-2 border-t border-noir-border text-[9px] font-mono text-foreground-subtle text-center opacity-40 uppercase tracking-widest">
            {isCyberCopy ? `SESSION_ID: ${user.id?.slice(0, 8).toUpperCase()}` : `Logged in as ${user.username}`}
          </div>
        </div>
      )}
    </div>
  );
}
