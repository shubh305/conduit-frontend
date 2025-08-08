"use client";


import { useLayoutManager } from "@/features/blog/hooks/useLayoutManager";
import { cn } from "@/lib/utils";
import { Check, LayoutTemplate, Rows, Grid, Columns, BookOpen, List } from "lucide-react";
import { Tenant } from "@/features/blog/types";
import { toast } from "sonner";

import { useThemeHelpers, useTheme } from "@/features/theme/ThemeProvider"
import {
  getLayoutSelectorButtonClasses,
  getLayoutMockupClasses,
  getLayoutSelectorLabelClasses,
} from "@/lib/theme-variants"

interface LayoutSelectorProps {
  tenants: Tenant[]
}

type LayoutType = "stacked" | "grid" | "magazine" | "single-row";

const LAYOUT_OPTIONS = [
  { id: "magazine", label: "Magazine", icon: LayoutTemplate, desc: "Hero post + Grid" },
  { id: "stacked", label: "Stacked (Default)", icon: Rows, desc: "Vertical list" },
  { id: "grid", label: "Grid", icon: Grid, desc: "Multi-column cards" },
  { id: "single-row", label: "Horizontal", icon: Columns, desc: "Side scrolling" },
  { id: "split", label: "Split", icon: BookOpen, desc: "Alternating Zig-Zag" },
  { id: "minimal", label: "Minimal", icon: List, desc: "Text only list" },
] as const;

export function LayoutSelector({ tenants }: LayoutSelectorProps) {
  const { theme } = useTheme()
  const { isCyberCopy, isTechieCopy, isTerminalCopy } = useThemeHelpers()
  const primaryTenant = tenants[0]
  const tenantId = primaryTenant?.id

  const { layout, updateLayout, isLoading } = useLayoutManager(tenantId)

  const handleLayoutSelect = async (layoutId: LayoutType) => {
    if (!tenantId) {
      toast.error("No active tenant identified for configuration")
      return
    }

    try {
      await updateLayout({ mode: layoutId })
      toast.success(isCyberCopy || isTechieCopy || isTerminalCopy ? "LAYOUT_UPDATED" : "Layout updated")
    } catch {
      toast.error("Failed to update layout")
    }
  }

  if (!primaryTenant) return null

  if (isLoading) {
    return (
      <div className="space-y-4 pt-8 border-t border-noir-border">
        <div className="p-12 text-center flex flex-col items-center gap-4 bg-noir-panel/30 border border-noir-border border-dashed">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent animate-pulse">
            Syncing_Layout_Matrix...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <label className={getLayoutSelectorLabelClasses()}>
        {isCyberCopy || isTechieCopy || isTerminalCopy ? "STRUCTURE_MATRIX" : "Homepage Layout Pattern"}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAYOUT_OPTIONS.map(option => {
          const isSelected = layout.mode === option.id
          return (
            <button
              key={option.id}
              onClick={() => handleLayoutSelect(option.id as LayoutType)}
              className={getLayoutSelectorButtonClasses(theme, isSelected)}
            >
              {/* Visual Mockup */}
              <div className={getLayoutMockupClasses(theme)}>{renderLayoutMockup(option.id)}</div>

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0 transition-colors",
                    isSelected
                      ? "bg-accent text-noir-bg shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]"
                      : "bg-noir-panel text-foreground-muted group-hover:bg-noir-bg group-hover:text-accent",
                  )}
                >
                  <option.icon size={18} />
                </div>
                <div>
                  <div
                    className={cn("font-bold text-sm tracking-tight", isSelected ? "text-accent" : "text-foreground")}
                  >
                    {option.label}
                  </div>
                  <div className="text-[10px] text-foreground-subtle font-mono uppercase tracking-wider mt-0.5">
                    {option.desc}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 text-accent bg-noir-bg rounded-full p-0.5 shadow-sm">
                  <Check size={14} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}


function renderLayoutMockup(type: string) {
  if (type === "magazine") {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-1 w-full h-full p-1">
        {/* 0: Tall Left */}
        <div className="col-span-1 row-span-2 bg-foreground/15 rounded-[2px]" />
        {/* 1: Big Hero Center */}
        <div className="col-span-2 row-span-2 bg-foreground/20 rounded-[2px]" />
        {/* 2: Small Top Right */}
        <div className="col-span-1 row-span-1 bg-foreground/10 rounded-[2px]" />
        {/* 3: Tall Right Sidebar */}
        <div className="col-span-1 row-span-2 bg-foreground/15 rounded-[2px]" />
        {/* 4: Wide Bottom Left */}
        <div className="col-span-2 row-span-1 bg-foreground/15 rounded-[2px]" />
        {/* 5: Small Bottom Middle */}
        <div className="col-span-1 row-span-1 bg-foreground/10 rounded-[2px]" />
      </div>
    );
  }
  if (type === "grid") {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
        <div className="bg-foreground/10 rounded-[2px]" />
        <div className="bg-foreground/10 rounded-[2px]" />
        <div className="bg-foreground/10 rounded-[2px]" />
        <div className="bg-foreground/10 rounded-[2px]" />
      </div>
    );
  }
  if (type === "single-row") {
    return (
      <div className="flex gap-1.5 w-full h-full items-center overflow-hidden px-1">
        <div className="min-w-[40%] h-[85%] bg-foreground/15 rounded-[2px]" />
        <div className="min-w-[40%] h-[85%] bg-foreground/10 rounded-[2px]" />
        <div className="min-w-[40%] h-[85%] bg-foreground/10 rounded-[2px]" />
      </div>
    );
  }
  if (type === "split") {
    return (
      <div className="flex flex-col gap-1 w-full h-full">
        <div className="flex gap-1 h-1/2">
          <div className="w-1/2 h-full bg-foreground/10 rounded-[2px]" />
          <div className="w-1/2 h-full flex flex-col gap-0.5 pt-1">
            <div className="w-full h-0.5 bg-foreground/5" />
            <div className="w-2/3 h-0.5 bg-foreground/5" />
          </div>
        </div>
        <div className="flex gap-1 h-1/2">
          <div className="w-1/2 h-full flex flex-col gap-0.5 pt-1">
            <div className="w-full h-0.5 bg-foreground/5" />
            <div className="w-2/3 h-0.5 bg-foreground/5" />
          </div>
          <div className="w-1/2 h-full bg-foreground/10 rounded-[2px]" />
        </div>
      </div>
    );
  }
  if (type === "minimal") {
    return (
      <div className="flex flex-col gap-2 w-full h-full py-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-1">
             <div className="w-full h-1 bg-foreground/15" />
             <div className="w-3/4 h-1 bg-foreground/10" />
          </div>
          <div className="w-6 h-6 bg-foreground/5 rounded-sm shrink-0" />
        </div>
        <div className="w-full h-[1px] bg-foreground/5" />
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-1">
             <div className="w-full h-1 bg-foreground/15" />
             <div className="w-3/4 h-1 bg-foreground/10" />
          </div>
          <div className="w-6 h-6 bg-foreground/5 rounded-sm shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full h-full p-1 border-noir-border/5">
      <div className="w-full h-[30%] bg-foreground/15 rounded-[2px]" />
      <div className="w-full h-[30%] bg-foreground/10 rounded-[2px]" />
      <div className="w-full h-[30%] bg-foreground/5 rounded-[2px]" />
    </div>
  );
}
