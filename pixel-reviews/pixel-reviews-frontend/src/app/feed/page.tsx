"use client";

import { useRef } from "react";
import FeedReviewCard from "@/components/review/FeedReviewCard";
import FeedReviewCardSkeleton from "@/components/review/FeedReviewCardSkeleton";
import { Spinner } from "@heroui/react";
import { useInfiniteReviews } from "@/hooks/fetching/reviews/useInfiniteReviews";
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
      <div className="flex flex-col items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <FeedReviewCardSkeleton key={i} className="w-xs sm:w-sm md:w-xl" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {(error as any).message}</span>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.results.map((review: Review) => (
            <FeedReviewCard
              review={review}
              className="w-xs sm:w-sm md:w-xl"
              key={review.reviewID}
            />
          ))}
        </div>
      ))}

      <div
        ref={lastElementRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && <Spinner />}
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
