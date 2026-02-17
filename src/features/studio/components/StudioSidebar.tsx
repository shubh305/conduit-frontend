"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText, PenTool, User, LogOut, Palette, ChevronDown, Globe, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, useStudioLabels, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { getSidebarClasses, getSidebarItemClasses, getTenantSwitcherClasses } from "@/lib/theme-variants"
import { useAuth } from "@/features/auth/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StudioLabelKey } from "@/features/theme/studio-labels"
import { SearchInput } from "@/features/search/components/SearchInput";
import { WIP_LIMITS } from "@/lib/wip-limits";

const navItemsConfig: { icon: React.ElementType; labelKey: StudioLabelKey; href: string; id: string }[] = [
  // { icon: LayoutDashboard, labelKey: "overview", href: "/studio" }, // Temp: Hidden
  { id: "studio-posts", icon: FileText, labelKey: "posts", href: "/studio/posts" },
  { id: "studio-editor", icon: PenTool, labelKey: "create_post", href: "/studio/editor" },
  { id: "studio-publications", icon: Globe, labelKey: "publications", href: "/studio/config?tab=transmissions" },
  { id: "studio-appearance", icon: Palette, labelKey: "appearance", href: "/studio/config?tab=appearance" },
  { id: "studio-notifications", icon: Bell, labelKey: "notifications", href: "/studio/config?tab=notifications" },
  { id: "studio-settings", icon: User, labelKey: "profile", href: "/studio/settings" },
];


interface StudioSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StudioSidebar({ isOpen = true, onToggle }: StudioSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, config } = useTheme();
  const { getLabel } = useStudioLabels();
  const { isCyberCopy, isOctaneCopy, isTechieCopy } = useThemeHelpers();
  const { user, logout } = useAuth();

  const isWalkthrough = pathname === "/walkthrough" && searchParams.get("tourStage") === "creator";
  const tenantId = searchParams.get("tenantId");
  const tenants =
    user?.tenants || (isWalkthrough ? [{ id: "mock-id", name: "Walkthrough Blog", slug: "walkthrough" }] : []);
  const currentTenant = tenants.find(t => t.id === tenantId) || tenants[0];

  const handleTenantSwitch = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tenantId", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside
      className={cn(
        getSidebarClasses(theme),
        // Mobile drawer behavior
        "fixed inset-y-0 left-0 z-[170] pt-16 md:pt-0 transition-transform duration-300 ease-in-out border-r shadow-xl md:shadow-none overflow-hidden",
        isOpen
          ? "translate-x-0 w-64 pointer-events-auto opacity-100"
          : "-translate-x-full w-64 pointer-events-none opacity-0 md:translate-x-0 md:w-20 md:pointer-events-auto md:opacity-100",
        "md:flex",
      )}
    >
      <div className={cn("p-8 border-b relative", isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border")}>
        {/* Desktop Toggle Button */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all hover:bg-noir-hover text-foreground-muted hover:text-foreground hidden md:block cursor-pointer",
            !isOpen && "right-1/2 translate-x-1/2",
          )}
          style={{ borderRadius: "var(--theme-radius-md)" }}
        >
          <Menu size={16} className={cn("transition-transform duration-300", !isOpen && "rotate-180")} />
        </button>

        <Link
          href="/"
          className={cn(
            "font-black text-2xl tracking-tighter uppercase transition-colors hover:text-accent",
            isOpen ? "block" : "hidden",
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
        <div className={cn("flex items-center gap-2 mt-2", !isOpen && "justify-center")}>
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
          {isOpen && (
            <span
              className={cn(
                "text-[9px] font-mono uppercase tracking-[0.2em]",
                isTechieCopy ? "text-[var(--accent-secondary)]" : "text-foreground-subtle",
              )}
            >
              {getLabel("status")}
            </span>
          )}
        </div>
      </div>

      {/* Tenant Switcher */}
      {(user || isWalkthrough) && tenants.length > 0 && (
        <div
          className={cn("px-4 py-2 md:py-4 border-b", isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border")}
        >
          <DropdownMenu>
            <DropdownMenuTrigger data-tour-id="studio-switcher" className="w-full outline-none group text-left">
              <div className={getTenantSwitcherClasses(theme)}>
                <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "justify-center")}>
                  <div
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center shrink-0",
                      isTechieCopy ? "bg-[var(--bg-panel)] text-[var(--accent)]" : "bg-accent/10",
                    )}
                  >
                    <Globe size={12} className={cn(isTechieCopy ? "text-[var(--accent)]" : "text-accent")} />
                  </div>
                  {isOpen && (
                    <div className="truncate">
                      <div className="text-[10px] font-bold truncate leading-none mb-1">{currentTenant?.name}</div>
                      <div className="text-[8px] text-foreground-subtle truncate opacity-60">
                        /{currentTenant?.slug}
                      </div>
                    </div>
                  )}
                </div>
                {isOpen && (
                  <ChevronDown
                    size={14}
                    className="text-foreground-subtle group-hover:text-accent transition-colors shrink-0"
                  />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={cn(
                "w-[224px] mt-1 p-2 z-[175] bg-noir-panel border-noir-border animate-in fade-in slide-in-from-top-2",
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

      {/* Search - WIP Indicator */}
      {isOpen && WIP_LIMITS.showSidebarSearch && (
        <div className="px-5 pt-2 md:pt-6 pb-1 md:pb-2">
          <SearchInput placeholder="Search studio..." className="scale-95 origin-left" />
        </div>
      )}

      {/* Navigation */}
      {(user || isWalkthrough) && (
        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 mt-1 md:mt-4">
          {navItemsConfig.map(item => {
            const itemUrl = new URL(item.href, "http://conduit.local");
            const itemPathname = itemUrl.pathname;
            const itemTab = itemUrl.searchParams.get("tab");

            const isConfigPage = itemPathname.endsWith("/config");
            const isActive =
              (isConfigPage ? pathname === itemPathname : pathname.startsWith(itemPathname)) &&
              (!itemTab || searchParams.get("tab") === itemTab);

            const displayLabel = getLabel(item.labelKey);
            const formattedLabel =
              isCyberCopy || isTechieCopy ? displayLabel.toUpperCase().replace(" ", "_") : displayLabel;

            const effectiveTenantId = tenantId || currentTenant?.id;
            const separator = item.href.includes("?") ? "&" : "?";
            const linkHref = effectiveTenantId ? `${item.href}${separator}tenantId=${effectiveTenantId}` : item.href;

            if (item.labelKey === "notifications" && !WIP_LIMITS.showNotifications) return null;

            return (
              <Link
                key={item.href}
                id={`studio-${item.id}`}
                data-tour-id={item.id}
                href={linkHref}
                className={cn(
                  getSidebarItemClasses(theme, isActive),
                  !isOpen && "justify-center px-0",
                  "cursor-pointer",
                )}
              >
                <item.icon
                  size={16}
                  className={cn(isActive && "scale-110", "transition-transform group-hover:scale-110")}
                />
                {isOpen && <span className="relative z-10">{formattedLabel}</span>}
                {isActive && !isTechieCopy && isOpen && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {!user && !isWalkthrough && (
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
          className={cn(
            "p-4 md:p-6 border-t bg-noir-bg/20",
            isTechieCopy ? "border-[var(--bg-panel)]" : "border-noir-border",
          )}
        >
          <button
            onClick={() => logout()}
            className={cn(
              "flex items-center gap-3 px-5 py-3 text-xs transition-all w-full text-left group cursor-pointer",
              "text-foreground-subtle hover:text-accent font-mono uppercase tracking-[0.2em]",
              isTechieCopy && "hover:text-[var(--accent)]",
              !isOpen && "justify-center px-0",
            )}
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            {isOpen && <span className="font-bold">{getLabel("logout")}</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
