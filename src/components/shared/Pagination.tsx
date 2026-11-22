import React from "react";
import { cn } from "@/utils/cn";
import { PaginationProps } from "@/types";
import { CustomButton } from "./CustomButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination: React.FC<PaginationProps> = ({
  className,
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-xl surface-3d px-3 py-2",
        className,
      )}
    >
      <CustomButton
        size="sm"
        variant="secondary"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        <span className="hidden sm:inline">Previous</span>
      </CustomButton>

      <div className="flex items-center gap-1.5">
        {visiblePages.map((p, idx, arr) => {
          const prev = arr[idx - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {showEllipsis && (
                <span className="px-1.5 text-xs text-slate-400 select-none">
                  …
                </span>
              )}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50",
                  p === currentPage
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600",
                )}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <CustomButton
        size="sm"
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
        disabled={currentPage >= totalPages || isLoading}
      >
        <span className="hidden sm:inline">Next</span>
      </CustomButton>
    </nav>
  );
};
