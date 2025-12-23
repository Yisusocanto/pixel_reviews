"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  createReview,
  deleteReview,
} from "@/services/apiService";
import { getUserReview } from "@/services/reviewsService";
import { toast } from "sonner";
import axios from "axios";
import type { Rating, Review } from "@/types/reviewTypes";

type UserReviewData = {
  review: Review | null;
  rating: Rating | null;
};

export const useCreateRating = (gameSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameID, score }: { gameID: number; score: number }) =>
      createRating(gameID, score),

    onMutate: async ({ score }) => {
      await queryClient.cancelQueries({ queryKey: ["userReview", gameSlug] });

      const previousData = queryClient.getQueryData<UserReviewData>([
        "userReview",
        gameSlug,
      ]);

      queryClient.setQueryData<UserReviewData>(
        ["userReview", gameSlug],
        (oldData) => {
          if (!oldData) {
            return {
              review: null,
              rating: {
                ratingID: 0,
                score,
                createdAt: new Date().toISOString(),
              },
            };
          }
          return {
            ...oldData,
            rating: oldData.rating
              ? { ...oldData.rating, score }
              : { ratingID: 0, score, createdAt: new Date().toISOString() },
          };
        }
      );

      return { previousData };
    },

    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["userReview", gameSlug],
          context.previousData
        );
      }
      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data?.error ?? "Unknown error"
        : "Unknown error";
      toast.error("Error", {
        description: `Error creating/updating the rating: ${errorMsj}`,
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast.success("Rating created", {
        description: "Rating created/updated successfully",
        duration: 5000,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userReview", gameSlug] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

export const useCreateReview = (gameSlug: string, username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gameID,
      reviewTitle,
      reviewContent,
      score,
    }: {
      gameID: number;
      reviewTitle: string;
      reviewContent: string;
      score: number;
    }) => createReview(gameID, reviewTitle, reviewContent, score),

    onMutate: async ({ reviewTitle, reviewContent, score }) => {
      await queryClient.cancelQueries({ queryKey: ["userReview", gameSlug] });

      const previousData = queryClient.getQueryData<UserReviewData>([
        "userReview",
        gameSlug,
      ]);

      const now = new Date().toISOString();

      queryClient.setQueryData<UserReviewData>(
        ["userReview", gameSlug],
        (oldData) => {
          const newReview: Review = oldData?.review
            ? {
                ...oldData.review,
                title: reviewTitle,
                content: reviewContent,
                updatedAt: now,
              }
            : {
                reviewID: 0,
                title: reviewTitle,
                content: reviewContent,
                isLiked: false,
                totalLikes: 0,
                createdAt: now,
                updatedAt: now,
              };

          const newRating: Rating = oldData?.rating
            ? { ...oldData.rating, score }
            : { ratingID: 0, score, createdAt: now };

          return {
            review: newReview,
            rating: newRating,
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["userReview", gameSlug],
          context.previousData
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userReview", gameSlug] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews", username] });
    },
  });
};

export const useDeleteReview = (gameSlug: string, username: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewID: number) => deleteReview(reviewID),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userReview", gameSlug] });

      const previousData = queryClient.getQueryData<UserReviewData>([
        "userReview",
        gameSlug,
      ]);

      queryClient.setQueryData<UserReviewData>(
        ["userReview", gameSlug],
        (oldData) => {
          if (!oldData) return { review: null, rating: null };
          return {
            ...oldData,
            review: null,
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["userReview", gameSlug],
          context.previousData
        );
      }
      toast.error("Failed to delete review");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userReview", gameSlug] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews", username] });
    },
  });
};

export const useGetUserReview = (
  gameID: number,
  gameSlug: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["userReview", gameSlug],
    queryFn: () => getUserReview(gameID),
    enabled: !!gameID && enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
