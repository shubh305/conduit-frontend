import { ThemeVariant, CardVariantStyles } from "../types";

export const cardVariants: Record<ThemeVariant, CardVariantStyles> = {
  cyber: {
    base: "bg-noir-panel",
    hover: "hover:bg-noir-hover",
    border: "border-r border-b border-noir-border",
    radius: "rounded-none",
  },
  classic: {
    base: "bg-noir-panel",
    hover: "hover:bg-noir-hover",
    border: "border border-noir-border",
    radius: "rounded-lg",
  },
  sakura: {
    base: "bg-noir-bg shadow-sm",
    hover: "hover:shadow-md",
    border: "border border-noir-border",
    radius: "rounded-xl",
  },
  "classic-white": {
    base: "bg-noir-panel",
    hover: "hover:bg-noir-hover",
    border: "border border-noir-border",
    radius: "rounded-lg",
  },
  professional: {
    base: "bg-noir-panel",
    hover: "hover:bg-noir-hover",
    border: "border border-noir-border",
    radius: "rounded-lg",
  },
  ronin: {
    base: "bg-noir-bg ronin-ink-splatter",
    hover: "hover:border-accent",
    border: "border border-noir-border",
    radius: "rounded-none",
  },
  octane: {
    base: "bg-noir-bg octane-card octane-speedometer",
    hover: "hover:border-accent",
    border: "border border-noir-border",
    radius: "rounded-sm",
  },
  journal: {
    base: "bg-[var(--journal-paper)] shadow-lg",
    hover: "hover:shadow-xl",
    border: "border border-accent/20",
    radius: "rounded-xl",
  },
  terminal: {
    base: "bg-black font-mono text-accent",
    hover: "hover:bg-accent/10 hover:border-accent/60",
    border: "border border-accent/20",
    radius: "rounded-2xl",
  },
  techie: {
    base: "bg-noir-panel border-l-4 border-l-accent shadow-md",
    hover: "hover:bg-noir-hover hover:border-l-foreground transition-all",
    border: "border-y border-r border-noir-border",
    radius: "rounded-md",
  },
};

export function getCardClasses(theme: ThemeVariant): string {
  const v = cardVariants[theme];
  return `${v.base} ${v.border} ${v.radius} ${v.hover}`;
}
