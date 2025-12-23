"use client";

import * as React from "react";
import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Avatar, Card } from "@heroui/react";
import Link from "next/link";
import type { Review } from "@/types/reviewTypes";

export interface SimpleReviewCardProps {
  review: Review;
  className?: string;
}

const SimpleReviewCard = React.forwardRef<
  HTMLDivElement,
  SimpleReviewCardProps
>(({ review, className }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("shadow-sm w-full ", className)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      // ARIA attributes for accessibility
      role="article"
      aria-labelledby="review-author"
      aria-describedby="review-content"
    >
      <Card className="py-4 border">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {review.author?.avatarUrl && (
              <Link href={`/users/${review.author.username}`}>
                <Avatar>
                  <Avatar.Image
                    src={review.author.avatarUrl}
                    alt={`Avatar of ${review.author.username}`}
                  />
                  <Avatar.Fallback>
                    {review.author.username.slice(0, 1)}
                  </Avatar.Fallback>
                </Avatar>
              </Link>
            )}
            <div>
              <h3 id="review-author" className="text-lg font-semibold">
                {review.title}
              </h3>
              <p className="text-sm hover:text-muted">
                <Link href={`/users/${review.author?.username}`}>
                  {review.author?.username}
                </Link>
              </p>
            </div>
          </div>
          {/* Rating Section */}
          <div className="flex items-center gap-1 text-lg font-bold">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>{review.rating?.score?.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Body */}
        <div id="review-content" className="mt-4 text-sm text-muted">
          <p>
            {isExpanded
              ? review.content
              : `${review.content.slice(0, MAX_LENGTH)}${
                  review.content.length > MAX_LENGTH ? "..." : ""
                }`}
          </p>
          {review.content.length > MAX_LENGTH && (
            <button
              onClick={toggleReadMore}
              className="text-blue-600 hover:text-blue-500 text-xs font-bold mt-1 hover:underline cursor-pointer relative z-10"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
});

SimpleReviewCard.displayName = "SimpleReviewCard";

export { SimpleReviewCard };
