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
  const { theme } = useTheme();

  return (
    <div className={cn(getPageClasses(theme), className)}>
      {children}
    </div>
  );
}
