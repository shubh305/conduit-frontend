"use client";

import { useThemeHelpers, useTheme } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils";
import {
  getChartContainerClasses,
  getChartBarClasses,
  getChartTooltipClasses,
  getHeadingClasses,
} from "@/lib/theme-variants";

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AnalyticsChart({ data, title, subtitle, className }: AnalyticsChartProps) {
  const { theme } = useTheme()
  const { isCyberCopy, isDarkMode, isJournalCopy, isTechieCopy } = useThemeHelpers()

  const maxValue = Math.max(...data.map(d => d.value), 10)

  return (
    <div className={cn(getChartContainerClasses(theme), className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3
            className={cn(
              "text-lg font-bold text-foreground",
              getHeadingClasses(theme),
              isTechieCopy && "text-foreground tracking-tight uppercase",
            )}
          >
            {title || "Analytics"}
          </h3>
          <p
            className={cn(
              "text-xs mt-1",
              isCyberCopy
                ? "text-accent/50 font-mono"
                : isJournalCopy
                  ? "text-accent/60 font-serif italic"
                  : isTechieCopy
                    ? "text-accent-secondary font-mono uppercase tracking-widest"
                    : "text-foreground-muted",
            )}
          >
            {subtitle || "Summary of performance metrics"}
          </p>
        </div>
        <div
          className={cn(
            "px-3 py-1 text-[10px] font-mono border",
            "border-accent/30 text-accent",
            isJournalCopy && "font-serif italic capitalize border-accent/20",
            isTechieCopy && "border-accent/30 text-accent bg-accent/10 rounded-sm",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
        >
          {isJournalCopy ? "Past Seven Days" : "LAST 7 DAYS"}
        </div>
      </div>

      <div className="flex-1 flex items-end gap-2 md:gap-4 min-h-[150px] relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={cn("w-full border-t border-accent", isTechieCopy && "border-accent-secondary")} />
          ))}
        </div>

        {data.map((d, i) => {
          const height = (d.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
              <div className={getChartTooltipClasses(theme)}>
                {d.value} {isJournalCopy ? "Observations" : "VIEWS"}
              </div>

              <div
                className={getChartBarClasses(theme)}
                style={{
                  height: `${height}%`,
                }}
              >
                {isDarkMode && !isJournalCopy && (
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
                )}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
              </div>
              <span
                className={cn(
                  "text-[9px] mt-4 font-mono uppercase tracking-tighter",
                  "text-foreground-subtle group-hover:text-accent transition-colors",
                  isJournalCopy && "font-serif italic capitalize tracking-normal text-xs",
                )}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
