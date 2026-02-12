"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, LayoutDashboard, UserIcon, LogIn, UserPlus } from "lucide-react";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getRootDomain } from "@/lib/utils";
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

interface UserNavWidgetProps {
  variant?: "top-nav" | "bottom-nav";
}

export function UserNavWidget({ variant = "top-nav" }: UserNavWidgetProps) {
  const pathname = usePathname();
  const { theme, isRoninCopy } = useThemeHelpers();
  const { user, logout } = useAuth();
  const t = useThemeLabel();

  // Determine if we are on a tenant-specific page to pass context to Studio
  const firstPathSegment = pathname.split("/")[1];
  const matchingTenant = user?.tenants?.find(t => t.slug === firstPathSegment);
  const studioParam = matchingTenant ? `?tenantId=${matchingTenant.id}` : "";

  const userInitial = user?.username?.[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        {variant === "top-nav" ? (
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
        ) : (
          <div className="flex flex-col items-center gap-1 text-foreground-muted hover:text-foreground transition-colors">
            <UserIcon size={20} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-wide">{user ? t("profile") : t("signIn")}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "top-nav" ? "end" : "center"}
        side={variant === "top-nav" ? "bottom" : "top"}
        sideOffset={variant === "top-nav" ? 4 : 12}
        className={cn(
          "w-64 p-2 z-[200] transition-all animate-in fade-in zoom-in-95 duration-200",
          isRoninCopy
            ? "bg-black/80 border-accent/40 border-2 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] backdrop-blur-xl"
            : "bg-noir-panel border-noir-border border shadow-2xl backdrop-blur-md",
          getRoundedClass(theme, "lg"),
        )}
      >
        {user ? (
          <>
            <div className={cn("px-4 py-3 mb-1 border-b", isRoninCopy ? "border-accent/20" : "border-noir-border")}>
              <div
                className={cn(
                  "text-[10px] uppercase tracking-[0.3em] truncate",
                  isRoninCopy ? "text-accent font-serif italic" : "text-accent font-mono",
                )}
              >
                @{user.username}
              </div>
              <div
                className={cn(
                  "text-[8px] uppercase tracking-[0.1em] opacity-40 mt-0.5",
                  isRoninCopy ? "text-foreground font-serif" : "text-foreground-subtle font-mono",
                )}
              >
                {t("activeSession")}
              </div>
            </div>

            <DropdownMenuItem
              asChild
              className={cn(
                "cursor-pointer transition-colors outline-none",
                isRoninCopy ? "focus:bg-accent/10" : "focus:bg-noir-hover",
                getRoundedClass(theme, "md"),
              )}
            >
              <Link
                href={`/u/${user.username}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-[10px] hover:text-foreground uppercase tracking-widest font-sans",
                  isRoninCopy ? "text-foreground/80" : "text-foreground/80",
                )}
              >
                <UserIcon size={14} className={cn("opacity-70", isRoninCopy && "text-accent")} />
                <span>{t("profile")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <Link
                href={`/studio${studioParam}`}
                className="flex items-center gap-3 px-4 py-2.5 text-[10px] text-foreground/80 hover:text-foreground font-sans uppercase tracking-widest"
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
                className="flex items-center gap-3 px-4 py-2.5 text-[10px] text-foreground/80 hover:text-foreground font-sans uppercase tracking-widest"
              >
                <Settings size={14} className="opacity-70" />
                <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={logout}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-[10px] text-red-500 focus:text-accent cursor-pointer font-mono uppercase tracking-widest outline-none",
                isRoninCopy ? "focus:bg-accent/10 font-serif italic" : "focus:bg-red-500/5",
                getRoundedClass(theme, "md"),
              )}
            >
              <LogOut size={14} className={isRoninCopy ? "text-accent" : ""} />
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
              <a
                href={
                  typeof window !== "undefined" ? `${window.location.protocol}//${getRootDomain()}/login` : "/login"
                }
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:text-accent font-mono uppercase tracking-widest"
              >
                <LogIn size={14} />
                <span>{t("signIn")}</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className={cn("cursor-pointer focus:bg-noir-hover transition-colors", getRoundedClass(theme, "md"))}
            >
              <a
                href={
                  typeof window !== "undefined" ? `${window.location.protocol}//${getRootDomain()}/signup` : "/signup"
                }
                className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:text-accent font-mono uppercase tracking-widest"
              >
                <UserPlus size={14} />
                <span>{t("signUp")}</span>
              </a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
