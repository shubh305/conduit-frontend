import { SearchPageContainer } from "@/features/search/components/SearchPage";
import { Metadata } from "next";
import { Suspense } from "react";
import { getTenant } from "@/features/blog/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  try {
    const { tenant } = await getTenant(tenantSlug);
    if (!tenant) return { title: "Search | Not Found" };
    return {
      title: `Search | ${tenant.name}`,
    };
  } catch {
    return { title: "Search" };
  }
}

export default async function TenantSearchPage({ params }: PageProps) {
  const { tenant: tenantSlug } = await params;
  
  // Verify tenant exists
  try {
    const { tenant } = await getTenant(tenantSlug);
    if (!tenant) notFound();
  } catch {
    notFound();
  }

  return (
    <Suspense>
        <SearchPageContainer initialTenantSlug={tenantSlug} />
    </Suspense>
  );
}
