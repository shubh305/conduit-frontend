import { useLibrary } from "@/features/library/context/LibraryContext";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Bookmark, Heart, MessageCircle, Share, MoreHorizontal, Hand } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeedActionBarProps {
  postId: string;
  initialLikes?: number;
  initialComments?: number;
  className?: string;
  onCommentClick?: () => void;
}

export function FeedActionBar({ 
  postId, 
  initialLikes = 0, 
  initialComments = 0, 
  className,
  onCommentClick
}: FeedActionBarProps) {
  const { theme } = useTheme();
  const { isPostSaved, togglePost } = useLibrary();
  
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const isSaved = isPostSaved(postId);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(prev => !prev);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/s/${postId}`); // Mock shortlink
    toast.success("Link copied to clipboard");
  };

  // Base icon styles
  const iconBase = "cursor-pointer transition-colors duration-200 flex items-center gap-1.5 focus:outline-none";
  const iconHover = theme === 'cyber' ? "hover:text-signal-green" : "hover:text-black";
  const iconActive = theme === 'cyber' ? "text-signal-green" : "text-red-500";

  return (
    <div className={cn("flex items-center justify-between mt-4", className)}>
      <div className="flex items-center gap-6">
        {/* Like */}
        <button 
            type="button"
            onClick={handleLike}
            className={cn(iconBase, isLiked ? iconActive : "text-gray-500", iconHover)}
        >
             {theme === 'cyber' ? <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> : <Hand size={18} />}
             <span className="text-xs font-mono">{likes}</span>
        </button>

        {/* Comments */}
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCommentClick?.(); }}
            className={cn(iconBase, "text-gray-500", iconHover)}
        >
            <MessageCircle size={18} />
             <span className="text-xs font-mono">{initialComments}</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Share */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button" onClick={(e) => e.stopPropagation()} className={cn(iconBase, "text-gray-500", iconHover)}>
                    <Share size={18} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn(
                theme === 'cyber' 
                    ? "bg-black border-white/20 text-gray-300" 
                    : "bg-noir-panel border-noir-border text-gray-100"
            )}>
                 <DropdownMenuItem onClick={handleShare} className="focus:bg-white/10 focus:text-white cursor-pointer">
                    Copy Link
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* Save */}
        <button 
           type="button"
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             togglePost(postId);
           }}
           className={cn(iconBase, isSaved ? (theme === 'cyber' ? "text-signal-green" : "text-black") : "text-gray-500", iconHover)}
        >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
        
        {/* More Options */}
         <button 
           type="button"
           onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
           className={cn(iconBase, "text-gray-500", iconHover)}
        >
            <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
