import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

export function getTabButtonClasses(theme: ThemeVariant, isSelected: boolean): string {
  const base = "px-6 py-2.5 text-sm transition-all flex items-center gap-3 relative border whitespace-nowrap";
  
  const selectedStyles = {
    techie: "bg-accent text-noir-bg border-accent font-bold font-mono uppercase text-xs rounded-none border-dashed",
    cyber: "bg-accent text-noir-bg border-accent font-bold font-mono uppercase text-xs rounded-none border-dashed",
    journal: "bg-accent text-noir-bg border-accent font-bold font-serif italic border-accent/10 rounded-full",
    default: "bg-accent text-noir-bg border-accent font-bold rounded-full",
  };

  const unselectedStyles = {
    techie: "text-foreground-subtle border-noir-border hover:border-accent/40 hover:text-foreground font-mono uppercase text-xs rounded-none border-dashed",
    cyber: "text-foreground-subtle border-noir-border hover:border-accent/40 hover:text-foreground font-mono uppercase text-xs rounded-none border-dashed",
    journal: "text-foreground-subtle border-noir-border hover:border-accent/40 hover:text-foreground font-serif italic border-accent/10 rounded-full",
    default: "text-foreground-subtle border-noir-border hover:border-accent/40 hover:text-foreground rounded-full",
  };

  const activeSet = isSelected ? selectedStyles : unselectedStyles;
  const themeStyle = activeSet[theme as keyof typeof activeSet] || activeSet.default;

  return cn(base, themeStyle);
}

export function getPostItemClasses(theme: ThemeVariant): string {
  const base = "group py-10 flex justify-between items-start transition-all duration-300 px-4 -mx-4";
  
  const styles = {
    journal: "hover:bg-accent/5",
    techie: "hover:bg-accent/5",
    default: "hover:bg-noir-hover/40",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default;
  return cn(base, themeStyle);
}

export function getPostStatusBadgeClasses(theme: ThemeVariant, status: string): string {
  const isPublished = status.toLowerCase() === "published";
  const baseColor = isPublished ? "text-emerald-500" : "text-amber-500";
  
  const styles = {
    journal: "font-serif italic capitalize tracking-normal",
    techie: "font-mono italic capitalize tracking-normal",
    default: "",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default;
  return cn(baseColor, themeStyle);
}

export function getPostActionMenuClasses(theme: ThemeVariant): string {
  const styles = {
    cyber: "rounded-none font-mono text-xs",
    techie: "rounded-none font-mono text-xs",
    default: "rounded-md",
  };
  return cn(styles[theme as keyof typeof styles] || styles.default);
}
