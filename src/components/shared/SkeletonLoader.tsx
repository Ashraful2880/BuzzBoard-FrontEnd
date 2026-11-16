import React from "react";
import { cn } from "@/utils/cn";
import type { SkeletonLoaderProps } from "@/types/sharedTypes";

const ShimmerBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-lg bg-slate-200/80 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent",
      className,
    )}
  />
);

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "card",
  count = 3,
  className,
}) => {
  if (variant === "detail") {
    return (
      <div
        className={cn(
          "max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-9 w-32 rounded-xl" />
          <div className="flex gap-2">
            <ShimmerBlock className="h-9 w-36 rounded-xl" />
            <ShimmerBlock className="h-9 w-28 rounded-xl" />
          </div>
        </div>
        <div className="rounded-3xl surface-3d p-6 sm:p-10 space-y-6">
          <div className="flex gap-2">
            <ShimmerBlock className="h-6 w-24 rounded-lg" />
            <ShimmerBlock className="h-6 w-32 rounded-lg" />
          </div>
          <ShimmerBlock className="h-10 w-3/4 rounded-xl" />
          <ShimmerBlock className="h-6 w-1/2 rounded-xl" />
          <div className="flex items-center gap-3 py-4 border-y border-slate-100">
            <ShimmerBlock className="w-11 h-11 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <ShimmerBlock className="h-4 w-40" />
              <ShimmerBlock className="h-3 w-28" />
            </div>
          </div>
          <div className="space-y-3">
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-11/12" />
            <ShimmerBlock className="h-4 w-4/5" />
            <ShimmerBlock className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "kpi") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
          className,
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl surface-3d p-5 space-y-3">
            <div className="flex items-center justify-between">
              <ShimmerBlock className="h-3.5 w-28" />
              <ShimmerBlock className="h-5 w-5 rounded-md" />
            </div>
            <ShimmerBlock className="h-9 w-24 rounded-xl" />
            <ShimmerBlock className="h-3 w-36" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <ShimmerBlock className="h-4 w-24" />
              <ShimmerBlock className="h-5 w-2/3" />
              <ShimmerBlock className="h-3 w-1/3" />
            </div>
            <ShimmerBlock className="h-10 w-24 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl surface-3d p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShimmerBlock className="h-6 w-24 rounded-lg" />
              <ShimmerBlock className="h-6 w-20 rounded-lg" />
            </div>
            <ShimmerBlock className="h-4 w-20" />
          </div>
          <div className="space-y-2.5">
            <ShimmerBlock className="h-7 w-5/6 rounded-xl" />
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-4/5" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShimmerBlock className="w-9 h-9 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <ShimmerBlock className="h-3.5 w-28" />
                <ShimmerBlock className="h-3 w-20" />
              </div>
            </div>
            <ShimmerBlock className="h-8 w-28 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
