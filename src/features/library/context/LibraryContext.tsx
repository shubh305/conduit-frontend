"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface LibraryContextType {
  savedPostIds: string[];
  followedUserIds: string[];
  followedPubIds: string[];
  togglePost: (id: string) => void;
  toggleUser: (id: string) => void;
  togglePub: (id: string) => void;
  isPostSaved: (id: string) => boolean;
  isUserFollowed: (id: string) => boolean;
  isPubFollowed: (id: string) => boolean;
  
  // Comments
  comments: Record<string, Comment[]>;
  addComment: (postId: string, text: string, parentId?: string) => void;
  likedCommentIds: string[];
  toggleCommentLike: (commentId: string, postId: string) => void;
}

export interface Comment {
    id: string;
    text: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string;
    replies: number;
    likes: number;
    children?: Comment[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [followedPubIds, setFollowedPubIds] = useState<string[]>([]);

  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("conduit_saved_posts");
      const users = localStorage.getItem("conduit_followed_users");
      const pubs = localStorage.getItem("conduit_followed_pubs");
      const storedComments = localStorage.getItem("conduit_comments");
      const storedLikes = localStorage.getItem("conduit_liked_comments");

      if (saved) setSavedPostIds(JSON.parse(saved));
      if (users) setFollowedUserIds(JSON.parse(users));
      if (pubs) setFollowedPubIds(JSON.parse(pubs));
      if (storedComments) setComments(JSON.parse(storedComments));
      if (storedLikes) setLikedCommentIds(JSON.parse(storedLikes));
    } catch (e) {
      console.error("Failed to load library data", e);
    } finally {
        setHydrated(true);
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("conduit_saved_posts", JSON.stringify(savedPostIds));
  }, [savedPostIds, hydrated]);
  
  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_followed_users", JSON.stringify(followedUserIds));
  }, [followedUserIds, hydrated]);

  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_followed_pubs", JSON.stringify(followedPubIds));
  }, [followedPubIds, hydrated]);

  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_comments", JSON.stringify(comments));
  }, [comments, hydrated]);
  
  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_liked_comments", JSON.stringify(likedCommentIds));
  }, [likedCommentIds, hydrated]);


  const togglePost = (id: string) => {
    setSavedPostIds(prev => {
        const isSaved = prev.includes(id);
        if (isSaved) {
            toast.success("Removed from Library");
            return prev.filter(i => i !== id);
        } else {
            toast.success("Saved to Library");
            return [...prev, id];
        }
    });
  };
  
   const toggleUser = (id: string) => {
    setFollowedUserIds(prev => {
        const isFollowed = prev.includes(id);
        if (isFollowed) {
             toast.info("Unfollowed user");
            return prev.filter(i => i !== id);
        } else {
             toast.success("Following user");
            return [...prev, id];
        }
    });
  };
  
   const togglePub = (id: string) => {
    setFollowedPubIds(prev => {
        const isFollowed = prev.includes(id);
        if (isFollowed) {
             toast.info("Unfollowed publication");
            return prev.filter(i => i !== id);
        } else {
             toast.success("Following publication");
            return [...prev, id];
        }
    });
  };

  const isPostSaved = (id: string) => savedPostIds.includes(id);
  const isUserFollowed = (id: string) => followedUserIds.includes(id);
  const isPubFollowed = (id: string) => followedPubIds.includes(id);

  const addComment = (postId: string, text: string, parentId?: string) => {
      const newComment: Comment = {
          id: Math.random().toString(36).substring(7),
          text,
          authorName: "You", // Mock user
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
          createdAt: new Date().toISOString(),
          replies: 0,
          likes: 0,
          children: []
      };
      
      setComments(prev => {
          const postComments = prev[postId] || [];
          
          if (parentId) {
              const updated = postComments.map(c => {
                  if (c.id === parentId) {
                      return {
                          ...c,
                          replies: c.replies + 1,
                          children: [...(c.children || []), newComment]
                      };
                  }
                  return c;
              });
              return { ...prev, [postId]: updated };
          }

          return {
              ...prev,
              [postId]: [newComment, ...postComments]
          };
      });
      toast.success("Response published");
  };

  const toggleCommentLike = (commentId: string, postId: string) => {
      setLikedCommentIds(prev => {
          const isLiked = prev.includes(commentId);
          
          setComments(currentComments => {
              const postComments = currentComments[postId] || [];
              const updatedPostComments = postComments.map(c => {
                  if (c.id === commentId) {
                      return { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 };
                  }
                  return c;
              });
              
              return {
                  ...currentComments,
                  [postId]: updatedPostComments
              };
          });

          if (isLiked) {
              return prev.filter(id => id !== commentId);
          } else {
              return [...prev, commentId];
          }
      });
  };

  return (
    <LibraryContext.Provider value={{
        savedPostIds, followedUserIds, followedPubIds,
        togglePost, toggleUser, togglePub,
        isPostSaved, isUserFollowed, isPubFollowed,
        comments, addComment, 
        likedCommentIds, toggleCommentLike
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
    const context = useContext(LibraryContext);
    if (!context) throw new Error("useLibrary must be used within LibraryProvider");
    return context;
};
