export const FEED_CATEGORIES = [
  { id: 'all', label: 'ALL', tags: [] },
  { id: 'engineering', label: 'ENGINEERING', tags: ['engineering', 'rust', 'devops', 'cloud', 'kubernetes', 'wasm'] },
  { id: 'systems', label: 'SYSTEMS', tags: ['systems', 'performance', 'distributed-systems', 'cli'] },
  { id: 'design', label: 'DESIGN', tags: ['design', 'ui/ux', 'minimalism', 'noir'] },
  { id: 'culture', label: 'CULTURE', tags: ['culture', 'philosophy', 'remote-work'] },
  { id: 'announcements', label: 'ANNOUNCEMENTS', tags: ['announcements', 'news', 'update'] },
  { id: 'ai-agents', label: 'AI AGENTS', tags: ['ai', 'agents', 'llm'] },
  { id: 'web3', label: 'WEB3 & DAO', tags: ['dao', 'governance', 'web3', 'crypto'] },
];

export type FeedCategory = typeof FEED_CATEGORIES[number];
