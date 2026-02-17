"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/features/theme/ThemeProvider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { config, mounted } = useTheme();

  if (!mounted) return null;
  
  return (
    <Sonner
      theme={config.isDark ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-noir-panel group-[.toaster]:text-foreground group-[.toaster]:border-noir-border group-[.toaster]:shadow-2xl group-[.toaster]:font-mono group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-foreground-muted",
          actionButton: "group-[.toast]:bg-accent group-[.toast]:text-noir-bg",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-foreground-muted",
          success: "group-[.toast]:text-signal-green group-[.toast]:border-signal-green/20",
          error: "group-[.toast]:text-signal-red group-[.toast]:border-signal-red/20",
        },
      }}
      {...props}
    />
  );
}
