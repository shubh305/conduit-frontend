export interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'tag';
  title?: string;
  name?: string;
  slug?: string;
  excerpt?: string;
  image?: string;
}
