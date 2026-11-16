import type { User } from "./authTypes";

export type PostCategory =
  | "Technology"
  | "Health"
  | "Lifestyle"
  | "Education"
  | "Entertainment"
  | "Business"
  | "Travel"
  | "Food"
  | "Sports"
  | "Other";

export interface PostReactions {
  love: number;
  fire: number;
  insightful: number;
  clap: number;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    url: string;
    public_id: string;
  };
  author: User;
  category: PostCategory;
  tags: string[];
  status: "draft" | "scheduled" | "published" | "archived";
  scheduledAt?: string | null;
  series?: string | null;
  seriesOrder?: number;
  aiGenerated?: boolean;
  aiAssisted?: boolean;
  aiSummary?: string;
  readingTime: number;
  isAdSafe: boolean;
  adSafetyReason?: string;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorUrl?: string;
  likes: string[] | User[];
  likesCount: number;
  reactions?: PostReactions;
  commentsCount: number;
  views: number;
  liveReaders?: number;
  engagementRate?: number;
  metaDescription?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdSafetyResult {
  isAdSafe: boolean;
  adSafetyScore: number;
  reason: string;
  flaggedCategories?: string[];
}
