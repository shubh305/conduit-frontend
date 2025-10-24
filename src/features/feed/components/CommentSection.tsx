"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { X, ThumbsUp, Bold, Italic, Underline } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getComments, createComment, likeComment, unlikeComment } from "@/features/comments/api";
import { Comment } from "@/features/comments/types";
import { useAuth } from "@/features/auth/AuthProvider";
import { toast } from "sonner";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
  tenantId?: string;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({ postId, tenantId, className, isOpen, onClose }: CommentSectionProps) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isTerminalCopy } = useThemeHelpers();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getComments(postId, {}, tenantId)
        .then(res => setComments(res.comments || []))
        .catch(err => console.error("Failed to fetch comments", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, postId, tenantId]);

  const totalComments = comments.reduce((acc, curr) => acc + 1 + (curr.children?.length || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await createComment(
        postId,
        {
          text: input,
          parentId: replyingToId || undefined,
        },
        tenantId,
      );

      const res = await getComments(postId, {}, tenantId);
      setComments(res.comments || []);

      setInput("");
      setReplyingToId(null);
      setReplyingToName(null);
      toast.success(isSakuraCopy ? "コメントを送信しました" : "Comment posted.");
    } catch (error) {
      toast.error("Failed to post comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormat = (format: "bold" | "italic" | "underline") => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = input;

    let wrapper = "";
    if (format === "bold") wrapper = "**";
    if (format === "italic") wrapper = "*";
    if (format === "underline") wrapper = "__";

    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${wrapper}${selection}${wrapper}${after}`;
    setInput(newText);

    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPos = end + wrapper.length * 2;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to like comments.");
      return;
    }

    const updateLikes = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: (c.likes || 0) + (isLiked ? 1 : -1),
          };
        }
        if (c.children) {
          return { ...c, children: updateLikes(c.children) };
        }
        return c;
      });
    };

    const targetComment = (list: Comment[]): Comment | undefined => {
      for (const c of list) {
        if (c.id === commentId) return c;
        if (c.children) {
          const found = targetComment(c.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = targetComment(comments);
    if (!comment) return;

    const previousLiked = comment.isLiked;
    setComments(prev => updateLikes(prev));

    try {
      if (previousLiked) {
        await unlikeComment(commentId, tenantId);
      } else {
        await likeComment(commentId, tenantId);
      }
    } catch (err) {
      setComments(prev => updateLikes(prev));
      toast.error("Failed to update like");
      console.error(err);
    }
  };

  const handleReplyClick = (commentId: string, authorName: string) => {
    if (!user) {
      toast.error("Please sign in to reply.");
      return;
    }
    setReplyingToId(commentId);
    setReplyingToName(authorName);
    textareaRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyingToName(null);
    setInput("");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return (
          <u key={index} className="underline decoration-1 underline-offset-2">
            {part.slice(2, -2)}
          </u>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const CommentItem = ({ comment, isChild = false }: { comment: Comment; isChild?: boolean }) => {
    return (
      <div className="flex flex-col">
        <div className="flex gap-4 group">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-noir-hover flex-shrink-0 relative border border-noir-border shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={comment.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName}`}
              alt={comment.authorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-bold text-foreground",
                    isCyberCopy ? "font-mono uppercase tracking-tighter" : "",
                  )}
                >
                  {comment.authorName}
                  {comment.authorName === "Ian Kiprono" && (
                    <span className="ml-2 text-[8px] bg-accent text-noir-bg px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                      Author
                    </span>
                  )}
                </span>
                <span className="text-[9px] text-foreground-subtle font-mono uppercase tracking-widest">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap text-foreground-muted",
                isCyberCopy ? "font-mono" : config.fontFamily === "serif" ? "font-serif italic" : "font-sans",
              )}
            >
              {renderMarkdown(comment.text)}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2 text-[10px] text-foreground-subtle font-mono uppercase tracking-widest">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors hover:text-accent",
                  comment.isLiked ? "text-accent" : "",
                )}
              >
                <ThumbsUp
                  size={12}
                  fill={comment.isLiked ? "currentColor" : "none"}
                  className={cn("transition-transform", comment.isLiked ? "scale-110" : "opacity-50")}
                />
                {comment.likes || 0}
              </button>

              {!isChild && (
                <button
                  onClick={() => handleReplyClick(comment.id, comment.authorName)}
                  className="hover:text-accent transition-colors font-bold"
                >
                  {isSakuraCopy ? "返信" : "Reply"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Render Children */}
        {comment.children && comment.children.length > 0 && (
          <div className="ml-4 mt-4 pl-4 border-l border-noir-border">
            {comment.children.map(child => (
              <div key={child.id} className="mt-4 first:mt-0">
                <CommentItem comment={child} isChild={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------
  // TERMINAL Layout
  // ---------------------------------------------------------
  if (isTerminalCopy) {
    if (!isOpen) return null;
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl bg-black border border-accent flex flex-col h-[600px] shadow-[0_0_20px_rgba(74,246,38,0.2)] font-mono text-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-accent text-black px-2 py-1 flex justify-between items-center font-bold">
            <span>[#comments] Topic: {totalComments} messages</span>
            <button onClick={onClose} className="hover:bg-black hover:text-accent px-1">
              [x]
            </button>
          </div>

          {/* IRC Log Window */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs md:text-sm scrollbar-hide">
            {isLoading && <div className="text-accent/50 ml-2">* Connecting to channel...</div>}
            {!isLoading && comments.length === 0 && (
              <div className="text-accent/50 ml-2">* No messages in channel. Be the first.</div>
            )}

            {comments.map(comment => (
              <div key={comment.id} className="flex flex-col">
                <div className="break-words">
                  <span className="text-foreground-muted">
                    [{new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]
                  </span>{" "}
                  <span
                    className={cn("font-bold text-accent", comment.authorName === "Ian Kiprono" ? "text-white" : "")}
                  >
                    &lt;{comment.authorName}&gt;
                  </span>{" "}
                  <span className="text-foreground-muted">{comment.text}</span>
                  <span
                    className="ml-2 text-[10px] text-accent/30 cursor-pointer hover:text-accent hover:underline"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    [{comment.isLiked ? "*" : " "}] {comment.likes || 0}
                  </span>
                  {user && (
                    <span
                      className="ml-2 text-[10px] text-accent/30 cursor-pointer hover:text-accent hover:underline"
                      onClick={() => handleReplyClick(comment.id, comment.authorName)}
                    >
                      [reply]
                    </span>
                  )}
                </div>

                {comment.children &&
                  comment.children.length > 0 &&
                  comment.children.map(child => (
                    <div key={child.id} className="ml-8 text-foreground-subtle">
                      <span>
                        [{new Date(child.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]
                      </span>{" "}
                      <span className="text-accent/70">&lt;{child.authorName}&gt;</span> <span>{child.text}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="border-t border-accent p-2 bg-black">
            {replyingToName && (
              <div className="text-accent/50 text-xs mb-1">Replying to {replyingToName} (ESC to cancel)</div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <span className="text-accent font-bold">&gt;</span>
              {user ? (
                <input
                  ref={textareaRef as unknown as React.RefObject<HTMLInputElement>}
                  autoFocus
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Escape") cancelReply();
                  }}
                  placeholder={user?.username ? `${user.username}: say something...` : "say something..."}
                  className="flex-1 bg-transparent border-none outline-none text-foreground font-mono placeholder:text-foreground-muted/50"
                />
              ) : (
                <div className="text-foreground-muted">
                  [readonly]{" "}
                  <Link href="/login" className="text-accent underline">
                    /login
                  </Link>{" "}
                  to send messages
                </div>
              )}
              {user && (
                <Button
                  type="submit"
                  disabled={!input.trim() || isSubmitting}
                  variant="ghost"
                  className="text-accent hover:text-white hover:bg-accent/20 rounded-none h-auto py-1 px-2 text-xs"
                >
                  [SEND]
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity" onClick={onClose} />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[201] w-full md:w-[450px] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0",
          "bg-noir-panel text-foreground border-l border-noir-border",
          className,
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-noir-border">
          <h2
            className={cn(
              "text-lg font-bold uppercase tracking-widest",
              isCyberCopy
                ? "text-accent font-mono"
                : config.fontFamily === "serif"
                  ? "font-serif italic decoration-accent/20 underline underline-offset-8"
                  : "font-sans",
            )}
          >
            {isSakuraCopy ? "コメント" : "Comments"} ({totalComments})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-noir-hover rounded-full transition-colors text-foreground-subtle hover:text-accent"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {isLoading && (
            <div className="text-center py-10 text-foreground-subtle font-mono uppercase text-xs animate-pulse tracking-[0.2em]">
              RECEIVING_TRANSMISSION...
            </div>
          )}
          {!isLoading && comments.length === 0 && (
            <div className="text-center py-10 text-foreground-subtle italic opacity-50">
              No signals found. Initiate contact.
            </div>
          )}

          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div className="p-6 border-t mt-auto border-noir-border bg-noir-bg/50 backdrop-blur-md">
          {user ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-noir-hover relative border border-noir-border shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-foreground-muted">
                    {user.displayName || user.username}
                  </span>
                </div>

                {replyingToName && (
                  <div className="flex items-center gap-2 text-[10px] text-accent font-bold uppercase tracking-widest bg-accent/5 px-2 py-1 border border-accent/20">
                    <span>
                      {isSakuraCopy ? "返信先：" : "Replying to "}
                      {replyingToName}
                    </span>
                    <button
                      onClick={cancelReply}
                      className="hover:text-foreground text-foreground-subtle transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isSakuraCopy ? "あなたの考えを教えてください..." : "Input thoughts..."}
                  className={cn(
                    "w-full h-32 p-4 pb-14 resize-none focus:outline-none focus:border-accent text-sm bg-noir-bg border border-noir-border text-foreground transition-all shadow-inner",
                    isCyberCopy ? "font-mono rounded-none" : "rounded-xl",
                  )}
                />

                <div className="absolute bottom-16 left-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFormat("bold")}
                    className="p-1 text-foreground-subtle hover:text-accent transition-colors"
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("italic")}
                    className="p-1 text-foreground-subtle hover:text-accent transition-colors"
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat("underline")}
                    className="p-1 text-foreground-subtle hover:text-accent transition-colors"
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2"></div>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isSubmitting}
                    className={cn(
                      "px-8 h-9 transition-all text-xs font-bold uppercase tracking-widest",
                      isCyberCopy
                        ? "bg-accent text-noir-bg hover:brightness-110 rounded-none font-mono"
                        : "bg-accent text-noir-bg hover:shadow-lg hover:shadow-accent/20",
                    )}
                    style={{ borderRadius: isCyberCopy ? "0" : "var(--theme-radius-full)" }}
                  >
                    {isSubmitting
                      ? isSakuraCopy
                        ? "送信中..."
                        : "Processing..."
                      : replyingToId
                        ? isSakuraCopy
                          ? "返信を送信"
                          : "Post Reply"
                        : isSakuraCopy
                          ? "コメントする"
                          : "Respond"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6 text-sm">
              <Link href="/login" className="text-accent font-bold hover:underline">
                Sign in
              </Link>{" "}
              <span className="text-foreground-muted">to join the transmission.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
