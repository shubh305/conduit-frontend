"use client";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

import { useThemeHelpers, useTheme } from "@/features/theme/ThemeProvider"

import {
  getConfigItemClasses,
  getConfigItemTitleClasses,
  getToggleSwitchClasses,
  getInfoBoxClasses,
} from "@/lib/theme-variants"

export function NotificationsConfig() {
  const { theme } = useTheme()
  const { isJournalCopy } = useThemeHelpers()

  const notifications = [
    { title: "System Broadcast", desc: "Global updates and system-wide announcements." },
    { title: "Node Interaction", desc: "Notifications when someone interacts with your nodes." },
    { title: "Signal Mentions", desc: "Alerts when your identifier is referenced." },
    { title: "Core Updates", desc: "Security and internal system upgrades." },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        {notifications.map(item => (
          <div key={item.title} className={getConfigItemClasses(theme)}>
            <div className="flex-1 pr-6">
              <span className={getConfigItemTitleClasses(theme)}>{item.title}</span>
              <p className={cn("text-xs text-foreground-subtle", isJournalCopy && "font-serif italic")}>{item.desc}</p>
            </div>

            <div className={getToggleSwitchClasses(theme, false)}>
              <div
                className={cn(
                  "w-4 h-4 rounded-full absolute top-1 left-1 shadow-sm",
                  ["cyber", "techie", "terminal"].includes(theme) ? "bg-accent/40" : "bg-accent/30",
                )}
              />
            </div>
          </div>
        ))}

        <div className={getInfoBoxClasses(theme)}>
          <Info size={16} className="text-accent shrink-0 mt-0.5" />
          <p
            className={cn(
              "text-[10px] uppercase font-mono tracking-[0.1em] leading-relaxed",
              ["cyber", "techie", "terminal"].includes(theme) ? "text-accent/40" : "text-foreground-subtle",
            )}
          >
            [SYSTEM_INFO]: Notification preferences are currently staged for local storage migration. Real-time
            synchronization will be enabled in the next core update.
          </p>
        </div>
      </div>
    </div>
  )
}
