import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

/**
 * Returns theme-aware classes for a tag badge.
 */
export function getTagClasses(theme: ThemeVariant): string {
  const base = "inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold border transition-all";
  
  const styles: Record<string, string> = {
    sakura: "bg-accent/10 border-accent-secondary/30 text-accent rounded-full font-serif italic",
    journal: "bg-accent/5 border-accent/20 text-accent rounded-md font-serif italic",
    cyber: "bg-accent/10 border-accent/40 text-accent rounded-none font-mono uppercase tracking-tighter",
    terminal: "bg-accent/5 border-accent/20 text-accent rounded-none font-mono",
    techie: "bg-accent/10 border-accent-secondary/30 text-accent-secondary rounded-none font-mono uppercase",
    ronin: "bg-noir-bg border-accent/40 text-accent rounded-none font-serif italic",
    default: "bg-white/10 border-white/20 text-white rounded-full",
  };

  const themeStyle = styles[theme] || styles.default;
  return cn(base, themeStyle);
}

/**
 * Returns theme-aware classes for the tag input field.
 */
export function getTagInputClasses(theme: ThemeVariant): string {
  const base = "w-full bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0 transition-all border-b";
  
  const styles: Record<string, string> = {
    sakura: "border-accent/20 focus:border-accent text-foreground font-serif italic",
    journal: "border-accent/10 focus:border-accent text-accent placeholder:text-accent/20 font-serif italic",
    cyber: "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    terminal: "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    techie: "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    default: "border-white/20 focus:border-white text-white placeholder:text-white/20",
  };

  const themeStyle = styles[theme] || styles.default;
  return cn(base, themeStyle);
}

/**
 * Returns theme-aware classes for the tag removal button.
 */
export function getTagRemoveButtonClasses(theme: ThemeVariant): string {
  const base = "ml-1 hover:text-red-400 focus:outline-none transition-colors";
  
  const styles: Record<string, string> = {
    sakura: "text-accent/50",
    default: "text-foreground-subtle",
  };

  return cn(base, styles[theme] || styles.default);
}
