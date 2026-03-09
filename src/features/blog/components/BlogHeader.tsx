"use client";

import { Tenant } from "../types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function BlogHeader({ tenant, className }: { tenant: Tenant; className?: string }) {
  const { config } = useTheme();
  const { isCyberCopy, isTechieCopy } = useThemeHelpers();
  return (
    <header className="py-2 bg-transparent">
      <div className={cn("w-full px-4 md:px-8", className)}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1
              className={cn(
                "text-2xl md:text-3xl font-black tracking-tighter uppercase text-foreground font-display transition-colors",
                isCyberCopy || isTechieCopy ? "font-mono" : config.fontFamily === "serif" ? "font-serif" : "font-sans",
                isTechieCopy && "text-accent tracking-widest",
              )}
            >
              {isTechieCopy ? `> ${tenant.name}_` : tenant.name}
            </h1>
            {tenant.description && (
              <p
                className={cn(
                  "text-base md:text-lg max-w-2xl text-foreground-muted transition-colors",
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
        </div>
      </div>
    </header>
  );
}
