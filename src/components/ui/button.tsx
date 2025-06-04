import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center",
          "border border-noir-border rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400",
          {
            "bg-white text-black hover:bg-gray-200": variant === "primary",
            "bg-noir-panel text-white hover:bg-noir-hover": variant === "secondary",
            "bg-transparent text-white hover:bg-noir-hover": variant === "ghost",
            "bg-transparent text-black border-gray-400 hover:bg-gray-100": variant === "outline",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
