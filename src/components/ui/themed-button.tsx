"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useTheme } from "@/features/theme/ThemeProvider";
import { getButtonClasses } from "@/lib/theme-variants";
import { cn } from "@/lib/utils";
import React from "react";

export const ThemedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();

    
    return (
      <Button
        ref={ref}
        {...props}
        className={cn(getButtonClasses(theme), className)}
      />
    );
  }
);

ThemedButton.displayName = "ThemedButton";
