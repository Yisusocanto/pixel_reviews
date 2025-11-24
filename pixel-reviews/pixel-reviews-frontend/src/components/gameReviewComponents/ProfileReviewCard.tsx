// Components
import { useState } from "react";
import { Star, Calendar, Trash, EllipsisVertical } from "lucide-react";
import { Card } from "../luxe/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";
// import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
// Utils
import { dateFormatter } from "@/utils/dateFormatter";
// Types
import type { Review } from "@/types/gameTypes";
// Services
import { useDeleteReview } from "@/hooks/fetching/reviews/useReview";

interface ProfileReviewCardProps {
  review: Review;
  ownReview: boolean;
}

function ProfileReviewCard({ review, ownReview }: ProfileReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const { mutate: deleteReview } = useDeleteReview(review.game?.slug || "");

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteReview = () => {
    deleteReview(review.review_id, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });
  };

  return (
    <div>
      <Toaster theme="dark" richColors={true} />
      <Card className="flex flex-col md:flex-row gap-4 bg-card">
        {/* Cover Image*/}
        <div className="shrink-0">
          <img
            src={review.game?.imageURL}
            alt="Game cover"
            className="rounded-lg shadow-2xl object-cover w-full h-48 md:w-72 md:h-48"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex-8 flex flex-col gap-4">
            {/* Game title and genre badges */}
            <div className="flex gap-2">
              <h3 className="text-2xl text-primary font-orbitron font-bold hover:text-primary-muted">
                <Link to={`/games/${review.game?.slug}`}>
                  {review.game?.title}
                </Link>
              </h3>
              {/* {<div className="flex items-center gap-2">
              <Badge variant="secondary">Genero</Badge>
              <Badge variant="destructive">Estado</Badge>
            </div>} */}
            </div>
            {/* rating and created date */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Star size={18} color="yellow" />
                <span className="text-sm">
                  <span className="text-primary font-bold text-lg">
                    {review.rating?.score}
                  </span>
                  /5
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className="text-sm">
                  {dateFormatter(review.createdAt)}
                </span>
              </div>
            </div>
            {/* title and content review */}
            <div>
              <h4 className="text-primary text-lg font-bold">{review.title}</h4>
              <p className="text-base">
                {isExpanded
                  ? review.content
                  : `${review.content.slice(0, MAX_LENGTH)}${
                      review.content.length > MAX_LENGTH ? "..." : ""
                    }`}
              </p>
              {review.content.length > MAX_LENGTH && (
                <button
                  onClick={toggleReadMore}
                  className="text-blue-600 hover:text-blue-500 text-sm font-bold mt-1 hover:underline cursor-pointer"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            {/* Social interaction */}
            {/* {<div className="flex gap-4 text-base">
            <div className="flex gap-1 items-center">
              <Eye size={16} /> 10
            </div>
            <div className="flex gap-1 items-center">
              <Heart size={16} /> 100
            </div>
            <div className="flex gap-1 items-center">
              <MessageCircle size={16} /> 33
            </div>
          </div>} */}
          </div>
          {ownReview && (
            <div className="flex-1 flex items-start justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background">
                  <DropdownMenuItem
                    className="focus:bg-(--accent-color)"
                    onClick={handleDeleteReview}
                  >
                    <Trash size={16} className="text-destructive" />
                    <span className="text-destructive text-base font-semibold">
                      Delete review
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ProfileReviewCard;
