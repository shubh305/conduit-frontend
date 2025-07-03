"use client";

import { FeedItem } from "../types";
import { getMediaUrl, getPostUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface RoninHeroProps {
  item: FeedItem;
}

export function RoninHero({ item }: RoninHeroProps) {
  const postUrl = getPostUrl(item);
  
  return (
    <div className="relative w-full overflow-hidden bg-black group/hero min-h-[350px] md:min-h-[400px] flex items-center justify-center ronin-brush-edge shadow-2xl border-y border-white/5">
      {/* Cinematic Background with Snippet Styles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Darkening Overlays for Readability */}
        <div className="absolute inset-0 z-10 bg-black/60 pointer-events-none transition-opacity group-hover/hero:opacity-40 duration-700" />
        <div className="absolute inset-0 mix-blend-overlay z-15 bg-red-900/40 pointer-events-none" />
        
        {item.featuredImage ? (
          <Image
            src={getMediaUrl(item.featuredImage) || ""}
            alt={item.title}
            fill
            className="object-cover grayscale contrast-125 brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-[0.6] transition-all duration-[4000ms] ease-out-expo scale-105 group-hover:scale-100"
            priority
          />
        ) : (
           <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
              <span className="text-[#ff4655]/10 font-cinzel font-black text-6xl tracking-[0.3em] uppercase select-none">VANGUARD</span>
           </div>
        )}
        
        {/* Inner shadow for paper feel */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,1)] z-30 pointer-events-none"></div>
      </div>

      {/* Content Overlay - Centered Typography with Shadow for Readability */}
      <div className="relative z-40 w-full max-w-4xl px-6 py-10 flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-4">
           {/* Primary Category / System Label */}
           <span className="text-[10px] font-noto font-bold text-white/40 uppercase tracking-[0.5em] mb-2 animate-in fade-in duration-1000">
              PRIORITY_TRANSMISSION_{new Date(item.publishedAt).getFullYear()}
           </span>

           <Link href={postUrl} className="group/title relative overflow-hidden pb-1 mb-2">
             <h1 className="ronin-cinematic-title text-3xl md:text-5xl lg:text-6xl transition-all duration-700 drop-shadow-[0_2px_15px_rgba(0,0,0,1)] group-hover/title:scale-[1.01] group-hover/title:text-white">
               {item.title}
             </h1>
             <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff4655] transform -translate-x-full group-hover/title:translate-x-0 transition-transform duration-700 ease-out-expo" />
           </Link>

           <p className="font-noto text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
             {item.excerpt}
           </p>
           
           <div className="mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <Link 
                href={postUrl}
                className="group/btn relative inline-flex items-center gap-5 text-white/40 hover:text-white transition-all duration-300 uppercase font-noto font-bold text-[10px] tracking-[0.3em]"
              >
                <div className="h-[1px] w-10 bg-[#ff4655] transition-all group-hover/btn:w-14" />
                READ ENTRY
                <div className="h-[1px] w-10 bg-[#ff4655] transition-all group-hover/btn:w-14" />
              </Link>
           </div>
        </div>
      </div>
      
      {/* Decorative cinematic effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] z-30 pointer-events-none"></div>
    </div>
  );
}
