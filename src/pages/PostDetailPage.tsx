import {
  Bot,
  Eye,
  Send,
  Flame,
  Heart,
  Clock,
  Sparkles,
  Bookmark,
  ArrowLeft,
  Languages,
  HandMetal,
  Lightbulb,
  MessageSquare,
  CornerDownRight,
} from "lucide-react";
import {
  EmptyState,
  CustomInput,
  CustomButton,
  CustomTextarea,
  SkeletonLoader,
} from "@/components/shared";
import {
  useGetPostByIdQuery,
  useLikePostMutation,
  useReactToPostMutation,
  useGetPostCommentsQuery,
  useTranslatePostMutation,
  useCreateCommentMutation,
  useToggleBookmarkMutation,
  useLazyGetPostSummaryQuery,
  useAskPostQuestionMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { formatDate, formatNumber } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { AdBannerSlot } from "@/components/layout/AdBannerSlot";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const { data: postRes, isLoading } = useGetPostByIdQuery(id || "");
  const post = postRes?.data;

  const [fetchSummary, { data: summaryRes, isFetching: isSummarizing }] =
    useLazyGetPostSummaryQuery();
  const [askQuestion, { data: qaRes, isLoading: isAsking }] =
    useAskPostQuestionMutation();
  const [translatePost, { data: translateRes, isLoading: isTranslating }] =
    useTranslatePostMutation();
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [reactToPost] = useReactToPostMutation();
  const [toggleBookmark, { isLoading: isSaving }] = useToggleBookmarkMutation();

  const { data: commentsRes } = useGetPostCommentsQuery(post?._id || "", {
    skip: !post?._id,
  });
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();

  const [question, setQuestion] = useState("");
  const [replyText, setReplyText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isBanglaView, setIsBanglaView] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [activeReaction, setActiveReaction] = useState<
    "love" | "fire" | "insightful" | "clap" | null
  >(null);
  const [reactedSet, setReactedSet] = useState<Set<string>>(new Set());
  const [isLikedState, setIsLikedState] = useState<boolean | null>(null);
  const [isSavedState, setIsSavedState] = useState<boolean | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  if (isLoading) {
    return <SkeletonLoader variant="detail" />;
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <EmptyState
          title="Article Not Found"
          actionLabel="Back to Explore"
          onAction={() => navigate("/")}
          secondaryLabel="Write Article"
          onSecondaryAction={() => navigate("/studio")}
          description="This article could not be located or may have been removed by its author."
        />
      </div>
    );
  }

  const requireAuth = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const handleToggleSummary = async () => {
    if (!showSummary && !summaryRes) {
      await fetchSummary(post._id);
    }
    setShowSummary((prev) => !prev);
  };

  const handleTranslateToggle = async () => {
    if (!isBanglaView && !translateRes) {
      await translatePost({ postId: post._id, targetLang: "bn" });
    }
    setIsBanglaView((prev) => !prev);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await askQuestion({ postId: post._id, question: question.trim() });
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    try {
      const res = await likePost(post._id).unwrap();
      const liked = res?.data?.hasLiked;
      if (typeof liked === "boolean") {
        setIsLikedState(liked);
        showFeedback(liked ? "Liked article!" : "Removed like");
      } else {
        showFeedback("Updated like");
      }
    } catch {
      showFeedback("Could not update like");
    }
  };

  const handleSave = async () => {
    if (!requireAuth()) return;
    try {
      const res = await toggleBookmark(post._id).unwrap();
      const saved = res?.data?.isBookmarked;
      if (typeof saved === "boolean") {
        setIsSavedState(saved);
        showFeedback(saved ? "Saved to Reading List" : "Removed from Reading List");
      } else {
        showFeedback("Updated Reading List");
      }
    } catch {
      showFeedback("Could not update Reading List");
    }
  };

  const handleReaction = async (
    type: "love" | "fire" | "insightful" | "clap",
  ) => {
    if (!requireAuth() || activeReaction) return;
    setActiveReaction(type);
    try {
      await reactToPost({ postId: post._id, type, count: 1 }).unwrap();
      setReactedSet((prev) => new Set(prev).add(type));
      showFeedback(`Reacted with ${type}!`);
    } catch {
      showFeedback("Could not add reaction");
    } finally {
      setActiveReaction(null);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !commentText.trim()) return;
    await createComment({ postId: post._id, content: commentText.trim() });
    setCommentText("");
  };

  const handlePostReply = async (parentId: string) => {
    if (!requireAuth() || !replyText.trim()) return;
    await createComment({
      postId: post._id,
      content: replyText.trim(),
      parentComment: parentId,
    });
    setReplyText("");
    setReplyToId(null);
  };

  const displayedTitle =
    isBanglaView && translateRes?.data?.translatedTitle
      ? translateRes.data.translatedTitle
      : post.title;
  const displayedContent =
    isBanglaView && translateRes?.data?.translatedContent
      ? translateRes.data.translatedContent
      : post.content;

  const comments = commentsRes?.data || [];

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CustomButton
          size="sm"
          variant="ghost"
          onClick={() => navigate("/")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Feed
        </CustomButton>

        <div className="flex flex-wrap items-center gap-2">
          <CustomButton
            size="sm"
            isLoading={isSummarizing}
            onClick={handleToggleSummary}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            variant={showSummary ? "primary" : "secondary"}
          >
            {showSummary ? "Hide Summary" : "Key Takeaways"}
          </CustomButton>

          <CustomButton
            size="sm"
            isLoading={isTranslating}
            onClick={handleTranslateToggle}
            variant={isBanglaView ? "emerald" : "outline"}
            leftIcon={<Languages className="w-3.5 h-3.5" />}
          >
            {isBanglaView ? "Show English" : "বাংলা অনুবাদ"}
          </CustomButton>
        </div>
      </div>

      <article className="rounded-lg surface-3d-elevated p-6 sm:px-5 sm:py-4 space-y-2 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-medium text-orange-700">
            {post?.category}
          </span>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            {post.liveReaders && post.liveReaders > 0 && (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {post.liveReaders} Reading Now
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} Min Read
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-950 leading-tight">
          {displayedTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-display font-bold flex items-center justify-center">
              {post.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {post.author?.name || "Md Ashraful Islam"}
              </p>
              <p className="text-xs text-slate-500">
                Published {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {actionFeedback && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700"
                >
                  {actionFeedback}
                </motion.span>
              )}
            </AnimatePresence>
            <CustomButton
              size="sm"
              isLoading={isLiking}
              variant={isLikedState ? "primary" : "secondary"}
              badge={post.likesCount}
              onClick={handleLike}
              leftIcon={
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isLikedState
                      ? "fill-rose-500 text-rose-500"
                      : "text-rose-500"
                  }`}
                />
              }
            >
              {isLikedState ? "Liked" : "Like"}
            </CustomButton>
            <CustomButton
              size="sm"
              isLoading={isSaving}
              variant={isSavedState ? "emerald" : "outline"}
              onClick={handleSave}
              leftIcon={
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isSavedState ? "fill-current" : ""
                  }`}
                />
              }
            >
              {isSavedState ? "Saved" : "Save"}
            </CustomButton>
          </div>
        </div>

        <AnimatePresence>
          {showSummary && (
            <motion.div
              className="overflow-hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <div className="p-5 rounded-lg bg-orange-50/70 border border-orange-200 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase text-orange-700 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Article Summary</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {summaryRes?.data?.summary ||
                    post.aiSummary ||
                    "Generating concise summary..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="prose max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line pt-2">
          {displayedContent}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CustomButton
              size="sm"
              isLoading={activeReaction === "clap"}
              variant={reactedSet.has("clap") ? "primary" : "secondary"}
              badge={post.reactions?.clap || 0}
              onClick={() => handleReaction("clap")}
              leftIcon={<HandMetal className="w-3.5 h-3.5" />}
            >
              Clap
            </CustomButton>
            <CustomButton
              size="sm"
              isLoading={activeReaction === "fire"}
              variant={reactedSet.has("fire") ? "primary" : "secondary"}
              badge={post.reactions?.fire || 0}
              onClick={() => handleReaction("fire")}
              leftIcon={<Flame className="w-3.5 h-3.5 text-orange-500" />}
            >
              Fire
            </CustomButton>
            <CustomButton
              size="sm"
              isLoading={activeReaction === "insightful"}
              variant={reactedSet.has("insightful") ? "primary" : "secondary"}
              badge={post.reactions?.insightful || 0}
              onClick={() => handleReaction("insightful")}
              leftIcon={<Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
            >
              Insightful
            </CustomButton>
            <CustomButton
              size="sm"
              isLoading={activeReaction === "love"}
              variant={reactedSet.has("love") ? "primary" : "secondary"}
              badge={post.reactions?.love || 0}
              onClick={() => handleReaction("love")}
              leftIcon={<Heart className="w-3.5 h-3.5 text-rose-500" />}
            >
              Love
            </CustomButton>
          </div>

          <AnimatePresence>
            {actionFeedback && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700"
              >
                {actionFeedback}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </article>

      <AdBannerSlot placement="in_article" category={post.category} />

      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-950">
              Ask About This Article
            </h3>
            <p className="text-xs text-slate-500">
              Get instant answers derived directly from the article content
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAskAI}
          className="flex flex-col sm:flex-row gap-3 mt-3"
        >
          <CustomInput
            value={question}
            containerClassName="flex-1"
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask question related to this article"
          />
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isAsking}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask
          </CustomButton>
        </form>

        {qaRes?.data?.answer && (
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-[13px] text-slate-700 leading-relaxed">
            {qaRes.data.answer}
          </div>
        )}
      </div>

      <section className="rounded-md surface-3d p-6 sm:px-4 sm:py-4 space-y-3">
        <h3 className="text-lg font-display font-bold text-slate-950 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          <span>Discussion ({comments.length})</span>
        </h3>

        <form onSubmit={handlePostComment} className="space-y-1">
          <CustomTextarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts or technical feedback..."
          />
          <div className="flex justify-end">
            <CustomButton
              size="sm"
              type="submit"
              variant="primary"
              isLoading={isCommenting}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Post Comment
            </CustomButton>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No comments yet. Be the first to start the discussion.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="p-3 rounded-md bg-slate-50/80 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    {c.author?.name || "Reader"}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {c.content}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setReplyToId(replyToId === c._id ? null : c._id)
                  }
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>

                {replyToId === c._id && (
                  <div className="flex gap-2 pt-2">
                    <CustomInput
                      value={replyText}
                      placeholder="Write a reply..."
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <CustomButton
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePostReply(c._id)}
                    >
                      Send
                    </CustomButton>
                  </div>
                )}

                {c.replies && c.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-orange-200 space-y-2.5 mt-3">
                    {c.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="p-3 rounded-xl bg-white border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-900">
                            {reply.author?.name || "Author"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
