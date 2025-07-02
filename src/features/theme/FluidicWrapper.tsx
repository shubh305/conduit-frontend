"use client";

import React from "react";
import { motion, useMotionTemplate, useAnimation } from "framer-motion";
import { useThemeInterpolation } from "./hooks/useThemeInterpolation";
import { useTheme } from "./ThemeProvider";

export function FluidicWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const controls = useAnimation();
  const { 
    containerPadding, 
    borderRadius, 
    borderWidth, 
    fontScale, 
    innerSpacing 
  } = useThemeInterpolation();

  React.useEffect(() => {
    controls.start({
      scale: [1, 0.992, 1],
      transition: { duration: 0.4, ease: "easeInOut" }
    });
  }, [theme, controls]);

  const paddingVar = useMotionTemplate`${containerPadding}px`;
  const radiusVar = useMotionTemplate`${borderRadius}px`;
  const borderVar = useMotionTemplate`${borderWidth}px`;
  const spacingVar = useMotionTemplate`${innerSpacing}px`;
  
  return (
    <motion.div
      animate={controls}
      style={{
        // @ts-expect-error - Custom CSS variables for fluid layout
        "--fluid-padding": paddingVar,
        "--fluid-radius": radiusVar,
        "--fluid-border-width": borderVar,
        "--fluid-font-scale": fontScale,
        "--fluid-spacing": spacingVar,
      }}
      className="relative w-full min-h-screen"
    >
      <motion.div
        key={`sweep-${theme}`}
        initial={{ top: "-10%", opacity: 0 }}
        animate={{ top: "110%", opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-x-0 h-[20vh] bg-gradient-to-b from-transparent via-accent/20 to-transparent pointer-events-none z-[100] blur-3xl shadow-[0_0_100px_rgba(var(--accent-rgb),0.2)]"
      />

      {children}
    </motion.div>
  );
}
