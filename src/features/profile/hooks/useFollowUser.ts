
import { useState, useEffect } from "react";
import { followUser, unfollowUser, FollowResponse } from "../api";
import { toast } from "sonner";

interface UseFollowUserProps {
  userId: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function useFollowUser({
  userId,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  onFollowChange,
}: UseFollowUserProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    setFollowersCount(initialFollowersCount);
  }, [initialFollowersCount]);

  const toggleFollow = async () => {
    if (isLoading) return;

    const previousIsFollowing = isFollowing;
    const previousFollowersCount = followersCount;

    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      let response: FollowResponse;
      if (previousIsFollowing) {
        response = await unfollowUser(userId);
      } else {
        response = await followUser(userId);
      }

      setIsFollowing(response.isFollowing);
      setFollowersCount(response.followersCount);
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("follow-status-changed", { 
          detail: { userId, isFollowing: response.isFollowing } 
        }));
      }
      
      if (onFollowChange) {
        onFollowChange(response.isFollowing);
      }
    } catch (error) {
      setIsFollowing(previousIsFollowing);
      setFollowersCount(previousFollowersCount);
      toast.error("Failed to update follow status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, followersCount, isLoading, toggleFollow };
}
