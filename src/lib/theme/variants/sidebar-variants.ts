import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

export function getStatBadgeClasses(theme: ThemeVariant, isPositive: boolean): string {
  const base = "px-1.5 py-0.5 rounded text-[10px] font-bold";
  
  if (theme === "terminal") {
    return cn(base, "rounded-none", isPositive ? "bg-accent/20 text-accent" : "bg-red-500/20 text-red-500");
  }
  
  if (theme === "cyber") {
    return cn(base, "rounded-none", isPositive ? "text-accent" : "text-red-500");
  }

  return cn(base, isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700");
}

export function getDashboardStatCardClasses(theme: ThemeVariant): string {
  const base = "p-4 border transition-all";
  
  if (theme === "cyber") return cn(base, "bg-noir-bg border-accent/20 rounded-none");
  if (theme === "terminal") return cn(base, "bg-black border-accent/20 rounded-none font-mono");
  if (theme === "journal") return cn(base, "bg-white/40 border-accent/10 rounded-xl");
  
  return cn(base, "bg-noir-panel border-noir-border rounded-2xl");
}

export function getSidebarClasses(theme: ThemeVariant): string {
  const base = "w-64 border-r flex flex-col fixed left-0 top-0 h-full z-30 transition-all duration-300";
  
  switch (theme) {
    case "cyber":
      return cn(base, "bg-noir-bg border-accent/10");
    case "terminal":
      return cn(base, "bg-black border-accent/20 font-mono");
    case "journal":
      return cn(base, "bg-[var(--journal-paper)] border-accent/5");
    default:
      return cn(base, "bg-noir-panel border-noir-border");
  }
}

export function getSidebarItemClasses(theme: ThemeVariant, isActive: boolean): string {
  const base = "flex items-center gap-3 px-4 py-2 text-sm transition-all";
  
  if (theme === "cyber") {
    return cn(
      base,
      "rounded-none",
      isActive ? "bg-accent/10 text-accent border-r-2 border-accent" : "text-foreground-subtle hover:bg-accent/5 hover:text-foreground"
    );
  }

  if (theme === "terminal") {
    return cn(
      base,
      "rounded-none font-mono",
      isActive ? "bg-accent text-black" : "text-accent/60 hover:bg-accent/10 hover:text-accent"
    );
  }

  return cn(
    base,
    "rounded-lg",
    isActive ? "bg-black/5 text-foreground font-medium" : "text-foreground-subtle hover:bg-black/5 hover:text-foreground"
  );
}

export function getTenantSwitcherClasses(theme: ThemeVariant): string {
  const base = "w-full flex items-center justify-between p-2 mb-6 border transition-all";
  
  if (theme === "cyber") return cn(base, "rounded-none border-accent/20 hover:border-accent");
  if (theme === "terminal") return cn(base, "rounded-none border-accent/20 hover:border-accent font-mono");
  if (theme === "journal") return cn(base, "rounded-xl border-accent/10 hover:border-accent/20");
  
  return cn(base, "rounded-xl border-noir-border hover:border-foreground/20");
}
