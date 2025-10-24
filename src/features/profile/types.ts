export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  image?: string; 
  avatar?: string;
  location?: string;
  website?: string;
  joinedAt?: string;
  isFollowing?: boolean;
  isVerified?: boolean;
  isPro?: boolean;
  tagline?: string;
  createdAt?: string;
  socialLinks?: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    stackoverflow?: string;
    instagram?: string;
  };
}

export interface ProfileResponse {
  user: Profile;
}
