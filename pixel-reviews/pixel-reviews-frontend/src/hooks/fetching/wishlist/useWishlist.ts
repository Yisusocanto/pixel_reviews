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
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useRemoveFromWishlist = (gameSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameID, userID }: { gameID: number; userID: number }) =>
      removeFromWishlist(gameID, userID),
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
