"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { ThemeVariant } from "@/lib/theme-variants";
import { getDialogContentClasses } from "@/lib/theme/variants/layout-variants";

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
  const { theme } = useTheme();
  const { isSakuraCopy, isJournalCopy, isMinimalCopy, isProfessionalCopy } = useThemeHelpers();

  if (typeof document === "undefined" || !open) return null;

  const content = (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[10000] transition-all duration-300 animate-in fade-in",
          isSakuraCopy
            ? "bg-white/40 backdrop-blur-md"
            : isJournalCopy
              ? "bg-noir-bg/80 backdrop-blur-sm"
              : isMinimalCopy || isProfessionalCopy
                ? "bg-black/60 backdrop-blur-[2px]"
                : "bg-black/80 backdrop-blur-sm",
        )}
        onClick={e => {
          e.stopPropagation();
          onOpenChange(false);
        }}
      />
      <div
        onClick={e => e.stopPropagation()}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[20000] w-[calc(100%-32px)] sm:w-full h-auto sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] sm:min-h-[400px]",
          getDialogContentClasses(theme as ThemeVariant),
          className,
        )}
      >
        {children}
      </div>
    </>
  );

  return createPortal(content, document.body);
}


export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-4 md:px-6 py-2 md:py-4 border-b border-foreground/10">{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={cn("text-xl font-bold uppercase tracking-tight", className)}>{children}</h2>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t border-foreground/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
