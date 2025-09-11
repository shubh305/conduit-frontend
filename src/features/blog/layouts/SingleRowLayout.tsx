import { BasePostCard } from "../components/base/BasePostCard";
import { LayoutProps } from "./types";

export function SingleRowLayout({ posts, tenantSlug, themeConfig }: LayoutProps) {


  
  return (
    <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide snap-x">
      {posts.map(post => (
        <div key={post.id} className="min-w-[300px] md:min-w-[350px] snap-center">
          <BasePostCard
            post={post}
            tenantSlug={tenantSlug}
            orientation="vertical"
            themeConfig={{
              ...themeConfig,
              cardStyle: "bordered",
              showExcerpt: themeConfig?.showExcerpt !== false,
            }}
          />
        </div>
      ))}
    </div>
  );
}
