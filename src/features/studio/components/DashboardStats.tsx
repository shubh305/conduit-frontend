"use client";

import { CardContent } from "@/components/ui/card"
import { DashboardStat } from "../types";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { getStatBadgeClasses, getDashboardStatCardClasses } from "@/lib/theme-variants"
import { ThemeCard } from "@/components/theme"

export function DashboardStats({ stats }: { stats: DashboardStat[] }) {
  const { theme } = useTheme()
  const { isCyberCopy, isOctaneCopy, isJournalCopy, isTechieCopy } = useThemeHelpers()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <ThemeCard key={i} className={getDashboardStatCardClasses(theme)}>
          <CardContent className="p-8">
            <span
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] block mb-6",
                isCyberCopy
                  ? "text-accent/40 font-mono"
                  : isJournalCopy
                    ? "text-accent/60 font-serif italic capitalize tracking-widest"
                    : isOctaneCopy
                      ? "text-foreground-subtle/70 font-sans font-bold"
                      : isTechieCopy
                        ? "text-accent-secondary font-mono tracking-widest"
                        : "text-foreground-muted font-bold",
              )}
            >
              {stat.label}
            </span>
            <div className="flex items-end justify-between">
              <span
                className={cn(
                  "text-4xl font-bold tracking-tighter text-foreground",
                  isCyberCopy
                    ? "font-mono text-accent"
                    : isJournalCopy
                      ? "font-serif text-journal-ink"
                      : isOctaneCopy
                        ? "octane-stat font-sans tracking-tight"
                        : isTechieCopy
                          ? "font-mono text-accent"
                          : "",
                )}
              >
                {stat.value}
              </span>
              <div
                className={getStatBadgeClasses(theme, stat.isPositive ?? false)}
                style={{ borderRadius: isCyberCopy || isTechieCopy ? "0" : "4px" }}
              >
                {stat.change}
              </div>
            </div>
          </CardContent>
        </ThemeCard>
      ))}
    </div>
  )
}
