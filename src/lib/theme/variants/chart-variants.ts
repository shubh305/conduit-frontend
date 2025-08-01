import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

export function getChartContainerClasses(theme: ThemeVariant): string {
  const base = "p-8 flex flex-col h-full bg-noir-panel transition-all";
  
  const styles = {
    journal: "bg-transparent border-none p-0",
    techie: "bg-noir-bg/20 border border-noir-border hover:border-accent-secondary/50 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)] rounded-xl bg-[linear-gradient(rgba(var(--bg-rgb),0)_50%,rgba(0,0,0,0.4)_100%),linear-gradient(90deg,rgba(var(--accent-rgb),0.06)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.06)_1px,transparent_1px)] bg-[length:100%_100%,20px_20px,20px_20px]",
    default: "border border-noir-border shadow-sm rounded-xl",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default;
  return cn(base, themeStyle);
}

export function getChartTooltipClasses(theme: ThemeVariant): string {
  const base = "absolute -top-10 px-3 py-1.5 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap z-20 shadow-xl bg-accent text-noir-bg";
  
  const styles = {
    journal: "font-serif italic bg-journal-ink text-journal-paper rounded-md",
    techie: "bg-noir-bg text-accent border border-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)] rounded-none",
    cyber: "rounded-none",
    default: "rounded-md",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default;
  return cn(base, themeStyle);
}

export function getChartBarClasses(theme: ThemeVariant): string {
  const base = "w-full transition-all duration-700 ease-out relative overflow-hidden bg-accent/20 border-t border-x border-accent/40 hover:bg-accent/30";
  
  const styles = {
    journal: "bg-accent/10 border-accent/20 hover:bg-accent/20 rounded-t-sm",
    techie: "bg-accent-secondary/20 border-accent/50 hover:bg-accent/30 hover:shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)] rounded-none",
    cyber: "rounded-none",
    default: "rounded-t-lg",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default;
  return cn(base, themeStyle);
}
