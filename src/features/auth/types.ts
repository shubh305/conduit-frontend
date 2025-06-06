export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: "owner" | "admin" | "author" | "reader";
  bio?: string;
  location?: string;
  website?: string;
  twitterHandle?: string;
  githubHandle?: string;
  joinedAt?: string;
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
  isVerified?: boolean;
  isPro?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
