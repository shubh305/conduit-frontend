import { ThemeVariant } from "../types";
import { needsTransparency } from "../helpers";
import { cn } from "@/lib/utils";

export function getPageClasses(theme: ThemeVariant): string {
  const transparent = needsTransparency(theme);
  const base = "w-full text-foreground transition-colors"

  if (theme === "terminal") {
    return `${base} bg-black text-accent`;
  }

  return transparent ? `${base} bg-transparent` : `${base} bg-noir-bg`;
}

export function getHeadingClasses(theme: ThemeVariant): string {
  switch (theme) {
    case "cyber":
      return "font-display uppercase tracking-tighter text-accent"
    case "terminal":
      return "font-mono tracking-tighter text-accent terminal-scanline-text terminal-glow"
    case "ronin":
      return "font-serif italic text-accent"
    case "sakura":
    case "journal":
      return "font-serif italic text-[#5d4037]"
    case "classic":
      return "font-serif italic text-foreground"
    case "techie":
      return "font-mono uppercase tracking-tighter text-accent"
    default:
      return "font-sans text-foreground"
  }
}

export function getMonoClasses(theme: ThemeVariant): string {
  return theme === "cyber" || theme === "terminal" ? "font-mono uppercase tracking-widest" : "font-sans";
}

export function getSubtitleClasses(theme: ThemeVariant): string {
  switch (theme) {
    case "cyber":
    case "terminal":
    case "octane":
    case "techie":
      return "font-mono text-xs uppercase tracking-[0.3em] opacity-60"
    case "journal":
    case "sakura":
    case "ronin":
      return "font-serif italic capitalize tracking-wider opacity-80"
    default:
      return "font-sans text-xs uppercase tracking-widest opacity-60"
  }
}

export function getRoundedClass(theme: ThemeVariant, size: "sm" | "md" | "lg" | "xl" | "2xl" | "full" = "md"): string {
  if (theme === "cyber" || theme === "ronin" || theme === "terminal") {
    return "rounded-none";
  }
  
  const roundingMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };
  
  return roundingMap[size];
}

export function getDialogContentClasses(theme: ThemeVariant): string {
  const base = "max-w-2xl p-0 overflow-hidden border shadow-2xl animate-in fade-in zoom-in-95 duration-300";
  const styles = {
    cyber: "bg-noir-bg border-accent shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] rounded-none",
    terminal: "bg-black border-accent/40 font-mono rounded-none",
    journal: "bg-[var(--journal-paper)] border-accent/10 rounded-lg",
    techie: "bg-noir-bg border-noir-border shadow-xl rounded-none",
    default: "bg-noir-panel border-noir-border rounded-2xl",
  };
  
  return cn(base, styles[theme as keyof typeof styles] || styles.default);
}

export function getTabsListClasses(theme: ThemeVariant): string {
  const base = "flex gap-8";
  const styles = {
    cyber: "border-b border-accent/20",
    terminal: "border-b border-accent/20 font-mono",
    techie: "border-b border-noir-border font-mono",
    default: "",
  };
  
  return cn(base, styles[theme as keyof typeof styles] || styles.default);
}

export function getTabsTriggerClasses(theme: ThemeVariant): string {
  const base = "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative outline-none";
  const styles = {
    cyber: "data-[state=active]:text-accent data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent text-foreground-subtle hover:text-foreground",
    terminal: "data-[state=active]:text-accent text-accent/40 hover:text-accent font-mono",
    techie: "data-[state=active]:text-accent data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent text-foreground-subtle hover:text-foreground font-mono",
    journal: "font-serif italic capitalize tracking-normal text-foreground/60 data-[state=active]:text-accent",
    default: "text-foreground-subtle data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent",
  };
  
  return cn(base, styles[theme as keyof typeof styles] || styles.default);
}

export function getUploadZoneClasses(theme: ThemeVariant): string {
  const base = "flex flex-col items-center justify-center gap-6 py-12 border-2 border-dashed transition-all group/upload cursor-pointer";
  const styles = {
    cyber: "bg-accent/5 border-accent/20 hover:border-accent hover:bg-accent/10 rounded-none",
    terminal: "bg-accent/5 border-accent/20 hover:border-accent/60 rounded-none font-mono",
    techie: "bg-noir-bg border-noir-border hover:border-accent-secondary rounded-none",
    journal: "bg-accent/5 border-accent/10 hover:border-accent/30 rounded-2xl",
    default: "bg-noir-bg border-noir-border hover:border-accent hover:bg-black/5 rounded-[2rem]",
  };
  
  return cn(base, styles[theme as keyof typeof styles] || styles.default);
}

export function getAttributionLinkClasses(theme: ThemeVariant): string {
  const base = "flex items-center gap-2 px-3 py-1.5 text-[10px] backdrop-blur-md border transition-all hover:scale-105";
  const styles = {
    cyber: "bg-noir-bg/80 border-accent/30 text-accent font-mono uppercase rounded-none",
    terminal: "bg-black/80 border-accent/30 text-accent font-mono rounded-none",
    techie: "bg-noir-bg/80 border-noir-border text-foreground-subtle font-mono uppercase rounded-none",
    journal: "bg-white/80 border-accent/10 text-accent font-serif italic rounded-full",
    default: "bg-black/40 border-white/10 text-white rounded-full",
  };
  
  return cn(base, styles[theme as keyof typeof styles] || styles.default);
}

export function getLayoutSelectorLabelClasses(): string {
  return "text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-subtle mb-4 block";
}

export function getLayoutSelectorButtonClasses(theme: ThemeVariant, isSelected: boolean): string {
  const base = "w-full text-left p-4 border transition-all relative overflow-hidden group";
  
  if (theme === "cyber") {
    return cn(
      base,
      "rounded-none",
      isSelected 
        ? "bg-accent/10 border-accent text-accent" 
        : "bg-noir-bg border-noir-border text-foreground-subtle hover:border-accent/50 hover:text-foreground"
    );
  }

  if (theme === "journal") {
    return cn(
      base,
      "rounded-xl font-serif italic",
      isSelected
        ? "bg-accent/5 border-accent text-accent shadow-inner"
        : "bg-white/40 border-accent/10 text-foreground/60 hover:bg-white/60 hover:border-accent/30"
    );
  }

  if (theme === "terminal") {
    return cn(
      base,
      "rounded-none font-mono",
      isSelected
        ? "bg-accent/10 border-accent text-accent"
        : "bg-black border-accent/20 text-accent/40 hover:border-accent/60 hover:text-accent"
    );
  }

  return cn(
    base,
    "rounded-2xl",
    isSelected
      ? "bg-accent/5 border-accent text-accent"
      : "bg-noir-panel border-noir-border text-foreground-subtle hover:border-accent/50 hover:text-foreground"
  );
}

export function getLayoutMockupClasses(theme: ThemeVariant): string {
  const base = "w-full aspect-video border mb-3 relative overflow-hidden flex flex-col";
  
  if (theme === "cyber" || theme === "terminal") {
    return cn(base, "rounded-none border-noir-border bg-black/40");
  }

  if (theme === "journal") {
    return cn(base, "rounded-lg border-accent/10 bg-white/40 shadow-inner");
  }

  return cn(base, "rounded-xl border-noir-border bg-black/20");
}
