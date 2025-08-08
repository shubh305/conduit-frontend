"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { User } from "@/features/auth/types";

export function AccountSection({ user }: { user: User }) {
  const { isCyberCopy, isJournalCopy, isTechieCopy, isTerminalCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();

  const isTechnical = isCyberCopy || isTechieCopy || isTerminalCopy;

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "space-y-4 transition-all",
          isTechnical || isJournalCopy ? "opacity-100" : "opacity-50 pointer-events-none",
        )}
      >
        <div className="space-y-2">
          <label
            className={cn(
              "text-xs uppercase tracking-widest font-mono",
              isCyberCopy ? "text-accent/50" : "text-foreground-subtle",
              isJournalCopy && "font-serif italic text-sm text-journal-ink/60",
              isTechieCopy && "text-[var(--accent)] text-[10px] font-bold",
            )}
          >
            {getLabel("email_label")}
          </label>
          <Input
            value={user.email}
            disabled
            className={cn(
              "bg-transparent border-noir-border font-mono",
              isTechnical
                ? "rounded-none"
                : isJournalCopy
                  ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                  : "rounded-xl",
              isTechieCopy &&
                "rounded-lg border-[var(--bg-panel)] bg-[var(--bg-panel)]/40 text-[var(--foreground-muted)]",
            )}
          />
        </div>
        <div
          className={cn(
            "p-6 border text-sm font-mono transition-all",
            isCyberCopy
              ? "border-accent/20 text-accent/40 bg-noir-panel"
              : isJournalCopy
                ? "border-accent/10 bg-journal-parchment/20 text-journal-ink/40 rounded-xl italic font-serif"
                : isTechieCopy
                  ? "border-[var(--bg-panel)] bg-[var(--bg-panel)]/30 text-[var(--accent)]/40 rounded-lg border-dashed"
                  : "border-noir-border bg-noir-hover text-foreground-subtle rounded-xl",
          )}
        >
          {getLabel("security_locked")}
        </div>
      </div>
    </div>
  )
}
