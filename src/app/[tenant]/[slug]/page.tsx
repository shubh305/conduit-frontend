"use client";

import { use } from "react";
import { ArticlePageWrapper } from "@/features/blog/components/ArticlePageWrapper";
import { usePostLoader } from "@/features/blog/hooks/usePostLoader";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ tenant: string; slug: string }>;
}

export default function TenantPostPage({ params }: PageProps) {
  const { tenant, slug } = use(params);
  const { loading, error, data } = usePostLoader(tenant, slug);

  if (loading) return null;

  if (error || !data) {
    if (error === "Tenant not found") notFound();
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-mono tracking-widest uppercase">{error || "404 NOT FOUND"}</div>;
  }

  return <ArticlePageWrapper post={data.post} tenant={data.tenant} nextPost={data.nextPost} />;
}
