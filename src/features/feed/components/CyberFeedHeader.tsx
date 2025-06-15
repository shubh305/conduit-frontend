"use client";

import React from "react";
import { FeedItem } from "../types";
import Link from "next/link";
import Image from "next/image";

export function CyberFeedHeader({ featured, blogDescription, blogTitle }: { featured?: FeedItem, blogDescription?: string, blogTitle?: string }) {
  const displayTitle = blogTitle || featured?.tenantName || "Conduit";

  return (
    <div className="border-b border-white/10 min-h-[400px] flex flex-col md:flex-row">
       {/* Left Sidebar */}
       <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col gap-6">
           <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold italic">
                {displayTitle.charAt(0).toUpperCase()}
              </span>
           </div>
           <h1 className="text-4xl font-sans font-bold text-white leading-none break-words">
              {displayTitle}
           </h1>
           <div className="mt-auto">
              <div className="text-[10px] font-mono text-gray-500 mb-2">NETWORK_STATUS</div>
              <div className="h-[1px] w-full bg-white/10 mb-2" />
              <div className="text-xs text-gray-400">
                 {blogDescription ? (
                    <>
                        {"// "}{blogDescription}
                    </>
                 ) : (
                    <>
                        {"// The OctaneBrew Publishing Network"}<br />
                        Discover stories from engineering, design, and culture.
                    </>
                 )}
              </div>
           </div>
       </div>

       {/* Center Hero */}
       {featured ? (
        <Link href={`/${featured.tenantSlug}/${featured.postSlug}`} className="flex-1 p-8 md:p-16 flex items-end relative overflow-hidden group hover:cursor-pointer transition-all">
           <div className="absolute inset-0 z-0">
              <div className="absolute top-10 right-10 w-64 h-64 bg-signal-green/5 blur-3xl rounded-full" />
              {featured.featuredImage && (
                 <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">

                 <Image 
                       src={featured.featuredImage} 
                       alt="" 
                       fill
                       className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-500" />
                 </div>
              )}
           </div>
           
           <div className="relative z-10 max-w-4xl">
              <div className="text-[10px] font-mono text-signal-green mb-4 border border-signal-green/30 w-fit px-2 py-0.5 uppercase">
                 {new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ANNOUNCEMENTS
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 leading-tight group-hover:text-signal-green transition-colors">
                 {featured.title}
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase">
                 <span className="w-2 h-2 bg-gray-600 group-hover:bg-signal-green transition-colors" />
                 BY {featured.authorName}
              </div>
           </div>
        </Link>
       ) : (
        <div className="flex-1 p-8 md:p-16 flex items-end relative overflow-hidden bg-white/[0.02]">
            <div className="relative z-10 max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-sans font-bold text-gray-700 mb-6 leading-tight">
                 NO TRANSMISSION ACTIVE
              </h2>
            </div>
        </div>
       )}
    </div>
  );
}
