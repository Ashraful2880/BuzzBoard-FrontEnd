import React from "react";
import { motion } from "framer-motion";
import { TiltCard3D } from "./TiltCard3D";
import type { PostCardProps } from "@/types";
import { cn, formatDate, formatNumber } from "@/utils/cn";
import { Eye, Clock, Heart, Loader2, Bookmark, MessageSquare } from "lucide-react";

export const PostCard: React.FC<
  PostCardProps & {
    isBookmarked?: boolean;
    isBookmarking?: boolean;
    isLiked?: boolean;
    isLiking?: boolean;
    onLike?: (postId: string) => void;
  }
> = ({
  post,
  onOpen,
  index = 0,
  onBookmark,
  isBookmarked = false,
  isBookmarking = false,
  isLiked = false,
  isLiking = false,
  onLike,
}) => {
  return (
    <motion.div
      className="h-full"
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ delay: index * 0.05 }}
    >
      <TiltCard3D
        intensity={8}
        className="h-full p-5 sm:p-6"
        onClick={() => onOpen(post.slug || post._id)}
      >
        <div className="h-full flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700">
                  {post.category}
                </span>

                {post.isSponsored && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                    Sponsored
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                {post.liveReaders && post.liveReaders > 0 && (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {post.liveReaders} Reading
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readingTime} Min Read
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-950 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {post.tags?.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-auto border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white font-display font-bold text-sm flex items-center justify-center">
                {post.author?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {post.author?.name || "BuzzBoard Author"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {formatNumber(post.views)}
              </span>
              {onLike ? (
                <button
                  type="button"
                  disabled={isLiking}
                  title={isLiked ? "Unlike article" : "Like article"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(post._id);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-60",
                    isLiked
                      ? "bg-rose-50 text-rose-600 font-semibold"
                      : "text-slate-500 hover:bg-rose-50 hover:text-rose-600",
                  )}
                >
                  {isLiking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  ) : (
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5 text-rose-500",
                        isLiked && "fill-current",
                      )}
                    />
                  )}
                  {formatNumber(post.likesCount)}
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {formatNumber(post.likesCount)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                {formatNumber(post.commentsCount)}
              </span>

              <button
                type="button"
                disabled={isBookmarking}
                title={isBookmarked ? "Saved in Reading List" : "Save to Reading List"}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(post._id);
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-60",
                  isBookmarked
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600",
                )}
              >
                {isBookmarking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bookmark
                    className={cn("w-4 h-4", isBookmarked && "fill-current")}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </TiltCard3D>
    </motion.div>
  );
};
