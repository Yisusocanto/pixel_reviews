"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { toast } from "sonner";
import axios from "axios";

export const useAddToWishlist = (gameSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameID, userID }: { gameID: number; userID: number }) =>
      addToWishlist(gameID, userID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["game", gameSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Game added to wishlist", { duration: 5000 });
    },
    onError: (error) => {
      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data.error
        : "Unknown error";
      toast.error("Error", {
        description: `Error adding the game to the wishlist: ${errorMsj}`,
        duration: 5000,
      });
    },
  });
};

export const useRemoveFromWishlist = (gameSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wishlistItemID: number) => removeFromWishlist(wishlistItemID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["game", gameSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Game removed from wishlist", { duration: 5000 });
    },
    onError: (error) => {
      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data.error
        : "Unknown error";
      toast.error("Error", {
        description: `Error removing from the wishlist: ${errorMsj}`,
        duration: 5000,
      });
    },
  });
};
