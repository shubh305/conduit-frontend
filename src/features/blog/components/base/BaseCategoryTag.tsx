"use client";

import { cn } from "@/lib/utils";

interface BaseCategoryTagProps {
  tag: string;
  fontFamily?: "sans" | "serif" | "mono";
}

export function BaseCategoryTag({ tag, fontFamily = "sans" }: BaseCategoryTagProps) {
  const fontClass = fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans";

  return (
    <span 
      className={cn(
        "text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium tracking-wide",
        fontClass
      )}
    >
      #{tag}
    </span>
  );
}
