"use client";

import { FeedItem } from "../types";
import { getMediaUrl, getPostUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface JournalHeroProps {
  item: FeedItem;
}

export function JournalHero({ item }: JournalHeroProps) {
  const postUrl = getPostUrl(item);
  
  return (
    <div className="relative w-full shadow-2xl overflow-hidden bg-noir-panel group/hero border-double border-[6px] border-noir-border/40 journal-page-curl">
      <div className="flex flex-col md:flex-row min-h-[350px]">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply z-10" />

        {/* Left Visual Area (standard editorial style - large image) */}
        <div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden h-[300px] md:h-auto border-r border-noir-border/20">
          {item.featuredImage ? (
            <Image
              src={getMediaUrl(item.featuredImage) || ""}
              alt={item.title}
              fill
              className="object-cover sepia-[0.2] contrast-[1.1] grayscale-[20%] group-hover:sepia-0 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-noir-hover/30">
              <span className="text-accent/20 font-serif italic text-3xl font-light tracking-widest uppercase -rotate-12">
                The Archive
              </span>
            </div>
          )}

          {/* Subtle shadows for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent z-10" />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center relative z-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-serif italic text-accent/50 tracking-[0.2em] uppercase border-b border-accent/10 pb-0.5">
              {new Date(item.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <Link href={postUrl} className="group/title">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-foreground leading-tight transition-colors group-hover/title:text-accent mb-4">
              {item.title}
            </h1>
          </Link>

          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-journal-ink-muted font-serif italic leading-relaxed line-clamp-3">
              {item.excerpt}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-noir-border" />
                <span className="text-sm font-serif font-bold text-foreground italic">{item.authorName}</span>
              </div>

              <Link href={postUrl} className="inline-flex">
                <span className="px-8 py-3 bg-foreground text-[#FDF5E6] font-serif italic text-sm rounded shadow-lg hover:bg-accent transition-colors duration-300">
                  Read Article
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
