import { notFound } from "next/navigation";
import { mockTenants, mockPosts } from "@/features/blog/data/mock-blogs";
import { BlogHeader } from "@/features/blog/components/BlogHeader";
import { FeedList } from "@/features/feed/components/FeedList";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  const tenant = mockTenants[tenantSlug];
  
  if (!tenant) return { title: "Not Found" };
  
  return {
    title: tenant.name,
    description: tenant.description,
  };
}

export default async function TenantHome({ params }: PageProps) {
  const { tenant: tenantSlug } = await params;
  const tenant = mockTenants[tenantSlug];
  
  if (!tenant) {
    notFound();
  }

  const posts = mockPosts[tenantSlug] || [];

  // Map to FeedItems
  const feedItems = posts.map(post => ({
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
    likesCount: 0,
    commentsCount: 0,
  }));

  // Classic Header Definition
  const ClassicHeader = (
    <div className="mb-12">
      <BlogHeader tenant={tenant} />
      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-4xl">
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-noir-border">
          <span className="font-mono text-sm uppercase tracking-wider text-signal-green">
            ● Latest Posts
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
       <FeedList items={feedItems} classicHeader={ClassicHeader} blogDescription={tenant.description} blogTitle={tenant.name} />
    </main>
  );
}
