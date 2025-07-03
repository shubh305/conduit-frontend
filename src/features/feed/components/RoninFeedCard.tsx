"use client";

import { FeedItem } from "../../feed/types";
import { cn, getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";

interface RoninFeedCardProps {
  item: FeedItem;
  variant?: "default" | "compact";
  className?: string;
  onRemove?: () => void;
  index?: number;
}

export function RoninFeedCard({ item, className, variant = "default", onRemove, index = 0 }: RoninFeedCardProps) {
  const postUrl = getPostUrl(item);
  const brushClass = index % 2 === 0 ? "ronin-brush-edge" : "ronin-brush-edge-alt";
  const overlayColor = index % 3 === 0 ? "bg-amber-900/20" : index % 3 === 1 ? "bg-blue-900/20" : "bg-red-900/20";

  if (variant === "compact") {
    return (
      <div className={cn(
        "group relative flex items-center bg-[#0D0D0D] hover:bg-[#151515] transition-all duration-700 overflow-hidden h-24 border-l-2 border-[#ff4655]",
        className
      )}>
        <Link 
          href={postUrl}
          className="flex items-center flex-1 h-full min-w-0"
        >
          {/* Left Visual: Brush Edge Image */}
          <div className={cn("relative w-28 h-full overflow-hidden shrink-0 border-r border-white/5", brushClass)}>
             {item.featuredImage ? (
                <Image
                  src={getMediaUrl(item.featuredImage) || ""}
                  alt={item.title}
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
             ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                   <span className="text-[#ff4655]/10 font-mono text-[8px] uppercase">VOID</span>
                </div>
             )}
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0 p-3 flex flex-col justify-center h-full relative z-20">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[7px] font-mono text-[#ff4655] uppercase tracking-widest font-black">
                   ENTRY
                </span>
             </div>
             <h3 className="text-sm font-noto font-bold text-white uppercase tracking-tight leading-tight group-hover:text-[#ff4655] transition-colors line-clamp-1">
                {item.title}
             </h3>
             <span className="text-[8px] font-noto text-white/30 uppercase tracking-tighter mt-1">
                作者: {item.authorName}
             </span>
          </div>
        </Link>
      </div>
    );
  }


  return (
    <div className={cn("group relative flex flex-col transition-all duration-1000 h-full", className)}>
      {/* 1. Visual Layer */}
      <Link href={postUrl} className="block relative aspect-video w-full overflow-hidden mb-8 group/image">
        <div className={cn("w-full h-full overflow-hidden bg-gray-900 relative", brushClass)}>
          {/* Color Grading Overlay */}
          <div
            className={cn(
              "absolute inset-0 mix-blend-overlay z-10 pointer-events-none transition-opacity duration-700 opacity-60 group-hover:opacity-100",
              overlayColor,
            )}
          />

          {/* Paint Texture Overlay (Simulated with opacity) */}
          <div className="absolute inset-0 bg-white/5 opacity-30 z-20 pointer-events-none mix-blend-soft-light" />

          {item.featuredImage ? (
            <Image
              src={getMediaUrl(item.featuredImage) || ""}
              alt={item.title}
              fill
              className="object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
              <span className="text-[#ff4655]/5 font-cinzel font-black text-xl tracking-tighter uppercase italic">
                SHADOW
              </span>
            </div>
          )}

          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] z-30 pointer-events-none"></div>
        </div>

        {/* Decorative 'Ink' Splatters */}
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black rounded-full blur-[2px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-40"></div>
        <div className="absolute top-1/2 -left-4 w-2 h-6 bg-black blur-[3px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-40"></div>
      </Link>

      {/* 2. Content Section */}
      <div className="flex flex-col items-center text-center px-2">
        <Link href={postUrl} className="group/title relative overflow-hidden pb-1">
          <h3 className="text-sm md:text-base font-noto font-bold text-gray-200 uppercase tracking-[0.2em] leading-tight transition-colors duration-300 group-hover:text-white">
            {item.title}
          </h3>
          {/* Animated Underline */}
          <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ff4655] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out-expo" />
        </Link>

        {/* Action Overlay*/}
        <div className="mt-4 relative z-50 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-auto">
          <PostActions
            data={item}
            onRemove={onRemove}
            interactive={{ likes: true, comments: true, share: true, save: true, more: true }}
            className="border-none bg-transparent pt-0 mt-0 text-white/30 hover:text-white/60"
          />
        </div>
      </div>
    </div>
  );
}
