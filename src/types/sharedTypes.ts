import type React from "react";
import type { HTMLMotionProps } from "framer-motion";

export interface TiltCard3DProps {
  className?: string;
  intensity?: number;
  elevated?: boolean;
  glareColor?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "emerald";

export type ButtonSize = "sm" | "md" | "lg";

export interface CustomButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  badge?: string | number;
  variant?: ButtonVariant;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  rightElement?: React.ReactNode;
}

export interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  helperText?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  label?: string;
  className?: string;
  helperText?: string;
  placeholder?: string;
  searchable?: boolean;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export interface CustomDatePickerProps {
  value: string;
  label?: string;
  className?: string;
  helperText?: string;
  placeholder?: string;
  onChange: (isoDate: string) => void;
}

export type SkeletonVariant = "card" | "detail" | "kpi" | "list";

export interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  variant?: SkeletonVariant;
}

export interface EmptyStateProps {
  title: string;
  className?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export interface HeroCarousel3DProps {
  posts: import("./postTypes").Post[];
  onSelectPost: (slugOrId: string) => void;
}

export interface PlatformMode {
  name: string;
  badge: string;
  route: string;
  tagline: string;
  ctaLabel: string;
  shortLabel: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
  id: "reader" | "studio" | "series" | "analytics";
}

export interface SectionHeaderProps {
  title: string;
  badge?: string;
  className?: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  badgeIcon?: React.ReactNode;
}