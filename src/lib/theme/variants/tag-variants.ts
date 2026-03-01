import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

/**
 * Returns theme-aware classes for a tag badge.
 */
export function getTagClasses(theme: ThemeVariant): string {
  const base = "inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold border transition-all";
  
  const styles: Record<string, string> = {
    sakura: "bg-accent/10 border-accent-secondary/30 text-accent rounded-full font-serif italic",
    journal: "bg-accent/10 border-accent/30 text-accent rounded-md font-serif italic",
    cyber: "bg-accent/10 border-accent/40 text-accent rounded-none font-mono uppercase tracking-tighter",
    terminal: "bg-accent/5 border-accent/20 text-accent rounded-none font-mono",
    techie: "bg-accent/10 border-accent-secondary/30 text-accent-secondary rounded-none font-mono uppercase",
    ronin: "bg-noir-bg border-accent/40 text-accent rounded-none font-serif italic",
    classic: "bg-foreground/5 border-foreground/10 text-foreground/80 rounded-none uppercase tracking-widest",
    "classic-white": "bg-accent/10 border-accent/20 text-accent rounded-md font-medium",
    professional: "bg-noir-bg text-accent border-accent/20 rounded-none",
    octane: "bg-accent/10 border-accent/40 text-accent rounded-sm skew-x-[-12deg]",
    default: "bg-accent/10 border-accent/20 text-accent rounded-full",
  };

  const themeStyle = styles[theme] || styles.default;
  return cn(base, themeStyle);
}

/**
 * Returns theme-aware classes for the tag input field.
 */
export function getTagInputClasses(theme: ThemeVariant): string {
  const base = "w-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0 transition-all border";
  
  const styles: Record<string, string> = {
    sakura: "border-accent/20 focus:border-accent text-foreground font-serif italic",
    journal: "border-accent/10 focus:border-accent text-accent placeholder:text-accent/20 font-serif italic",
    cyber:
      "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    terminal:
      "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    techie:
      "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20 font-mono uppercase tracking-widest",
    classic:
      "border-foreground/10 focus:border-foreground/30 text-foreground placeholder:text-foreground/20 rounded-none",
    professional:
      "border-foreground/10 focus:border-accent text-foreground placeholder:text-foreground/20 rounded-none",
    octane: "border-accent/30 focus:border-accent text-accent placeholder:text-accent/20 rounded-sm skew-x-[-12deg]",
    default: "border-accent/20 focus:border-accent text-accent placeholder:text-accent/20",
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
    cyber: "text-accent/60",
    terminal: "text-accent/60",
    techie: "text-accent-secondary/60",
    ronin: "text-accent/60",
    default: "text-accent/60 hover:text-red-400",
  };

  return cn(base, styles[theme] || styles.default);
}
