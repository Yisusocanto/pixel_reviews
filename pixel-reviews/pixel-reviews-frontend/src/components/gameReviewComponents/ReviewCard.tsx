import * as React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming 'cn' utility from shadcn setup
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

// Interface for component props for type-safety and reusability
export interface ReviewCardProps {
  reviewTitle: string;
  username?: string;
  review: string;
  rating?: number;
  imageUrl: string;
  className?: string;
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ reviewTitle, username, review, rating, imageUrl, className }, ref) => {
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
        className={cn(
          "bg-card text-card-foreground border rounded-xl p-6 shadow-sm w-full max-w-md",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        // ARIA attributes for accessibility
        role="article"
        aria-labelledby="review-author"
        aria-describedby="review-content"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Avatar of ${username}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <UserRound size={32} />
            )}
            <div>
              <h3 id="review-author" className="text-lg font-semibold">
                {reviewTitle}
              </h3>
              <p className="text-sm text-muted-foreground hover:text-foreground">
                <Link to={`/users/${username}`}>{username}</Link>
              </p>
            </div>
          </div>
          {/* Rating Section */}
          <div className="flex items-center gap-1 text-lg font-bold">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>{rating?.toFixed(1)}</span>
          </div>
        </div>

        {/* Card Body */}
        <p id="review-content" className="mt-4 text-sm text-muted-foreground">
          {review}
        </p>
      </motion.div>
    );
  }
);

ReviewCard.displayName = "ReviewCard";

export { ReviewCard };
