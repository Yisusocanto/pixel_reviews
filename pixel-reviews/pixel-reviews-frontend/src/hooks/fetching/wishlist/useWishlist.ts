"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWishlistItem } from "@/services/wishlistService";
import { toast } from "sonner";
import axios from "axios";

export const useToggleWishlistItem = (username: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gameID: number) => toggleWishlistItem(gameID),
    onMutate: (gameID) => {
      queryClient.cancelQueries({ queryKey: ["inUserWishlist", gameID] });

      const prevState = queryClient.getQueryData(["inUUserWishlist", gameID]);

      queryClient.setQueryData(
        ["inUserWishlist", gameID],
        (oldData: boolean) => {
          return !oldData;
        }
      );

      return { prevState };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWishlist", username] });
    },
    onError: (error, gameID, context) => {
      if (context?.prevState) {
        queryClient.setQueryData(["inUserWishlist", gameID], context.prevState);
      }

      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data.error
        : "Unknown error";
      toast.error("Error", {
        description: `Error toggling the wishlist: ${errorMsj}`,
        duration: 5000,
      });
    },
  });
};
