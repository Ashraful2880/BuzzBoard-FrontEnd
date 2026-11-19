import React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Clock, ArrowRight, Trash2 } from "lucide-react";
import {
  TiltCard3D,
  SkeletonLoader,
  EmptyState,
} from "@/components/shared";
import {
  useGetBookmarksQuery,
  useToggleBookmarkMutation,
} from "@/features/api/buzzboardApi";
import { formatDate } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { data: bookmarksRes, isLoading } = useGetBookmarksQuery(undefined, {
    skip: !token,
  });
  const [toggleBookmark] = useToggleBookmarkMutation();

  const bookmarks = token ? bookmarksRes?.data || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-950 flex items-center gap-2.5">
          <Bookmark className="w-5 h-5 text-orange-600" />
          <span>Saved Articles</span>
        </h1>

        <span className="text-xs font-mono text-slate-500">
          {bookmarks.length} saved {bookmarks.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {!token ? (
        <EmptyState
          icon={<Bookmark className="w-6 h-6" />}
          title="Sign In to View Your Reading List"
          description="Sign in with your BuzzBoard account to save and access bookmarked technical articles."
          actionLabel="Sign In"
          onAction={() => navigate("/login", { state: { from: "/bookmarks" } })}
        />
      ) : isLoading ? (
        <SkeletonLoader variant="card" count={2} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-6 h-6" />}
          title="Your Reading List is Empty"
          description="Bookmark any technical article from the Explore feed to save it here for distraction-free reading later."
          actionLabel="Explore Articles"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((post) => (
            <TiltCard3D
              key={post._id}
              intensity={6}
              onClick={() => navigate(`/posts/${post.slug || post._id}`)}
              className="p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-mono font-semibold">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {post.readingTime} min
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Saved • {formatDate(post.createdAt)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(post._id);
                    }}
                    title="Remove bookmark"
                    className="p-2 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>
      )}
    </div>
  );
};
