import type { User } from "./authTypes";

export type PostCategory =
  | "Food"
  | "Health"
  | "Other"
  | "Travel"
  | "Sports"
  | "Business"
  | "Technology"
  | "Lifestyle"
  | "Education"
  | "Entertainment";

export interface PostReactions {
  love: number;
  fire: number;
  clap: number;
  insightful: number;
}

export interface Post {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    url: string;
    public_id: string;
  };
  author: User;
  tags: string[];
  views: number;
  isAdSafe: boolean;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  likesCount: number;
  readingTime: number;
  sponsorUrl?: string;
  aiAssisted?: boolean;
  seriesOrder?: number;
  sponsorName?: string;
  liveReaders?: number;
  aiGenerated?: boolean;
  isSponsored?: boolean;
  commentsCount: number;
  canonicalUrl?: string;
  category: PostCategory;
  series?: string | null;
  adSafetyReason?: string;
  engagementRate?: number;
  likes: string[] | User[];
  metaDescription?: string;
  reactions?: PostReactions;
  scheduledAt?: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
}

export interface AdSafetyResult {
  reason: string;
  isAdSafe: boolean;
  adSafetyScore: number;
  flaggedCategories?: string[];
}
