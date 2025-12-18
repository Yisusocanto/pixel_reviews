"use client";

import { RatingComponent } from "@/components/ui/rating";
import { useCreateRating } from "@/hooks/fetching/reviews/useReview";

interface RatingProps {
  gameID: number;
  gameSlug: string;
  userRatingScore: number;
}

function Rating({ gameID, gameSlug, userRatingScore }: RatingProps) {
  const { mutate: createRating } = useCreateRating(gameSlug);

  const handleRatingChange = (score: number) => {
    if (!gameID) return;

    createRating({ gameID, score });
  };

  return (
    <RatingComponent
      size="lg"
      rating={userRatingScore || 0}
      editable
      showValue
      onRatingChange={handleRatingChange}
    />
  );
}

export default Rating;
