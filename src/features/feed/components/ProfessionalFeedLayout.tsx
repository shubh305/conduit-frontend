import { FeedItem } from "../types";
import { ThemePage } from "@/components/theme";
import { getPostUrl, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostActions } from "@/features/blog/components/base/PostCardParts";
import { ArrowRight } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

interface ProfessionalFeedLayoutProps {
  items: FeedItem[];
  blogTitle?: string;
  blogDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  loadMoreText: string;
}

export function ProfessionalFeedLayout({
  items,
  blogTitle,
  blogDescription,
  hasMore,
  onLoadMore,
  isLoadingMore,
  loadMoreText,
}: ProfessionalFeedLayoutProps) {
  const mounted = useMounted();
  const featured = items[0];
  const listItems = items.slice(1);

  const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions) => {
    if (!mounted) return "";
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <ThemePage className="min-h-screen bg-bg-primary text-foreground pb-24">
      <main className="max-w-screen-xl mx-auto w-full px-6 md:px-12 py-8 md:py-12 flex flex-col gap-10">
        {/* 1. Minimal Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-noir-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">
              {blogTitle || "The Conduit"}
            </h1>
          </div>
          <p className="text-sm md:text-base text-foreground-muted font-sans max-w-lg leading-relaxed text-right">
            {blogDescription || "Curated insights on engineering, design, and culture."}
          </p>
        </header>

        {/* 2. Featured Hero Story */}
        {featured && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group cursor-pointer">
            {/* Image (Right on Desktop for asymmetrical balance, or Left?) Let's go Left for standard editorial */}
            <div className="lg:col-span-8 relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-sm">
              <Link href={getPostUrl(featured)}>
                {featured.featuredImage ? (
                  <Image
                    src={getMediaUrl(featured.featuredImage) || ""}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-panel border border-noir-border flex items-center justify-center">
                    <span className="text-foreground-subtle font-serif italic text-2xl">Editorial Feature</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Content */}
            <div className="lg:col-span-4 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-accent uppercase">
                <span>Feature Story</span>
                <div className="w-12 h-[1px] bg-accent/30" />
              </div>

              <Link href={getPostUrl(featured)}>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
              </Link>

              <p className="text-foreground-muted leading-relaxed text-lg line-clamp-3">{featured.excerpt}</p>

              <div className="mt-4 pt-4 border-t border-noir-border flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">{featured.authorName}</div>
                <div className="text-sm text-foreground-subtle">{formatDate(featured.publishedAt)}</div>
              </div>
            </div>
          </section>
        )}

        {/* 3. The Feed List (Editorial Borders) */}
        {items.length > 0 ? (
          <section className="flex flex-col">
            {listItems.map(item => (
              <article
                key={item.postId}
                className="mb-5 p-5 group grid grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px] xl:grid-cols-[160px_1fr_240px] gap-8 py-8 border-t border-border-primary first:border-none items-start"
              >
                {/* Meta (Left Column - ONLY visible on XL) */}
                <div className="hidden xl:flex flex-col gap-2 pt-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">
                    {item.tags[0] || "Article"}
                  </span>
                  <span className="text-sm text-foreground-subtle font-serif italic">
                    {formatDate(item.publishedAt, { month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Content (Middle) */}
                <div className="flex flex-col gap-3">
                  {/* Mobile/Tablet Meta (Visible until XL layout takes over) */}
                  <div className="flex xl:hidden items-center gap-3 text-xs mb-2">
                    <span className="font-bold text-accent uppercase">{item.tags[0]}</span>
                    <span className="text-foreground-subtle">•</span>
                    <span className="text-foreground-subtle">{formatDate(item.publishedAt)}</span>
                  </div>

                  <Link href={getPostUrl(item)}>
                    <h3 className="text-2xl font-serif font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-foreground-muted leading-relaxed line-clamp-2 md:line-clamp-3">{item.excerpt}</p>

                  <div className="mt-2 flex items-center gap-4">
                    <Link
                      href={getPostUrl(item)}
                      className="text-sm font-bold text-foreground flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Read Story <ArrowRight size={14} className="text-accent" />
                    </Link>
                    <div className="flex-1" />
                    <PostActions data={item} className="scale-90 origin-right border-border-primary/50" />
                  </div>
                </div>

                {/* Image (Right) */}
                <div className="hidden md:block pl-4 xl:pl-0">
                  <Link
                    href={getPostUrl(item)}
                    className="block relative aspect-[3/2] w-full max-w-[280px] ml-auto rounded-sm overflow-hidden bg-bg-panel border border-border-primary shadow-sm hover:shadow-md transition-all"
                  >
                    {item.featuredImage && (
                      <Image
                        src={getMediaUrl(item.featuredImage) || ""}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    )}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="py-20 text-center text-[#9E9E9E] font-sans text-sm uppercase tracking-widest">
            No posts found.
          </div>
        )}

        {/* 4. Load More */}
        {hasMore && (
          <div className="flex justify-center pt-8 border-t border-noir-border">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-bg-panel border border-border-primary text-foreground font-sans font-bold text-sm uppercase tracking-widest hover:border-accent hover:text-accent transition-all disabled:opacity-50"
            >
              {isLoadingMore ? "Loading Entries..." : loadMoreText || "Load More Stories"}
            </button>
          </div>
        )}
      </main>
    </ThemePage>
  );
}
