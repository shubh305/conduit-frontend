
import { useLibrary, Comment } from "@/features/library/context/LibraryContext";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { X, ThumbsUp, Bold, Italic, Underline } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CommentSectionProps {
  postId: string;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({ postId, className, isOpen, onClose }: CommentSectionProps) {
  const { theme } = useTheme();
  const { comments, addComment, likedCommentIds, toggleCommentLike } = useLibrary();
  const [input, setInput] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const postComments = comments[postId] || [];
  
  const totalComments = postComments.reduce((acc, curr) => acc + 1 + (curr.children?.length || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      
      if (replyingToId) {
          addComment(postId, input, replyingToId);
          setReplyingToId(null);
          setReplyingToName(null);
      } else {
          addComment(postId, input);
      }
      
      setInput("");
  };

  const handleFormat = (format: 'bold' | 'italic' | 'underline') => {
      if (!textareaRef.current) return;
      
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = input;
      
      let wrapper = '';
      if (format === 'bold') wrapper = '**';
      if (format === 'italic') wrapper = '*';
      if (format === 'underline') wrapper = '__'; 

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

  const handleReplyClick = (commentId: string, authorName: string) => {
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
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const renderMarkdown = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);
      
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('__') && part.endsWith('__')) {
              return <u key={index} className="underline decoration-1 underline-offset-2">{part.slice(2, -2)}</u>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={index} className="italic">{part.slice(1, -1)}</em>;
          }
          return part;
      });
  };

  const CommentItem = ({ comment, isChild = false }: { comment: Comment, isChild?: boolean }) => {
       const isLiked = likedCommentIds?.includes(comment.id);

       return (
           <div className="flex flex-col">
                <div className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-sm font-bold",
                                    theme === 'cyber' ? "text-white" : "text-white"
                                )}>
                                    {comment.authorName}
                                    {comment.authorName === "Ian Kiprono" && (
                                        <span className="ml-2 text-[10px] bg-green-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Author</span>
                                    )}
                                </span>
                                <span className="text-[10px] opacity-50">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        
                        <p className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap", // preserved whitespace
                            theme === 'cyber' ? "text-gray-300" : "text-gray-300 font-serif"
                        )}>
                            {renderMarkdown(comment.text)}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 pt-2 text-xs opacity-50">
                            <button 
                                onClick={() => toggleCommentLike(comment.id, postId)}
                                className={cn(
                                    "flex items-center gap-1 transition-colors",
                                    isLiked ? "text-signal-green" : "hover:text-signal-green"
                                )}
                            >
                                <ThumbsUp size={14} fill={isLiked ? "currentColor" : "none"} /> 
                                {comment.likes}
                            </button>
                            
                            {!isChild && (
                                <button 
                                    onClick={() => handleReplyClick(comment.id, comment.authorName)}
                                    className="hover:text-signal-green transition-colors"
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Render Children */}
                {comment.children && comment.children.length > 0 && (
                    <div className={cn(
                        "ml-4 mt-4 pl-4 border-l",
                        theme === 'cyber' ? "border-white/10" : "border-gray-700"
                    )}>
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

  if (!isOpen) return null;

  return (
    <>
        {/* Backdrop */}
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity"
            onClick={onClose}
        />
        
        {/* Drawer */}
        <div className={cn(
            "fixed inset-y-0 right-0 z-[100] w-full md:w-[450px] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0",
            theme === 'cyber' ? "bg-[#050505] border-l border-white/10 text-gray-300" : "bg-noir-panel text-gray-100 border-l border-noir-border",
            className
        )}>
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between p-6 border-b",
                theme === 'cyber' ? "border-white/10" : "border-noir-border"
            )}>
                <h2 className={cn(
                    "text-lg font-bold",
                    theme === 'cyber' ? "text-white font-mono uppercase" : "text-white font-sans"
                )}>
                    Comments ({totalComments})
                </h2>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {postComments.length === 0 && (
                    <div className="text-center py-10 opacity-50 italic">
                        No comments yet. Start the conversation.
                    </div>
                )}
                
                {postComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>

            {/* Input Footer */}
            <div className={cn(
                "p-6 border-t mt-auto",
                theme === 'cyber' ? "border-white/10 bg-[#0A0A0A]" : "border-noir-border bg-noir-panel"
            )}>
                 <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                             {/* Mock current user */}
                             <Image 
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" 
                                alt="You" 
                                fill
                                className="object-cover" 
                             />
                         </div>
                         <span className="text-sm font-bold opacity-70">Shubham Singh</span>
                     </div>
                     
                     {replyingToName && (
                         <div className="flex items-center gap-2 text-xs text-signal-green">
                             <span>Replying to {replyingToName}</span>
                             <button onClick={cancelReply} className="hover:text-white">
                                 <X size={12} />
                             </button>
                         </div>
                     )}
                 </div>
                 
                 <form onSubmit={handleSubmit} className="relative">
                     <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What are your thoughts?"
                        className={cn(
                            "w-full h-24 p-4 pb-12 rounded-lg resize-none focus:outline-none focus:ring-1 text-sm bg-transparent border transition-all",
                            theme === 'cyber' 
                                ? "border-white/20 focus:border-signal-green placeholder:text-gray-600 font-mono" 
                                : "border-noir-border focus:border-white placeholder:text-gray-500 font-sans text-white"
                        )}
                     />
                     
                     {/* Toolbar */}
                     <div className="absolute bottom-16 left-4 flex gap-2">
                        <button 
                             type="button"
                             onClick={() => handleFormat('bold')}
                             className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                             title="Bold"
                         >
                             <Bold size={16} />
                         </button>
                         <button 
                             type="button"
                             onClick={() => handleFormat('italic')}
                             className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                             title="Italic"
                         >
                             <Italic size={16} />
                         </button>
                         <button 
                             type="button"
                             onClick={() => handleFormat('underline')}
                             className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                             title="Underline"
                         >
                             <Underline size={16} />
                         </button>
                     </div>

                     <div className="flex justify-between items-center mt-3">
                         <div className="flex gap-2">
                         </div>
                         <Button 
                            type="submit" 
                            disabled={!input.trim()}
                            size="sm"
                            className={cn(
                                "rounded-full px-6 transition-all",
                                !input.trim() && "opacity-50 cursor-not-allowed",
                                theme === 'cyber' 
                                    ? "bg-signal-green text-black hover:bg-signal-green/90 rounded-none font-mono text-xs" 
                                    : "bg-white text-black hover:bg-gray-200"
                            )}
                         >
                            {replyingToId ? "Post Reply" : "Respond"}
                         </Button>
                     </div>
                 </form>
            </div>
        </div>
    </>
  );
}
