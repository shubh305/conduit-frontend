import { ThemeVariant, PopoverVariantStyles } from "../types";

export const popoverVariants: Record<ThemeVariant, PopoverVariantStyles> = {
  cyber: {
    base: "bg-noir-bg",
    border: "border-noir-border",
    radius: "rounded-none",
    shadow: "shadow-2xl",
    text: "text-foreground",
    itemHover: "hover:bg-accent/10",
    label: "text-accent/60",
  },
  classic: {
    base: "bg-noir-panel",
    border: "border-noir-border",
    radius: "rounded-lg",
    shadow: "shadow-2xl",
    text: "text-foreground",
    font: "font-serif",
    itemHover: "hover:bg-accent/5",
    label: "text-muted-foreground",
  },
  sakura: {
    base: "bg-white/90 backdrop-blur-md",
    border: "border-accent/10",
    radius: "rounded-2xl",
    shadow: "shadow-sakura",
    text: "text-foreground",
    font: "font-serif",
    itemHover: "hover:bg-accent/10 hover:text-accent",
    label: "text-accent/40",
  },
  "classic-white": {
    base: "bg-white",
    border: "border-gray-200",
    radius: "rounded-lg",
    shadow: "shadow-xl",
    text: "text-gray-900",
    itemHover: "hover:bg-gray-50",
    label: "text-gray-400",
  },
  professional: {
    base: "bg-white",
    border: "border-gray-200",
    radius: "rounded-md",
    shadow: "shadow-xl",
    text: "text-gray-900",
    itemHover: "hover:bg-gray-50",
    label: "text-gray-400",
  },
  ronin: {
    base: "bg-noir-panel",
    border: "border-accent/40",
    radius: "rounded-none",
    shadow: "shadow-2xl",
    text: "text-accent",
    font: "font-serif italic",
    itemHover: "hover:bg-accent/10",
    label: "text-accent/60",
  },
  octane: {
    base: "bg-noir-panel",
    border: "border-white/20",
    radius: "rounded-sm",
    shadow: "shadow-2xl",
    text: "text-white",
    itemHover: "hover:bg-white/10",
    label: "text-white/40",
  },
  journal: {
    base: "bg-[var(--journal-paper)]",
    border: "border-accent/20",
    radius: "rounded-xl",
    shadow: "shadow-xl",
    text: "text-accent",
    itemHover: "hover:bg-accent/5",
    label: "text-accent/40 font-serif italic",
  },
  terminal: {
    base: "bg-noir-bg",
    border: "border-accent",
    radius: "rounded-none",
    shadow: "shadow-none",
    text: "text-accent",
    font: "font-mono",
    itemHover: "hover:bg-accent/20 hover:text-accent",
    label: "text-accent font-mono opacity-100",
  },
  techie: {
    base: "bg-noir-bg",
    border: "border-accent/40",
    radius: "rounded-md",
    shadow: "shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]",
    text: "text-accent",
    font: "font-mono",
    itemHover: "hover:bg-accent/10 hover:text-foreground",
    label: "text-accent/60",
  },
};

export function getPopoverClasses(theme: ThemeVariant): string {
  const v = popoverVariants[theme] || popoverVariants.classic;
  return `${v.base} ${v.border} ${v.radius} ${v.shadow} ${v.text || ""} ${v.font || ""}`;
}

export function getPopoverItemClasses(theme: ThemeVariant): string {
  const v = popoverVariants[theme] || popoverVariants.classic;
  return `w-full px-4 py-2 text-sm text-left flex items-center gap-3 transition-colors ${v.itemHover || "hover:bg-accent/5"}`;
}

export function getPopoverLabelClasses(theme: ThemeVariant): string {
  const v = popoverVariants[theme] || popoverVariants.classic;
  return `px-3 py-1 text-[10px] uppercase font-bold tracking-wider ${v.label || "text-muted-foreground opacity-50"}`;
}
