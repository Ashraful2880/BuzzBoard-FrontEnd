import type {
  ButtonSize,
  ButtonVariant,
  CustomButtonProps,
} from "@/types/sharedTypes";
import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white font-semibold border border-slate-900 hover:bg-slate-800",
  secondary:
    "bg-white text-slate-800 font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  emerald:
    "bg-orange-600 text-white font-semibold border border-orange-600 hover:bg-orange-700",
  outline:
    "bg-white text-slate-700 font-medium border border-slate-300 hover:border-slate-400 hover:text-slate-950",
  ghost:
    "bg-transparent text-slate-600 font-medium hover:text-slate-950 hover:bg-slate-200/60 border border-transparent",
  danger:
    "bg-rose-600 text-white font-semibold border border-rose-600 hover:bg-rose-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-sm rounded-lg gap-2",
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  badge,
  children,
  leftIcon,
  disabled,
  rightIcon,
  className,
  size = "md",
  type = "button",
  isLoading = false,
  fullWidth = false,
  variant = "primary",
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { y: 1.5 }}
      whileHover={isDisabled ? undefined : { y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={cn(
        "relative inline-flex items-center justify-center select-none transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}

      <span className="truncate">{children}</span>

      {badge !== undefined && (
        <span
          className={cn(
            "ml-1 px-1.5 py-0.5 text-[11px] font-mono rounded-md leading-none",
            variant === "primary" || variant === "emerald"
              ? "bg-white/20 text-white font-semibold"
              : "bg-slate-100 text-slate-700 border border-slate-200",
          )}
        >
          {badge}
        </span>
      )}

      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
