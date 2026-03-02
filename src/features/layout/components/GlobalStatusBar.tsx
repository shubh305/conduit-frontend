"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { ThemeHubSlider } from "@/features/theme/ThemeHubSlider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Activity, Cpu, Monitor, Settings2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { usePathname } from "next/navigation";
import { WIP_LIMITS } from "@/lib/wip-limits";

export function GlobalStatusBar() {
  const pathname = usePathname();
  const { theme, focusMode, setFocusMode, themeHubVisible, setThemeHubVisible } = useTheme();
  const isStudio = pathname?.startsWith("/studio");
  const { isDarkMode, fontFamily } = useThemeHelpers();
  const [uptime, setUptime] = useState(0);
  const [load, setLoad] = useState("NORMAL");

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    const loadInterval = setInterval(() => {
      const loads = ["NORMAL", "OPTIMAL", "STABLE", "NOMINAL"];
      setLoad(loads[Math.floor(Math.random() * loads.length)]);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(loadInterval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isThemeHub = target.closest(".theme-hub-slider");
      const isToggleButton = target.closest(".theme-ops-toggle");

      if (themeHubVisible && !isThemeHub && !isToggleButton) {
        setThemeHubVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeHubVisible, setThemeHubVisible]);

  if (focusMode || !WIP_LIMITS.showThemeOps) return null;

  const fontClass = fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans";

  return (
    <>
      <AnimatePresence>
        {themeHubVisible && (
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[101] theme-hub-slider"
          >
            <ThemeHubSlider />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] h-9 hidden md:flex items-center justify-between px-4 text-xs tracking-wider transition-all duration-500 select-none",
          isStudio ? "md:pl-64" : "",
          fontClass,
          "bg-black/90 border-t border-accent/20 text-accent/80 backdrop-blur-sm",
          !isDarkMode && "bg-stone-200/90 border-accent/10 text-stone-600 font-medium",
        )}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Monitor size={12} className="opacity-70" />
            <span>NODE: {theme.toUpperCase()}_v1.0</span>
          </div>

          <div className="flex items-center gap-2 hidden sm:flex">
            <Cpu size={12} className="opacity-70" />
            <span>
              SYSTEM_LOAD: <span className="text-accent">{load}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setThemeHubVisible(!themeHubVisible)}
            className={cn(
              "flex items-center gap-2 hover:text-accent transition-colors theme-ops-toggle",
              themeHubVisible && "text-accent font-bold",
            )}
          >
            <Settings2 size={12} />
            <span>THEME_OPS</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hidden sm:flex">
              <Activity size={12} />
              <span>TRANSMISSION: ACTIVE</span>
            </div>
            <span className="opacity-70 hidden xs:inline">UPTIME: {uptime}s</span>
          </div>

          <button
            onClick={() => setFocusMode(true)}
            className="bg-accent/10 hover:bg-accent hover:text-black px-3 py-1 border border-accent/20 transition-all uppercase font-bold text-[10px]"
          >
            ENTER_VOID
          </button>
        </div>
      </div>
    </>
  );
}
