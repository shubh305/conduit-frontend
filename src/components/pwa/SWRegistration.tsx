"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Serwist } from "@serwist/window";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const UPDATE_TOAST_ID = "pwa-update-available";

export function SWRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "development"
    ) {
      const serwist = new Serwist("/sw.js", { scope: "/" });

      const onUpdate = () => {
        const currentVersion = process.env.NEXT_PUBLIC_PWA_VERSION || "1.0.0";
        const savedVersion = localStorage.getItem("pwa-version");

        if (!savedVersion) {
          localStorage.setItem("pwa-version", currentVersion);
          serwist.messageSkipWaiting();
          return;
        }

        if (savedVersion === currentVersion) {
          serwist.messageSkipWaiting();
          return;
        }

        toast.info("Update available!", {
          id: UPDATE_TOAST_ID,
          description: "A new version is ready. Please refresh to update.",
          duration: Infinity,
          action: {
            label: "Update",
            onClick: () => {
              localStorage.setItem("pwa-version", currentVersion);
              serwist.addEventListener("controlling", () => {
                window.location.reload();
              });
              serwist.messageSkipWaiting();
            },
          },
        });
      };

      serwist.addEventListener("waiting", onUpdate);

      serwist.addEventListener("installed", (event) => {
        if (event.isUpdate) {
          onUpdate();
        }
      });

      serwist.register();
    }
  }, []);

  return <OfflineIndicator />;
}

function OfflineIndicator() {
  const { config } = useTheme();
  const { isRoninCopy, isJournalCopy, isSakuraCopy } = useThemeHelpers();
  const [offlineState, setOfflineState] = useState(
    typeof window !== "undefined" ? !navigator.onLine : false,
  );

  useEffect(() => {
    const handleOnline = () => setOfflineState(false);
    const handleOffline = () => setOfflineState(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offlineState) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 h-16 z-[200] flex items-center gap-3 px-4",
        "animate-in fade-in slide-in-from-top-4 duration-700 select-none pointer-events-none",
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Main Dot */}
        <div className="w-2 h-2 bg-foreground-muted rounded-full opacity-60" />
        {/* Pulse Ring */}
        <div className="absolute inset-0 w-2 h-2 bg-foreground-muted rounded-full animate-ping opacity-20" />
      </div>
      <span
        className={cn(
          "uppercase tracking-[0.3em] text-foreground-muted font-black text-[10px]",
          config.fontFamily === "mono" ? "font-mono" : 
          config.fontFamily === "serif" ? "font-serif italic tracking-normal" : "font-sans",
          isRoninCopy && "font-serif italic tracking-wider",
          isSakuraCopy && "tracking-[0.4em]",
          isJournalCopy && "font-serif normal-case tracking-normal italic"
        )}
      >
        Offline Mode
      </span>
    </div>
  );
}
