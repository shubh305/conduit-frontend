"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeId, ThemeConfig } from "./types"
import { StudioLabelKey, getStudioLabel } from "./studio-labels"

export type { ThemeId, ThemeConfig } from "./types"

// ============================================================================
// Theme Registry - Register all themes configurations
// ============================================================================

export const THEMES = [
  "cyber",
  "classic",
  "sakura",
  "classic-white",
  "professional",
  "ronin",
  "octane",
  "journal",
  "terminal",
  "techie",
] as const




export const THEME_REGISTRY: Record<ThemeId, ThemeConfig> = {
  cyber: {
    id: "cyber",
    label: "CYBERPUNK",
    description: "High contrast. Signal Green accents. Digital noise.",
    copyTone: "cyber",
    isDark: true,
    fontFamily: "mono",
    tokens: {
      layoutType: "grid",
      containerPadding: 24,
      borderRadius: 4,
      borderWidth: 1,
      fontScale: 1.0,
      innerSpacing: 16,
    },
  },
  classic: {
    id: "classic",
    label: "NOIR",
    description: "Minimalist. High focus. Grayscale hierarchy.",
    copyTone: "classic",
    isDark: true,
    fontFamily: "serif",
    tokens: {
      layoutType: "stack",
      containerPadding: 32,
      borderRadius: 0,
      borderWidth: 1,
      fontScale: 1.05,
      innerSpacing: 24,
    },
  },
  sakura: {
    id: "sakura",
    label: "桜 SAKURA",
    labelJp: "桜の花",
    description: "Cherry blossom elegance. Soft pinks. Japanese aesthetics.",
    copyTone: "sakura",
    isDark: false,
    fontFamily: "serif",
    tokens: {
      layoutType: "stack",
      containerPadding: 40,
      borderRadius: 8,
      borderWidth: 0,
      fontScale: 1.0,
      innerSpacing: 20,
    },
  },
  "classic-white": {
    id: "classic-white",
    label: "CLASSIC WHITE",
    description: "Clean. Accessible. Modern minimalism.",
    copyTone: "minimal",
    isDark: false,
    fontFamily: "sans",
    tokens: {
      layoutType: "stack",
      containerPadding: 32,
      borderRadius: 4,
      borderWidth: 1,
      fontScale: 1.0,
      innerSpacing: 24,
    },
  },
  professional: {
    id: "professional",
    label: "PROFESSIONAL",
    description: "Industrial editorial. Dark nav, white content. Polished.",
    copyTone: "professional",
    isDark: false,
    fontFamily: "serif",
    tokens: {
      layoutType: "stack",
      containerPadding: 24,
      borderRadius: 0,
      borderWidth: 1,
      fontScale: 1.0,
      innerSpacing: 16,
    },
  },
  ronin: {
    id: "ronin",
    label: "浪人 RONIN",
    labelJp: "影の道",
    description: "Dark warrior aesthetic. Blood crimson accents. Katana-sharp edges.",
    copyTone: "ronin",
    isDark: true,
    fontFamily: "serif",
    tokens: {
      layoutType: "stack",
      containerPadding: 32,
      borderRadius: 2,
      borderWidth: 1,
      fontScale: 1.1,
      innerSpacing: 24,
    },
  },
  octane: {
    id: "octane",
    label: "OCTANE",
    description: "Industrial automotive. Gunmetal accents. Precision engineering.",
    copyTone: "octane",
    isDark: true,
    fontFamily: "sans",
    tokens: {
      layoutType: "grid",
      containerPadding: 24,
      borderRadius: 2,
      borderWidth: 2,
      fontScale: 1.0,
      innerSpacing: 12,
    },
  },
  journal: {
    id: "journal",
    label: "JOURNAL",
    description: "Warm sepia tones. Paper texture. Literary elegance.",
    copyTone: "journal",
    isDark: false,
    fontFamily: "serif",
    tokens: {
      layoutType: "stack",
      containerPadding: 48,
      borderRadius: 2,
      borderWidth: 1,
      fontScale: 1.15,
      innerSpacing: 32,
    },
  },
  terminal: {
    id: "terminal",
    label: "TERMINAL",
    description: "Raw power user interface. Phosphor green. Wireframes.",
    copyTone: "terminal",
    isDark: true,
    fontFamily: "mono",
    tokens: {
      layoutType: "terminal",
      containerPadding: 16,
      borderRadius: 0,
      borderWidth: 0,
      fontScale: 0.9,
      innerSpacing: 12,
    },
  },
  techie: {
    id: "techie",
    label: "TECH_SPEC",
    description: "Gadget review aesthetic. Deep slate & Electric cyan. Data-heavy.",
    copyTone: "techie",
    isDark: true,
    fontFamily: "sans",
    tokens: {
      layoutType: "grid",
      containerPadding: 24,
      borderRadius: 6,
      borderWidth: 1,
      fontScale: 1.0,
      innerSpacing: 20,
    },
  },
};


export function isThemeId(value: string): value is ThemeId {
  return THEMES.includes(value as ThemeId);
}

// ============================================================================
// Theme Context
// ============================================================================

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  config: ThemeConfig;
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  themeHubVisible: boolean;
  setThemeHubVisible: (value: boolean) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("cyber");
  const [mounted, setMounted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [themeHubVisible, setThemeHubVisibleState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("conduit-theme");
    if (saved && isThemeId(saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("conduit-theme", theme);
  }, [theme, mounted]);

  const setTheme = React.useCallback((newTheme: ThemeId) => {
    if (isThemeId(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);

  const setThemeHubVisible = React.useCallback((value: boolean) => {
    setThemeHubVisibleState(value);
  }, []);

  const config = React.useMemo(() => THEME_REGISTRY[theme], [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      config,
      focusMode,
      setFocusMode,
      themeHubVisible,
      setThemeHubVisible,
      mounted,
    }),
    [theme, setTheme, config, focusMode, themeHubVisible, setThemeHubVisible, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {

    if (typeof window === "undefined") {
      return {
        theme: "cyber" as ThemeId,
        setTheme: () => {},
        config: THEME_REGISTRY["cyber"],
        focusMode: false,
        setFocusMode: () => {},
        themeHubVisible: false,
        setThemeHubVisible: () => {},
        mounted: false,
      };
    }
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context;
}

// ============================================================================

// ============================================================================

export function useThemeHelpers() {
  const { theme, config } = useTheme();

  return {
    isCyberCopy: config.copyTone === "cyber",
    isSakuraCopy: config.copyTone === "sakura",
    isProfessionalCopy: config.copyTone === "professional",
    isMinimalCopy: config.copyTone === "minimal",
    isRoninCopy: config.copyTone === "ronin",
    isOctaneCopy: config.copyTone === "octane",
    isJournalCopy: config.copyTone === "journal",
    isTerminalCopy: config.copyTone === "terminal",
    isTechieCopy: config.copyTone === "techie",

    isDarkMode: config.isDark,
    isLightMode: !config.isDark,

    fontFamily: config.fontFamily,

    isNoir: theme === "classic",
    isCyber: theme === "cyber",
    theme,
  };
}

export function useStudioLabels() {
  const { theme } = useTheme()
  return {
    getLabel: (key: StudioLabelKey) => getStudioLabel(key, theme),
  }
}
