import {
  Send,
  Tags,
  Wand2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  TiltCard3D,
  CustomInput,
  CustomButton,
  CustomSelect,
  CustomTextarea,
  CustomDatePicker,
} from "@/components/shared";
import {
  useCreatePostMutation,
  useGetSeriesListQuery,
  useGenerateSEOMutation,
  useAssistWritingMutation,
  useModerateContentMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AdSafetyResult } from "@/types/postTypes";
import { useAppSelector } from "@/app/hooks";
import { AI_ACTIONS, AI_TONES, CATEGORY_OPTIONS } from "@/utils/AllOptions";

export const StudioPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [category, setCategory] = useState("Technology");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("react, nodejs, architecture");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("technical");
  const [aiAction, setAiAction] = useState("outline");
  const [publishMessage, setPublishMessage] = useState("");
  const [safetyResult, setSafetyResult] = useState<AdSafetyResult | null>(null);

  const { data: seriesRes } = useGetSeriesListQuery();
  const [createPost, { isLoading: isPublishing }] = useCreatePostMutation();
  const [generateSEO, { isLoading: isGeneratingSEO }] =
    useGenerateSEOMutation();
  const [assistWriting, { isLoading: isAssisting }] =
    useAssistWritingMutation();
  const [moderateContent, { isLoading: isModerating }] =
    useModerateContentMutation();

  const seriesOptions = [
    { value: "", label: "Standalone Article (No Series)" },
    ...(seriesRes?.data || []).map((s) => ({
      value: s._id,
      label: s.title,
      badge: s.status,
    })),
  ];

  const handleRunCoPilot = async () => {
    const res = await assistWriting({
      prompt: aiPrompt || title || "Building Scalable SaaS Architecture",
      content,
      action: aiAction,
      tone: aiTone,
    }).unwrap();

    if (res.data?.result) {
      setContent((prev) =>
        prev ? `${prev}\n\n${res.data.result}` : res.data.result,
      );
    }
  };

  const handleAutoSEO = async () => {
    if (!title && !content) return;
    const res = await generateSEO({ title, content, category }).unwrap();
    if (res.data) {
      if (!title && res.data.suggestedTitles?.[0]) {
        setTitle(res.data.suggestedTitles[0]);
      }
      if (res.data.excerpt) setExcerpt(res.data.excerpt);
      if (res.data.metaDescription)
        setMetaDescription(res.data.metaDescription);
      if (res.data.tags?.length) setTags(res.data.tags.join(", "));
    }
  };

  const handleBrandSafetyCheck = async () => {
    const res = await moderateContent({ title, content }).unwrap();
    if (res.data) {
      setSafetyResult(res.data);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const res = await createPost({
      title,
      content,
      category,
      tags,
      excerpt,
      metaDescription,
      status: scheduledAt ? "scheduled" : "published",
      scheduledAt: scheduledAt || null,
      series: selectedSeries || null,
      aiAssisted: true,
    }).unwrap();

    if (res.success && res.data) {
      setPublishMessage(
        scheduledAt
          ? "Article scheduled successfully!"
          : "Article published live to BuzzBoard!",
      );
      setTimeout(() => {
        navigate(`/posts/${res.data.slug || res.data._id}`);
      }, 900);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-950 flex items-center gap-2.5">
          <Wand2 className="w-5 h-5 text-orange-600" />
          <span>Write, Optimize &amp; Schedule Articles</span>
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <CustomButton
            size="sm"
            variant="secondary"
            onClick={handleAutoSEO}
            isLoading={isGeneratingSEO}
            leftIcon={<Tags className="w-3.5 h-3.5 text-orange-600" />}
          >
            Generate SEO Metadata
          </CustomButton>
          <CustomButton
            size="sm"
            variant="outline"
            isLoading={isModerating}
            onClick={handleBrandSafetyCheck}
            leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Check Policy Compliance
          </CustomButton>
        </div>
      </div>

      {publishMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{publishMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handlePublish}
          className="lg:col-span-8 rounded-xl surface-3d p-6 sm:p-8 space-y-5"
        >
          <CustomInput
            required
            value={title}
            label="Article Headline"
            placeholder="Enter your headline..."
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
            <CustomSelect
              value={selectedSeries}
              options={seriesOptions}
              onChange={setSelectedSeries}
              label="Assign to Series (Optional)"
            />
          </div>

          <CustomTextarea
            required
            rows={12}
            showCount
            value={content}
            maxLength={50000}
            label="Article Content (Markdown Supported)"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here, or use the Writing Assistant on the right to draft an outline..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomInput
              value={tags}
              label="Tags (Comma Separated)"
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, typescript, postgresql, prisma"
            />
            <CustomDatePicker
              value={scheduledAt}
              onChange={setScheduledAt}
              label="Schedule Publish Date (Optional)"
              helperText="Leave empty to publish immediately"
            />
          </div>

          <CustomTextarea
            label="SEO Meta Description (<= 160 chars)"
            rows={2}
            showCount
            maxLength={160}
            value={metaDescription}
            placeholder="Concise summary for search engines..."
            onChange={(e) => setMetaDescription(e.target.value)}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <CustomButton
              size="lg"
              type="submit"
              variant="primary"
              isLoading={isPublishing}
              rightIcon={<Send className="w-4 h-4" />}
            >
              {scheduledAt ? "Schedule Article" : "Publish Article"}
            </CustomButton>
          </div>
        </form>

        <div className="lg:col-span-4 space-y-6">
          <TiltCard3D intensity={4} elevated className="p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-slate-950">
                  Writing Assistant
                </h3>
                <p className="text-[11px] text-slate-500">
                  Outline, polish &amp; expand drafts
                </p>
              </div>
            </div>

            <CustomSelect
              label="Action"
              value={aiAction}
              options={AI_ACTIONS}
              onChange={setAiAction}
            />

            <CustomSelect
              value={aiTone}
              options={AI_TONES}
              onChange={setAiTone}
              label="Editorial Tone"
            />

            <CustomInput
              value={aiPrompt}
              label="Topic or Instruction"
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Explain Redis Pub/Sub scaling..."
            />

            <CustomButton
              fullWidth
              variant="emerald"
              isLoading={isAssisting}
              onClick={handleRunCoPilot}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Insert into Draft
            </CustomButton>
          </TiltCard3D>

          <div className="rounded-2xl surface-3d p-6 space-y-3">
            <h4 className="text-sm font-display font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AdSense Policy Check</span>
            </h4>

            {safetyResult ? (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  safetyResult.isAdSafe
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center justify-between font-mono font-bold">
                  <span>
                    {safetyResult.isAdSafe
                      ? "STATUS: COMPLIANT"
                      : "STATUS: FLAGGED"}
                  </span>
                  <span>Score: {safetyResult.adSafetyScore}/100</span>
                </div>
                <p>{safetyResult.reason}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                Run <strong>Check Policy Compliance</strong> above to verify
                your article meets ad-network guidelines before publishing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
