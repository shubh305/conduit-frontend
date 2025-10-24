export interface Comment {
  id: string;
  text: string;
  authorId?: string; // Optional if not populated
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  replies: number;
  children?: Comment[]; // Nested replies
  isLiked?: boolean;
}
