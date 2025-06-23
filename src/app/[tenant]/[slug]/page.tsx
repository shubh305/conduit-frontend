import { notFound } from "next/navigation";
import { mockTenants, mockPosts } from "@/features/blog/data/mock-blogs";
import { Metadata } from "next";
import { ArticlePageWrapper } from "@/features/blog/components/ArticlePageWrapper";

interface PageProps {
  params: Promise<{ tenant: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug, slug } = await params;
  const posts = mockPosts[tenantSlug] || [];
  const post = posts.find(p => p.slug === slug);
  const tenant = mockTenants[tenantSlug];
  
  if (!post || !tenant) return { title: "Not Found" };
  
  return {
    title: `${post.title} | ${tenant.name}`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { tenant: tenantSlug, slug } = await params;
  const tenant = mockTenants[tenantSlug];
  
  if (!tenant) notFound();
  
  const posts = mockPosts[tenantSlug] || [];
  const post = posts.find(p => p.slug === slug);
  
  if (!post) notFound();

  const feedItemPost = {
    ...post,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    postId: post.id,
    postSlug: post.slug,
    likesCount: 0,
    commentsCount: 0,
  };

  return <ArticlePageWrapper post={feedItemPost} tenant={tenant} />;
}
