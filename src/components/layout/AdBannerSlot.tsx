import {
  useGetActiveAdsQuery,
  useRecordAdClickMutation,
} from "@/features/api/buzzboardApi";
import React from "react";
import { ExternalLink } from "lucide-react";
import type { AdBannerSlotProps } from "@/types/adTypes";
import { TiltCard3D, CustomButton } from "@/components/shared";

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  placement = "in_article",
  category,
}) => {
  const { data } = useGetActiveAdsQuery({ placement, category });
  const [recordClick] = useRecordAdClickMutation();

  const ads = data?.data || [];
  const ad = ads.find((a) => a.placement === placement) || ads[0];

  if (!ad) return null;

  const handleAdClick = async () => {
    try {
      await recordClick(ad._id).unwrap();
    } catch {
      // Ignore error
    }
    window.open(ad.targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <TiltCard3D
      intensity={3}
      className="p-5 border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-slate-200/70 text-slate-700 font-semibold">
              Sponsored • {ad.sponsorName}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {ad.impressions.toLocaleString()} views
            </span>
          </div>

          <h4 className="text-base font-display font-bold text-slate-900">
            {ad.title}
          </h4>

          {ad.description && (
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {ad.description}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <CustomButton
            size="sm"
            variant="emerald"
            onClick={handleAdClick}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            {ad.ctaText || "Learn More"}
          </CustomButton>
        </div>
      </div>
    </TiltCard3D>
  );
};
