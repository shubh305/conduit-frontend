import { getGlobalFeed } from "@/features/feed/api";
import { FeedList } from "@/features/feed/components/FeedList";
import { FEED_CATEGORIES } from "@/features/feed/constants";
import { FeedItem } from "@/features/feed/types";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { category } = await searchParams;

  let tag: string | undefined;
  if (category && category !== "all") {
    const catDef = FEED_CATEGORIES.find(c => c.id === category);
    if (catDef && catDef.tags.length > 0) {
      tag = catDef.tags[0];
    }
  }

  let initialItems: FeedItem[] = [];
  try {
    const response = await getGlobalFeed({ tag, limit: 12 });
    initialItems = response.data || [];
  } catch (error) {
    console.error("Failed to fetch feed", error);
  }

  return (
    <main className="min-h-screen">
      <FeedList items={initialItems} />
    </main>
  );
}
