import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  if (url.startsWith("http")) return url;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;

  return `${storageUrl}${cleanPath}`;
}

export function getPostUrl(
  item: { tenantSlug?: string; authorUsername?: string; postSlug: string } | undefined | null,
): string {
  if (!item) return "/";
  if (item.tenantSlug === "default" && item.authorUsername) {
    return `/u/${item.authorUsername}/${item.postSlug}`;
  }
  const slug = item.tenantSlug || "public";
  const postSlug = item.postSlug || "undefined";
  return `/${slug}/${postSlug}`;
}
