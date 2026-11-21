import {
  EmptyState,
  TiltCard3D,
  SectionHeader,
  SkeletonLoader,
} from "@/components/shared";
import {
  useGetBookmarksQuery,
  useToggleBookmarkMutation,
} from "@/features/api/buzzboardApi";
import React from "react";
import { formatDate } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { Bookmark, Clock, ArrowRight, Trash2 } from "lucide-react";

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { data: bookmarksRes, isLoading } = useGetBookmarksQuery(undefined, {
    skip: !token,
  });
  const [toggleBookmark] = useToggleBookmarkMutation();

  const bookmarks = token ? bookmarksRes?.data || [] : [];

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto space-y-5">
      <SectionHeader
        title="Saved"
        badge="Reading List"
        highlight="Articles"
        badgeIcon={<Bookmark className="w-3 h-3" />}
      />

      {!token ? (
        <div className="max-w-3xl mx-auto">
          <EmptyState
            icon={""}
            actionLabel="Sign In"
            title="Sign In to View Your Reading List"
            onAction={() =>
              navigate("/login", { state: { from: "/bookmarks" } })
            }
            description="Sign in with your BuzzBoard account to save and access bookmarked technical articles."
          />
        </div>
      ) : isLoading ? (
        <SkeletonLoader variant="card" count={2} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          actionLabel="Explore Articles"
          onAction={() => navigate("/")}
          title="Your Reading List is Empty"
          icon={<Bookmark className="w-6 h-6" />}
          description="Bookmark any technical article from the Explore feed to save it here for distraction-free reading later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((post) => (
            <TiltCard3D
              intensity={6}
              key={post._id}
              onClick={() => navigate(`/posts/${post.slug || post._id}`)}
              className="p-4 sm:p-6 flex flex-col justify-between gap-4"
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
                    title="Remove bookmark"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(post._id);
                    }}
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
