import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  if (url.startsWith("http")) {
    if (url.includes("/conduit-uploads/") && storageUrl && !url.includes(storageUrl)) {
      try {
        const path = url.split("/conduit-uploads/")[1];
        return `${storageUrl}/conduit-uploads/${path}`;
      } catch {
        return url;
      }
    }
    return url;
  }

  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${storageUrl}${cleanPath}`;
}

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "octanebrew.dev";

export function getRootDomain() {
  if (typeof window === "undefined") return ROOT_DOMAIN;
  const host = window.location.host;

  if (host.includes("localhost")) {
    const port = host.split(":")[1] || "3000";
    return `localhost:${port}`;
  }

  return ROOT_DOMAIN;
}

/**
 * Returns true if the current hostname matches the root platform domain.
 * On the server, we default to false
 */
export function isRootSite() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;

  return hostname === "localhost" || hostname === ROOT_DOMAIN;
}

export function getRootUrl() {
  if (typeof window === "undefined") return `https://${ROOT_DOMAIN}`;
  const protocol = window.location.protocol;
  const root = getRootDomain();
  return `${protocol}//${root}/`;
}

export function getBlogHomeUrl(tenantSlug: string | undefined): string {
  if (!tenantSlug || tenantSlug === "default" || tenantSlug === "public") return "/";

  if (typeof window === "undefined") return `/${tenantSlug}`;

  const host = window.location.host;
  const protocol = window.location.protocol;
  const root = getRootDomain();

  const parts = host.split(".");
  const currentSubdomain = host.includes("localhost")
    ? host !== "localhost:3000"
      ? parts[0]
      : null
    : parts.length > 2
      ? parts[0]
      : null;

  if (currentSubdomain === tenantSlug) return "/";

  const baseUrl = `${protocol}//${tenantSlug}.${root}`;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const rt = localStorage.getItem("refreshToken");
      return `${baseUrl}?token=${token}${rt ? `&refreshToken=${rt}` : ""}`;
    }
  }

  return baseUrl;
}

export function getPostUrl(
  item: { tenantSlug?: string; authorUsername?: string; postSlug: string } | undefined | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _currentTenantSlug?: string,
): string {
  if (!item) return "/";

  if (item.tenantSlug === "default" && item.authorUsername) {
    if (typeof window === "undefined") return `/u/${item.authorUsername}/${item.postSlug}`;
    const root = getRootDomain();
    return `${window.location.protocol}//${root}/u/${item.authorUsername}/${item.postSlug}`;
  }

  const slug = item.tenantSlug || "public";
  const postSlug = item.postSlug || "undefined";

  if (typeof window === "undefined") return `/${slug}/${postSlug}`;

  const host = window.location.host;
  const protocol = window.location.protocol;
  const root = getRootDomain();

  const parts = host.split(".");
  const currentSubdomain = host.includes("localhost")
    ? host !== "localhost:3000"
      ? parts[0]
      : null
    : parts.length > 2
      ? parts[0]
      : null;

  if (currentSubdomain === slug) {
    return `/${postSlug}`;
  }

  const baseUrl = `${protocol}//${slug}.${root}/${postSlug}`;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const rt = localStorage.getItem("refreshToken");
      return `${baseUrl}?token=${token}${rt ? `&refreshToken=${rt}` : ""}`;
    }
  }

  return baseUrl;
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
