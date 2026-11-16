export interface AdCampaign {
  _id: string;
  title: string;
  sponsorName: string;
  targetUrl: string;
  imageUrl?: string;
  description?: string;
  ctaText: string;
  placement: "header_banner" | "sidebar" | "in_article" | "footer" | "sponsored_post";
  targetCategories: string[];
  status: "active" | "paused" | "completed" | "draft";
  impressions: number;
  clicks: number;
  ctr: number;
  budget: number;
  endDate?: string | null;
  createdAt: string;
}

export interface AdBannerSlotProps {
  placement?: "in_article" | "sidebar" | "header_banner";
  category?: string;
}
