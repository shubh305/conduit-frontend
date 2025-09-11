"use client";

import { useRef, useState, useEffect } from "react";
import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";
import { cn } from "@/lib/utils";

export function MagazineLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {
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
        className="flex overflow-x-auto snap-x snap-mandatory h-[calc(100vh-240px)] max-h-[1000px] min-h-[600px] w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {pages.map((pagePosts, pageIndex) => (
          <div key={pageIndex} className="w-full shrink-0 snap-center p-1 h-full">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[1fr_1fr_1.3fr] gap-3 h-full w-full">
              {pagePosts.map((post, i) => (
                <div key={post.id} className={cn("relative overflow-hidden", getGridClasses(i))}>
                  <BasePostCard
                    post={post}
                    tenantSlug={tenantSlug}
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
  );
}
