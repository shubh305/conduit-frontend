"use client";

/**
 * ThemeButton - Universal button with automatic theme styling
 */

import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { ThemeVariant, getButtonClasses } from "@/lib/theme-variants"
import { Button, ButtonProps } from "@/components/ui/button";

interface ThemeButtonProps extends Omit<ButtonProps, "variant"> {
  themeVariant?: "primary" | "ghost";
}

export function ThemeButton({
  themeVariant = "primary",
  className,
  children,
  ...props
}: ThemeButtonProps) {
  const { theme } = useTheme()
  
  return (
    <Button
      variant="none"
      className={cn("h-10 px-6", getButtonClasses(theme as ThemeVariant, themeVariant), className)}
      {...props}
    >
      {children}
    </Button>
  );
}
