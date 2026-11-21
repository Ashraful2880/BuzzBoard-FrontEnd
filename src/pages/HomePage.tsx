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
  SectionHeader,
  SkeletonLoader,
} from "@/components/shared";
import {
  useGetPostsQuery,
  useGetTrendingPostsQuery,
  useToggleBookmarkMutation,
  useGetPublicAuthorProfileQuery,
} from "@/features/api/buzzboardApi";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { formatDate, formatNumber, resolveMediaUrl } from "@/utils/cn";
import { CATEGORY_OPTIONS } from "@/utils/AllOptions";
import { AdBannerSlot } from "@/components/layout/AdBannerSlot";
import { PlatformModesSection } from "@/components/layout/PlatformModesSection";
import { HeroEditorialShowcase } from "@/components/shared/HeroEditorialShowcase";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [adSafeOnly, setAdSafeOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [avatarError, setAvatarError] = useState(false);

  const { data: postsRes, isLoading } = useGetPostsQuery({
    category: selectedCategory,
    search: searchQuery || undefined,
    adSafeOnly,
  });
  const { data: trendingRes } = useGetTrendingPostsQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const posts = postsRes?.data || [];
  const trendingPosts = trendingRes?.data || posts.slice(0, 3);

  const featuredAuthorId =
    user?._id || trendingPosts[0]?.author?._id || posts[0]?.author?._id || "";
  const { data: authorProfileRes } = useGetPublicAuthorProfileQuery(
    featuredAuthorId,
    { skip: !featuredAuthorId },
  );

  const featuredAuthor =
    authorProfileRes?.data?.author ||
    user ||
    trendingPosts[0]?.author ||
    posts[0]?.author;
  const authorInitials = (featuredAuthor?.name || "BuzzBoard")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto space-y-5">
      {/* Modern Editorial Landing Hero Section */}
      <section className="relative rounded-lg surface-3d-elevated px-3 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-12 xl:px-14 xl:py-16 min-h-[480px] lg:min-h-[510px] xl:min-h-[560px] flex flex-col justify-between overflow-hidden bg-architectural-grid">
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

        {/* Main Hero Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center my-auto">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-2 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>AI-Powered Technical Publishing &amp; Monetization</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-display font-extrabold tracking-tight text-slate-950 leading-[1.1]">
              Engineering Notes for{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Modern Builders
              </span>
              .
            </h1>

            <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 max-w-lg leading-relaxed">
              Publish technical articles with built-in SEO, bilingual
              translation, and sponsorship analytics.
            </p>

            <div className="flex items-center gap-2 sm:gap-3.5 pt-2">
              <CustomButton
                size="lg"
                variant="primary"
                onClick={() => navigate("/studio")}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Start Writing
              </CustomButton>
              <CustomButton
                size="lg"
                variant="secondary"
                onClick={() => navigate("/series")}
                leftIcon={<Layers className="w-4 h-4 text-slate-700" />}
              >
                Browse Series
              </CustomButton>
            </div>
          </div>

          {/* Animated Editorial Workspace Showcase */}
          <div className="lg:col-span-5">
            <HeroEditorialShowcase />
          </div>
        </div>

        {/* Bottom Capability Strip */}
        <div className="relative z-10 mt-3 sm:mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: "AI Editorial Studio",
              desc: "Outlines, SEO & brand safety",
            },
            {
              title: "Structured Series",
              desc: "Multi-part engineering guides",
            },
            {
              title: "Smart Reader",
              desc: "AI TL;DR, Q&A & translation",
            },
            {
              title: "Direct Sponsorships",
              desc: "Live impressions & CTR",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-0.5">
              <p className="text-xs sm:text-sm font-display font-bold text-slate-900">
                {item.title}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Modes Section */}
      <PlatformModesSection />

      {/* Search & Category Filter Bar */}
      <section className="rounded-xl surface-3d p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <CustomInput
              value={searchQuery}
              label="Search Publications"
              leftIcon={<Search className="w-4 h-4" />}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fastify, PostgreSQL, WebSockets, RTK Query..."
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
      <div className="space-y-4 sm:space-y-8 pt-2">
        <SectionHeader
          title="Latest"
          badge="Publications"
          highlight="Publications"
          badgeIcon={<BookOpen className="w-3 h-3" />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Left 8 Columns: Article Feed */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : posts.length === 0 ? (
              <EmptyState
                actionLabel="Reset Filters"
                secondaryLabel="Write Article"
                title="No Matching Articles Found"
                icon={<Search className="w-6 h-6" />}
                onSecondaryAction={() => navigate("/studio")}
                description="Try adjusting your search keywords, switching categories, or clearing active filters."
                onAction={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setAdSafeOnly(false);
                }}
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
                        className="p-5 sm:px-7 sm:py-5"
                        onClick={() =>
                          navigate(`/posts/${post.slug || post._id}`)
                        }
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[12px] font-medium text-orange-700">
                                {post.category}
                              </span>

                              {post.isSponsored && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px]  text-slate-600">
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
                                <Clock className="w-3 h-3 text-slate-400" />
                                {post.readingTime} Min Read
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl sm:text-xl font-display font-bold text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {post.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] capitalize text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-display font-bold text-sm flex items-center justify-center">
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

                            <div className="flex items-center gap-4">
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
                                title="Save to Reading List"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!token) {
                                    navigate("/login");
                                    return;
                                  }
                                  toggleBookmark(post._id);
                                }}
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
          <aside className="lg:col-span-4 space-y-3">
            <div className="rounded-lg surface-3d px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-bold text-slate-950 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Trending Articles</span>
                </h3>
              </div>

              <div className="space-y-2">
                {trendingPosts.map((tp, i) => (
                  <div
                    key={tp._id}
                    onClick={() => navigate(`/posts/${tp.slug || tp._id}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/70 hover:border-orange-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-base font-bold text-slate-400 group-hover:text-orange-600">
                        0{i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {tp.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {formatNumber(tp.views)} views • {tp.readingTime}m
                          read
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AdBannerSlot placement="sidebar" />

            <TiltCard3D intensity={4} className="px-5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 mb-1.5">
                  {featuredAuthor?.profile_img?.url && !avatarError ? (
                    <img
                      alt={featuredAuthor.name}
                      src={featuredAuthor.profile_img.url}
                      onError={() => setAvatarError(true)}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-display font-bold text-base flex items-center justify-center shrink-0">
                      {authorInitials || "BB"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-display font-bold text-slate-950 truncate">
                      {featuredAuthor?.name || "BuzzBoard Creator"}
                    </h4>
                    <p className="text-xs text-orange-600 font-medium capitalize truncate">
                      {user?._id && featuredAuthor?._id === user._id
                        ? `Signed in · ${featuredAuthor.role || "Author"}`
                        : `Featured ${featuredAuthor?.role || "Creator"}`}
                    </p>
                  </div>
                </div>

                <CustomButton
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (featuredAuthor?.website) {
                      window.open(featuredAuthor.website, "_blank");
                    } else {
                      navigate(user ? "/studio" : "/series");
                    }
                  }}
                >
                  {featuredAuthor?.website
                    ? "Website"
                    : user
                      ? "Studio"
                      : "Series"}
                </CustomButton>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                {featuredAuthor?.bio ||
                  "Publishing in-depth engineering notes, system architecture guides, and technical series on BuzzBoard."}
              </p>
            </TiltCard3D>
          </aside>
        </div>
      </div>
    </div>
  );
};
