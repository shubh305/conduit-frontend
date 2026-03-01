import { ThemeVariant, ButtonVariantStyles } from "../types";
import { cn } from "@/lib/utils";

export const buttonVariants: Record<ThemeVariant, ButtonVariantStyles> = {
  cyber: {
    primary:
      "bg-accent/10 border border-accent rounded-none shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-accent hover:text-black font-mono uppercase tracking-[0.2em] font-bold text-accent",
    ghost:
      "bg-transparent border border-accent/20 rounded-none hover:bg-accent/10 font-mono uppercase tracking-[0.2em] text-accent/70",
  },
  octane: {
    primary:
      "bg-accent text-white border-none rounded-sm shadow-[0_0_15px_rgba(255,100,0,0.4)] hover:brightness-110 font-bold uppercase tracking-wider italic",
    ghost:
      "bg-transparent border border-accent/30 text-accent rounded-sm hover:bg-accent/10 font-bold uppercase tracking-wider italic",
  },
  sakura: {
    primary:
      "bg-[#ffc0cb]/20 border border-[#ffb7c5] rounded-full backdrop-blur-sm hover:bg-[#ffc0cb]/40 text-[#d65d7a] font-serif font-medium tracking-wide",
    ghost:
      "bg-transparent border border-[#ffb7c5]/30 rounded-full hover:bg-[#ffc0cb]/10 text-[#d65d7a] font-serif italic",
  },
  ronin: {
    primary:
      "bg-noir-bg border-2 border-accent rounded-none hover:bg-accent hover:text-black font-serif font-black uppercase tracking-[0.2em] text-accent",
    ghost:
      "bg-transparent border border-accent/40 rounded-none hover:bg-accent/10 font-serif text-accent uppercase tracking-[0.1em]",
  },
  journal: {
    primary:
      "bg-accent text-[#FDF5E6] rounded-lg shadow-sm border border-accent/20 hover:bg-journal-ink-muted hover:text-white font-serif font-bold italic tracking-wide",
    ghost: "bg-transparent text-accent border border-accent/20 rounded-lg hover:bg-accent/5 font-serif italic",
  },
  terminal: {
    primary:
      "bg-accent/10 border border-accent rounded-none hover:bg-accent hover:text-black font-mono text-accent before:content-['['] before:mr-2 after:content-[']'] after:ml-2",
    ghost: "bg-transparent border border-accent/40 rounded-none hover:bg-accent/20 font-mono text-accent/70",
  },
  techie: {
    primary:
      "bg-accent text-noir-bg font-mono font-bold uppercase tracking-wider rounded-md hover:bg-foreground hover:text-noir-bg shadow-[0_2px_10px_rgba(var(--accent-rgb),0.2)]",
    ghost:
      "bg-transparent text-accent border border-accent/40 font-mono uppercase tracking-wider rounded-md hover:bg-accent/10",
  },
  classic: {
    primary:
      "bg-white text-black border border-white/10 rounded-lg hover:bg-white/90 font-sans font-bold tracking-tight shadow-[0_4px_20px_rgba(255,255,255,0.15)]",
    ghost:
      "bg-transparent text-foreground border border-noir-border rounded-lg hover:bg-noir-hover font-sans font-medium tracking-tight",
  },
  "classic-white": {
    primary:
      "bg-white text-black border border-black/10 rounded-lg hover:bg-black/5 font-sans font-medium tracking-tight",
    ghost:
      "bg-transparent text-foreground border border-black/10 rounded-lg hover:bg-black/5 font-sans font-medium tracking-tight",
  },
  professional: {
    primary:
      "bg-accent text-white rounded-md hover:bg-accent-secondary font-sans font-medium tracking-tight shadow-sm transition-all",
    ghost:
      "bg-transparent text-accent border border-accent/20 rounded-md hover:bg-accent/5 font-sans font-medium tracking-tight",
  },
};

export function getButtonClasses(theme: ThemeVariant, variant: "primary" | "ghost" = "primary"): string {
  const v = buttonVariants[theme] || buttonVariants.classic;
  return cn("transition-all duration-300 flex items-center justify-center", v[variant]);
}

export function getToolbarButtonClasses(theme: ThemeVariant, isActive: boolean): string {
  const base =
    "flex items-center justify-center p-2.5 md:p-2 min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0 transition-all duration-200 cursor-pointer";
  
  if (theme === "cyber") {
    return cn(
      base,
      "rounded-none",
      isActive ? "bg-accent/20 text-accent" : "text-foreground/70 hover:bg-accent/10 hover:text-accent",
    );
  }
  
  if (theme === "terminal") {
    return cn(
      base,
      "rounded-none font-mono",
      isActive ? "bg-accent text-black" : "text-accent/70 hover:bg-accent/20 hover:text-accent",
    );
  }

  if (theme === "journal") {
    return cn(
      base,
      "rounded-md",
      isActive ? "bg-accent/10 text-accent" : "text-foreground/70 hover:bg-accent/5 hover:text-accent",
    );
  }

  return cn(
    base,
    "rounded-lg",
    isActive ? "bg-black/10 text-foreground" : "text-foreground/60 hover:bg-black/5 hover:text-foreground",
  );
}
