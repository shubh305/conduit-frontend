"use client";

import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { PostContent } from "@/features/blog/components/PostContent";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { likePost, unlikePost } from "@/features/feed/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import { cn, getMediaUrl } from "@/lib/utils";
import { useTheme, useLabels } from "@/features/theme/ThemeProvider";
import { useFollowUser } from "@/features/profile/hooks/useFollowUser";
import { useBlogNavigation } from "@/features/blog/hooks/useBlogNavigation";
import { AnimatePresence, motion } from "framer-motion";

interface TerminalPostLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
  nextPost?: FeedItem;
  isPreview?: boolean;
}

export function TerminalPostLayout({ post, tenant, isPreview: isPreviewProp }: TerminalPostLayoutProps) {
  const { navigateToBlogHome } = useBlogNavigation(tenant.slug);
  const { focusMode } = useTheme();
  const isPreview = isPreviewProp;

  const dateStr = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(post.publishedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollowUser({
    userId: post.authorId || "",
    initialIsFollowing: false,
  });
  const { getLabel } = useLabels();

  // -- BOOT SEQUENCE STATE --
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);

  // -- TYPEWRITER STATE --
  const [typedTitle, setTypedTitle] = useState("");
  const titleRef = useRef(post.title);

  // Boot Sequence Effect
  useEffect(() => {
    const sequence = [
      { text: "> INITIALIZING...", delay: 50 },
      { text: "> RESOLVING: node_v9", delay: 200 },
      { text: "> VERIFYING_HANDSHAKE...", delay: 400 },
      { text: "> FETCHING_PAYLOAD...", delay: 600 },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    // Queue Log Lines
    sequence.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setBootLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const progressStartDelay = 650;
    const tProg = setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 15) + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => setIsBooting(false), 200);
        }
        setProgress(p);
      }, 40);
    }, progressStartDelay);
    timeouts.push(tProg);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Typewriter Effect for Title
  useEffect(() => {
    if (!isBooting) {
      let i = 0;
      const fullTitle = titleRef.current;
      const interval = setInterval(() => {
        setTypedTitle(fullTitle.slice(0, i + 1));
        i++;
        if (i === fullTitle.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isBooting]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to perform this action.");
      return;
    }
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prev => prev + (newLiked ? 1 : -1));

    try {
      if (newLiked) await likePost(post.postId, tenant.id);
      else await unlikePost(post.postId, tenant.id);
    } catch {
      setIsLiked(!newLiked);
      setLikes(prev => prev + (!newLiked ? 1 : -1));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-black font-mono text-foreground pt-28 pb-12 px-2 md:px-0 mx-auto transition-all duration-500 ease-in-out",
        focusMode ? "max-w-5xl" : "max-w-4xl",
      )}
    >
      <CommentSection
        postId={post.postId}
        tenantId={tenant.id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {/* Header Metadata */}
      <div className="mb-4 font-mono text-xs space-y-1 select-none relative">
        <div className="flex justify-between text-foreground-muted border-b border-accent/20 pb-1">
          <div className="flex flex-wrap gap-4 md:gap-8 items-center">
            <span>File: {post.postSlug}.md</span>
            <span>Permission: -r--r--r--</span>
            <span>Owner: root</span>

            {post.summary && (
              <div className="relative">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="text-accent hover:bg-accent hover:text-black px-1 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  [{showSummary ? "READING..." : "CAT SUMMARY.TXT"}]
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-foreground-muted">
          <div className="flex flex-wrap gap-4 md:gap-8">
            <span>Size: {post.readingTimeMinutes}KB</span>
            <span>Lines: {Object.keys(post.content || {}).length || 100}</span>
            <span>
              Last Modified: {dateStr} {timeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <article className="border border-accent p-6 md:p-10 min-h-[60vh] relative mb-20 bg-black">
        {isBooting ? (
          /* Boot / Loading State */
          <div className="w-full h-full min-h-[50vh] flex flex-col justify-start items-start font-mono space-y-4 p-4 text-xs md:text-sm">
            {/* Log Lines */}
            <div className="space-y-1 text-foreground-muted">
              {bootLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>

            {/* Progress Bar */}
            {bootLines.length >= 3 && (
              <div className="w-full max-w-md mt-4">
                <div className="flex justify-between mb-1 text-accent">
                  <span>DOWNLOADING_PACKETS</span>
                  <span>{progress}%</span>
                </div>
                <div className="text-accent whitespace-pre tracking-tighter leading-none select-none">
                  {"["}
                  {"#".repeat(Math.floor(progress / 2))}
                  {".".repeat(50 - Math.floor(progress / 2))}
                  {"]"}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Loaded Content */
          <div className="animate-flicker-in">
            <div className="absolute top-0 right-0 bg-accent text-black text-[10px] px-2 font-bold transform translate-y-[-100%]">
              READ_ONLY
            </div>

            {/* Typewriter Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-accent uppercase tracking-tighter leading-tight min-h-[3rem]">
              # {typedTitle}
              <span className="animate-blink inline-block w-[0.6em] h-[1em] bg-accent ml-2 align-middle"></span>
            </h1>

            <div className="flex items-center gap-4 text-xs text-foreground-muted mb-12 italic border-b border-accent/10 pb-4 w-fit">
              <span>
                {"//"} Author: @{post.authorUsername || "unknown"}
              </span>
              <span>
                {"//"} Published in: {tenant.name}
              </span>
            </div>

            {post.featuredImage && (
              <div className="mb-12 border border-accent p-2 w-full relative">
                <div className="relative w-full aspect-video">
                  <Image
                    src={getMediaUrl(post.featuredImage) || ""}
                    alt={post.title}
                    fill
                    className="grayscale opacity-80 object-cover"
                  />
                </div>
                <div className="text-[10px] text-center bg-accent text-black font-bold mt-2 py-1 flex justify-between px-3">
                  <span>FIG. 1 - HEADER_IMAGE</span>
                  {post.featuredImageAttribution && (
                    <a
                      href={post.featuredImageAttribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      CREDIT: {post.featuredImageAttribution.name.toUpperCase()} / UNSPLASH
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="terminal-post-content text-foreground leading-loose">
              <PostContent content={post.content} />
            </div>
          </div>
        )}
      </article>

      {/* VIM Status Bar*/}
      <div className="fixed bottom-0 left-0 right-0 bg-accent text-black font-mono text-xs px-4 py-1 flex flex-col md:flex-row justify-between z-50 border-t border-black">
        <div className="flex gap-4 font-bold items-center">
          <span className="bg-black text-accent px-1">[NORMAL]</span>
          <span>&quot;{post.postSlug}.md&quot;</span>
          <span>[readonly]</span>
        </div>

        {/* Interactive Commands */}
        <div className="flex gap-4 items-center">
          <button onClick={handleLike} className="hover:bg-black hover:text-accent px-1 transition-colors">
            :w [Like:{likes}]
          </button>
          {post.authorId && (
            <button
              onClick={toggleFollow}
              className="hover:bg-black hover:text-accent px-1 transition-colors text-accent"
            >
              :f [{isFollowing ? getLabel("unfollowButton") : getLabel("followButton")}]
            </button>
          )}
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="hover:bg-black hover:text-accent px-1 transition-colors"
          >
            :c [Comments:{post.commentsCount}]
          </button>
          {!isPreview && (
            <button onClick={navigateToBlogHome} className="hover:bg-black hover:text-accent px-1 transition-colors">
              :q [Back]
            </button>
          )}
        </div>

        <div className="flex gap-4 hidden md:flex">
          <span>utf-8</span>
          <span>100%</span>
          <span>1:1</span>
        </div>
      </div>

      {/* AI Summary */}
      <AnimatePresence>
        {showSummary && post.summary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummary(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className={cn(
                "fixed bg-black border-2 border-accent shadow-[12px_12px_0_rgba(var(--accent-rgb),0.5)] z-[101] overflow-hidden flex flex-col font-mono",
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-[700px] max-h-[85vh]",
              )}
            >
              <div className="bg-accent text-black px-4 py-2 flex items-center justify-between font-bold">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest">SUMMARY_BUFFER</span>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="hover:bg-black hover:text-accent px-2 transition-colors cursor-pointer"
                >
                  [X]
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-black text-accent/90">
                <div className="mb-6 opacity-40 text-[10px]">
                  <div>$ cat /var/log/ai/summary.txt</div>
                  <div>Reading from segment {post.postId.substring(0, 8)}...</div>
                </div>

                <div className="text-base md:text-xl leading-relaxed whitespace-pre-wrap italic pl-6 border-l-2 border-accent/20">
                  {post.summary}
                  <span className="animate-pulse ml-2 inline-block w-2 h-4 bg-accent align-middle" />
                </div>

                <div className="mt-12 opacity-30 text-[9px] uppercase tracking-[0.2em] flex flex-col gap-1">
                  <div>-- EOF --</div>
                  <div>System: Pulse_v9.2</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
