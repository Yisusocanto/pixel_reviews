import { motion } from "framer-motion";
import * as React from "react";
import { Link } from "react-router-dom";
// Components
import { Calendar, User } from "lucide-react";
import { RatingComponent } from "../ui/rating";
import { Avatar, AvatarImage, AvatarFallback } from "../luxe/avatar";
// Utils
import { dateFormatter } from "@/utils/dateFormatter";
// Types
import type { Review } from "@/types/gameTypes";

export interface GameReviewCardProps {
  review: Review;
  className?: string;
}

const GameReviewCard = React.forwardRef<HTMLDivElement, GameReviewCardProps>(
  ({ review, className }, ref) => {
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
        className={`relative min-h-[24rem] md:min-h-[28rem] w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] p-4 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="bg-[#0f0f0f] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="relative h-48 md:h-56 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10" />
              <img
                src={review.game?.imageURL}
                alt={review.game?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="p-4 md:p-6">
              <motion.div
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="mb-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-orbitron md:text-2xl font-bold text-white/90 mb-1 hover:text-primary-muted">
                    <Link to={`/games/${review.game?.slug}`}>
                      {review.game?.title}
                    </Link>
                  </h2>
                  <div className="h-px w-16 bg-gradient-to-r from-white/40 to-transparent" />
                </div>
                <div className="flex items-center gap-3">
                  <RatingComponent
                    rating={review.rating?.score || 0}
                    showValue
                    size="lg"
                    className="text-xl"
                  />
                  <span className="text-primary-muted">/ 5</span>
                </div>
              </motion.div>
              <motion.h1
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="text-3xl md:text-4xl font-bold mb-8 text-white leading-tight"
              >
                {review.title}
              </motion.h1>

              <motion.div
                custom={3}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <p className="text-base md:text-lg text-white/60 leading-relaxed">
                  {review.content}
                </p>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                    {review.author?.avatarUrl ? (
                      <Avatar>
                        <AvatarImage
                          src={review.author.avatarUrl}
                          alt="Author Avatar"
                        />
                        <AvatarFallback>
                          {review.author.username?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="w-5 h-5 text-white/60" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/40 mb-0.5">Author</p>
                    <Link to={`/users/${review.author?.username}`}>
                      <p className="text-base font-medium text-white/80 hover:text-primary-muted">
                        {review.author?.username}
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 mb-0.5">Created At</p>
                    <p className="text-base font-medium text-white/80">
                      {dateFormatter(review.createdAt || "")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
      </div>
    );
  }
);

GameReviewCard.displayName = "GameReview";

export default GameReviewCard;
