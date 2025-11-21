import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
// Components
import GameReviewCard from "@/components/gameReviewComponents/GameReviewCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
// Hooks
import { useInfiniteReviews } from "@/hooks/fetching/useInfiniteReviews";
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

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return <SpinnerComponent />;
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
        ref={loadMoreRef}
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
