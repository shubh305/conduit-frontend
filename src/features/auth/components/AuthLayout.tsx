"use client";

import { useState, useEffect } from "react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  cyberSideContent?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, cyberSideContent }: AuthLayoutProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy } = useThemeHelpers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const themeFontClass = mounted ? (config.fontFamily === "serif" ? "font-serif italic" : "font-sans") : "font-sans"; // Default to sans for SSR stability

  // 1. Two-Column Layout (Cyber & Professional)
  if (isCyberCopy || config.id === "professional") {
    return (
      <main className="min-h-screen grid lg:grid-cols-2 bg-noir-bg text-foreground transition-all duration-500">
        {/* Side Panel */}
        <div
          className={cn(
            "hidden lg:flex flex-col justify-between p-16 border-r transition-all overflow-hidden relative",
            "bg-noir-panel border-noir-border shadow-2xl",
          )}
        >
          {/* Decorative Background */}
          {isCyberCopy && (
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          )}

          <div className="relative z-10 transition-transform hover:scale-105 origin-left">
            <Link
              href="/"
              className={cn(
                "text-3xl font-black uppercase tracking-tighter hover:text-accent transition-colors",
                isCyberCopy ? "font-display italic" : "font-sans",
              )}
            >
              Conduit.
            </Link>
          </div>

          <div className="font-mono text-[10px] text-foreground-subtle uppercase tracking-[0.4em] relative z-10 animate-pulse">
            {cyberSideContent || (
              <>
                {isCyberCopy ? "// SYSTEM ACCESS" : "// PROFESSIONAL_ENTRY"}
                <br />
                {isCyberCopy ? "// SECURE CONNECTION ESTABLISHED" : "// SESSION_VALIDATED"}
              </>
            )}
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex flex-col items-center justify-center p-8 bg-noir-bg relative">
          <div className="w-full max-w-sm mb-16 lg:hidden">
            <Link
              href="/"
              className="text-2xl font-black uppercase tracking-tighter hover:text-accent transition-colors"
            >
              Conduit.
            </Link>
          </div>

          <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1
              className={cn(
                "text-4xl font-black mb-3 text-foreground transition-colors",
                isCyberCopy ? "font-display uppercase tracking-tighter" : "font-sans",
              )}
            >
              {title}
            </h1>
            <p className="font-mono text-[10px] text-foreground-subtle mb-10 uppercase tracking-[0.2em]">{subtitle}</p>
            <div className="bg-transparent">{children}</div>
          </div>
        </div>
      </main>
    );
  }

  // 2. Centered Layout (Sakura, Classic Noir, Classic White)
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-noir-bg text-foreground p-6 transition-all duration-700">
      {/* Background Accent for Sakura */}
      {isSakuraCopy && (
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />
      )}

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-16 animate-in zoom-in duration-1000">
          <Link
            href="/"
            className={cn(
              "text-5xl font-black tracking-tighter text-foreground hover:text-accent transition-all hover:scale-110 block",
              themeFontClass,
            )}
          >
            Conduit
          </Link>
        </div>

        <div
          className={cn(
            "p-10 border transition-all shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700",
            "bg-noir-panel border-noir-border",
            isSakuraCopy ? "rounded-3xl hover:shadow-accent/5" : "rounded-none",
          )}
        >
          <div className="text-center mb-10">
            <h1 className={cn("text-3xl font-black mb-4 transition-colors", themeFontClass)}>{title}</h1>
            <p className="text-foreground-subtle text-sm font-sans italic opacity-70 leading-relaxed">{subtitle}</p>
          </div>

          <div className="relative">{children}</div>
        </div>
      </div>
    </main>
  );
}
