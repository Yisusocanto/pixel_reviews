import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  createReview,
  deleteReview,
} from "@/services/apiService";

export const useCreateRating = (gameSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameID, score }: { gameID: number; score: number }) =>
      createRating(gameID, score),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["game", gameSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useCreateReview = (gameSlug: string) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["game", gameSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useDeleteReview = (gameSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameID, userID }: { gameID: number; userID: number }) =>
      deleteReview(gameID, userID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["game", gameSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};
