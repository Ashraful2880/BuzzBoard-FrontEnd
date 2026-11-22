import {
  PostCard,
  EmptyState,
  CustomButton,
  SkeletonLoader,
} from "@/components/shared";
import {
  useLikePostMutation,
  useGetBookmarksQuery,
  useGetSeriesByIdQuery,
  useToggleBookmarkMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { formatDate } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, BookOpen, PenTool } from "lucide-react";

export const SeriesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const { data: res, isLoading } = useGetSeriesByIdQuery(id || "", {
    skip: !id,
  });
  const { data: bookmarksRes } = useGetBookmarksQuery(undefined, {
    skip: !token,
  });
  const [likePost] = useLikePostMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const [likingId, setLikingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  const series = res?.data?.series;
  const posts = res?.data?.posts || [];
  const bookmarkedIds = new Set(
    (token ? bookmarksRes?.data || [] : []).map((p) => p._id),
  );

  if (isLoading) {
    return (
      <div className="container px-4 sm:px-6 mx-auto pt-6 space-y-6">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <EmptyState
          title="Series Not Found"
          actionLabel="Back to Series"
          onAction={() => navigate("/series")}
          icon={<Layers className="w-6 h-6" />}
          description="This engineering series could not be located or may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 mx-auto space-y-3 sm:space-y-5">
      <button
        type="button"
        onClick={() => navigate("/series")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Series</span>
      </button>

      {/* Series Header Card */}
      <section className="rounded-2xl surface-3d-elevated p-6 sm:p-8 bg-architectural-grid space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700">
              {series.category}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] uppercase font-semibold">
              {series.status}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
            {posts.length} {posts.length === 1 ? "Part" : "Parts"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-950 leading-tight">
          {series.title}
        </h1>

        {series.description && (
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {series.description}
          </p>
        )}

        <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Curated by{" "}
            <strong className="text-slate-800">
              {series.author?.name || "BuzzBoard Author"}
            </strong>{" "}
            • Created {formatDate(series.createdAt)}
          </span>
          <CustomButton
            size="sm"
            variant="secondary"
            onClick={() => navigate("/studio")}
            leftIcon={<PenTool className="w-3.5 h-3.5" />}
          >
            Add Article to Series
          </CustomButton>
        </div>
      </section>

      {/* Ordered Series Chapters */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-950 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" />
          <span>Series Chapters</span>
        </h2>

        {posts.length === 0 ? (
          <EmptyState
            title="No Chapters Published Yet"
            actionLabel="Write First Chapter"
            onAction={() => navigate("/studio")}
            icon={<BookOpen className="w-6 h-6" />}
            description="Assign an article to this series from Editorial Studio to publish the first chapter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            {posts.map((post, idx) => (
              <div key={post._id} className="space-y-2 flex flex-col">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-orange-600 px-1">
                  Part {String(post.seriesOrder || idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
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
                        navigate("/login", {
                          state: { from: `/series/${id}` },
                        });
                        return;
                      }
                      setLikingId(postId);
                      try {
                        const likeRes = await likePost(postId).unwrap();
                        setLikedIds((prev) => {
                          const next = new Set(prev);
                          if (likeRes?.data?.hasLiked) next.add(postId);
                          else next.delete(postId);
                          return next;
                        });
                      } finally {
                        setLikingId(null);
                      }
                    }}
                    onBookmark={async (postId) => {
                      if (!token) {
                        navigate("/login", {
                          state: { from: `/series/${id}` },
                        });
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
