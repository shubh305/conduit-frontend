import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

export function getEditorContainerClasses(theme: ThemeVariant): string {
  const base = "w-full flex flex-col transition-all duration-500";
  
  if (theme === "cyber") return cn(base, "bg-noir-bg");
  if (theme === "terminal") return cn(base, "bg-black font-mono");
  if (theme === "journal" || theme === "sakura") return cn(base, "bg-[var(--journal-paper)]");
  if (theme === "ronin") return cn(base, "bg-noir-bg ronin-ink-bleed");
  if (theme === "techie" || theme === "octane" || theme === "professional") return cn(base, "bg-[var(--editor-bg)]");
  
  return cn(base, "bg-noir-panel");
}

export function getEditorProseClasses(theme: ThemeVariant, isDark: boolean): string {
  const base = "max-w-none focus:outline-none min-h-[300px] md:min-h-[500px] w-full";
  
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

export function getTextColorPalette(theme: ThemeVariant): string[] {
  const common = [
    "#000000",
    "#ffffff",
    "#64748b",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#d946ef",
    "#f43f5e",
  ];

  if (theme === "cyber") {
    return [
      "#00ff00",
      "#ff00ff",
      "#00ffff",
      "#ffff00",
      "#ff0000",
      "#ffffff",
      "#000000",
      "var(--accent)",
      "var(--secondary)",
    ];
  }

  if (theme === "terminal") {
    return ["#00ff00", "var(--accent)", "#ffffff", "#000000", "#333333"];
  }

  if (theme === "ronin") {
    return ["#e94560", "#ffffff", "#000000", "#6b6b6b", "var(--accent)", "var(--secondary)"];
  }

  return [...common, "var(--accent)", "var(--secondary)", "var(--accent-warm)"];
}

export function getHighlightPalette(theme: ThemeVariant): string[] {
  const common = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#ddd6fe", "#fed7aa", "#99f6e4", "#fbcfe8"];

  if (theme === "terminal" || theme === "cyber") {
    return ["rgba(var(--accent-rgb), 0.3)", "rgba(var(--secondary-rgb), 0.3)", "#00ff0044", "#ff00ff44"];
  }

  return [...common, "rgba(var(--accent-rgb), 0.2)", "rgba(var(--secondary-rgb), 0.2)"];
}
