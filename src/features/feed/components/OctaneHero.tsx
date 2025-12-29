"use client";

import { FeedItem } from "../types";
import { getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function OctaneHero({ item }: { item: FeedItem }) {
  const postUrl = getPostUrl(item);
  
  return (
    <div className="relative group/hero w-full h-[600px] bg-noir-bg overflow-hidden border-2 border-noir-border hover:border-accent transition-colors duration-500">
      {/* 1. Full Bleed Image */}
      <div className="absolute inset-0 z-0">
        {item.featuredImage ? (
          <Image
            src={getMediaUrl(item.featuredImage) || ""}
            alt={item.title}
            fill
            className="object-cover scale-105 group-hover/hero:scale-110 transition-transform duration-[2000ms] ease-out-quint brightness-[0.4] group-hover/hero:brightness-[0.6]"
          />
        ) : (
          <div className="w-full h-full bg-noir-panel flex items-center justify-center">
            <span className="text-noir-border font-black italic text-9xl uppercase tracking-tighter skew-x-[-15deg] opacity-20">
              NO_SIGNAL
            </span>
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-bg via-noir-bg/60 to-transparent opacity-90" />
      </div>

      {/* 2. HUD Elements (Lines & Measurements) */}
      <div className="absolute inset-x-8 top-8 h-[2px] bg-noir-border flex justify-between">
        <div className="w-12 h-1 bg-accent" />
        <div className="w-1/2 h-[1px] bg-white/5" />
        <div className="w-12 h-1 bg-noir-border" />
      </div>
      <div className="absolute bottom-8 right-8 text-accent font-mono text-xs tracking-widest animate-pulse">
        {"// SYSTEM_READY"}
      </div>

      {/* 3. Content Block (Bottom Left) */}
      <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 z-10 flex flex-col gap-6">
        {/* Metadata Pill */}
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-accent text-white font-black uppercase text-xs skew-x-[-10deg]">
            FEATURED_LAP
          </span>
          <span className="text-foreground-muted font-mono text-xs uppercase tracking-[0.2em]">
            {new Date(item.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Hero Title */}
        <Link href={postUrl}>
          <h1 className="text-5xl md:text-8xl font-black italic text-white uppercase leading-[0.85] tracking-tighter drop-shadow-lg group-hover/hero:text-accent transition-colors duration-300">
            {item.title}
          </h1>
        </Link>

        {/* Excerpt */}
        <p className="text-foreground-muted font-mono text-sm md:text-base leading-relaxed max-w-xl border-l-2 border-accent pl-4">
          {item.excerpt}
        </p>

        {/* Read Button */}
        <Link href={postUrl} className="mt-4 flex items-center gap-4 group/btn w-fit">
          <div className="px-8 py-3 bg-accent text-white font-black uppercase tracking-widest skew-x-[-10deg] hover:bg-white hover:text-black transition-colors duration-300">
            <span className="skew-x-[10deg] block">INITIATE_READ</span>
          </div>
          <div className="h-[1px] w-24 bg-noir-border group-hover/btn:w-32 group-hover/btn:bg-accent transition-all duration-300" />
        </Link>
      </div>

      {/* 4. Decorative Speed Lines (Right Side) */}
      <div className="absolute top-1/2 right-12 md:right-24 -translate-y-1/2 flex flex-col gap-2 opacity-20 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full h-[2px] bg-white skew-x-[-45deg]"
            style={{ width: `${100 + i * 40}px`, opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
