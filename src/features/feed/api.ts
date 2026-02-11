import { fetchApi } from "@/lib/api-client";
import { FeedResponse } from "./types";

interface FeedParams {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string;
  ids?: string[];
  type?: "global" | "following";
}

export function getGlobalFeed(params: FeedParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.author) searchParams.set("author", params.author);
  if (params.type) searchParams.set("type", params.type);
  if (params.ids) {
    params.ids.forEach(id => searchParams.append("ids", id));
  }

  const queryString = searchParams.toString();
  return fetchApi<FeedResponse>(`/feed?${queryString}`);
}

export function getPosts(params: FeedParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.author) searchParams.set("author", params.author);
  if (params.ids) {
    params.ids.forEach(id => searchParams.append("ids", id));
  }

  const queryString = searchParams.toString();
  return fetchApi<FeedResponse>(`/posts?${queryString}`);
}

export function likePost(postId: string, tenantId?: string) {
  return fetchApi<{ isLiked: boolean }>(`/posts/${postId}/like`, { method: "POST", tenantId });
}

export function unlikePost(postId: string, tenantId?: string) {
  return fetchApi<{ isLiked: boolean }>(`/posts/${postId}/unlike`, { method: "POST", tenantId });
}
