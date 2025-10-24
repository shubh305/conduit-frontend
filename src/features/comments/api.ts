import { fetchApi } from "@/lib/api-client";
import { Comment } from "./types";

export function getComments(postId: string, params: { page?: number } = {}, tenantId?: string) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());

  return fetchApi<{ comments: Comment[]; meta: { total: number; page: number; limit: number } }>(`/posts/${postId}/comments?${searchParams.toString()}`, { tenantId });
}

export function createComment(postId: string, data: { text: string; parentId?: string }, tenantId?: string) {
  return fetchApi<{ comment: Comment }>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
    tenantId,
  });
}

export function likeComment(commentId: string, tenantId?: string) {
  return fetchApi<{ isLiked: true }>(`/comments/${commentId}/like`, {
    method: "POST",
    tenantId,
  });
}

export function unlikeComment(commentId: string, tenantId?: string) {
  return fetchApi<{ isLiked: false }>(`/comments/${commentId}/unlike`, {
    method: "POST",
    tenantId,
  });
}
