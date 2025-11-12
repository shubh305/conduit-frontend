"use client";

import { FeedItem } from "../types";
import { getMediaUrl, getPostUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface TechieHeroProps {
  item: FeedItem;
}

export function TechieHero({ item }: TechieHeroProps) {
  const postUrl = getPostUrl(item);
  
  return (
    <div className="relative w-full shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden bg-black group/hero">
      <div className="flex flex-col md:flex-row min-h-[300px]">
        {/* Left Content Area */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center relative z-20">
          <div className="absolute inset-0 bg-noir-panel/60 backdrop-blur-sm z-[-1]" />
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-mono text-accent uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-0.5">
              {item.tenantName || "CORE_SYS"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-black text-white leading-[0.9] tracking-tighter uppercase mb-4 group-hover/hero:text-accent/80 transition-colors duration-500">
            {item.title}
          </h1>

          <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4">
            <p className="text-sm text-foreground/50 max-w-lg font-sans leading-relaxed line-clamp-2">
              {item.excerpt}
            </p>
            
            <Link 
              href={postUrl}
              className="inline-flex"
            >
              <span className="px-4 py-2 bg-accent text-noir-bg font-sans font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-colors duration-300">
                READ_SPEC
              </span>
            </Link>
          </div>
        </div>

        {/* Right Visual Area */}
        <div className="w-full md:w-[40%] lg:w-[35%] relative overflow-hidden bg-noir-panel/10">
          {item.featuredImage ? (
            <Image
              src={getMediaUrl(item.featuredImage) || ""}
              alt={item.title}
              fill
              className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
              priority
            />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center border-l border-white/5">
                <span className="text-accent font-mono text-2xl font-bold opacity-5 uppercase select-none -rotate-12 tracking-tighter">NULL_VID</span>
             </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--accent-rgb),0.05)_1px,transparent_1px),linear-gradient(rgba(var(--accent-rgb),0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
