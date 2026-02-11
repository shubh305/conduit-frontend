import { ThemeVariant } from "../types";
import { cn } from "@/lib/utils";

// Settings Sidebar
export function getSettingsSidebarClasses(theme: ThemeVariant): string {
  const base =
    "fixed top-0 right-0 h-full w-full md:max-w-md z-[150] shadow-2xl transform transition-transform duration-300 ease-out md:border-l flex flex-col";

  const styles = {
    techie: "bg-noir-bg border-noir-border text-foreground",
    ronin: "bg-[var(--bg-sidebar)] border-l border-[#3D3835] text-foreground",
    default: "bg-noir-panel border-noir-border text-foreground",
  };

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getSettingsHeaderClasses(theme: ThemeVariant): string {
  const base = "font-bold text-lg uppercase tracking-wide"

  const styles = {
    cyber: "font-mono text-accent",
    journal: "font-serif",
    techie: "font-mono text-accent tracking-widest",
    default: "", 
  }

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getSettingsLabelClasses(theme: ThemeVariant): string {
  const base = "text-[10px] font-bold uppercase tracking-[0.2em] block"

  const styles = {
    cyber: "text-accent font-mono",
    journal: "font-serif text-foreground",
    techie: "text-accent-secondary font-mono",
    default: "text-foreground-muted",
  }

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getSettingsInputContainerClasses(theme: ThemeVariant, isEditing: boolean): string {
  const base = "group relative flex items-center border transition-all"

  const styles = {
    techie: `bg-noir-panel border-noir-border ${isEditing ? "border-accent" : "border-noir-border"} rounded-none`,
    cyber: `bg-noir-bg border-noir-border ${isEditing ? "border-accent" : "border-noir-border hover:border-noir-border/80"} rounded-none`,
    default: `bg-noir-bg border-noir-border ${isEditing ? "border-accent" : "border-noir-border hover:border-noir-border/80"} rounded-xl`,
  }

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getSettingsStatsGridClasses(theme: ThemeVariant): string {
  const base = "p-3 border grid grid-cols-3 gap-2"

  const styles = {
    techie: "bg-noir-panel/30 border-noir-border rounded-none",
    cyber: "bg-noir-bg/30 border-noir-border/50 rounded-none",
    default: "bg-noir-bg/30 border-noir-border/50 rounded-2xl",
  }

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getSettingsPublishButtonClasses(theme: ThemeVariant): string {
  const base = "w-full h-11 text-xs font-bold uppercase tracking-widest shadow-lg transition-all"

  const styles = {
    cyber: "bg-accent text-noir-bg font-mono rounded-none border border-accent hover:bg-accent/90",
    techie:
      "bg-accent text-noir-bg font-mono rounded-md hover:bg-accent-secondary shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)] border-none",
    default: "rounded-full",
  }

  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

// Config Sections
export function getConfigSectionClasses(theme: ThemeVariant, isOpen: boolean): string {
  const base = "border transition-all duration-500 overflow-hidden"
  const styles = {
    cyber: `border-noir-border ${isOpen ? "bg-noir-panel/40 border-accent/40 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]" : "bg-noir-bg hover:bg-noir-panel/20"} rounded-none`,
    techie: `border-noir-border ${isOpen ? "bg-noir-panel/60 border-accent/30 shadow-xl" : "bg-noir-bg hover:bg-noir-panel/30"} rounded-none`,
    default: `border-noir-border ${isOpen ? "bg-noir-panel/40 shadow-lg" : "bg-noir-bg hover:bg-noir-panel/20"} rounded-[2rem]`,
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getConfigIconClasses(theme: ThemeVariant, isOpen: boolean): string {
  const base =
    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 scale-90 group-hover:scale-100"
  const styles = {
    cyber: `border ${isOpen ? "bg-accent text-noir-bg border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]" : "bg-noir-panel border-noir-border text-accent/60"}`,
    techie: `border ${isOpen ? "bg-accent text-noir-bg border-accent shadow-lg" : "bg-noir-bg border-noir-border text-accent-secondary"}`,
    default: `border ${isOpen ? "bg-accent text-noir-bg border-accent" : "bg-noir-bg border-noir-border text-foreground-muted"}`,
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getConfigTitleClasses(theme: ThemeVariant): string {
  const base = "text-lg font-bold transition-colors"
  const styles = {
    cyber: "font-mono uppercase tracking-tighter text-accent",
    techie: "font-mono uppercase tracking-widest text-accent-secondary",
    journal: "font-serif italic",
    default: "font-sans",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getThemeCardClasses(theme: ThemeVariant, isSelected: boolean): string {
  const base = "relative p-6 text-left border transition-all group overflow-hidden"
  const styles = {
    cyber: `border-noir-border ${isSelected ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "bg-noir-bg hover:border-accent/40 hover:bg-noir-hover"} rounded-none`,
    techie: `border-noir-border ${isSelected ? "border-accent bg-accent/5 ring-2 ring-accent/10" : "bg-noir-bg hover:border-accent/30 hover:bg-noir-panel"} rounded-none`,
    default: `border-noir-border ${isSelected ? "border-accent bg-accent/5 ring-1 ring-accent/20" : "bg-noir-bg hover:border-accent/40 hover:bg-noir-hover"} rounded-2xl`,
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getConfigItemClasses(theme: ThemeVariant): string {
  const base = "flex items-center justify-between p-5 border transition-all"
  const styles = {
    cyber: "border-noir-border bg-noir-bg/20 hover:bg-noir-panel/40 rounded-none",
    techie: "border-noir-border bg-noir-panel/40 hover:bg-noir-panel/60 rounded-none",
    journal: "border-accent/10 bg-[var(--journal-paper)] hover:bg-[#f5e6d3]/30 rounded-xl shadow-sm",
    default: "border-noir-border bg-noir-bg/20 hover:bg-noir-panel/40 rounded-2xl",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getConfigItemTitleClasses(theme: ThemeVariant): string {
  const base = "text-sm font-bold block mb-1 uppercase tracking-wider"
  const styles = {
    cyber: "font-mono text-accent",
    techie: "font-mono text-accent-secondary",
    journal: "font-serif italic normal-case tracking-normal",
    default: "font-sans text-foreground",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getToggleSwitchClasses(theme: ThemeVariant, isActive: boolean): string {
  const base = "w-12 h-6 rounded-full relative transition-all cursor-pointer"
  const styles = {
    cyber: `border border-noir-border ${isActive ? "bg-accent/20 border-accent" : "bg-noir-bg"} rounded-none`,
    techie: `border border-noir-border ${isActive ? "bg-accent/20 border-accent" : "bg-noir-panel"} rounded-none`,
    default: `border border-noir-border ${isActive ? "bg-accent" : "bg-noir-bg"}`,
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getInfoBoxClasses(theme: ThemeVariant): string {
  const base = "flex gap-4 p-6 border transition-all"
  const styles = {
    cyber: "border-accent/20 bg-accent/5 rounded-none",
    techie: "border-accent-secondary/20 bg-accent-secondary/5 rounded-none",
    default: "border-noir-border bg-noir-panel/40 rounded-2xl",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getConfigItemHeadingClasses(theme: ThemeVariant): string {
  const base = "text-lg font-bold mb-1"
  const styles = {
    cyber: "font-mono text-accent uppercase tracking-tighter",
    techie: "font-mono text-accent-secondary uppercase tracking-widest",
    journal: "font-serif italic",
    default: "font-sans",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}

export function getAddButtonClasses(theme: ThemeVariant): string {
  const base =
    "flex items-center gap-3 px-4 md:px-8 py-2.5 md:py-4 font-bold uppercase tracking-[0.2em] transition-all";
  const styles = {
    cyber:
      "bg-accent text-noir-bg font-mono rounded-none hover:bg-accent/90 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]",
    techie: "bg-noir-panel border border-accent text-accent font-mono rounded-none hover:bg-accent/10",
    default: "bg-accent text-noir-bg rounded-full hover:shadow-lg hover:shadow-accent/20",
  }
  const themeStyle = styles[theme as keyof typeof styles] || styles.default
  return cn(base, themeStyle)
}
