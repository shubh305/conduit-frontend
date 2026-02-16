"use client";

import React from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useTheme, THEMES, useThemeHelpers } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ThemeHubSlider() {
  const { theme, setTheme, config } = useTheme();
  const { fontFamily, isDarkMode, isTerminalCopy, isCyberCopy } = useThemeHelpers();
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = React.useState(0);
  
  const currentIndex = THEMES.indexOf(theme);
  const totalThemes = THEMES.length;


  React.useEffect(() => {
    if (!trackRef.current) return;
    const updateWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);


  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 800, damping: 50, mass: 0.5 });


  React.useEffect(() => {
    if (!isDragging && trackWidth > 0) {
      const targetX = (currentIndex / (totalThemes - 1)) * trackWidth;
      x.set(targetX);
    }
  }, [currentIndex, trackWidth, isDragging, totalThemes, x]);

  const handleDrag = () => {
    if (trackWidth === 0) return;
    const relativeX = Math.max(0, Math.min(trackWidth, x.get()));
    const newIndex = Math.round((relativeX / trackWidth) * (totalThemes - 1));
    const targetTheme = THEMES[newIndex];
    if (targetTheme && targetTheme !== theme) {
      setTheme(targetTheme);
    }
  };

  const fontClass = fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif italic" : "font-sans";
  const baseRadius = config.tokens.borderRadius;
  const cardRadius = baseRadius > 0 ? "24px" : "0px";
  const innerRadius = baseRadius > 0 ? "12px" : "0px";

  return (
    <motion.div
      animate={{
        borderRadius: cardRadius,
      }}
      className={cn(
        "flex flex-col gap-4 touch-none select-none w-80 p-3 border backdrop-blur-3xl shadow-2xl relative transition-all duration-500",
        isDarkMode ? "bg-black/80 border-white/10" : "bg-white/90 border-black/10",
        fontClass,
      )}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between px-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">
            {isTerminalCopy ? "TTY_PROTOCOL" : "STATION_CONTROL"}
          </span>
          <motion.span
            key={config.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase font-black tracking-widest text-accent"
          >
            {config.label}
          </motion.span>
        </div>
        <div className="flex flex-col items-end opacity-40">
          <span className="text-[9px]">00{currentIndex + 1}</span>
          <span className="text-[9px] uppercase tracking-tighter">{isDarkMode ? "Secure" : "Standard"}</span>
        </div>
      </div>

      {/* Interaction Track */}
      <div
        style={{ borderRadius: innerRadius }}
        className={cn(
          "relative h-14 flex items-center group px-12 cursor-pointer transition-all duration-300",
          isDarkMode ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5",
          "border",
        )}
        onClick={e => {
          if (!trackRef.current) return;
          const rect = trackRef.current.getBoundingClientRect();
          const clickX = Math.max(0, Math.min(trackWidth, e.clientX - rect.left));
          const newIndex = Math.round((clickX / trackWidth) * (totalThemes - 1));
          setTheme(THEMES[newIndex]);
        }}
      >
        <motion.div
          animate={{ opacity: isDragging ? 0.3 : 0.05 }}
          className="absolute inset-2 bg-accent blur-2xl rounded-xl pointer-events-none"
        />

        {/* The Track Line & Snap Dots */}
        <div
          ref={trackRef}
          className={cn(
            "relative w-full h-0.5 flex items-center justify-between rounded-full",
            isDarkMode ? "bg-white/10" : "bg-black/10",
          )}
        >
          {THEMES.map(t => (
            <div
              key={t}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 relative z-0",
                theme === t
                  ? "bg-accent scale-[2.5] blur-[0.5px] shadow-[0_0_10px_var(--accent)]"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-black/20",
              )}
            />
          ))}

          {/* Magnetic Thumb */}
          <motion.div
            style={{ x: isDragging ? x : springX }}
            animate={{
              borderRadius: isTerminalCopy || isCyberCopy || theme === "classic" ? "1px" : "12px",
            }}
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={() => setIsDragging(false)}
            className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-10 h-10 bg-accent shadow-[0_0_40px_rgba(var(--accent-rgb),0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-white/30 z-20"
          >
            {/* Core Lens Node */}
            <div
              className={cn(
                "w-4 h-4 border flex items-center justify-center transition-all duration-300",
                isTerminalCopy || isCyberCopy || theme === "classic" ? "rounded-none" : "rounded-lg",
                isDarkMode ? "bg-black/60 border-white/20" : "bg-white/60 border-black/20",
              )}
            >
              <motion.div
                animate={{
                  height: isDragging ? "2px" : "8px",
                  width: isDragging ? "8px" : "2px",
                  rotate: isDragging ? 90 : 0,
                }}
                className="bg-accent/80 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Station Controls */}
      <div className="flex justify-between px-2 relative z-30">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            const idx = THEMES.indexOf(theme);
            const prev = (idx - 1 + THEMES.length) % THEMES.length;
            setTheme(THEMES[prev]);
          }}
          style={{ borderRadius: baseRadius > 0 ? "4px" : "0px" }}
          className={cn(
            "text-[9px] uppercase font-bold tracking-[0.2em] transition-all py-2.5 px-6 border hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center min-w-[100px]",
            isDarkMode
              ? "text-white/60 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white hover:border-accent/40"
              : "text-black/60 border-black/20 bg-black/5 hover:bg-black/10 hover:text-black hover:border-accent/40",
            "theme-header-accent",
          )}
        >
          {isTerminalCopy ? "[PREV]" : "← PREV"}
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            const idx = THEMES.indexOf(theme);
            const next = (idx + 1) % THEMES.length;
            setTheme(THEMES[next]);
          }}
          style={{ borderRadius: baseRadius > 0 ? "4px" : "0px" }}
          className={cn(
            "text-[9px] uppercase font-bold tracking-[0.2em] transition-all py-2.5 px-6 border hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center min-w-[100px]",
            isDarkMode
              ? "text-white/60 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white hover:border-accent/40"
              : "text-black/60 border-black/20 bg-black/5 hover:bg-black/10 hover:text-black hover:border-accent/40",
            "theme-header-accent",
          )}
        >
          {isTerminalCopy ? "[NEXT]" : "NEXT →"}
        </button>
      </div>
    </motion.div>
  );
}
