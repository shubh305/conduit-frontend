import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

export function getEditorContainerClasses(theme: ThemeVariant): string {
  const base = "w-full h-full flex flex-col transition-all duration-500 overflow-hidden";
  
  if (theme === "cyber") return cn(base, "bg-noir-bg");
  if (theme === "terminal") return cn(base, "bg-black font-mono");
  if (theme === "journal") return cn(base, "bg-[var(--journal-paper)]");
  if (theme === "ronin") return cn(base, "bg-noir-bg ronin-ink-bleed");
  
  return cn(base, "bg-noir-panel");
}

export function getEditorProseClasses(theme: ThemeVariant, isDark: boolean): string {
  const base = "max-w-none focus:outline-none min-h-[500px] w-full";
  
  switch (theme) {
    case "journal":
      return cn(base, "font-serif text-lg leading-relaxed text-journal-ink-muted");
    case "cyber":
    case "terminal":
      return cn(base, "font-mono text-sm tracking-tight text-accent");
    default:
      return cn(base, "font-sans", isDark ? "prose-invert" : "");
  }
}
