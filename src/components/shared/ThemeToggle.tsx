"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "cyber" ? "classic" : "cyber");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2",
        "font-mono text-xs uppercase tracking-wider",
        "border transition-all duration-300 shadow-lg",
        theme === "cyber" 
          ? "bg-black border-signal-green text-signal-green hover:bg-signal-green hover:text-black" 
          : "bg-white border-black text-black hover:bg-black hover:text-white"
      )}
      title="Toggle Theme"
    >
      {theme === "cyber" ? <Zap size={14} /> : <Moon size={14} />}
      <span>{theme === "cyber" ? "CYBER MODE" : "CLASSIC MODE"}</span>
    </button>
  );
}
