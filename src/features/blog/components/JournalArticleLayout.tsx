"use client"

import { ArrowLeft, ScrollText, X } from "lucide-react";
import { FeedItem } from "@/features/feed/types"
import { Tenant, TiptapContent } from "@/features/blog/types"
import { useState, useEffect, useRef, useCallback } from "react"
import { CommentSection } from "@/features/feed/components/CommentSection"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { getPost } from "@/features/blog/api"
import { getGlobalFeed } from "@/features/feed/api"
import { mapPostToFeedItem, FeedItemExtended } from "@/features/blog/mappers"
import { JournalSheet } from "./JournalSheet"
import { JournalRecommendationsDrawer } from "./JournalRecommendationsDrawer"
import { FeedActionBar } from "@/features/feed/components/FeedActionBar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useMoreFromAuthor } from "@/features/blog/hooks/useMoreFromAuthor";
import { useBlogNavigation } from "@/features/blog/hooks/useBlogNavigation";

interface JournalArticleLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number }
  tenant: Tenant
  nextPost?: FeedItem
  isPreview?: boolean
}

export function JournalArticleLayout({ post, tenant, nextPost, isPreview: isPreviewProp }: JournalArticleLayoutProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { focusMode } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { navigateToBlogHome } = useBlogNavigation(tenant.slug);
  const isPreview = isPreviewProp || searchParams.get("preview") === "true";
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const [activePost, setActivePost] = useState(post);
  const [nextContent, setNextContent] = useState<FeedItemExtended | null>(null);

  const { hasMore: hasMorePosts } = useMoreFromAuthor(activePost.tenantId || tenant.id, activePost.postId);

  const [isFlipping, setIsFlipping] = useState(false);
  const [flippingPost, setFlippingPost] = useState<
    (FeedItem & { content: TiptapContent; readingTimeMinutes: number }) | null
  >(null);

  const [frozenPost, setFrozenPost] = useState<
    (FeedItem & { content: TiptapContent; readingTimeMinutes: number }) | null
  >(null);

  const [currentScroll, setCurrentScroll] = useState(0);
  const [preservedScroll, setPreservedScroll] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isFlipping) {
      setCurrentScroll(e.currentTarget.scrollTop);
    }
  };

  useEffect(() => {
    setActivePost(post);
  }, [post]);

  const fetchNextData = useCallback(
    async (currentPostSlug: string) => {
      try {
        const { data: globalFeed } = await getGlobalFeed({ limit: 50 });
        const currentIndex = globalFeed.findIndex(p => p.postSlug === currentPostSlug);

        let nextFeedItem: FeedItem | undefined;
        if (currentIndex >= 0 && currentIndex < globalFeed.length - 1) {
          nextFeedItem = globalFeed[currentIndex + 1];
        }

        if (nextFeedItem) {
          const { post: fullPost } = await getPost(nextFeedItem.postSlug, nextFeedItem.tenantId);
          if (fullPost) {
            // @ts-expect-error - Partial tenant is sufficient for display
            const mapped = mapPostToFeedItem(fullPost, {
              id: nextFeedItem.tenantId,
              name: nextFeedItem.tenantName,
              slug: nextFeedItem.tenantSlug,
            });
            setNextContent(mapped);

            router.prefetch(`/${nextFeedItem.tenantSlug}/${nextFeedItem.postSlug}`);
          }
        } else {
          setNextContent(null);
        }
      } catch (e) {
        console.warn("Background fetch failed", e);
      }
    },
    [router],
  );

  // Initial Fetch Setup
  useEffect(() => {
    if (nextPost && !nextContent) {
      fetchNextData(activePost.postSlug);
    }
  }, [activePost, nextPost, fetchNextData, nextContent]);

  // Seamless Navigation Handler
  const handleSeamlessPageTurn = () => {
    if (isFlipping || !nextContent) return;

    setPreservedScroll(currentScroll);
    setFrozenPost(activePost);
    setFlippingPost(activePost);
    setIsFlipping(true);

    const currentPath = window.location.pathname;
    const isTenantInPath = currentPath.startsWith(`/${tenant.slug}`);

    const nextUrl = isTenantInPath ? `/${tenant.slug}/${nextContent.postSlug}` : `/${nextContent.postSlug}`;

    const newSlug = nextContent.postSlug;

    setTimeout(() => {
      setActivePost({ ...nextContent, content: nextContent.content });
      setFrozenPost(null);
      setCurrentScroll(0);
      window.history.pushState(null, "", nextUrl);
      fetchNextData(newSlug);
    }, 150);

    setTimeout(() => {
      setIsFlipping(false);
      setFlippingPost(null);
    }, 1400);
  }

  const handleManualNavigation = () => {
    navigateToBlogHome();
  }

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.offsetHeight;
        if (newHeight > 0) {
          setContainerHeight(Math.min(newHeight, 900));
        }
      }
    };

    const timer = setTimeout(updateHeight, 100);

    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const ringCount = containerHeight > 0 ? Math.ceil(containerHeight / 30) : 24;

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 pt-0 md:pt-20 lg:pt-24 overflow-hidden">
      {/* 2D LAYOUT CONTAINER */}
      <main
        className={cn(
          "relative w-full h-[88dvh] min-h-[500px] md:min-h-[650px] flex shadow-2xl rounded-r-lg bg-journal-binding overflow-hidden transition-all duration-700",
          focusMode ? "max-w-[1700px]" : "max-w-[1400px]",
        )}
        style={{ contentVisibility: "auto", contain: "content" } as React.CSSProperties}
      >
        {/* -- STATIC BINDING COLUMN -- */}
        <div className="relative w-6 xs:w-10 md:w-16 shrink-0 z-20 flex flex-col items-center py-4 overflow-hidden bg-journal-binding shadow-[inset_-2px_0_5px_rgba(0,0,0,0.4)] border-r border-journal-binding-border">
          {/* Leather Texture & Stitching */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-black/60" />
          {/* Stitching Line */}
          <div className="absolute right-2 md:right-3 top-0 bottom-0 w-px border-r border-dashed border-accent/40" />

          {/* Back Button */}
          {!isPreview && (
            <button
              onClick={navigateToBlogHome}
              className="relative z-40 mb-8 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-journal-paper/10 text-journal-paper/80 hover:bg-journal-paper/20 hover:text-white transition-all border border-white/10"
              title="Back to Blog"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* -- SPIRAL RINGS */}
        <div className="absolute left-[4px] xs:left-[10px] md:left-[22px] top-0 bottom-0 w-10 xs:w-16 z-30 flex flex-col justify-between py-4 pointer-events-none">
          {Array.from({ length: ringCount }).map((_, i) => (
            <div key={i} className="w-full relative h-[14px] group my-1">
              {/* Hole Punch Shadow on Binding */}
              <div className="absolute left-[1px] top-1/2 -translate-y-1/2 w-4 h-4 bg-black/80 rounded-full blur-[1px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]" />

              {/* The Metal Coil */}
              <div
                className="absolute left-[-2px] xs:left-[-4px] top-1/2 -translate-y-1/2 h-[10px] xs:h-[18px] w-[30px] xs:w-[70px] bg-gradient-to-b from-journal-coil-metal via-journal-coil-highlight to-journal-coil-shadow rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.4),_inset_0_-1px_1px_rgba(0,0,0,0.6)] transform -rotate-[8deg] origin-left z-50 ring-1 ring-white/30"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)" }}
              />

              <div className="absolute left-1 xs:left-3 top-1/2 -translate-y-1/2 h-[6px] xs:h-[12px] w-[25px] xs:w-[55px] bg-gradient-to-b from-journal-coil-dark-base via-[#333] to-[#000] rounded-full transform -rotate-[2deg] origin-left -z-10 opacity-90 shadow-inner" />
            </div>
          ))}
        </div>

        {/* -- MAIN CONTENT AREA */}
        <div ref={containerRef} className="relative flex-1 h-full perspective-[2000px]">
          {/* BOTTOM STACK (Decoration) */}
          <div className="absolute inset-4 -right-3 top-3 bottom-1 bg-[var(--journal-paper)] shadow-md rounded-r-lg border-r border-b border-black/10" />
          <div className="absolute inset-2 -right-1.5 top-1.5 bottom-0.5 bg-[var(--journal-paper)] shadow-sm rounded-r-lg border-r border-b border-black/5" />

          {/* ACTIVE PAGE CONTAINER */}
          <div className="absolute inset-0 z-10 flex">
            <JournalSheet
              key={activePost.postId}
              post={frozenPost || activePost}
              tenantSlug={tenant.slug || tenant.id}
              isLoading={!activePost}
              onShowRecommendations={hasMorePosts ? () => setIsRecommendationsOpen(true) : undefined}
              onShowComments={() => setIsCommentsOpen(true)}
              onShowSummary={() => setShowSummaryModal(true)}
              className="w-full h-full"
              disableInitialAnimation={isFlipping}
              initialScrollOffset={frozenPost ? preservedScroll : 0}
              onScroll={handleScroll}
            />

            {/* FIXED ACTION BAR - Desktop */}
            <div
              className={cn(
                "hidden md:flex absolute right-0 z-50 flex-col items-center transition-all duration-500",
                "top-1/2 -translate-y-1/2",
                "origin-right scale-100",
              )}
            >
              <div className="bg-[var(--journal-paper)] shadow-[2px_0_10px_rgba(0,0,0,0.1)] border-l border-y border-accent/10 py-4 md:py-6 px-2 md:px-3 rounded-l-xl flex flex-col items-center gap-4 md:gap-6 translate-x-1 hover:translate-x-0 transition-transform duration-500">
                {activePost.summary && (
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="group/btn relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-accent/60 hover:text-accent hover:scale-110 transition-all duration-300 cursor-pointer"
                    title="View Journal Insight"
                  >
                    <div className="absolute inset-0 bg-accent/10 rounded-full scale-0 group-hover/btn:scale-100 transition-transform duration-300" />
                    <ScrollText size={18} />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-[10px] uppercase tracking-widest rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                      Insight
                    </span>
                  </button>
                )}

                <div className="w-6 md:w-8 h-px bg-accent/10" />

                <FeedActionBar
                  postId={activePost.postId}
                  slug={activePost.postSlug}
                  authorUsername={activePost.authorUsername}
                  authorId={activePost.authorId}
                  initialLikes={activePost.likesCount}
                  initialComments={activePost.commentsCount}
                  initialIsLiked={activePost.isLiked}
                  initialIsFollowing={activePost.isFollowing}
                  onCommentClick={() => setIsCommentsOpen(true)}
                  layout="vertical"
                  compact={true}
                  className="mt-0 gap-6 md:gap-8"
                />
              </div>
              {/* Tab Puller handle visual */}
              <div className="w-1 h-24 md:h-32 bg-accent/5 rounded-l-full absolute -left-1 opacity-40 px-0" />
            </div>
          </div>

          {/* FLIPPING OVERLAY */}
          <AnimatePresence mode="popLayout">
            {isFlipping && flippingPost && (
              <motion.div
                key="flipper"
                className="absolute inset-0 z-50 origin-left"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: [0, -90, -180],
                }}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
                onAnimationComplete={() => {
                  setIsFlipping(false);
                  setTimeout(() => {
                    setFlippingPost(null);
                    setNextContent(null);
                  }, 50);
                }}
              >
                {/* FRONT FACE (Old Content) */}
                <div className="absolute inset-0 backface-hidden bg-noir-hover rounded-r-xl overflow-hidden flex flex-col border-l border-black/5 shadow-[-5px_0_15px_rgba(0,0,0,0.1)]">
                  <JournalSheet
                    post={flippingPost}
                    tenantSlug={tenant.slug || tenant.id}
                    disableInitialAnimation={true}
                    isStatic={true}
                    initialScrollOffset={preservedScroll}
                  />
                  {/* CYLINDRICAL SHADING OVERLAY*/}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1],
                      background: [
                        "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)", // Flat start
                        "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)", // Deep shadow near spine at 90deg
                        "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)", // Darker overall at end
                      ],
                    }}
                    transition={{ duration: 1.4, ease: "easeInOut", times: [0, 0.5, 1] }}
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                  />
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent/40 font-serif">
                    Sheet Ref: {flippingPost.postId?.substring(0, 8) || "00000000"}
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className="absolute inset-0 backface-hidden bg-noir-panel flex items-center justify-center overflow-hidden rounded-l-[2rem] shadow-[inset_-10px_0_30px_rgba(0,0,0,0.1)]"
                  style={{
                    transform: "rotateY(180deg)",
                    background:
                      "linear-gradient(90deg, #d6d3cc 0%, var(--journal-page-edge-light) 20%, var(--journal-paper) 50%, var(--journal-page-edge-light) 80%, #d6d3cc 100%)",
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

                  {/* Spine Shadow for Curvature */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/10 to-transparent mix-blend-multiply" />

                  <div className="scale-x-[-1] opacity-10 blur-[0.5px]">
                    <h1 className="text-4xl font-serif text-black uppercase tracking-widest">{flippingPost.title}</h1>
                  </div>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-journal-ink">
                      {flippingPost.publishedAt ? new Date(flippingPost.publishedAt).getDate() : "--"}
                    </span>
                    <span className="text-xs uppercase font-bold text-journal-accent/80 mt-1">
                      {flippingPost.publishedAt
                        ? new Date(flippingPost.publishedAt).toLocaleString("default", { month: "short" })
                        : "---"}
                    </span>
                    <span className="text-[9px] text-journal-accent/40 mt-1">
                      {flippingPost.publishedAt ? new Date(flippingPost.publishedAt).getFullYear() : "----"}
                    </span>
                  </div>

                  {/* Highlighting Glint as it turns */}
                  <motion.div
                    initial={{ opacity: 0.8, translateX: "-100%" }}
                    animate={{ opacity: 0, translateX: "150%" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none mix-blend-overlay blur-md"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner Peel (Interaction) */}
          {!isPreview && !isFlipping && (
            <motion.div
              className="absolute bottom-0 right-0 w-32 h-32 z-50 cursor-pointer overflow-hidden"
              whileHover="hover"
              initial="initial"
              onClick={nextContent ? handleSeamlessPageTurn : handleManualNavigation}
            >
              <motion.div
                variants={{
                  initial: { x: 0, y: 0 },
                  hover: { x: -5, y: -5 },
                }}
                className="absolute bottom-0 right-0 w-full h-full"
              >
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-black/20 to-transparent rounded-tl-xl blur-sm" />
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-journal-page-edge-light shadow-[-2px_-2px_5px_rgba(0,0,0,0.1)] rounded-tl-lg border-t border-l border-white/50" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-[var(--journal-paper)]/30">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-black/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-black/5 rounded-full blur-[150px]" />
      </div>

      {/* Comments Drawer */}
      <CommentSection
        postId={activePost.postId}
        tenantId={activePost.tenantId || tenant.id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        className="bg-[var(--journal-paper)] text-foreground border-l border-[var(--journal-binding)]/10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]"
      />

      {/* Recommendations Drawer */}
      <JournalRecommendationsDrawer
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
        post={activePost}
        currentTenantSlug={tenant.slug}
      />

      {/* AI Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummaryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div
              className="relative flex flex-col items-center justify-center max-h-[80vh] w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Top Roller */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[calc(100%+40px)] h-12 bg-[#8B4513] rounded-full shadow-xl z-20 flex items-center justify-center border-b-4 border-[#5c2e0b] relative"
              >
                <div className="w-full h-full bg-gradient-to-b from-white/10 to-black/20 rounded-full" />
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-yellow-600 rounded-l-full border-r border-yellow-800 shadow-inner" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-yellow-600 rounded-r-full border-l border-yellow-800 shadow-inner" />
              </motion.div>

              {/* Unfurling Paper */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full bg-[var(--journal-paper)] shadow-2xl overflow-hidden relative origin-top z-10"
              >
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] bg-repeat" />
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-10" />

                <div className="p-10 md:p-12 flex flex-col items-start relative z-20">
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="absolute top-4 right-4 text-accent/40 hover:text-accent transition-colors opacity-50 hover:opacity-100 cursor-pointer"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-4 opacity-60">
                    <ScrollText size={24} className="text-accent" />
                  </div>

                  <h3 className="text-accent font-serif text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-accent/20 pb-2">
                    Journal Insight
                  </h3>

                  <div className="font-serif italic text-lg md:text-xl leading-relaxed text-foreground/90 text-left drop-shadow-sm">
                    {activePost.summary}
                  </div>

                  <div className="mt-8 opacity-40 font-serif italic text-[10px]">
                    — Dictated by Machine Intelligence
                  </div>
                </div>
              </motion.div>

              {/* Bottom Roller */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[calc(100%+40px)] h-12 bg-[#8B4513] rounded-full shadow-xl z-20 flex items-center justify-center border-t-4 border-[#5c2e0b] relative"
              >
                <div className="w-full h-full bg-gradient-to-t from-white/10 to-black/20 rounded-full" />
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-yellow-600 rounded-l-full border-r border-yellow-800 shadow-inner" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-yellow-600 rounded-r-full border-l border-yellow-800 shadow-inner" />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
