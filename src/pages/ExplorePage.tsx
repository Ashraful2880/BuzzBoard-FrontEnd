import {
  PostCard,
  EmptyState,
  Pagination,
  CustomInput,
  CustomSelect,
  CustomButton,
  SectionHeader,
  SkeletonLoader,
} from "@/components/shared";
import {
  useGetPostsQuery,
  useLikePostMutation,
  useGetBookmarksQuery,
  useToggleBookmarkMutation,
} from "@/features/api/buzzboardApi";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { AdBannerSlot } from "@/components/layout/AdBannerSlot";
import { CATEGORY_OPTIONS, VERIFICATION_OPTIONS } from "@/utils/AllOptions";
import { X, Search, Compass, RotateCcw, SlidersHorizontal } from "lucide-react";

const POSTS_PER_PAGE = 6;

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const feedTopRef = useRef<HTMLDivElement>(null);
  const { token } = useAppSelector((state) => state.auth);

  // Input / Pending UI states
  const [searchInput, setSearchInput] = useState("");
  const [pendingCategory, setPendingCategory] = useState("All");
  const [pendingVerification, setPendingVerification] = useState("all");

  // Applied API query states
  const [page, setPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("All");
  const [appliedVerification, setAppliedVerification] = useState("all");

  const {
    isLoading,
    isFetching,
    data: postsRes,
  } = useGetPostsQuery({
    page,
    limit: POSTS_PER_PAGE,
    category: appliedCategory,
    search: appliedSearch || undefined,
    adSafeOnly: appliedVerification === "verified",
  });
  const { data: bookmarksRes } = useGetBookmarksQuery(undefined, {
    skip: !token,
  });
  const [likePost] = useLikePostMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [likingId, setLikingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  const bookmarkedIds = new Set(
    (token ? bookmarksRes?.data || [] : []).map((p) => p._id),
  );

  const posts = postsRes?.data || [];
  const pagination = postsRes?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const isSearchApplied =
    Boolean(appliedSearch) && searchInput.trim() === appliedSearch;

  const hasPendingFilterChanges =
    pendingCategory !== appliedCategory ||
    pendingVerification !== appliedVerification;

  const hasActiveFilters =
    appliedCategory !== "All" || appliedVerification !== "all";

  const handleSearchOrClear = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearchApplied) {
      setSearchInput("");
      setAppliedSearch("");
      setPage(1);
    } else {
      setAppliedSearch(searchInput.trim());
      setPage(1);
    }
  };

  const handleFilterOrClear = () => {
    if (hasActiveFilters && !hasPendingFilterChanges) {
      setPendingCategory("All");
      setPendingVerification("all");
      setAppliedCategory("All");
      setAppliedVerification("all");
      setPage(1);
    } else {
      setAppliedCategory(pendingCategory);
      setAppliedVerification(pendingVerification);
      setPage(1);
    }
  };

  const resetAll = () => {
    setSearchInput("");
    setAppliedSearch("");
    setPendingCategory("All");
    setPendingVerification("all");
    setAppliedCategory("All");
    setAppliedVerification("all");
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
    feedTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLike = async (postId: string) => {
    if (!token) {
      navigate("/login", { state: { from: "/explore" } });
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
  };

  const handleBookmark = async (postId: string) => {
    if (!token) {
      navigate("/login", { state: { from: "/explore" } });
      return;
    }
    setBookmarkingId(postId);
    try {
      await toggleBookmark(postId).unwrap();
    } finally {
      setBookmarkingId(null);
    }
  };

  return (
    <div className="container px-4 sm:px-6 mx-auto space-y-3 sm:space-y-5">
      <SectionHeader
        title="All"
        badge="Explore Archive"
        highlight="Publications"
        badgeIcon={<Compass className="w-3 h-3" />}
        description="Search, filter by topic, and browse every engineering note published on BuzzBoard."
      />

      {/* Unified Bordered Explore Workspace */}
      <div className="rounded-2xl surface-3d-elevated p-4 sm:p-6 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="pb-5 border-b border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* Search Input + Search/Clear Button */}
            <form
              onSubmit={handleSearchOrClear}
              className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5"
            >
              <CustomInput
                value={searchInput}
                label="Search Publications"
                containerClassName="flex-1"
                placeholder="Search Publications"
                leftIcon={<Search className="w-4 h-4" />}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <CustomButton
                type="submit"
                className="shrink-0 sm:w-28"
                variant={isSearchApplied ? "outline" : "primary"}
                leftIcon={
                  isSearchApplied ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )
                }
              >
                {isSearchApplied ? "Clear" : "Search"}
              </CustomButton>
            </form>

            {/* Category Dropdown + Verification Dropdown + Filter/Clear Button */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-5">
                <CustomSelect
                  searchable
                  label="Category"
                  value={pendingCategory}
                  options={CATEGORY_OPTIONS}
                  onChange={setPendingCategory}
                />
              </div>

              <div className="sm:col-span-4">
                <CustomSelect
                  label="Verification"
                  value={pendingVerification}
                  options={VERIFICATION_OPTIONS}
                  onChange={setPendingVerification}
                />
              </div>

              <div className="sm:col-span-3">
                <CustomButton
                  fullWidth
                  type="button"
                  onClick={handleFilterOrClear}
                  variant={
                    hasActiveFilters && !hasPendingFilterChanges
                      ? "outline"
                      : "secondary"
                  }
                  leftIcon={
                    hasActiveFilters && !hasPendingFilterChanges ? (
                      <RotateCcw className="w-3.5 h-3.5" />
                    ) : (
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {hasActiveFilters && !hasPendingFilterChanges
                    ? "Clear"
                    : "Filter"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        {/* Equal-Height 2-Column Publications Grid */}
        <div ref={feedTopRef} className="space-y-6 scroll-mt-20">
          {isLoading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : posts.length === 0 ? (
            <EmptyState
              onAction={resetAll}
              actionLabel="Reset Filters"
              secondaryLabel="Write Article"
              title="No Matching Articles Found"
              icon={<Search className="w-6 h-6" />}
              onSecondaryAction={() => navigate("/studio")}
              description="Try adjusting your search keywords, switching categories, or clearing active filters."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                {posts.map((post, idx) => (
                  <React.Fragment key={post._id}>
                    <PostCard
                      post={post}
                      index={idx}
                      isLiked={likedIds.has(post._id)}
                      isLiking={likingId === post._id}
                      isBookmarked={bookmarkedIds.has(post._id)}
                      isBookmarking={bookmarkingId === post._id}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onOpen={(slugOrId) => navigate(`/posts/${slugOrId}`)}
                    />
                    {idx === 1 && (
                      <div className="md:col-span-2">
                        <AdBannerSlot
                          placement="in_article"
                          category={appliedCategory}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-end pt-2">
                  <Pagination
                    currentPage={page}
                    isLoading={isFetching}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
