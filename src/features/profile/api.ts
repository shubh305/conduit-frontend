import { fetchApi } from "@/lib/api-client";
import { Profile } from "./types";

export async function getProfile(username: string) {
  return fetchApi<{ user: Profile & { _id?: string } }>(`/users/${username}`).then(res => ({
    user: res.user ? { ...res.user, id: res.user.id || res.user._id || "" } : res.user
  }));
}

export interface FollowResponse {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
}

export function followUser(userId: string) {
  return fetchApi<FollowResponse>(`/users/${userId}/follow`, {
    method: "POST",
  });
}

export function unfollowUser(userId: string) {
  return fetchApi<FollowResponse>(`/users/${userId}/follow`, {
    method: "DELETE",
  });
}

export function getFollowingUsers() {
  return fetchApi<{ users: (Profile & { _id?: string })[] }>("/users/me/following").then(res => ({
    users: (res.users || []).map(u => ({ ...u, id: u.id || u._id || "" })),
  }));
}

export function updateProfile(userId: string, data: Partial<Profile>) {
    return fetchApi<{ user: Profile }>(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
