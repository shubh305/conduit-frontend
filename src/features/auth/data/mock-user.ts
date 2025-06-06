import { User } from "../types";

export const mockUser: User = {
  id: "u1",
  email: "alice@octane.com",
  username: "alice",
  displayName: "Alice Chen",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
  role: "owner",
  bio: "Systems Engineer & Rustacean. Building the future of decentralized publishing at OctaneBrew. Obsessed with zero-cost abstractions and neon lights.",
  location: "Neo-Tokyo, Digital Plane",
  website: "https://alice.dev",
  twitterHandle: "alice_builds",
  githubHandle: "alice-chen",
  joinedAt: "2024-06-15T00:00:00Z",
  stats: {
    followers: 12400,
    following: 420,
    posts: 42,
  },
  isVerified: true,
  isPro: true,
};
// Recommended users for the sidebar "Signal Sources"
export const mockRecommendedUsers: User[] = [
  {
    id: "u2",
    username: "sarah_edo",
    displayName: "Sarah Drasner",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    role: "author",
    bio: "Engineering Manager",
    joinedAt: "2024-01-01T00:00:00Z",
    stats: { followers: 15000, following: 200, posts: 100 },
    isVerified: true
  },
  {
    id: "u3",
    username: "dan_abramov",
    displayName: "Dan Abramov",
    email: "dan@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80",
    role: "author",
    bio: "React Core Team",
    joinedAt: "2024-01-02T00:00:00Z",
    stats: { followers: 25000, following: 100, posts: 50 },
    isVerified: true
  },
  {
    id: "u4",
    username: "rich_harris",
    displayName: "Rich Harris",
    email: "rich@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&q=80",
    role: "author",
    bio: "Creator of Svelte",
    joinedAt: "2024-01-03T00:00:00Z",
    stats: { followers: 18000, following: 150, posts: 80 },
    isVerified: true
  }
];
