import { useRef } from "react";
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
