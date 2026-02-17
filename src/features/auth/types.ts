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
  tenantId?: string;
  tenants?: { id: string; name: string; slug: string }[];
  tagline?: string;
  socialLinks?: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    stackoverflow?: string;
    instagram?: string;
  };
  onboardingCompleted?: boolean;
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

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}
