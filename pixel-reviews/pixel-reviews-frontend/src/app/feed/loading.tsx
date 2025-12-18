import FeedReviewCardSkeleton from "@/components/review/FeedReviewCardSkeleton";

export default function FeedLoading() {
  return (
    <div className="flex flex-col items-center gap-2">
      {[...Array(3)].map((_, i) => (
        <FeedReviewCardSkeleton key={i} className="w-xs sm:w-sm md:w-xl" />
      ))}
    </div>
  );
}
