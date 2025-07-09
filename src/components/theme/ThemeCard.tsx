"use client";

/**
 * ThemeCard - Universal card component with automatic theme styling
 */

import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { getCardClasses } from "@/lib/theme-variants";

interface ThemeCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  interactive?: boolean;
}

export function ThemeCard({
  children,
  className,
  as: Component = "div",
  interactive = false,
}: ThemeCardProps) {
  const { theme } = useTheme();
  const baseClasses = getCardClasses(theme);

  return (
    <Component
      className={cn(
        baseClasses,
        interactive && "cursor-pointer transition-all",
        "p-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
