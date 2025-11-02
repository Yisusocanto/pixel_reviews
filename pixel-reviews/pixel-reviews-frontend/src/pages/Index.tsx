import { useState, useEffect } from "react";
// Components
import GameReviewCard from "@/components/gameReviewComponents/GameReviewCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
// Services
import { indexPageData } from "@/services/indexPageService";
// Types
import type { Review } from "@/types/gameTypes";

function Index() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const bringIndexPageData = async () => {
      try {
        const response = await indexPageData();
        setReviews(response.data.reviews);
      } catch (error: any) {
        setError(error?.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };
    bringIndexPageData();
  }, []);

  if (loading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {error && <span>{error}</span>}
      {reviews?.map((review: Review, e) => {
        return (
          <GameReviewCard
            review={review}
            className="w-xs sm:w-sm md:w-xl "
            key={e}
          />
        );
      })}
    </div>
  );
}

export default Index;
