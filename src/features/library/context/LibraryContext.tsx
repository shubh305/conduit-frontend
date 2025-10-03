"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { getMyLists } from "@/features/lists/api";
import { ReadingList } from "@/features/lists/types";

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
  refreshLibrary: () => Promise<void>;
  readingLists: ReadingList[];

  readingHistory: FeedItem[];
  addToHistory: (item: FeedItem) => void;

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

import { FeedItem } from "@/features/feed/types";

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [followedPubIds, setFollowedPubIds] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<FeedItem[]>([]);
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const { user } = useAuth();

  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("conduit_saved_posts");
      const users = localStorage.getItem("conduit_followed_users");
      const pubs = localStorage.getItem("conduit_followed_pubs");
      const history = localStorage.getItem("conduit_reading_history");
      const storedComments = localStorage.getItem("conduit_comments");
      const storedLikes = localStorage.getItem("conduit_liked_comments");

      if (saved) setSavedPostIds(JSON.parse(saved));
      if (users) setFollowedUserIds(JSON.parse(users));
      if (pubs) setFollowedPubIds(JSON.parse(pubs));
      if (history) setReadingHistory(JSON.parse(history));
      if (storedComments) setComments(JSON.parse(storedComments));
      if (storedLikes) setLikedCommentIds(JSON.parse(storedLikes));
    } catch (e) {
      console.error("Failed to load library data", e);
    } finally {
        setHydrated(true);
    }
  }, []);

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
    localStorage.setItem("conduit_reading_history", JSON.stringify(readingHistory));
  }, [readingHistory, hydrated]);

  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_comments", JSON.stringify(comments));
  }, [comments, hydrated]);
  
  useEffect(() => {
     if (!hydrated) return;
    localStorage.setItem("conduit_liked_comments", JSON.stringify(likedCommentIds));
  }, [likedCommentIds, hydrated]);

  const refreshLibrary = useCallback(async () => {
    if (!user) return;
    try {
      const lists = await getMyLists();
      setReadingLists(lists);
    } catch (e) {
      console.error("Failed to refresh library from backend", e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshLibrary();
    } else {
      setReadingLists([]);
    }
  }, [user, refreshLibrary]);

  const backendSavedPostIds = useMemo(() => {
    const ids = new Set<string>();
    readingLists.forEach(list => {
      list.items?.forEach(item => {
        ids.add(item.postId);
      });
    });
    return ids;
  }, [readingLists]);


  const togglePost = (id: string) => {
    const isSaved = savedPostIds.includes(id);
    if (isSaved) {
      toast.success("Removed from Library");
      setSavedPostIds(prev => prev.filter(i => i !== id));
    } else {
      toast.success("Saved to Library");
      setSavedPostIds(prev => [...prev, id]);
    }
  };
  
   const toggleUser = (id: string) => {
    const isFollowed = followedUserIds.includes(id);
    if (isFollowed) {
      toast.info("Unfollowed user");
      setFollowedUserIds(prev => prev.filter(i => i !== id));
    } else {
      toast.success("Following user");
      setFollowedUserIds(prev => [...prev, id]);
    }
  };
  
   const togglePub = (id: string) => {
    const isFollowed = followedPubIds.includes(id);
    if (isFollowed) {
      toast.info("Unfollowed publication");
      setFollowedPubIds(prev => prev.filter(i => i !== id));
    } else {
      toast.success("Following publication");
      setFollowedPubIds(prev => [...prev, id]);
    }
  };

  const addToHistory = useCallback((item: FeedItem) => {
    setReadingHistory(prev => {
      if (prev.length > 0 && prev[0].postId === item.postId) {
        return prev;
      }

      const filtered = prev.filter(i => i.postId !== item.postId);
      return [item, ...filtered].slice(0, 50);
    });
  }, []);

  const isPostSaved = (id: string) => {
    if (backendSavedPostIds.has(id)) return true;
    return savedPostIds.includes(id);
  };
  const isUserFollowed = (id: string) => followedUserIds.includes(id);
  const isPubFollowed = (id: string) => followedPubIds.includes(id);

  const addComment = (postId: string, text: string, parentId?: string) => {
      const newComment: Comment = {
        id: Math.random().toString(36).substring(7),
        text,
        authorName: "You",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        createdAt: new Date().toISOString(),
        replies: 0,
        likes: 0,
        children: [],
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
    <LibraryContext.Provider
      value={{
        savedPostIds,
        followedUserIds,
        followedPubIds,
        togglePost,
        toggleUser,
        togglePub,
        isPostSaved,
        isUserFollowed,
        isPubFollowed,
        readingHistory,
        addToHistory,
        comments,
        addComment,
        likedCommentIds,
        toggleCommentLike,
        refreshLibrary,
        readingLists,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
    const context = useContext(LibraryContext);
    if (!context) throw new Error("useLibrary must be used within LibraryProvider");
    return context;
};
