"use client";

import { useTheme, THEME_REGISTRY, ThemeId, THEMES } from "@/features/theme/ThemeProvider";
import {
  Moon,
  Zap,
  Cherry,
  Sun,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Sword,
  Gauge,
  BookOpen,
  Terminal,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const THEME_ICONS: Record<ThemeId, React.ReactNode> = {
  cyber: <Zap size={14} />,
  classic: <Moon size={14} />,
  sakura: <Cherry size={14} />,
  "classic-white": <Sun size={14} />,
  professional: <Briefcase size={14} />,
  ronin: <Sword size={14} />,
  octane: <Gauge size={14} />,
  journal: <BookOpen size={14} />,
  terminal: <Terminal size={14} />,
  techie: <Cpu size={14} />,
}

export function ThemeToggle() {
  const { theme, setTheme, config } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="fixed bottom-6 right-6 z-50">
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full right-0 mb-2 w-64 border shadow-xl overflow-hidden",
            "animate-in slide-in-from-bottom-2 fade-in duration-200",
            config.isDark ? "bg-noir-bg border-noir-border" : "bg-noir-panel border-noir-border",
          )}
          style={{ borderRadius: "var(--theme-radius-md)" }}
        >
          {THEMES.map(themeId => {
            const themeConfig = THEME_REGISTRY[themeId];
            const isSelected = theme === themeId;

            return (
              <button
                key={themeId}
                onClick={() => {
                  setTheme(themeId);
                  setIsOpen(false);
                }}
                data-theme={themeId}
                className={cn("w-full px-4 py-3 text-left flex items-center gap-3 transition-all", "hover:bg-noir-hover", isSelected && "bg-accent/10")}
              >
                <span
                  className={cn("flex items-center justify-center w-8 h-8 border", isSelected ? "border-accent text-accent" : "border-noir-border text-foreground-muted")}
                  style={{ borderRadius: "var(--theme-radius-sm)" }}
                >
                  {THEME_ICONS[themeId]}
                </span>
                <div className="flex-1">
                  <div className={cn("text-sm font-bold", isSelected ? "text-accent" : "text-foreground")}>{themeConfig.label}</div>
                  <div className="text-[10px] text-foreground-subtle line-clamp-1">{themeConfig.description}</div>
                </div>
                {isSelected && <div className="w-2 h-2 rounded-full bg-accent" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2",
          "font-mono text-xs uppercase tracking-wider",
          "border transition-all duration-300 shadow-lg",
          "bg-noir-bg border-accent text-accent hover:bg-accent hover:text-noir-bg",
        )}
        style={{ borderRadius: "var(--theme-radius-sm)" }}
        title="Select Theme"
      >
        {THEME_ICONS[theme]}
        <span>{config.label}</span>
        {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>
    </div>
  );
}
