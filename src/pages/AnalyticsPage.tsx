import {
  Eye,
  Plus,
  Heart,
  BarChart3,
  Megaphone,
  ShieldCheck,
  MousePointerClick,
} from "lucide-react";
import {
  TiltCard3D,
  EmptyState,
  CustomInput,
  CustomButton,
  CustomSelect,
  SkeletonLoader,
  CustomDatePicker,
} from "@/components/shared";
import {
  useGetCreatorAnalyticsQuery,
  useCreateAdCampaignMutation,
  useGetMonetizationAnalyticsQuery,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { formatNumber } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";
import { useLocation, useNavigate } from "react-router-dom";

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAppSelector((state) => state.auth);

  const { data: creatorRes, isLoading: isCreatorLoading } =
    useGetCreatorAnalyticsQuery(undefined, { skip: !token });
  const { data: monetizationRes, isLoading: isMonLoading } =
    useGetMonetizationAnalyticsQuery(undefined, { skip: !token });
  const [createAd, { isLoading: isCreatingAd }] = useCreateAdCampaignMutation();

  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("350");
  const [sponsorName, setSponsorName] = useState("");
  const [placement, setPlacement] = useState("in_article");
  const [targetUrl, setTargetUrl] = useState("https://byshelp.com");

  const overview = creatorRes?.data?.overview;
  const monSummary = monetizationRes?.data?.summary;
  const campaigns = monetizationRes?.data?.campaigns || [];

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!title || !sponsorName || !targetUrl) return;
    await createAd({
      title,
      sponsorName,
      targetUrl,
      placement,
      budget: Number(budget) || 200,
      endDate: endDate || null,
      targetCategories: ["Technology", "Business", "All"],
    }).unwrap();
    setTitle("");
    setSponsorName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-950 flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          <span>Analytics &amp; Ad Campaigns</span>
        </h1>
      </div>

      {isCreatorLoading ? (
        <SkeletonLoader variant="kpi" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard3D intensity={5} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Article Views</span>
              <Eye className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-3xl font-display font-bold text-slate-950">
              {formatNumber(overview?.totalViews || 0)}
            </p>
            <p className="text-[11px] font-mono text-emerald-700">
              Deduplicated Unique Views
            </p>
          </TiltCard3D>

          <TiltCard3D intensity={5} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Engagement Rate</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-3xl font-display font-bold text-slate-950">
              {overview?.avgEngagementRate || 0}%
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              {overview?.totalLikes || 0} likes • {overview?.totalComments || 0}{" "}
              comments
            </p>
          </TiltCard3D>

          <TiltCard3D intensity={5} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Ad Impressions</span>
              <MousePointerClick className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-3xl font-display font-bold text-slate-950">
              {formatNumber(monSummary?.totalImpressions || 0)}
            </p>
            <p className="text-[11px] font-mono text-emerald-700">
              {monSummary?.totalClicks || 0} clicks •{" "}
              {monSummary?.averageCtr || 0}% CTR
            </p>
          </TiltCard3D>

          <TiltCard3D intensity={5} className="p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Policy Compliance</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-display font-bold text-emerald-700">
              {overview?.adSafeReadyPercentage ?? 100}%
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              Verified Monetizable Posts
            </p>
          </TiltCard3D>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-xl surface-3d p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-slate-950 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span>Active Sponsored Campaigns</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {campaigns.length} campaigns
            </span>
          </div>

          {isMonLoading ? (
            <SkeletonLoader variant="list" count={3} />
          ) : campaigns.length === 0 ? (
            <EmptyState
              title="No Ad Campaigns Yet"
              icon={<Megaphone className="w-6 h-6" />}
              description="Launch your first sponsored banner or native in-article placement using the form on the right."
            />
          ) : (
            <div className="space-y-4">
              {campaigns.map((ad) => (
                <div
                  key={ad._id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-orange-50 text-orange-700 border border-orange-200 font-semibold">
                        {ad.placement}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {ad.sponsorName}
                      </span>
                    </div>
                    <h4 className="text-sm font-display font-bold text-slate-950">
                      {ad.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500">
                      {ad.targetUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right font-mono">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {ad.impressions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500">Impr.</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-600">
                        {ad.clicks.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500">Clicks</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-700">
                        {ad.ctr}%
                      </p>
                      <p className="text-[9px] text-emerald-600">CTR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleCreateCampaign}
          className="lg:col-span-5 rounded-xl surface-3d-elevated p-6 space-y-4 h-fit"
        >
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-display font-bold text-slate-950">
              Create Sponsored Ad
            </h3>
          </div>

          <CustomInput
            required
            value={title}
            label="Campaign Headline"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deploy Fastify APIs in 60 Seconds"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput
              required
              value={sponsorName}
              label="Sponsor / Brand"
              placeholder="Madmind Digitals"
              onChange={(e) => setSponsorName(e.target.value)}
            />
            <CustomInput
              type="number"
              value={budget}
              label="Budget (USD)"
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <CustomInput
            required
            value={targetUrl}
            label="Destination URL"
            placeholder="https://byshelp.com"
            onChange={(e) => setTargetUrl(e.target.value)}
          />

          <CustomSelect
            value={placement}
            onChange={setPlacement}
            label="Ad Slot Placement"
            options={[
              { value: "in_article", label: "In-Article Native Banner" },
              { value: "sidebar", label: "Sidebar Spotlight Card" },
              { value: "header_banner", label: "Top Header Leaderboard" },
              { value: "sponsored_post", label: "Sponsored Post Feed" },
            ]}
          />

          <CustomDatePicker
            value={endDate}
            onChange={setEndDate}
            label="Campaign End Date (Optional)"
          />

          <CustomButton
            fullWidth
            type="submit"
            variant="primary"
            isLoading={isCreatingAd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Activate Campaign
          </CustomButton>
        </form>
      </div>
    </div>
  );
};
