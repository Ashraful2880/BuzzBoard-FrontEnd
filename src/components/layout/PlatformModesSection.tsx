import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Edit3,
  Layers,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { CustomButton } from "@/components/shared";

interface PlatformMode {
  id: "reader" | "studio" | "series" | "analytics";
  name: string;
  shortLabel: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  route: string;
  ctaLabel: string;
  icon: React.ReactNode;
}

const PLATFORM_MODES: PlatformMode[] = [
  {
    id: "reader",
    name: "Reader Mode",
    shortLabel: "Focused Reading",
    badge: "AI-Assisted",
    tagline: "Distraction-free reading with AI summaries & bilingual translation",
    description:
      "Dive into long-form engineering notes with instant TL;DR summaries, interactive Q&A on article content, and one-click bilingual translation.",
    highlights: [
      "Instant AI-generated article summaries for faster technical scanning",
      "Ask contextual questions directly against any published post",
      "Bookmark articles to your personal Reading List",
    ],
    route: "/bookmarks",
    ctaLabel: "Open Reading List",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "studio",
    name: "Editorial Studio",
    shortLabel: "AI Writing",
    badge: "Co-Pilot",
    tagline: "AI co-pilot drafting, automated SEO & brand-safety checks",
    description:
      "Draft technical articles faster with tone-aware AI assistance, automated SEO metadata extraction, and pre-publish brand-safety moderation.",
    highlights: [
      "Generate outlines, drafts, and technical refinements in-editor",
      "Auto-generate SEO excerpts, meta descriptions, and tags",
      "Verify ad-safe & brand-safe compliance before publishing",
    ],
    route: "/studio",
    ctaLabel: "Launch Studio",
    icon: <Edit3 className="w-4 h-4" />,
  },
  {
    id: "series",
    name: "Series Mode",
    shortLabel: "Multi-Part Guides",
    badge: "Structured",
    tagline: "Organize deep-dive articles into multi-part engineering guides",
    description:
      "Turn standalone posts into cohesive multi-part courses and architectural guides so readers can follow complex topics step by step.",
    highlights: [
      "Group related articles into ordered, topic-focused series",
      "Track series status and category organization at a glance",
      "Keep readers engaged across multi-chapter deep dives",
    ],
    route: "/series",
    ctaLabel: "Browse Series",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "analytics",
    name: "Creator Analytics",
    shortLabel: "Growth & Ads",
    badge: "Live Telemetry",
    tagline: "Real-time readership telemetry & direct sponsorship campaigns",
    description:
      "Measure how your technical writing performs and manage direct sponsor placements with transparent impression and click tracking.",
    highlights: [
      "Track views, likes, comments, and active reader engagement",
      "Monitor sponsorship campaign budgets, impressions, and CTR",
      "Create targeted in-article and sidebar ad placements",
    ],
    route: "/analytics",
    ctaLabel: "View Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

export const PlatformModesSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeModeId, setActiveModeId] =
    useState<PlatformMode["id"]>("reader");

  const activeMode =
    PLATFORM_MODES.find((m) => m.id === activeModeId) || PLATFORM_MODES[0];

  return (
    <section className="rounded-xl surface-3d p-6 sm:p-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-semibold text-orange-700">
            <Sparkles className="w-3 h-3" />
            Platform Modes
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
            Choose Your Publishing Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Switch seamlessly between focused reading, AI-assisted authoring,
            structured series, and creator monetization.
          </p>
        </div>
      </div>

      {/* Mode Selector + Active Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 4 Mode Selector Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {PLATFORM_MODES.map((mode) => {
            const isActive = mode.id === activeMode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveModeId(mode.id)}
                className={cn(
                  "text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                  isActive
                    ? "bg-orange-50/70 border-orange-300 text-slate-950"
                    : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                      isActive
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "bg-white border-slate-200 text-slate-600",
                    )}
                  >
                    {mode.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-display font-bold leading-tight truncate">
                      {mode.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {mode.shortLabel}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold shrink-0 border",
                    isActive
                      ? "bg-white border-orange-200 text-orange-700"
                      : "bg-white border-slate-200 text-slate-500",
                  )}
                >
                  {mode.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Active Mode Detail Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full rounded-xl surface-3d-elevated bg-architectural-grid p-6 sm:p-7 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                    {activeMode.icon}
                    <span>{activeMode.name}</span>
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-orange-600 font-semibold">
                    {activeMode.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-950">
                    {activeMode.tagline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeMode.description}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-1">
                  {activeMode.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Ready to switch into {activeMode.name}?
                </span>
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(activeMode.route)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {activeMode.ctaLabel}
                </CustomButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
