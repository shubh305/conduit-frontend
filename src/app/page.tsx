import { mockFeedItems } from "@/features/feed/data/mock-feed";
import { FeedList } from "@/features/feed/components/FeedList";

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  
  const filteredItems = tag
    ? mockFeedItems.filter((item) => item.tags.includes(tag))
    : mockFeedItems;

  return (
    <main className="min-h-screen">
       {/* FeedList now handles the Layout/Header switching based on Theme */}
       <FeedList items={filteredItems} />
    </main>
  );
}
