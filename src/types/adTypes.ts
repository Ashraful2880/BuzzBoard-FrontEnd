export interface AdCampaign {
  _id: string;
  ctr: number;
  title: string;
  clicks: number;
  budget: number;
  ctaText: string;
  targetUrl: string;
  imageUrl?: string;
  createdAt: string;
  sponsorName: string;
  impressions: number;
  description?: string;
  endDate?: string | null;
  targetCategories: string[];
  status: "active" | "paused" | "completed" | "draft";
  placement:
    | "header_banner"
    | "sidebar"
    | "in_article"
    | "footer"
    | "sponsored_post";
}

export interface AdBannerSlotProps {
  category?: string;
  placement?: "in_article" | "sidebar" | "header_banner";
}
