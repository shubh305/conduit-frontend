"use client";

import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDeleting: boolean;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title, description, isDeleting }: DeleteDialogProps) {
  const { isCyberCopy, isOctaneCopy, isTerminalCopy, isJournalCopy } = useThemeHelpers()

  if (!isOpen) return null;

  // --- TERMINAL MODE ---
  if (isTerminalCopy) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
        <div className="w-full max-w-lg border border-red-600 bg-black shadow-[0_0_30px_rgba(220,38,38,0.2)] font-mono text-sm text-red-500 p-2">
          <div className="bg-red-600 text-black font-bold px-2 py-1 mb-4 flex justify-between">
            <span>CRITICAL SYSTEM ALERT</span>
            <span>[EUID: 0]</span>
          </div>

          <div className="px-4 pb-4 space-y-4">
            <div className="border border-red-900/50 p-4 bg-red-900/10">
              <p className="font-bold">WARNING: IRREVERSIBLE DATA DESTRUCTION</p>
              <p className="opacity-70 mt-2">{description}</p>
              <div className="mt-4 pt-4 border-t border-red-900/50">
                <p>
                  TARGET: <span className="text-white bg-red-900 px-1">{title}</span>
                </p>
              </div>
            </div>

            <p className="animate-pulse">Are you sure you want to execute `rm -rf`? [y/N]</p>

            <div className="flex gap-4 pt-4 justify-end">
              <button onClick={onClose} disabled={isDeleting} className="px-6 py-2 border border-red-800 hover:bg-red-900/20 transition-colors uppercase">
                [N] ABORT
              </button>
              <button onClick={onConfirm} disabled={isDeleting} className="px-6 py-2 bg-red-600 text-black font-bold hover:bg-red-500 transition-colors uppercase">
                {isDeleting ? "DELETING..." : "[Y] EXECUTE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm p-8 flex flex-col items-center text-center shadow-2xl transition-all duration-300",
          isCyberCopy
            ? "bg-[#050505] border border-signal-green/30 rounded-none shadow-[0_0_30px_rgba(51,255,51,0.05)]"
            : isOctaneCopy
              ? "bg-[#0a0a0a] border border-accent/40 rounded-sm shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
              : isJournalCopy
                ? "bg-[#fdfcf8] border border-accent/20 rounded-2xl shadow-xl"
                : "bg-noir-panel border border-noir-border rounded-3xl",
        )}
      >
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "p-4 flex items-center justify-center",
              isCyberCopy || isOctaneCopy
                ? "bg-red-500/10 border border-red-500/20 text-red-500 rounded-none w-16 h-16"
                : "bg-red-500/10 text-red-500 rounded-full w-14 h-14",
              isJournalCopy && "bg-accent/5 text-accent border border-accent/10",
            )}
          >
            <Trash2 size={isCyberCopy || isOctaneCopy ? 32 : 28} />
          </div>
        </div>

        <h3
          className={cn(
            "text-xl font-bold mb-3",
            isCyberCopy || isOctaneCopy
              ? "font-mono uppercase text-red-500 tracking-[0.15em]"
              : isJournalCopy
                ? "font-serif italic text-[#3e2723]"
                : "text-foreground",
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-sm mb-8 leading-relaxed max-w-xs",
            isCyberCopy || isOctaneCopy
              ? "font-mono text-gray-500 uppercase tracking-tight text-xs"
              : isJournalCopy
                ? "font-serif italic text-accent/70"
                : "text-foreground-subtle",
          )}
        >
          {description}
        </p>

        <div className="flex gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className={cn(
              "flex-1",
              isCyberCopy || isOctaneCopy
                ? "font-mono uppercase rounded-none hover:bg-white/10 text-xs tracking-wider h-12"
                : isJournalCopy
                  ? "font-serif italic text-accent hover:bg-accent/5 rounded-xl border border-accent/10"
                  : "rounded-full",
            )}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={onConfirm}
            disabled={isDeleting}
            className={cn(
              "flex-1",
              isCyberCopy
                ? "bg-red-600 hover:bg-red-700 text-white font-mono uppercase mounted-none shadow-[0_0_15px_rgba(220,38,38,0.4)] text-xs tracking-widest h-12"
                : isOctaneCopy
                  ? "bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-mono uppercase rounded-none tracking-widest h-12 transition-all duration-300"
                  : isJournalCopy
                    ? "bg-[#3e2723] text-white hover:bg-[#2d1b17] border-none font-serif italic rounded-xl h-12"
                    : "rounded-full",
            )}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
