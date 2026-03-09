"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { BasePostCard } from "../components/base/BasePostCard";
import { PostActions } from "../components/base/PostCardParts";
import { LayoutProps } from "./types";
import { cn, getPostUrl } from "@/lib/utils";
import Image from "next/image";

export function MagazineLayout({ posts, tenantSlug, currentTenantSlug, themeConfig }: LayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);

  const chunkSize = 6;
  const pages = [];
  for (let i = 0; i < posts.length; i += chunkSize) {
    pages.push(posts.slice(i, i + chunkSize));
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollLeftMobile = () => {
    if (mobileScrollContainerRef.current) {
      const childWidth =
        (mobileScrollContainerRef.current.children[0] as HTMLElement)?.offsetWidth || window.innerWidth * 0.85;
      mobileScrollContainerRef.current.scrollBy({ left: -(childWidth + 16), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRightMobile = () => {
    if (mobileScrollContainerRef.current) {
      const childWidth =
        (mobileScrollContainerRef.current.children[0] as HTMLElement)?.offsetWidth || window.innerWidth * 0.85;
      mobileScrollContainerRef.current.scrollBy({ left: childWidth + 16, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const mobileContainer = mobileScrollContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const index = Math.round(container.scrollLeft / container.clientWidth);
        setActiveIndex(index);
      }
    };

    const handleMobileScroll = () => {
      if (mobileContainer) {
        const children = mobileContainer.children;
        let index = mobileActiveIndex;
        let minDiff = Infinity;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const diff = Math.abs(child.offsetLeft - mobileContainer.scrollLeft - mobileContainer.offsetLeft);
          if (diff < minDiff) {
            minDiff = diff;
            index = i;
          }
        }
        setMobileActiveIndex(index);
      }
    };

    if (container) container.addEventListener("scroll", handleScroll);
    if (mobileContainer) mobileContainer.addEventListener("scroll", handleMobileScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollLeft();
        scrollLeftMobile();
      }
      if (e.key === "ArrowRight") {
        scrollRight();
        scrollRightMobile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      if (mobileContainer) mobileContainer.removeEventListener("scroll", handleMobileScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileActiveIndex]);

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

  if (posts.length === 0) return null;

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-0 h-full">
      {/* Mobile View */}
      <div className="md:hidden flex-1 flex flex-col min-h-0 h-full relative w-full group/mobile">
        {posts.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-between px-2 w-full h-0">
            <button
              onClick={scrollLeftMobile}
              className="pointer-events-auto cursor-pointer p-2 rounded-full bg-background/90 hover:bg-background text-foreground shadow-2xl backdrop-blur-md border border-border/50 transition-all active:scale-95 group/btn"
              aria-label="Previous page"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={scrollRightMobile}
              className="pointer-events-auto cursor-pointer p-2 rounded-full bg-background/90 hover:bg-background text-foreground shadow-2xl backdrop-blur-md border border-border/50 transition-all active:scale-95 group/btn"
              aria-label="Next page"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
        <div
          ref={mobileScrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full h-full flex-1 min-h-0"
        >
          {posts.slice(0, 10).map(post => (
            <Link
              key={post.id}
              href={getPostUrl({ ...post, postSlug: post.slug, tenantSlug }, currentTenantSlug)}
              className="group flex-shrink-0 w-[85vw] snap-center relative h-full flex flex-col pt-2"
            >
              <div className="relative w-full h-full flex-1 overflow-hidden rounded-2xl bg-black shadow-xl border border-border/10">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 50vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 group-hover:opacity-60"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] opacity-20" />
                )}
                <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="text-xs px-2 py-1 bg-white/20 border border-white/10 backdrop-blur-sm rounded-full text-white/90"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 line-clamp-4 md:line-clamp-1 leading-tight flat-card-title">
                    {post.title}
                  </h3>
                  <p className="text-sm flat-card-excerpt line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs !text-white/70">
                    <span>{post.authorName}</span>
                    <span>•</span>
                    <span>{post.readingTimeMinutes} min</span>
                  </div>
                  <PostActions
                    data={{ ...post, postId: post.id }}
                    isFlat={true}
                    compact={true}
                    className="pt-3 border-t border-white/10 px-0 mt-3"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-2 py-2 shrink-0">
          {posts.slice(0, Math.min(10, posts.length)).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const childWidth =
                  (mobileScrollContainerRef.current?.children[0] as HTMLElement)?.offsetWidth ||
                  window.innerWidth * 0.85;
                mobileScrollContainerRef.current?.scrollTo({ left: i * (childWidth + 16), behavior: "smooth" });
              }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all cursor-pointer",
                i === mobileActiveIndex ? "bg-foreground scale-125" : "bg-foreground/20 hover:bg-foreground/40",
              )}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop*/}
      <div className="hidden md:flex flex-col flex-1 min-h-0 relative h-full">
        <div className="w-full flex-1 flex flex-col min-h-0 relative h-full">
          {/* Navigation Arrows */}
          {pages.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-between px-4 w-full h-0">
              <button
                onClick={scrollLeft}
                className="pointer-events-auto cursor-pointer p-2.5 rounded-full bg-background/90 hover:bg-background text-foreground shadow-2xl backdrop-blur-md border border-border/50 transition-all hover:scale-110 active:scale-95 group/btn"
                aria-label="Previous page"
              >
                <svg
                  className="w-5 h-5 transform group-hover/btn:-translate-x-1 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={scrollRight}
                className="pointer-events-auto cursor-pointer p-2.5 rounded-full bg-background/90 hover:bg-background text-foreground shadow-2xl backdrop-blur-md border border-border/50 transition-all hover:scale-110 active:scale-95 group/btn"
                aria-label="Next page"
              >
                <svg
                  className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory flex-1 w-full h-full min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2"
          >
            {pages.map((pagePosts, pageIndex) => (
              <div
                key={pageIndex}
                className="relative w-full h-full shrink-0 snap-center py-2 md:py-3 px-6 md:px-16 flex flex-col min-h-0"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(0,1fr))] gap-5 md:gap-6 w-full h-full min-h-0">
                  {pagePosts.map((post, i) => (
                    <div
                      key={post.id}
                      className={cn(
                        "relative overflow-hidden transition-all duration-300 min-h-0 min-w-0 w-full h-full",
                        getGridClasses(i),
                      )}
                    >
                      <BasePostCard
                        post={post}
                        tenantSlug={tenantSlug}
                        currentTenantSlug={currentTenantSlug}
                        orientation="vertical"
                        className="h-full w-full min-h-0"
                        imageClassName="absolute inset-0 w-full h-full"
                        themeConfig={{
                          ...magazineConfig,
                          showExcerpt: [0, 1, 3].includes(i),
                          showBio: false,
                          showreadTime: [0, 1, 3].includes(i),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation bullets */}
        {pages.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2 py-1 z-50">
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
                  "w-1 h-1 rounded-full transition-all border border-foreground/10 cursor-pointer shadow-sm",
                  i === activeIndex ? "bg-foreground scale-125" : "bg-foreground/10 hover:bg-foreground/30",
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
