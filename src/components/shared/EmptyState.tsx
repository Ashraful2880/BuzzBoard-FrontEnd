import React from "react";
import { cn } from "@/utils/cn";
import { Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard3D } from "./TiltCard3D";
import { CustomButton } from "./CustomButton";
import type { EmptyStateProps } from "@/types/sharedTypes";

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  onAction,
  className,
  description,
  actionLabel,
  secondaryLabel,
  onSecondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("w-full", className)}
    >
      <TiltCard3D
        intensity={4}
        className="p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-5 bg-architectural-grid"
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
          {icon || <Inbox className="w-6 h-6" />}
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-display font-bold text-slate-900">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {(actionLabel || secondaryLabel) && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {actionLabel && onAction && (
              <CustomButton variant="primary" size="md" onClick={onAction}>
                {actionLabel}
              </CustomButton>
            )}
            {secondaryLabel && onSecondaryAction && (
              <CustomButton
                size="md"
                variant="secondary"
                onClick={onSecondaryAction}
              >
                {secondaryLabel}
              </CustomButton>
            )}
          </div>
        )}
      </TiltCard3D>
    </motion.div>
  );
};
