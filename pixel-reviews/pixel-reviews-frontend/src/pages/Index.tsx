import { useState, useEffect } from "react";
import { indexPageData } from "@/services/indexPageService";
import GameReviewCard from "@/components/gameReviewComponents/GameReviewCard";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";

import type { Review } from "@/types/gameTypes";

function Index() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bringIndexPageData = async () => {
      try {
        const response = await indexPageData();
        setReviews(response.data.reviews);
      } catch (error: any) {
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
      {reviews?.map((review: Review) => {
        return (
          <GameReviewCard
            coverImage={review.game?.imageURL}
            gameTitle={review.game?.title}
            gameSlug={review.game?.slug}
            reviewTitle={review.title}
            reviewContent={review.content}
            rating={review.rating?.score}
            authorUsername={review.author?.username}
            createdDate={review.createdAt}
            className="w-xl "
          />
        );
      })}
    </div>
  );
}

export default Index;
