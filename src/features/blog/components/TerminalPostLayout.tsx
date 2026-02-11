"use client";

import { FeedItem } from "@/features/feed/types";
import { TiptapContent } from "@/features/blog/types";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import Image from "next/image";
import TiptapImage from "@tiptap/extension-image";
import { useState, useEffect, useRef } from "react";
import { CommentSection } from "@/features/feed/components/CommentSection";
import { likePost, unlikePost } from "@/features/feed/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import { cn, getMediaUrl } from "@/lib/utils";
import { useTheme, useLabels } from "@/features/theme/ThemeProvider";
import { useFollowUser } from "@/features/profile/hooks/useFollowUser";
import { Ruby, RubyText } from "@/features/studio/extensions/Ruby";

interface TerminalPostLayoutProps {
  post: FeedItem & { content: TiptapContent; readingTimeMinutes: number };
  tenant: { name: string; slug?: string; id: string };
  nextPost?: FeedItem;
  isPreview?: boolean;
}

export function TerminalPostLayout({ post, tenant, isPreview: isPreviewProp }: TerminalPostLayoutProps) {
  const { focusMode } = useTheme();
  const isPreview = isPreviewProp;
  const htmlContent = generateHTML(post.content || {}, [
    StarterKit,
    TiptapImage,
    Youtube.configure({ controls: false }),
    Link,
    Underline,
    Ruby,
    RubyText,
  ]);
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
        "min-h-screen bg-black font-mono text-foreground pt-28 pb-12 px-2 md:px-0 mx-auto transition-all duration-700",
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
      <div className="mb-4 font-mono text-xs space-y-1 select-none">
        <div className="flex justify-between text-foreground-muted border-b border-accent/20 pb-1">
          <div className="flex flex-wrap gap-4 md:gap-8">
            <span>File: {post.postSlug}.md</span>
            <span>Permission: -r--r--r--</span>
            <span>Owner: root</span>
            <span>Group: wheel</span>
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

            <div
              className="prose prose-invert prose-p:font-mono prose-headings:font-bold prose-headings:text-accent prose-headings:uppercase prose-a:text-accent prose-a:no-underline hover:prose-a:bg-accent hover:prose-a:text-black max-w-none text-foreground leading-loose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
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
            <button
              onClick={() => window.history.back()}
              className="hover:bg-black hover:text-accent px-1 transition-colors"
            >
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
    </div>
  );
}
