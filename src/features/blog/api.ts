import { fetchApi } from "@/lib/api-client";
import { Post, Tenant } from "./types";

export async function getTenant(slug: string) {
  const res = await fetchApi<Tenant & { _id?: string } | null>(`/tenants/${slug}`);
  if (!res) return { tenant: null };
  const tenant = {
      ...res,
      id: res.id || res._id || ""
  };
  return { tenant };
}

export function createTenant(data: { name: string; slug: string; theme: string; logo?: string }) {
  return fetchApi<{ tenant: Tenant }>("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTenant(id: string) {
  return fetchApi<{ success: boolean }>(`/tenants/${id}`, {
    method: "DELETE",
  });
}

export function getMyTenants() {
  return fetchApi<Tenant[]>("/tenants/me").then(res => (res ? res.map((t: Tenant & { _id?: string }) => ({ ...t, id: t.id || t._id || "" })) : []));
}

export function getUserTenants(userId: string) {
  return fetchApi<Tenant[]>(`/tenants/user/${userId}`).then(res => (res ? res.map((t: Tenant & { _id?: string }) => ({ ...t, id: t.id || t._id || "" })) : []));
}

type RawPost = Post & { _id?: string };

const mapPost = (p: RawPost | null): Post | null => {
  if (!p) return null;
  return {
    ...p,
    id: p.id || p._id || "",
    isLiked: p.isLiked || false,
  };
};

export function getPosts(tenantId: string, params: { page?: number; limit?: number; status?: string; author?: string } = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.author) searchParams.set("author", params.author);

  return fetchApi<{ data: RawPost[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`/posts?${searchParams.toString()}`, {
    tenantId,
    headers: { "x-tenant-id": tenantId },
    cache: "no-store"
  }).then(res => ({
    ...res,
    data: res.data ? res.data.map(p => mapPost(p) as Post).filter(Boolean) : []
  }));
}

export function getPost(slug: string, tenantId?: string) {
  return fetchApi<RawPost | null>(`/posts/${slug}`, {
    tenantId,
    cache: "no-store"
  }).then(p => ({ post: mapPost(p) }));
} 

export function createPost(data: Partial<Post>, tenantId: string) {
  return fetchApi<RawPost>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
    tenantId
  }).then(p => ({ post: mapPost(p) }));
}

export function updatePost(id: string, data: Partial<Post>, tenantId: string) {
  return fetchApi<RawPost>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    tenantId
  }).then(p => ({ post: mapPost(p) }));
}
export function deletePost(id: string, tenantId: string) {
  return fetchApi(`/posts/${id}`, {
    method: "DELETE",
    tenantId,
  });
}
export async function schedulePost(postId: string, scheduledAt: string, tenantId?: string) {
  return fetchApi(`/posts/${postId}/schedule`, {
    method: "POST",
    body: JSON.stringify({ scheduledAt }),
    tenantId,
  });
}

export function restorePost(id: string, tenantId?: string) {
  return fetchApi(`/posts/${id}/restore`, {
    method: "POST",
    tenantId,
  });
}
