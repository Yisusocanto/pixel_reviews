import { useRef } from "react";
// Components
import GameReviewCard from "@/components/gameReviewComponents/GameReviewCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import { Skeleton } from "@/components/ui/skeleton";
// Hooks
import { useInfiniteReviews } from "@/hooks/fetching/reviews/useInfiniteReviews";
// Types
import type { Review } from "@/types/gameTypes";

function Feed() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteReviews();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  };

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-8 mt-4">
        <div className="flex flex-col gap-4 rounded-2xl border-1 border-gray-800 bg-main w-xs sm:w-sm md:w-lg p-3">
          <Skeleton className="w-full h-64 rounded-2xl" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-2/3" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-2/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/4" />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
            <div className="flex gap-1">
              <Skeleton className="rounded-full h-12 w-12" />
              <div className="flex flex-col justify-center gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-30" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="rounded-full h-12 w-12" />
              <div className="flex flex-col justify-center gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-30" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border-1 border-gray-800 bg-main w-xs sm:w-sm md:w-lg p-3">
          <Skeleton className="w-full h-64" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-2/3" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-2/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/4" />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
            <div className="flex gap-1">
              <Skeleton className="rounded-full h-12 w-12" />
              <div className="flex flex-col justify-center gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-30" />
              </div>
            </div>
            <div className="flex gap-1">
              <Skeleton className="rounded-full h-12 w-12" />
              <div className="flex flex-col justify-center gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {(error as any).message}</span>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {data?.pages.map((page, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          {page.data.results.map((review: Review) => (
            <GameReviewCard
              review={review}
              className="w-xs sm:w-sm md:w-xl "
              key={review.review_id}
            />
          ))}
        </div>
      ))}

      <div
        ref={lastElementRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && <SpinnerComponent />}
        {!hasNextPage && data && (
          <span className="text-gray-500 text-sm mt-4">
            No more reviews to load
          </span>
        )}
      </div>
    </div>
  );
}

export default Feed;
