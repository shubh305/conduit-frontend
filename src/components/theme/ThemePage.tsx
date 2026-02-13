"use client";

/**
 * ThemePage - Universal page wrapper with automatic theme handling
 */

import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { getPageClasses } from "@/lib/theme-variants";

interface ThemePageProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemePage({ children, className }: ThemePageProps) {
  const { theme, mounted } = useTheme();
  const activeTheme = mounted ? theme : "classic";

  return <div className={cn(getPageClasses(activeTheme), className)}>{children}</div>;
}
