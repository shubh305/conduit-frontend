export interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'tag';
  title?: string;
  name?: string;
  slug?: string;
  excerpt?: string;
  image?: string;
}

export interface SemanticResult {
  entity_id: string;
  score: number;
  title: string;
  content: string;
  source_app: string;
  matched_chunk?: string;
  metadata: {
    slug: string;
    authorName: string;
    authorUsername: string;
    authorId: string;
    tenantName: string;
    tenantSlug: string;
    tags: string[];
    status: string;
    publishedAt: string;
    featuredImage?: string;
  };
}
