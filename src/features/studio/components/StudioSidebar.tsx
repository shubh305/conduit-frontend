"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, FileText, PenTool, User, LogOut, Palette, ChevronDown, Globe, Bell } from "lucide-react"
import { cn } from "@/lib/utils";
import { useTheme, useStudioLabels, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { getSidebarClasses, getSidebarItemClasses, getTenantSwitcherClasses } from "@/lib/theme-variants"
import { useAuth } from "@/features/auth/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StudioLabelKey } from "@/features/theme/studio-labels"

const navItemsConfig: { icon: React.ElementType; labelKey: StudioLabelKey; href: string }[] = [
  { icon: LayoutDashboard, labelKey: "overview", href: "/studio" },
  { icon: FileText, labelKey: "posts", href: "/studio/posts" },
  { icon: PenTool, labelKey: "create_post", href: "/studio/editor" },
  { icon: Globe, labelKey: "publications", href: "/studio/config?tab=transmissions" },
  { icon: Palette, labelKey: "appearance", href: "/studio/config?tab=appearance" },
  { icon: Bell, labelKey: "notifications", href: "/studio/config?tab=notifications" },
  { icon: User, labelKey: "profile", href: "/studio/settings" },
]


export function StudioSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, config } = useTheme()
  const { getLabel } = useStudioLabels()
  const { isCyberCopy, isOctaneCopy, isTechieCopy } = useThemeHelpers()
  const { user, logout } = useAuth()



  const tenantId = searchParams.get("tenantId")
  const tenants = user?.tenants || []
  const currentTenant = tenants.find(t => t.id === tenantId) || tenants[0]

  const handleTenantSwitch = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tenantId", id)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className={getSidebarClasses(theme)}>
      <div className={cn("p-8 border-b", isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border")}>
        <Link
          href="/"
          className={cn(
            "font-black text-2xl tracking-tighter uppercase block transition-colors hover:text-accent",
            isCyberCopy || isTechieCopy
              ? "font-mono"
              : isOctaneCopy
                ? "font-sans"
                : config.fontFamily === "serif"
                  ? "font-serif italic"
                  : "font-sans",
            isTechieCopy && "text-[var(--accent)] tracking-widest",
          )}
        >
          {isTechieCopy ? `> ${getLabel("brand")}_` : getLabel("brand")}
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isCyberCopy
                ? "bg-accent"
                : isOctaneCopy
                  ? "bg-accent-warm"
                  : isTechieCopy
                    ? "bg-[var(--accent)]"
                    : "bg-accent/40",
            )}
          />
          <span
            className={cn(
              "text-[9px] font-mono uppercase tracking-[0.2em]",
              isTechieCopy ? "text-[var(--accent-secondary)]" : "text-foreground-subtle",
            )}
          >
            {getLabel("status")}
          </span>
        </div>
      </div>

      {/* Tenant Switcher */}
      {user && tenants.length > 0 && (
        <div className={cn("px-4 py-4 border-b", isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border")}>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-none group text-left">
              <div className={getTenantSwitcherClasses(theme)}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center shrink-0",
                      isTechieCopy ? "bg-[var(--bg-panel)] text-[var(--accent)]" : "bg-accent/10",
                    )}
                  >
                    <Globe size={12} className={cn(isTechieCopy ? "text-[var(--accent)]" : "text-accent")} />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] font-bold truncate leading-none mb-1">{currentTenant?.name}</div>
                    <div className="text-[8px] text-foreground-subtle truncate opacity-60">/{currentTenant?.slug}</div>
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className="text-foreground-subtle group-hover:text-accent transition-colors shrink-0"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={cn(
                "w-[224px] mt-1 p-2 z-[200] bg-noir-panel border-noir-border animate-in fade-in slide-in-from-top-2",
                isCyberCopy || isTechieCopy ? "rounded-none" : "rounded-2xl",
                isTechieCopy && "bg-[var(--bg-primary)] border-[var(--bg-panel)]",
              )}
            >
              <div className="px-3 py-2 text-[8px] font-mono text-foreground-subtle uppercase tracking-widest border-b border-noir-border mb-1">
                {getLabel("publications")}
              </div>
              {tenants.map(t => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => handleTenantSwitch(t.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors focus:bg-noir-hover",
                    t.id === currentTenant?.id ? "text-accent" : "text-foreground-subtle hover:text-foreground",
                    isCyberCopy || isTechieCopy ? "rounded-none" : "rounded-xl",
                    isTechieCopy &&
                      "hover:bg-[var(--bg-panel)] focus:bg-[var(--bg-panel)] text-[var(--foreground)] focus:text-[var(--accent)]",
                  )}
                >
                  <span className="text-[10px] font-bold">{t.name}</span>
                  {t.id === currentTenant?.id && (
                    <div
                      className={cn(
                        "w-1 h-1 rounded-full shadow-[0_0_5px_rgba(var(--accent-rgb),0.5)]",
                        isTechieCopy ? "bg-[var(--accent)]" : "bg-accent",
                      )}
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      {user && (
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItemsConfig.map(item => {
            const itemUrl = new URL(item.href, "http://conduit.local");
            const itemPathname = itemUrl.pathname;
            const itemTab = itemUrl.searchParams.get("tab");

            const isActive = pathname === itemPathname && (!itemTab || searchParams.get("tab") === itemTab);

            const displayLabel = getLabel(item.labelKey);
            const formattedLabel =
              isCyberCopy || isTechieCopy ? displayLabel.toUpperCase().replace(" ", "_") : displayLabel;

            const linkHref = tenantId ? `${item.href}?tenantId=${tenantId}` : item.href;

            return (
              <Link key={item.href} href={linkHref} className={getSidebarItemClasses(theme, isActive)}>
                <item.icon
                  size={16}
                  className={cn(isActive && "scale-110", "transition-transform group-hover:scale-110")}
                />
                <span className="relative z-10">{formattedLabel}</span>
                {isActive && !isTechieCopy && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {!user && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
          <div className="w-12 h-12 rounded-full border border-dashed border-foreground/20 flex items-center justify-center mb-4">
            <User size={20} />
          </div>
          <div className="text-[10px] uppercase font-mono tracking-widest leading-relaxed">
            Authentication Required
            <br />
            for Studio Access
          </div>
          <Link
            href="/login"
            className="mt-6 text-[10px] font-bold text-accent hover:underline uppercase tracking-widest"
          >
            Go to Login
          </Link>
        </div>
      )}
      {user && (
        <div
          className={cn("p-6 border-t bg-noir-bg/20", isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border")}
        >
          <button
            onClick={() => logout()}
            className={cn(
              "flex items-center gap-3 px-5 py-3 text-xs transition-all w-full text-left group",
              "text-foreground-subtle hover:text-accent font-mono uppercase tracking-[0.2em]",
              isTechieCopy && "hover:text-[var(--accent)]",
            )}
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">{getLabel("logout")}</span>
          </button>
        </div>
      )}
    </aside>
  );
}

