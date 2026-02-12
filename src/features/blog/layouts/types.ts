import { Post } from "@/features/blog/types";

export interface LayoutProps {
  posts: Post[];
  tenantSlug: string;
  themeConfig?: {
    fontFamily?: "sans" | "serif" | "mono";
    showBio?: boolean;
    showreadTime?: boolean;
    showDate?: boolean;
    showExcerpt?: boolean;
    showTags?: boolean;
    cardStyle?: "minimal" | "bordered" | "flat";
  };
  showHero?: boolean;
  density?: string;
  currentTenantSlug?: string;
}
