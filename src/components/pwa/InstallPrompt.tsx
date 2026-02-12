"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS] = useState(
    () => typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
  );
  const { isRoninCopy, isJournalCopy } = useThemeHelpers();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      // console.log("User accepted the install prompt");
    } else {
      // console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible && !isIOS) return null;
  if (isIOS) return null; 

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[200] flex items-center gap-3 p-3 rounded-lg shadow-2xl border transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in",
        isRoninCopy 
          ? "bg-black/90 border-accent/30 text-accent font-serif italic"
          : "bg-noir-panel border-noir-border text-foreground font-sans",
        isJournalCopy && "bg-[#F5F2E8] border-stone-300 text-stone-800 font-serif"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">Install App</span>
        <span className="text-[10px] opacity-70">Add to home screen</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant={isRoninCopy ? "outline" : "secondary"}
          className={cn(
            "h-8 px-3 gap-2",
            isRoninCopy && "border-accent/50 hover:bg-accent/10 hover:text-accent text-accent",
            isJournalCopy && "bg-stone-800 text-[#F5F2E8] hover:bg-stone-700"
          )}
          onClick={handleInstallClick}
        >
          <Download size={14} />
          Install
        </Button>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1.5 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
