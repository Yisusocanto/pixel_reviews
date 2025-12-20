"use client";

import { useLikes } from "@/hooks/fetching/likes/useLikes";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  hasLike: boolean;
  likesCount: number;
  reviewID: number;
}

function LikeButton({ hasLike, likesCount, reviewID }: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(hasLike);
  const { mutate: toggleLike } = useLikes();
  const router = useRouter();

  const handleToggleLike = () => {
    toggleLike(reviewID, {
      onSuccess: () => {
        setIsLiked(!isLiked);
      },
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        isAuthenticated ? handleToggleLike() : router.push("/login")
      }
      className="flex items-center gap-2 text-gray-400 hover:text-danger transition-colors"
    >
      <Heart
        size={24}
        className={`${
          isLiked ? "text-danger fill-danger" : ""
        } hover:scale-110`}
      />
      <span className={`${isLiked ? "text-danger" : ""} text-xl font-medium`}>
        {likesCount}
      </span>
    </motion.button>
  );
}

export default LikeButton;
