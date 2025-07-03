import { ThemeVariant } from "./types";

/**
 * Themes that require transparent backgrounds (have background images)
 */
export const TRANSPARENT_THEMES: readonly ThemeVariant[] = ["ronin", "sakura", "journal", "terminal", "techie"] as const;
