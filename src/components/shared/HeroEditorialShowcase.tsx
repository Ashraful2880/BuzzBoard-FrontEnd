import {
  Tags,
  Sparkles,
  Languages,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  {
    id: "seo",
    label: "AI SEO & Outline",
    badge: "98 / 100 Score",
    icon: <Tags className="w-3.5 h-3.5 text-orange-600" />,
    title: "Multi-Tenant SaaS with PostgreSQL RLS",
    lines: [
      { label: "Meta Description", value: "Optimized (152 chars)", ok: true },
      {
        label: "Semantic Tags",
        value: "#postgres · #saas · #security",
        ok: true,
      },
      { label: "Brand Safety", value: "Ad-Safe Verified", ok: true },
    ],
  },
  {
    id: "reader",
    label: "Bilingual & TL;DR",
    badge: "EN ↔ BN Ready",
    icon: <Languages className="w-3.5 h-3.5 text-orange-600" />,
    title: "Instant Summary & Contextual Q&A",
    lines: [
      { label: "AI Summary", value: "3 key takeaways extracted", ok: true },
      { label: "Translation", value: "Bangla & English synced", ok: true },
      { label: "Reader Q&A", value: "Interactive context active", ok: true },
    ],
  },
  {
    id: "telemetry",
    label: "Live Sponsorships",
    badge: "+142% CTR",
    icon: <TrendingUp className="w-3.5 h-3.5 text-orange-600" />,
    title: "Real-Time Creator & Ad Telemetry",
    lines: [
      { label: "Impressions", value: "18.4k this week", ok: true },
      { label: "Active Readers", value: "64 reading now", ok: true },
      { label: "Sponsor Slot", value: "In-Article · Active", ok: true },
    ],
  },
];

const BAR_HEIGHTS = [38, 62, 48, 82, 68, 94, 76];

export const HeroEditorialShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const current = STAGES[activeIdx];

  return (
    <div className="relative sm:py-2">
      {/* Floating Top-Right Metric Badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-slate-800 absolute -top-2 right-4 z-20"
      >
        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
        <span>AI Co-Pilot Active</span>
      </motion.div>

      {/* Main Animated Workspace Card */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_36px_-14px_rgba(15,23,42,0.12)] p-5 space-y-4 overflow-hidden">
        {/* Window Top Chrome */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
            <span className="ml-2 text-[11px] font-mono text-slate-400">
              buzzboard-studio.mdx
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-[10px] font-mono font-semibold text-orange-700">
            {current.badge}
          </span>
        </div>

        {/* Stage Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
          {STAGES.map((stage, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "relative py-1.5 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer truncate",
                  isActive
                    ? "text-slate-950"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroStagePill"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-white border border-slate-200/80 shadow-2xs"
                  />
                )}
                <span className="relative z-10">{stage.label}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Stage Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="space-y-3"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/70 flex items-center justify-center shrink-0">
                {current.icon}
              </div>
              <p className="text-xs sm:text-sm font-display font-bold text-slate-900 truncate">
                {current.title}
              </p>
            </div>

            <div className="space-y-2">
              {current.lines.map((line, i) => (
                <motion.div
                  key={line.label}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -6 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/90 border border-slate-200/70 text-xs"
                >
                  <span className="text-slate-500 font-medium">
                    {line.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {line.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animated Mini Telemetry Bars */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-3">
          <div className="flex items-end gap-1.5 h-9">
            {BAR_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${h * 0.65}%`, `${h}%`, `${h * 0.75}%`] }}
                transition={{
                  duration: 2.4,
                  delay: i * 0.14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn(
                  "w-2 rounded-t-sm",
                  i >= 5 ? "bg-orange-500" : "bg-slate-200",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Pipeline Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
