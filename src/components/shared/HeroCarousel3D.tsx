import {
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { TiltCard3D } from "./TiltCard3D";
import { formatNumber } from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroCarousel3DProps } from "@/types/sharedTypes";

export const HeroCarousel3D: React.FC<HeroCarousel3DProps> = ({
  posts,
  onSelectPost,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const items = posts.slice(0, 5);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const currentPost = items[activeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div
      className="relative perspective-1600 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Active Interactive 3D Card */}
      <div className="relative z-10 overflow-hidden rounded-lg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPost._id}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction > 0 ? 60 : -60,
              rotateY: direction > 0 ? 12 : -12,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              rotateY: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -60 : 60,
              rotateY: direction > 0 ? -12 : 12,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <TiltCard3D
              elevated
              intensity={10}
              className="p-6 sm:p-7 space-y-4 bg-transparent"
              onClick={() => onSelectPost(currentPost.slug || currentPost._id)}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700  font-semibold">
                  {currentPost.category}
                </span>
                <div className="flex items-center gap-3  text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(currentPost.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentPost.readingTime}m
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-950 leading-snug line-clamp-2 min-h-[3.2rem]">
                {currentPost.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed min-h-[3.8rem]">
                {currentPost.excerpt}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-display font-bold text-xs flex items-center justify-center">
                    {currentPost.author?.name?.charAt(0) || "A"}
                  </div>
                  <span className="font-medium text-slate-700">
                    {currentPost.author?.name || "Md Ashraful Islam"}
                  </span>
                </div>

                <span className="text-orange-600 font-semibold flex items-center gap-1">
                  Read article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </TiltCard3D>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls & Pagination Dots */}
      {items.length > 1 && (
        <div className="relative z-20 mt-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {items.map((item, idx) => (
              <button
                key={item._id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-6 bg-orange-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous featured article"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next featured article"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
