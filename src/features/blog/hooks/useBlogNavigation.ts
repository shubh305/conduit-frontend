"use client";

import { useRouter } from "next/navigation";
import { getBlogHomeUrl } from "@/lib/utils";

export function useBlogNavigation(tenantSlug: string | undefined) {
  const router = useRouter();

  const navigateToBlogHome = () => {
    const url = getBlogHomeUrl(tenantSlug);
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  return { navigateToBlogHome };
}
