"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWishlistItem } from "@/services/wishlistService";
import { toast } from "sonner";
import axios from "axios";

export const useToggleWishlistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gameID: number) => toggleWishlistItem(gameID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
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
