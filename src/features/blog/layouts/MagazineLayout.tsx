"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";
import { cn, getPostUrl } from "@/lib/utils";
import Image from "next/image";

export function MagazineLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const chunkSize = 6;
  const pages = [];
  for (let i = 0; i < posts.length; i += chunkSize) {
    pages.push(posts.slice(i, i + chunkSize));
  }

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const getGridClasses = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-1 md:row-span-2";
      case 1:
        return "md:col-span-2 md:row-span-2";
      case 2:
        return "md:col-span-1 md:row-span-1";
      case 3:
        return "md:col-span-1 md:row-span-2";

      case 4:
        return "md:col-span-2 md:row-span-1";
      case 5:
        return "md:col-span-1 md:row-span-1";
      default:
        return "col-span-1 row-span-1";
    }
  };

  const magazineConfig = {
    ...themeConfig,
    cardStyle: "flat" as const,
    showBio: false,
    showExcerpt: true,
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {posts.slice(0, 10).map(post => (
            <Link
              key={post.id}
              href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
              className="group flex-shrink-0 w-[85vw] snap-center"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 50vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2 line-clamp-3 leading-tight">{post.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>{post.authorName}</span>
                    <span>•</span>
                    <span>{post.readingTimeMinutes} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {posts.slice(0, Math.min(10, posts.length)).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
          ))}
        </div>
      </div>

      {/* Desktop*/}
      <div className="hidden md:block">
        {/* Navigation Arrows */}
        {pages.length > 1 && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/50 hover:bg-background backdrop-blur-sm border border-border transition-all hidden xl:flex"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-[-1.5rem] top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-background/50 hover:bg-background backdrop-blur-sm border border-border transition-all hidden xl:flex"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory h-[calc(100vh-200px)] md:h-[calc(100vh-240px)] max-h-[1000px] min-h-[500px] md:min-h-[600px] w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 md:px-0"
        >
          {pages.map((pagePosts, pageIndex) => (
            <div key={pageIndex} className="w-full shrink-0 snap-center p-2 md:p-4 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[1fr_1fr_1.3fr] gap-3 md:gap-4 h-full w-full">
                {pagePosts.map((post, i) => (
                  <div key={post.id} className={cn("relative overflow-hidden", getGridClasses(i))}>
                    <BasePostCard
                      post={post}
                      tenantSlug={tenantSlug}
                      currentTenantSlug={currentTenantSlug}
                      orientation="vertical"
                      className="h-full w-full"
                      imageClassName="absolute inset-0 w-full h-full"
                      themeConfig={{
                        ...magazineConfig,

                        showExcerpt: [0, 1, 3, 4].includes(i),
                        showBio: false,

                        showreadTime: [0, 1, 3, 4].includes(i),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {pages.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-2 z-20">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  scrollContainerRef.current?.scrollTo({
                    left: i * (scrollContainerRef.current?.clientWidth || 0),
                    behavior: "smooth",
                  });
                }}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all border border-foreground/20",
                  i === activeIndex ? "bg-foreground scale-125" : "bg-foreground/20 hover:bg-foreground/40",
                )}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
