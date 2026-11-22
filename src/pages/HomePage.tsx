import {
  PostCard,
  EmptyState,
  TiltCard3D,
  CustomButton,
  SectionHeader,
  SkeletonLoader,
} from "@/components/shared";
import {
  useLikePostMutation,
  useGetBookmarksQuery,
  useGetLatestPostsQuery,
  useGetTrendingPostsQuery,
  useToggleBookmarkMutation,
  useGetPublicAuthorProfileQuery,
} from "@/features/api/buzzboardApi";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { formatNumber } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { AdBannerSlot } from "@/components/layout/AdBannerSlot";
import { Layers, BookOpen, TrendingUp, ArrowUpRight } from "lucide-react";
import { PlatformModesSection } from "@/components/layout/PlatformModesSection";
import { HeroEditorialShowcase } from "@/components/shared/HeroEditorialShowcase";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const [avatarError, setAvatarError] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  const { data: postsRes, isLoading } = useGetLatestPostsQuery();
  const { data: trendingRes } = useGetTrendingPostsQuery();
  const { data: bookmarksRes } = useGetBookmarksQuery(undefined, {
    skip: !token,
  });
  const [likePost] = useLikePostMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const bookmarkedIds = new Set(
    (token ? bookmarksRes?.data || [] : []).map((p) => p._id),
  );

  const posts = postsRes?.data || [];
  const trendingPosts = trendingRes?.data || posts;

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

      {/* Latest 4 Publications + Sidebar */}
      <div className="space-y-4 sm:space-y-8 pt-2">
        <SectionHeader
          title="Latest"
          badge="Publications"
          highlight="Publications"
          badgeIcon={<BookOpen className="w-3 h-3" />}
          description="Read our 4 most recent engineering notes, or explore the full archive."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Left 8 Columns: Latest 4 Articles */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {isLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : posts.length === 0 ? (
              <EmptyState
                actionLabel="Write Article"
                title="No Publications Yet"
                icon={<BookOpen className="w-6 h-6" />}
                description="Be the first to publish an engineering article on BuzzBoard."
                onAction={() => navigate("/studio")}
              />
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {posts.map((post, idx) => (
                  <React.Fragment key={post._id}>
                    <PostCard
                      post={post}
                      index={idx}
                      isLiked={likedIds.has(post._id)}
                      isLiking={likingId === post._id}
                      isBookmarked={bookmarkedIds.has(post._id)}
                      isBookmarking={bookmarkingId === post._id}
                      onOpen={(slugOrId) => navigate(`/posts/${slugOrId}`)}
                      onLike={async (postId) => {
                        if (!token) {
                          navigate("/login");
                          return;
                        }
                        setLikingId(postId);
                        try {
                          const res = await likePost(postId).unwrap();
                          setLikedIds((prev) => {
                            const next = new Set(prev);
                            if (res?.data?.hasLiked) next.add(postId);
                            else next.delete(postId);
                            return next;
                          });
                        } finally {
                          setLikingId(null);
                        }
                      }}
                      onBookmark={async (postId) => {
                        if (!token) {
                          navigate("/login");
                          return;
                        }
                        setBookmarkingId(postId);
                        try {
                          await toggleBookmark(postId).unwrap();
                        } finally {
                          setBookmarkingId(null);
                        }
                      }}
                    />

                    {idx === 0 && (
                      <AdBannerSlot placement="in_article" category="All" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Right 4 Columns: Trending & Sidebar */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="rounded-lg surface-3d px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-bold text-slate-950 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Trending Articles</span>
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {trendingPosts.map((tp, i) => (
                  <div
                    key={tp._id}
                    onClick={() => navigate(`/posts/${tp.slug || tp._id}`)}
                    className="px-3 py-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 hover:border-orange-300 transition-colors cursor-pointer group"
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

        {posts.length > 0 && (
          <div className="pt-2 flex justify-center">
            <CustomButton
              size="lg"
              variant="secondary"
              onClick={() => navigate("/explore")}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Explore All Publications
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};
