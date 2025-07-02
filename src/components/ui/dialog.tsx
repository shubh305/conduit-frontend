"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({ open: false, onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  const { onOpenChange } = React.useContext(DialogContext);
  
  if (React.isValidElement(children)) {
    const originalOnClick = (children.props as { onClick?: React.MouseEventHandler }).onClick;
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        if (typeof originalOnClick === "function") {
          originalOnClick(e);
        }
        onOpenChange(true);
      },
    });
  }

  return <>{children}</>;
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, onOpenChange } = React.useContext(DialogContext);
  const { isCyberCopy } = useThemeHelpers();

  if (typeof document === "undefined" || !open) return null;

  const content = (
    <>
      <div 
        className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
      />
      <div 
        onClick={(e) => e.stopPropagation()}
        className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[20000] w-full max-w-lg sm:max-w-[700px]",
        "bg-noir-panel border-2 border-accent shadow-2xl overflow-hidden min-h-[400px]",
        isCyberCopy ? "rounded-none" : "rounded-3xl",
        className
      )}>
        {children}
      </div>
    </>
  );

  return createPortal(content, document.body);
}


export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b border-noir-border">{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={cn("text-xl font-bold uppercase tracking-tight", className)}>{children}</h2>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t border-noir-border", className)}>
      {children}
    </div>
  );
}
