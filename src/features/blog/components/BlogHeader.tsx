"use client";

import { Tenant } from "../types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function BlogHeader({ tenant }: { tenant: Tenant }) {
  const { config } = useTheme();
  const { isCyberCopy, isTechieCopy } = useThemeHelpers()

  return (
    <header
      className={cn(
        "border-b py-6 md:py-12",
        isTechieCopy ? "bg-noir-bg border-noir-border" : "border-noir-border bg-noir-panel",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h1
          className={cn(
            "text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-foreground font-display",
            isCyberCopy || isTechieCopy ? "font-mono" : config.fontFamily === "serif" ? "font-serif" : "font-sans",
            isTechieCopy && "text-accent tracking-widest",
          )}
        >
          {isTechieCopy ? `> ${tenant.name}_` : tenant.name}
        </h1>
        {tenant.description && (
          <p
            className={cn(
              "text-lg md:text-xl max-w-2xl text-foreground-muted",
              isCyberCopy || isTechieCopy ? "font-mono" : "font-sans",
              isTechieCopy && "text-accent-secondary text-base",
            )}
          >
            {isCyberCopy
              ? `// ${tenant.description}`
              : isTechieCopy
                ? `/* ${tenant.description} */`
                : tenant.description}
          </p>
        )}
      </div>
    </header>
  )
}
