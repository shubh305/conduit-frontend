import { ThemeVariant } from "../types";

export interface InputVariantStyles {
  base: string;
  focus: string;
  placeholder: string;
}

export const inputVariants: Record<ThemeVariant, InputVariantStyles> = {
  cyber: {
    base: "border-none bg-zinc-900 font-mono uppercase tracking-wider",
    focus: "focus:bg-zinc-800",
    placeholder: "placeholder:text-zinc-500",
  },
  classic: {
    base: "border-input bg-transparent font-serif",
    focus: "focus:border-foreground/40 focus:bg-accent/5",
    placeholder: "placeholder:text-muted-foreground",
  },
  sakura: {
    base: "border-accent/10 bg-white/40 font-serif",
    focus: "focus:bg-white/60 focus:border-accent/30",
    placeholder: "placeholder:text-accent/30",
  },
  "classic-white": {
    base: "border-gray-200 bg-white font-sans",
    focus: "focus:border-black/20 focus:bg-gray-50",
    placeholder: "placeholder:text-gray-400",
  },
  professional: {
    base: "border-gray-200 bg-white font-serif",
    focus: "focus:border-gray-300 focus:bg-gray-50",
    placeholder: "placeholder:text-gray-400",
  },
  ronin: {
    base: "border-white/20 bg-transparent text-accent font-serif italic",
    focus: "focus:border-accent/60",
    placeholder: "placeholder:text-accent/30",
  },
  octane: {
    base: "border-white/10 bg-noir-panel text-white font-sans italic",
    focus: "focus:border-accent/60",
    placeholder: "placeholder:text-white/20",
  },
  journal: {
    base: "border-b-2 border-accent/20 bg-transparent font-serif italic text-lg text-accent",
    focus: "focus:border-accent/40",
    placeholder: "placeholder:text-accent/40",
  },
  terminal: {
    base: "border-accent/50 bg-noir-bg text-accent font-mono",
    focus: "focus:border-accent",
    placeholder: "placeholder:text-accent/30",
  },
  techie: {
    base: "border-accent/30 bg-black/40 text-accent font-mono",
    focus: "focus:border-accent/60",
    placeholder: "placeholder:text-accent/20",
  },
};

export function getInputClasses(theme: ThemeVariant): string {
  const v = inputVariants[theme] || inputVariants.classic;
  return `${v.base} ${v.focus} ${v.placeholder}`;
}
