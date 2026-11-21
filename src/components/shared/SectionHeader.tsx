import React from "react";
import { cn } from "@/utils/cn";
import { SectionHeaderProps } from "@/types";

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  badgeIcon,
  highlight,
  className,
  align = "center",
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "relative sm:py-1",
        isCentered ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl",
        className,
      )}
    >
      {/* Subtle Shape-Type Ambient Accent */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-3 w-44 h-16 rounded-full bg-gradient-to-r from-orange-400/15 via-amber-300/15 to-rose-300/10 blur-xl",
          isCentered ? "left-1/2 -translate-x-1/2" : "left-0",
        )}
      />

      <div
        className={cn(
          "relative z-10 flex flex-col gap-2.5",
          isCentered ? "items-center" : "items-start",
        )}
      >
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50/90 border border-orange-200/80 text-[11px] font-semibold text-orange-700 shadow-2xs">
            {badgeIcon}
            <span>{badge}</span>
          </span>
        )}

        <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-950 leading-tight">
          {title}{" "}
          {highlight && (
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </h2>

        {/* Geometric Shape Divider */}
        <div
          className={cn(
            "flex items-center gap-1.5",
            isCentered ? "justify-center" : "justify-start",
          )}
        >
          <span className="h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          <span className="h-1 w-3 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
