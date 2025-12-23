"use client";

import { useState } from "react";
import { Star, Calendar, Trash, EllipsisVertical } from "lucide-react";
import { Card, Label } from "@heroui/react";
import { Dropdown } from "@heroui/react";
import { useAuth } from "@/providers/AuthProvider";
import { orbitron } from "@/fonts/fonts";
import Link from "next/link";
import Image from "next/image";
import { dateFormatter } from "@/lib/dateFormatter";
import { useDeleteReview } from "@/hooks/fetching/reviews/useReview";
import type { Review } from "@/types/reviewTypes";
import LikeButton from "../actions/LikeButton";

interface ProfileReviewCardProps {
  review: Review;
  username: string;
}

function ProfileReviewCard({ review, username }: ProfileReviewCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;
  const ownReview = user?.username === username;

  const { mutate: deleteReview } = useDeleteReview(
    review.game?.slug ?? "",
    user?.username ?? ""
  );

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteReview = () => {
    deleteReview(review.reviewID);
  };

  return (
    <div>
      <Card className="border flex flex-col md:flex-row gap-4 bg-card">
        {/* Cover Image*/}
        <div className="shrink-0 relative w-full h-48 md:w-72 md:h-48">
          {review.game && (
            <Link
              href={`/games/${review.game.slug}`}
              className="relative block w-full h-full"
            >
              <Image
                src={review.game.imageURL || "/default-cover.png"}
                alt="Game cover"
                fill
                className="rounded-lg shadow-2xl object-cover overflow-hidden transition-all ease-in-out hover:scale-105 duration-300 hover:shadow-xl"
                sizes="(max-width: 768px) 100vw, 288px"
              />
            </Link>
          )}
        </div>
        <div className="flex justify-between w-full">
          <div className="flex-8 flex flex-col gap-4">
            {/* Game title and genre badges */}
            <div className="flex gap-2">
              <h3
                className={`${orbitron.className} text-2xl font font-bold hover:text-muted`}
              >
                <Link href={`/games/${review.game?.slug}`}>
                  {review.game?.title}
                </Link>
              </h3>
            </div>
            {/* rating and created date */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Star size={18} color="yellow" className="fill-yellow-400" />
                <span className="text-sm">
                  <span className="font-bold text-lg">
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
              <h4 className="text-xl font-bold">{review.title}</h4>
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
            <div>
              <LikeButton
                hasLike={review.isLiked}
                likesCount={review.totalLikes}
                reviewID={review.reviewID}
                authorUsername={review.author?.username ?? ""}
              />
            </div>
          </div>
          {ownReview && (
            <div className="flex-1 flex items-start justify-end">
              <Dropdown>
                <Dropdown.Trigger>
                  <EllipsisVertical />
                </Dropdown.Trigger>
                <Dropdown.Popover className={"border"}>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={handleDeleteReview}
                      className="text-danger hover:bg-default-hover"
                    >
                      <Trash size={16} />
                      <Label className="text-danger text-base">
                        Delete reviews
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ProfileReviewCard;
