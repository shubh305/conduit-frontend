"use client";

import React from "react";
import { FeedItem } from "../types";
import Link from "next/link";
import Image from "next/image";
import { cn, getMediaUrl } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";

export function CyberFeedHeader({ featured, blogDescription, blogTitle }: { featured?: FeedItem; blogDescription?: string; blogTitle?: string }) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isDarkMode } = useThemeHelpers();
  const displayTitle = blogTitle || featured?.tenantName || "Conduit";

  return (
    <div
      className={cn(
        "border-b border-noir-border min-h-[400px] flex flex-col md:flex-row bg-noir-bg overflow-hidden transition-colors relative",
        isSakuraCopy && "bg-gradient-to-br from-noir-bg to-accent/5",
        isRoninCopy &&
          "ronin-watermark ronin-katana ronin-bamboo ronin-moon bg-gradient-to-br from-noir-bg to-accent/3",
        isOctaneCopy && "octane-watermark bg-gradient-to-br from-noir-bg via-noir-bg to-accent/5",
        isJournalCopy && "bg-gradient-to-br from-noir-bg to-accent/5 journal-page-curl",
      )}
    >
      {!isCyberCopy && (
        <div
          className={cn(
            "w-full md:w-64 border-b md:border-b-0 md:border-r border-noir-border p-8 flex flex-col gap-6 relative z-10",
            isCyberCopy ? "bg-noir-bg" : "bg-transparent",
            isJournalCopy && "md:w-80 border-r-4 border-double border-accent/20 bg-[var(--journal-paper)]",
          )}
        >
          <div
            className={cn(
              "w-12 h-12 border flex items-center justify-center transition-all",
              isCyberCopy
                ? "border-accent/40 text-accent font-mono"
                : "border-noir-border text-foreground font-serif bg-noir-panel",
              !isCyberCopy && "rounded-lg shadow-sm",
              isJournalCopy &&
                "border-2 border-accent/40 bg-accent/5 text-accent font-black text-3xl shadow-sm rounded-lg",
            )}
          >
            <span className={cn("text-2xl font-bold italic", isJournalCopy && "not-italic")}>
              {displayTitle.charAt(0).toUpperCase()}
            </span>
          </div>

          <h1
            className={cn(
              "text-4xl font-bold text-foreground leading-none break-words tracking-tighter",
              isCyberCopy ? "font-mono uppercase" : config.fontFamily === "serif" ? "font-serif italic" : "font-sans",
              isJournalCopy && "font-serif font-black text-5xl leading-[0.9] tracking-tight text-journal-ink",
            )}
          >
            {displayTitle}
          </h1>

          {blogDescription && (
            <div className="mt-auto">
              <div
                className={cn(
                  "text-[10px] mb-2 uppercase tracking-widest",
                  isCyberCopy
                    ? "font-mono text-accent/50"
                    : isRoninCopy
                      ? "font-serif text-accent/70"
                      : isOctaneCopy
                        ? "font-sans text-accent/60"
                        : "font-sans text-foreground-subtle",
                  isJournalCopy &&
                    "font-serif text-journal-accent font-bold border-b border-journal-accent/20 pb-1 mb-3",
                )}
              >
                {isSakuraCopy
                  ? "ネットワーク状態"
                  : isRoninCopy
                    ? "道の状態 (Path Status)"
                    : isOctaneCopy
                      ? "STATUS"
                      : isJournalCopy
                        ? "The Edition"
                        : "NETWORK_STATUS"}
              </div>
              {!isJournalCopy && <div className="h-[1px] w-full bg-noir-border mb-2" />}
              <div
                className={cn(
                  "text-xs leading-relaxed",
                  isCyberCopy ? "text-foreground-subtle/80 font-mono" : "text-foreground-muted",
                  isJournalCopy && "text-journal-ink-muted font-serif italic text-sm",
                )}
              >
                {isCyberCopy ? "// " : ""}
                {blogDescription}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center Hero Component */}
      {featured ? (
        <Link
          href={
            featured.tenantSlug === "default" && featured.authorUsername
              ? `/u/${featured.authorUsername}/${featured.postSlug}`
              : `/${featured.tenantSlug}/${featured.postSlug}`
          }
          className="flex-1 p-8 md:p-16 flex items-end relative overflow-hidden group hover:cursor-pointer transition-all"
        >
          <div className="absolute inset-0 z-0">
            <div
              className={cn(
                "absolute top-10 right-10 w-96 h-96 blur-[100px] rounded-full transition-opacity opacity-20",
                isCyberCopy ? "bg-accent" : "bg-accent/40",
              )}
            />

            {featured.featuredImage && (
              <div className="absolute inset-0 z-0 transition-opacity duration-700">
                <Image
                  src={getMediaUrl(featured.featuredImage) || ""}
                  alt=""
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    isDarkMode
                      ? "grayscale group-hover:grayscale-0 opacity-20 group-hover:opacity-40"
                      : "opacity-10 group-hover:opacity-20",
                    isJournalCopy &&
                      "grayscale-0 opacity-100 group-hover:scale-105 group-hover:opacity-100 mix-blend-multiply sepia-[.3]",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    isDarkMode ? "bg-black/60 backdrop-blur-sm group-hover:backdrop-blur-none" : "bg-white/40",
                    isJournalCopy && "bg-journal-parchment/90 mix-blend-normal",
                  )}
                />
              </div>
            )}

            {/* Journal Specific Texture Overlay */}
            {isJournalCopy && (
              <div className="absolute inset-0 opacity-[0.2] mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
            )}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl">
            <div
              className={cn(
                "text-[10px] mb-4 w-fit px-2 py-0.5 uppercase tracking-widest transition-all",
                isCyberCopy
                  ? "font-mono text-accent border border-accent/40 bg-accent/5"
                  : "font-sans text-accent bg-accent/10 rounded-full",
                isJournalCopy &&
                  "bg-accent/10 border border-accent/20 text-journal-accent px-3 py-1 rounded-sm font-serif font-bold tracking-[0.2em] mb-2 shadow-sm",
              )}
            >
              {new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              {isSakuraCopy
                ? " 公開中"
                : isRoninCopy
                  ? " • 最新 (Latest)"
                  : isOctaneCopy
                    ? " • LATEST"
                    : isJournalCopy
                      ? ""
                      : " BROADCAST ACTIVE"}
              {isJournalCopy && <span className="mx-2 opacity-50">•</span>}
              {isJournalCopy && "FEATURED ARTICLE"}
            </div>

            <h2
              className={cn(
                "text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight group-hover:text-accent transition-colors",
                isCyberCopy
                  ? "font-display uppercase tracking-tighter"
                  : config.fontFamily === "serif"
                    ? "font-serif italic"
                    : "font-sans",
                isJournalCopy && "font-serif text-journal-ink italic group-hover:text-journal-accent drop-shadow-sm",
              )}
            >
              {featured.title}
            </h2>

            <div
              className={cn(
                "flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest",
                isCyberCopy ? "font-mono text-foreground-subtle" : "font-sans text-foreground-muted",
                isJournalCopy && "font-serif text-[#8B4513]/80",
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 transition-colors",
                  isCyberCopy
                    ? "bg-foreground-subtle group-hover:bg-accent"
                    : isRoninCopy
                      ? "bg-accent"
                      : "bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]",
                  isJournalCopy && "bg-journal-accent rounded-full w-1 h-1",
                )}
              />
              {isSakuraCopy ? "著者：" : isRoninCopy ? "作者 (Author): " : isJournalCopy ? "Written by " : "BY "}
              {featured.authorName}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1 p-8 md:p-16 flex items-end relative overflow-hidden bg-noir-hover/50">
          <div className="relative z-10 max-w-4xl">
            <h2
              className={cn(
                "text-4xl md:text-5xl font-black text-foreground-subtle/30 uppercase tracking-tighter",
                isCyberCopy ? "font-mono" : "font-sans",
              )}
            >
              {isSakuraCopy
                ? "信号なし"
                : isRoninCopy
                  ? "静寂 (Silence)"
                  : isOctaneCopy
                    ? "NO CONTENT YET"
                    : isJournalCopy
                      ? "No Entries Yet"
                      : "NO TRANSMISSION ACTIVE"}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
