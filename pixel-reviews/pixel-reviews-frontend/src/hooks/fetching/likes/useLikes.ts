"use client";

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toggleLike } from "@/services/likeService";
import axios from "axios";
import { toast } from "sonner";
import type { Review } from "@/types/reviewTypes";

type ReviewsInfiniteData = InfiniteData<{
  data: {
    results: Review[];
  };
}>;

export const useLikes = (username: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewID: number) => toggleLike(reviewID),
    onMutate: async (reviewID) => {
      await queryClient.cancelQueries({ queryKey: ["reviews"] });

      const previousReviews = queryClient.getQueryData<ReviewsInfiniteData>([
        "reviews",
      ]);

      queryClient.setQueryData<ReviewsInfiniteData>(["reviews"], (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              results: page.data.results.map((review) => {
                if (review.reviewID === reviewID) {
                  const isLiked = !review.isLiked;
                  return {
                    ...review,
                    isLiked,
                    totalLikes: isLiked
                      ? review.totalLikes + 1
                      : review.totalLikes - 1,
                  };
                }
                return review;
              }),
            },
          })),
        };
      });

      return { previousReviews };
    },
    onError: (error, _reviewID, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(["reviews"], context.previousReviews);
      }

      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data.error
        : "Unknown error";
      toast.error("Error", { description: errorMsj, duration: 5000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews", username] });
    },
  });
};
