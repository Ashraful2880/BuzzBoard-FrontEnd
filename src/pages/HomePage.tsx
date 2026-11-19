import {
  Eye,
  Clock,
  Heart,
  Layers,
  Search,
  BookOpen,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import {
  EmptyState,
  TiltCard3D,
  CustomInput,
  CustomSelect,
  CustomButton,
  SkeletonLoader,
  HeroCarousel3D,
} from "@/components/shared";
import {
  useGetPostsQuery,
  useGetTrendingPostsQuery,
  useToggleBookmarkMutation,
} from "@/features/api/buzzboardApi";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatNumber } from "@/utils/cn";
import { CATEGORY_OPTIONS } from "@/utils/AllOptions";
import { AdBannerSlot } from "@/components/layout/AdBannerSlot";
import { PlatformModesSection } from "@/components/layout/PlatformModesSection";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [adSafeOnly, setAdSafeOnly] = useState(false);

  const { data: postsRes, isLoading } = useGetPostsQuery({
    category: selectedCategory,
    search: searchQuery || undefined,
    adSafeOnly,
  });
  const { data: trendingRes } = useGetTrendingPostsQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const posts = postsRes?.data || [];
  const trendingPosts = trendingRes?.data || posts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
      {/* Editorial Hero Section with Animated Colorful Shapes */}
      <section className="relative rounded-xl surface-3d-elevated p-6 sm:p-10 lg:p-12 overflow-hidden bg-architectural-grid">
        {/* Animated Colorful Background Shapes (Logo-Matched Orange, Amber, Coral & Slate) */}
        <motion.div
          animate={{
            x: [0, 35, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.15, 0.95, 1],
            rotate: [0, 45, 90, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-400/25 via-amber-400/20 to-rose-300/20 blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 25, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, -60, -120, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-28 right-12 w-96 h-96 rounded-full bg-gradient-to-bl from-amber-300/25 via-orange-300/20 to-slate-300/25 blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, 25, -30, 0],
            y: [0, 20, -25, 0],
            scale: [0.95, 1.1, 1, 0.95],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-orange-300/20 via-rose-300/15 to-amber-400/20 blur-2xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-950 leading-[1.12]">
              In-Depth Engineering Notes for{" "}
              <span className="text-orange-600">Modern Builders</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Write, structure, and monetize long-form technical articles with
              built-in SEO workflows, bilingual translation, threaded
              discussions, and transparent sponsorship analytics.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <CustomButton
                variant="primary"
                size="lg"
                onClick={() => navigate("/studio")}
              >
                Start Writing
              </CustomButton>
              <CustomButton
                variant="secondary"
                size="lg"
                leftIcon={<Layers className="w-4 h-4 text-slate-700" />}
                onClick={() => navigate("/series")}
              >
                Browse Series
              </CustomButton>
            </div>
          </div>

          {/* 3D Stacked Carousel Card */}
          <div className="lg:col-span-5">
            <HeroCarousel3D
              posts={posts}
              onSelectPost={(slugOrId) => navigate(`/posts/${slugOrId}`)}
            />
          </div>
        </div>
      </section>

      {/* Platform Modes Section */}
      <PlatformModesSection />

      {/* Search & Category Filter Bar */}
      <section className="rounded-xl surface-3d p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <CustomInput
              label="Search Publications"
              placeholder="Search Fastify, PostgreSQL, WebSockets, RTK Query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="md:col-span-4">
            <CustomSelect
              searchable
              label="Category"
              value={selectedCategory}
              options={CATEGORY_OPTIONS}
              onChange={setSelectedCategory}
            />
          </div>

          <div className="md:col-span-2">
            <CustomButton
              fullWidth
              variant={adSafeOnly ? "emerald" : "secondary"}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => setAdSafeOnly((prev) => !prev)}
            >
              {adSafeOnly ? "Verified Only" : "All Posts"}
            </CustomButton>
          </div>
        </div>
      </section>

      {/* Main Content Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Article Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span>Latest Publications</span>
            </h2>
            <span className="text-xs  text-slate-500">
              {posts.length} articles
            </span>
          </div>

          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : posts.length === 0 ? (
            <EmptyState
              actionLabel="Reset Filters"
              title="No Matching Articles Found"
              icon={<Search className="w-6 h-6" />}
              description="Try adjusting your search keywords, switching categories, or clearing active filters."
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setAdSafeOnly(false);
              }}
              secondaryLabel="Write Article"
              onSecondaryAction={() => navigate("/studio")}
            />
          ) : (
            <div className="space-y-6">
              {posts.map((post, idx) => (
                <React.Fragment key={post._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <TiltCard3D
                      intensity={8}
                      onClick={() =>
                        navigate(`/posts/${post.slug || post._id}`)
                      }
                      className="p-6 sm:p-7"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-xs  font-semibold text-orange-700">
                              {post.category}
                            </span>

                            {post.isSponsored && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px]  text-slate-600">
                                Sponsored
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs  text-slate-500">
                            {post.liveReaders && post.liveReaders > 0 && (
                              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                {post.liveReaders} reading
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {post.readingTime} min read
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px]  text-slate-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-display font-bold text-sm flex items-center justify-center">
                              {post.author?.name?.charAt(0) || "A"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-900">
                                {post.author?.name || "Md Ashraful Islam"}
                              </p>
                              <p className="text-[11px]  text-slate-500">
                                {formatDate(post.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs  text-slate-500">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {formatNumber(post.views)}
                            </span>
                            <span className="flex items-center gap-1 text-xs  text-slate-500">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              {formatNumber(post.likesCount)}
                            </span>
                            <span className="flex items-center gap-1 text-xs  text-slate-500">
                              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                              {formatNumber(post.commentsCount)}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(post._id);
                              }}
                              title="Save to Reading List"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </TiltCard3D>
                  </motion.div>

                  {idx === 0 && (
                    <AdBannerSlot
                      placement="in_article"
                      category={selectedCategory}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Columns: Trending & Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-lg surface-3d p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-slate-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span>Trending Articles</span>
              </h3>
            </div>

            <div className="space-y-3">
              {trendingPosts.map((tp, i) => (
                <div
                  key={tp._id}
                  onClick={() => navigate(`/posts/${tp.slug || tp._id}`)}
                  className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/70 hover:border-orange-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base  font-bold text-slate-400 group-hover:text-orange-600">
                      0{i + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {tp.title}
                      </h4>
                      <p className="text-[11px]  text-slate-500">
                        {formatNumber(tp.views)} views • {tp.readingTime}m read
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdBannerSlot placement="sidebar" />

          <TiltCard3D intensity={4} className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-display font-bold text-base flex items-center justify-center">
                MA
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-slate-950">
                  Md Ashraful Islam
                </h4>
                <p className="text-xs text-orange-600 font-medium">
                  Senior Frontend &amp; Full-Stack Engineer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              5+ years shipping production SaaS, Fintech &amp; Enterprise ERP
              platforms with React, Next.js, TypeScript, Fastify, PostgreSQL
              &amp; Prisma.
            </p>

            <CustomButton
              size="sm"
              fullWidth
              variant="outline"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              onClick={() =>
                window.open("https://ashrafulislam.netlify.app", "_blank")
              }
            >
              View Portfolio
            </CustomButton>
          </TiltCard3D>
        </aside>
      </div>
    </div>
  );
};
