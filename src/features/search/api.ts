import { fetchApi } from "@/lib/api-client";
import { Post } from "@/features/blog/types";
import { Profile } from "@/features/profile/types";
import { FeedItem } from "@/features/feed/types";


export interface Tag {
  name: string;
  count?: number;
}

export function globalSearch(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  return fetchApi<{
    results: {
      users: Profile[];
      posts: FeedItem[];
      tags: Tag[];
    };
  }>(`/search?${params.toString()}`);
}

export function searchPosts(query: string) {
  const params = new URLSearchParams();
  params.set("search", query);
  return fetchApi<{ data: Post[]; meta: Record<string, unknown> }>(`/posts?${params.toString()}`);
}

export function searchUsers(query: string) {
    const params = new URLSearchParams();
    params.set("search", query);
    return fetchApi<{ users: Profile[] }>(`/users?${params.toString()}`); 
}

export interface Suggestion {
  text: string;
  type: "post" | "user" | "tag";
  id?: string;
  url?: string;
}

export function getSuggestions(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  return fetchApi<Suggestion[]>(`/search/suggest?${params.toString()}`);
}

export function getTags() {
    return fetchApi<{ tags: string[] }>("/tags");
}
