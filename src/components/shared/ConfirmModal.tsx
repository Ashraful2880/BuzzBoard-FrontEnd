import { cn } from "@/utils/cn";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmModalProps } from "@/types";
import { CustomButton } from "./CustomButton";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  icon,
  title,
  isOpen,
  onClose,
  onConfirm,
  description,
  isLoading = false,
  variant = "danger",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => !isLoading && onClose()}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl surface-3d-elevated p-6 space-y-5 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close modal"
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-6">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  variant === "danger"
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-orange-50 border-orange-200 text-orange-600",
                )}
              >
                {icon || <AlertTriangle className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-display font-bold text-slate-950">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <CustomButton
                size="sm"
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isLoading}
              >
                {cancelLabel}
              </CustomButton>
              <CustomButton
                size="sm"
                type="button"
                onClick={onConfirm}
                isLoading={isLoading}
                variant={variant === "danger" ? "danger" : "primary"}
              >
                {confirmLabel}
              </CustomButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
