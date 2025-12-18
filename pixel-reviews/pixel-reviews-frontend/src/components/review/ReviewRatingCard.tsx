"use client";

import { Card, Separator, Skeleton } from "@heroui/react";
import { Star, AlertCircle } from "lucide-react";
import CreateReviewModal from "@/components/review/CreateReviewModal";
import Rating from "@/components/game/Rating";
import { useGetUserReview } from "@/hooks/fetching/reviews/useReview";
import { Game } from "@/types/gameTypes";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";

interface ReviewRatingCardProps {
  game: Game;
}

function ReviewRatingCard({ game }: ReviewRatingCardProps) {
  const { isAuthenticated } = useAuth();
  const { data, error, isError, isLoading } = useGetUserReview(
    game.gameID,
    game.slug,
    isAuthenticated
  );

  const isNotFoundError =
    isError && axios.isAxiosError(error) && error.response?.status === 404;

  const isRealError = isError && !isNotFoundError;
  const userRating = isNotFoundError ? null : data?.rating ?? null;
  const userReview = isNotFoundError ? null : data?.review ?? null;
  const showLoading = isAuthenticated && isLoading;

  return (
    <div className="w-full md:max-w-sm">
      <Card
        variant="default"
        className="flex flex-col items-center gap-4 bg-card border"
      >
        <h3 className="text-lg">Rate this game</h3>
        <div className="flex gap-2 items-center">
          <Star size={36} className="text-yellow-400 fill-yellow-400" />
          <span className="text-4xl text-bold">
            {game.averageRating.toFixed(1)}
          </span>
          <span className="text-base">/ 5</span>
        </div>
        <span className="text-base text-muted">
          Total Reviews: {game.totalRatings}
        </span>
        <Separator />
        <h4 className="text-lg">Your rating</h4>

        {showLoading && (
          <div className="w-full flex flex-col items-center gap-3">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        )}

        {isRealError && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm">Error loading your review data</p>
          </div>
        )}

        {!showLoading && !isRealError && (
          <>
            {isAuthenticated && (
              <Rating
                gameID={game.gameID}
                userRatingScore={userRating?.score ?? 0}
                gameSlug={game.slug}
              />
            )}

            <CreateReviewModal
              game={game}
              userRating={userRating}
              userReview={userReview}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default ReviewRatingCard;
