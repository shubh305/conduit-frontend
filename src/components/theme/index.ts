/**
 * Theme Components - Re-export barrel file
 */

export { ThemePage } from "./ThemePage";
export { ThemeCard } from "./ThemeCard";
export { ThemeLabel, useThemeLabel } from "./ThemeLabel";
export { ThemeButton } from "./ThemeButton";

// Re-export utilities from theme-variants
export { getHeadingClasses, getCardClasses, getLabel, getMonoClasses, needsTransparency } from "@/lib/theme-variants";
