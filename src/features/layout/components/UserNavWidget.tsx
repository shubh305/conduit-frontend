"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, LayoutDashboard, UserIcon, LogIn, UserPlus, Bookmark } from "lucide-react";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { useThemeLabel } from "@/components/theme/ThemeLabel";
import { getRoundedClass } from "@/lib/theme-variants";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function UserNavWidget() {
  const pathname = usePathname();
  const { theme } = useThemeHelpers();
  const { user, logout } = useAuth();
  const t = useThemeLabel();

  // Determine if we are on a tenant-specific page to pass context to Studio
  const firstPathSegment = pathname.split("/")[1];
  const matchingTenant = user?.tenants?.find(t => t.slug === firstPathSegment);
  const studioParam = matchingTenant ? `?tenantId=${matchingTenant.id}` : "";

  const userInitial = user?.username?.[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div
          className={cn(
            "w-9 h-9 flex items-center justify-center transition-all border shadow-lg overflow-hidden",
            "bg-noir-panel border-noir-border text-foreground hover:border-accent hover:text-accent",
            getRoundedClass(theme, "full"),
          )}
        >
          {user ? (
            <span className="font-mono text-xs font-bold transition-all group-hover:scale-110">{userInitial}</span>
          ) : (
            <UserIcon size={16} />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-60 p-2 z-[200] transition-all animate-in fade-in slide-in-from-top-2 duration-300",
          "bg-noir-panel border-noir-border border shadow-2xl backdrop-blur-md",
          getRoundedClass(theme, "lg"),
        )}
      >
        {user ? (
          <>
            <div className="px-4 py-3 border-b border-noir-border mb-1">
              <div className="text-[10px] font-mono text-accent uppercase tracking-[0.3em] truncate">
                @{user.username}
              </div>
              <div className="text-[8px] text-foreground-subtle font-mono uppercase tracking-[0.1em] opacity-40 mt-0.5">
                {t("activeSession")}
              </div>
            </div>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href={`/u/${user.username}`}
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground-subtle hover:text-foreground font-mono uppercase tracking-widest"
              >
                <UserIcon size={14} className="opacity-70" />
                <span>{t("profile")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href="/me/library"
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground-subtle hover:text-foreground font-mono uppercase tracking-widest"
              >
                <Bookmark size={14} className="opacity-70" />
                <span>{t("library")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href={`/studio${studioParam}`}
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground-subtle hover:text-foreground font-mono uppercase tracking-widest"
              >
                <LayoutDashboard size={14} className="opacity-70" />
                <span>{t("studio")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-noir-border my-1 mx-2" />

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href={`/studio/settings${studioParam}`}
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground-subtle hover:text-foreground font-mono uppercase tracking-widest"
              >
                <Settings size={14} className="opacity-70" />
                <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={logout}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 focus:text-red-400 cursor-pointer focus:bg-red-500/5 font-mono uppercase tracking-widest",
                getRoundedClass(theme, "md"),
              )}
            >
              <LogOut size={14} />
              <span>{t("signOut")}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-noir-border mb-1">
              <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-[0.3em]">GUEST_USER</div>
            </div>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:text-accent font-mono uppercase tracking-widest"
              >
                <LogIn size={14} />
                <span>{t("signIn")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href="/signup"
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:text-accent font-mono uppercase tracking-widest"
              >
                <UserPlus size={14} />
                <span>{t("signUp")}</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
