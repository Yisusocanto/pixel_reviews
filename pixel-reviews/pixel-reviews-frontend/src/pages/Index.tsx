import { useState, useEffect, useRef } from "react";
// Components
import GameReviewCard from "@/components/gameReviewComponents/GameReviewCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
// Services
import { getReviews } from "@/services/reviewsService";
// Types
import type { Review } from "@/types/gameTypes";
import AccentButton from "@/components/commonsComponents/AccentButton";

function Index() {
  const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const initialFetched = useRef(false);

  const getRecentReviews = async (pageToFetch: number = page) => {
    setLoading(true);
    try {
      const response = await getReviews(pageToFetch);
      setReviews((prev) =>
        prev ? [...prev, ...response.data.results] : response.data.results
      );
      setPage((prevPage) => prevPage + 1);
      response.data.info.results < 10 ? setShowLoadMore(false) : null;
    } catch (error: any) {
      setError(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFetched.current) {
      initialFetched.current = true;
      getRecentReviews();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {loading && <SpinnerComponent />}
      {error && <span>{error}</span>}
      {reviews?.map((review: Review, e) => {
        return (
          <GameReviewCard
            review={review}
            className="w-xs sm:w-sm md:w-xl "
            key={review.review_id ?? e}
          />
        );
      })}
      {!loading && !error && showLoadMore && (
        <AccentButton onClick={() => getRecentReviews()}>
          Load More Reviews
        </AccentButton>
      )}
    </div>
  );
}

export default Index;
