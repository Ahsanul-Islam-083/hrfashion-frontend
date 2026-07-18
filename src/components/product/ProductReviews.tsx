"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, getToken } from "@/lib/auth-client";
import { Star, Heart, MessageCircle, Trash2, Loader2, ChevronDown, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  fetchProductReviews,
  createReview,
  updateReview,
  toggleReviewLike,
  deleteReview,
  type Review,
} from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform duration-500 hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= (hovered || value) ? "fill-foreground text-foreground" : "text-neutral-300 dark:text-neutral-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${cls} ${n <= Math.round(rating) ? "fill-foreground text-foreground" : "text-neutral-300 dark:text-neutral-600"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, image, size = "md" }: { name?: string; image?: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  const displayName = name || "User";
  return (
    <div className={`${dim} rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-medium uppercase overflow-hidden flex-shrink-0`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={displayName} className="w-full h-full object-cover" />
      ) : (
        displayName.charAt(0)
      )}
    </div>
  );
}

function ReviewItem({
  review,
  productId,
  currentUserId,
  isAdmin,
  depth = 0,
}: {
  review: Review;
  productId: string;
  currentUserId?: string;
  isAdmin?: boolean;
  depth?: number;
}) {
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating || 0);
  const isLiked = currentUserId ? review.likes.includes(currentUserId) : false;
  const isOwner = currentUserId === review.userId;
  const canDelete = isOwner || isAdmin;

  const likeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return toggleReviewLike(review._id, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(productId) }),
    onError: () => toast.error("Failed to toggle like"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return deleteReview(review._id, token);
    },
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(productId) });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const editMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const data: any = { content: editContent };
      if (depth === 0) data.rating = editRating;
      return updateReview(review._id, data, token);
    },
    onSuccess: () => {
      toast.success("Review updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(productId) });
    },
    onError: (e: any) => toast.error(e.message || "Failed to update review"),
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return createReview(productId, { content, parentId: review._id }, token);
    },
    onSuccess: () => {
      toast.success("Reply posted");
      setReplyText("");
      setReplyOpen(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(productId) });
    },
    onError: (e: any) => toast.error(e.message || "Failed to post reply"),
  });

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

  return (
    <div className={depth > 0 ? "ml-10 pl-4 border-l border-neutral-200 dark:border-neutral-800" : ""}>
      <div className="flex gap-3 py-5">
        <Avatar name={review.userName} image={review.userImage} size={depth > 0 ? "sm" : "md"} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{review.userName || "User"}</span>
              {review.rating != null && depth === 0 && (
                <StarDisplay rating={review.rating} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">{timeAgo}</span>
              {!isEditing && isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-neutral-400 hover:text-foreground transition-colors rounded-sm"
                  title="Edit review"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
              {!isEditing && canDelete && (
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="p-1 text-neutral-400 hover:text-red-500 transition-colors rounded-sm"
                  title="Delete review"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 mb-3">
              {depth === 0 && (
                <div className="mb-3">
                  <StarSelector value={editRating} onChange={setEditRating} />
                </div>
              )}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-background border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground resize-none mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(review.content);
                    setEditRating(review.rating || 0);
                  }}
                  className="px-4 py-2 text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editMutation.mutate()}
                  disabled={!editContent.trim() || (depth === 0 && !editRating) || editMutation.isPending}
                  className="px-4 py-2 bg-foreground text-background text-xs font-medium uppercase tracking-widest rounded-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {editMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 mb-3">{review.content}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (!currentUserId) { toast.error("Log in to like reviews"); return; }
                likeMutation.mutate();
              }}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                isLiked ? "text-foreground" : "text-neutral-400 hover:text-foreground"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
              {review.likes.length > 0 && <span>{review.likes.length}</span>}
            </button>

            {depth === 0 && currentUserId && (
              <button
                onClick={() => setReplyOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>
          )}

          {replyOpen && (
            <div className="mt-3 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground resize-none"
              />
              <button
                onClick={() => replyMutation.mutate(replyText)}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="px-4 py-2 bg-foreground text-background text-xs font-medium uppercase tracking-widest rounded-sm hover:opacity-90 disabled:opacity-50 self-end"
              >
                {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>

      {review.replies && review.replies.length > 0 && (
        <div>
          {review.replies.map((reply) => (
            <ReviewItem
              key={reply._id}
              review={reply}
              productId={productId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const currentUserId = session?.user?.id;
  const isAdmin = (session?.user as any)?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.reviews(productId),
    queryFn: () => fetchProductReviews(productId),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      if (!rating) throw new Error("Please select a rating");
      return createReview(productId, { content, rating }, token);
    },
    onSuccess: () => {
      toast.success("Review posted");
      setContent("");
      setRating(0);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews(productId) });
    },
    onError: (e: any) => toast.error(e.message || "Failed to post review"),
  });

  const reviews = data?.reviews ?? [];
  const avgRating = data?.averageRating ?? 0;
  const totalReviews = reviews.length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif mb-1">Customer Reviews</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <StarDisplay rating={avgRating} size="sm" />
              <span className="text-sm text-neutral-500">
                {avgRating.toFixed(1)} · {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Write Review Form */}
      {session && showForm && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm uppercase tracking-widest">Your Review</h3>
            <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-foreground text-xs uppercase tracking-widest transition-colors">Cancel</button>
          </div>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest font-medium text-neutral-500 mb-2">Rating</p>
            <StarSelector value={rating} onChange={setRating} />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this piece..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground resize-none mb-4"
          />
          <div className="flex justify-end">
            <button
              onClick={() => submitMutation.mutate()}
              disabled={!content.trim() || !rating || submitMutation.isPending}
              className="px-6 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* Not logged in prompt */}
      {!session && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/50 rounded-sm px-6 py-5 mb-8 flex items-center justify-between">
          <p className="text-sm text-neutral-500">Log in to leave a review.</p>
          <Link
            href="/login"
            className="text-sm font-medium uppercase tracking-widest hover:text-neutral-500 transition-colors underline underline-offset-4"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm border border-neutral-100 dark:border-neutral-800/50">
          <Star className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
          <p className="text-sm text-neutral-500">Be the first to share your thoughts on this piece.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              productId={productId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
