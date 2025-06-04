"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0A0A0A] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:font-mono group-[.toaster]:rounded-none",
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-signal-green group-[.toast]:text-black",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-gray-400",
          success: "group-[.toast]:text-signal-green",
          error: "group-[.toast]:text-red-500",
        },
      }}
      {...props}
    />
  );
}
