import { FeedItem } from "../../feed/types";
import { mockFeedItems } from "./mock-feed";

export const mockFollowingItems: FeedItem[] = mockFeedItems.filter(
    item => item.tenantSlug === 'alice' || item.tenantSlug === 'design-systems'
);

export const mockForYouItems: FeedItem[] = mockFeedItems;
