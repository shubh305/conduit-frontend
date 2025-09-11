import { notFound } from "next/navigation";
import { BlogHeader } from "@/features/blog/components/BlogHeader";
import { FeedList } from "@/features/feed/components/FeedList";
import { Metadata } from "next";
import { getTenant, getPosts } from "@/features/blog/api";
import { FeedItem } from "@/features/feed/types";
import { PublicBlogViewer } from "@/features/blog/components/PublicBlogViewer";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  try {
    const { tenant } = await getTenant(tenantSlug);
    if (!tenant) return { title: "Not Found" };
    return {
      title: tenant.name,
      description: tenant.description,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function TenantHome({ params }: PageProps) {
  const { tenant: tenantSlug } = await params;

  let tenant,
    posts = [];

  try {
    const response = await getTenant(tenantSlug);
    tenant = response.tenant;

    if (!tenant) {
      notFound();
    }

    const postsResponse = await getPosts(tenant.id, { limit: 10, status: "published" });
    posts = postsResponse.data || [];
  } catch (error) {
    console.error(error);
    notFound();
  }


  if (!tenant) {
    notFound();
  }


  const feedItems: FeedItem[] = posts.map(post => ({
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    postId: post.id,
    postSlug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    authorName: post.authorName,
    tags: post.tags,
    publishedAt: post.publishedAt,
    viewsCount: post.viewsCount,
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
  }));


  const ClassicHeader = (
    <div className="mb-12">
      <BlogHeader tenant={tenant} />
      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-noir-border">
          <span className="font-mono text-sm uppercase tracking-wider text-signal-green">● Latest Posts</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <PublicBlogViewer
        tenant={tenant}
        items={feedItems}
        classicHeader={ClassicHeader}
        fallbackFeed={<FeedList items={feedItems} blogDescription={tenant.description} blogTitle={tenant.name} />}
      />
    </main>
  );
}
