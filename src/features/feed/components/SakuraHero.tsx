"use client";

import { FeedItem } from "../types";
import { getMediaUrl, getPostUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface SakuraHeroProps {
  item: FeedItem;
}

export function SakuraHero({ item }: SakuraHeroProps) {
  const postUrl = getPostUrl(item);
  
  return (
    <div className="relative w-full overflow-hidden bg-white/60 group/hero min-h-[280px] md:min-h-[340px] flex flex-col-reverse md:flex-row md:items-stretch shadow-lg shadow-accent/5 rounded-[1.5rem] border border-accent/10">
      {/* 1. Left Content Section (Determines height on Desktop) */}
      <div className="relative z-20 w-full md:w-5/12 flex flex-col justify-center px-6 py-6 md:px-8 md:py-8 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex flex-col items-start gap-2">
          {/* Featured Label */}
          <div className="flex items-center gap-2 animate-in fade-in duration-1000">
            <span className="text-[9px] font-sans font-bold text-accent uppercase tracking-[0.2em]">Featured</span>
            <div className="h-[1px] w-6 bg-accent/30" />
          </div>

          <Link href={postUrl} className="group/title block">
            <h1 className="font-serif text-2xl md:text-3xl text-foreground transition-colors duration-500 leading-tight group-hover/title:text-accent line-clamp-2">
              {item.title}
            </h1>
          </Link>

          <p className="font-sans text-foreground-muted text-xs leading-relaxed line-clamp-3 font-light animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200 mb-2">
            {item.excerpt}
          </p>

          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Link
              href={postUrl}
              className="group/btn relative inline-flex items-center gap-2 text-accent font-medium text-[10px] tracking-widest uppercase hover:gap-3 transition-all duration-300"
            >
              <span>Read</span>
              <div className="h-[1px] w-4 bg-accent group-hover/btn:w-8 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Right Image Section (Cover - Absolute on Desktop to fill height) */}
      <div className="relative w-full h-[180px] md:absolute md:top-0 md:right-0 md:bottom-0 md:w-7/12 md:h-full overflow-hidden bg-noir-bg/20">
        {item.featuredImage ? (
          <Image
            src={getMediaUrl(item.featuredImage) || ""}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out-expo scale-100"
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-noir-bg/20">
            <span className="text-accent/10 font-serif italic text-4xl tracking-widest select-none">Bloom</span>
          </div>
        )}

        {/* Subtle pink tint */}
        <div className="absolute inset-0 bg-accent/5 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border border-white/60 pointer-events-none rounded-[1.5rem] mix-blend-overlay z-30" />
    </div>
  );
}
