"use client";

import { motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { RatingComponent } from "@/components/ui/rating";
import { Avatar } from "@heroui/react";
import { dateFormatter } from "@/lib/dateFormatter";
import { orbitron } from "@/fonts/fonts";
import { Link as LinkHero } from "@heroui/react";
import type { Review } from "@/types/reviewTypes";
import LikeButton from "../actions/LikeButton";

export interface FeedReviewCard {
  review: Review;
  className?: string;
}

const FeedReviewCard = React.forwardRef<HTMLDivElement, FeedReviewCard>(
  ({ review, className }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 150;

    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };

    const fadeUpVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          delay: i * 0.15,
          ease: [0.25, 0.4, 0.25, 1] as const,
        },
      }),
    };

    return (
      <div
        ref={ref}
        className={`relative min-h-80 md:min-h-96 w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-2 sm:px-4 py-3 ${className}`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-white/2" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="bg-[#0f0f0f] border rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* Game Cover */}
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="relative h-40 sm:h-48 md:h-56 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-transparent to-transparent z-10" />
              <img
                src={`${review.game?.imageURL || "/default-cover.png"}`}
                alt={review.game?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {/* Game Title & Rating */}
              <motion.div
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="mb-3 sm:mb-4"
              >
                {/* Mobile: Stack vertically with gap */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`${orbitron.className} text-lg sm:text-xl md:text-2xl font-bold hover:text-muted truncate`}
                    >
                      <Link href={`/games/${review.game?.slug}`}>
                        {review.game?.title}
                      </Link>
                    </h2>
                    <div className="h-px w-12 sm:w-16 bg-linear-to-r from-white/40 to-transparent mt-1" />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <RatingComponent
                      rating={review.rating?.score || 0}
                      showValue
                      size="lg"
                      className="text-lg sm:text-xl"
                    />
                    <span className="text-muted text-sm sm:text-base">/ 5</span>
                  </div>
                </div>
              </motion.div>

              {/* Review Title */}
              <motion.h1
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 leading-tight"
              >
                {review.title}
              </motion.h1>

              {/* Review Content */}
              <motion.div
                custom={3}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="mb-3 sm:mb-4"
              >
                <p className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed">
                  {isExpanded
                    ? review.content
                    : `${review.content.slice(0, MAX_LENGTH)}${
                        review.content.length > MAX_LENGTH ? "..." : ""
                      }`}
                </p>
                {review.content.length > MAX_LENGTH && (
                  <button
                    onClick={toggleReadMore}
                    className="text-blue-600 hover:text-blue-500 text-sm font-bold mt-2 hover:underline cursor-pointer relative z-10"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </motion.div>
              <motion.div
                custom={4}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center sm:justify-between py-3 border-t"
              >
                <LikeButton
                  hasLike={review.isLiked}
                  likesCount={review.totalLikes}
                  reviewID={review.reviewID}
                  authorUsername={review.author?.username ?? ""}
                />
              </motion.div>

              {/* Author & Date */}
              <motion.div
                custom={4}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-3 sm:pt-3 border-t"
              >
                <div className="flex items-center gap-3">
                  <Link href={`/users/${review.author?.username}`}>
                    <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
                      <Avatar.Image
                        src={review.author?.avatarUrl}
                        alt="Author Avatar"
                      />
                      <Avatar.Fallback>
                        {review.author?.username?.slice(0, 2)}
                      </Avatar.Fallback>
                    </Avatar>
                  </Link>
                  <div>
                    <p className="text-xs sm:text-sm text-muted mb-0.5">
                      Author
                    </p>
                    <LinkHero asChild>
                      <Link href={`/users/${review.author?.username}`}>
                        <p className="text-sm sm:text-base font-medium hover:text-muted">
                          {review.author?.username}
                        </p>
                      </Link>
                    </LinkHero>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted mb-0.5">
                      Created At
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      {dateFormatter(review.createdAt || "")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
      </div>
    );
  }
);

FeedReviewCard.displayName = "FeedReviewCard";

export default FeedReviewCard;
