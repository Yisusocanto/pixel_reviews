"use client";

import ProfileReviewCard from "@/components/review/ProfileReviewCard";
import { useInfinityUserReviews } from "@/hooks/fetching/reviews/useInfiniteReviews";
import { Review } from "@/types/reviewTypes";
import { Spinner } from "@heroui/react";
import { useRef, use } from "react";

interface ReviewsPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ReviewsPage({ params }: ReviewsPageProps) {
  const { username } = use(params);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfinityUserReviews(username);

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

  if (status === "error") {
    return <span>Error: {(error as any).message}</span>;
  }

  return (
    <div className="w- full max-w-3/4 mx-auto flex flex-col gap-2">
      {data?.pages.map((page, i) => (
        <div key={i} className="flex flex-col gap-4">
          {page.data.results.map((review: Review) => (
            <ProfileReviewCard
              username={username}
              review={review}
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
