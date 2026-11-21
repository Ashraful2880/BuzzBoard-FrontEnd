import type {
  CustomInputProps,
  CustomTextareaProps,
} from "@/types/sharedTypes";
import React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      className,
      helperText,
      rightElement,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-600"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 text-slate-400 group-focus-within:text-orange-600 transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 rounded-lg bg-white text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 transition-all duration-150 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15",
              leftIcon ? "pl-10" : "pl-3.5",
              rightElement ? "pr-11" : "pr-3.5",
              error &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15",
              className,
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-2.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          helperText && <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>(
  (
    {
      id,
      error,
      label,
      value,
      showCount,
      maxLength,
      className,
      helperText,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || React.useId();
    const currentLen = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={textareaId}
                className="block text-xs font-semibold text-slate-600"
              >
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  "text-[11px] font-mono",
                  currentLen > maxLength * 0.9
                    ? "text-amber-600"
                    : "text-slate-400",
                )}
              >
                {currentLen} / {maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          value={value}
          id={textareaId}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-lg bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 transition-all duration-150 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 resize-y",
            error &&
              "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15",
            className,
          )}
          {...props}
        />

        {error ? (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          helperText && <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  },
);

CustomTextarea.displayName = "CustomTextarea";
