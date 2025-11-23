import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";

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
    },
  });
};
