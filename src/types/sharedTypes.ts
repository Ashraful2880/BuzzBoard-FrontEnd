import type React from "react";
import type { HTMLMotionProps } from "framer-motion";

export interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareColor?: string;
  elevated?: boolean;
  onClick?: () => void;
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "emerald";

export type ButtonSize = "sm" | "md" | "lg";

export interface CustomButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  badge?: string | number;
}

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
  containerClassName?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  helperText?: string;
}

export interface CustomDatePickerProps {
  label?: string;
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export type SkeletonVariant = "card" | "detail" | "kpi" | "list";

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export interface HeroCarousel3DProps {
  posts: import("./postTypes").Post[];
  onSelectPost: (slugOrId: string) => void;
}
