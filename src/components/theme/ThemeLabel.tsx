"use client";

/**
 * ThemeLabel - Centralized terminology component
 */

import { useTheme } from "@/features/theme/ThemeProvider";
import { getLabel, getJapaneseSubLabel, ThemeVariant, LabelKey } from "@/lib/theme-variants";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

interface ThemeLabelProps {
  labelKey: LabelKey;
  showSubLabel?: boolean;
  className?: string;
  subLabelClassName?: string;
}

export function ThemeLabel({
  labelKey,
  showSubLabel = false,
  className,
  subLabelClassName,
}: ThemeLabelProps) {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  const mainLabel = getLabel(labelKey, theme as ThemeVariant);
  const subLabel = showSubLabel ? getJapaneseSubLabel(labelKey, theme as ThemeVariant) : undefined;

  if (subLabel) {
    return (
      <span className={cn("leading-tight", className)}>
        <span className="block">{mainLabel}</span>
        {theme === "sakura" && (
          <span className={cn("block text-[9px] text-foreground-muted font-normal", subLabelClassName)}>
            {subLabel}
          </span>
        )}
        {theme === "ronin" && (
          <span className={cn("block text-[11px] text-accent font-serif italic", subLabelClassName)}>
            {subLabel}
          </span>
        )}
      </span>
    );
  }

  return <span className={className}>{mainLabel}</span>;
}

/**
 * Hook variant for raw label string
 */
export function useThemeLabel() {
  const { theme } = useTheme();
  const mounted = useMounted();

  return (labelKey: LabelKey) => {
    if (!mounted) return "";
    return getLabel(labelKey, theme as ThemeVariant);
  };
}
