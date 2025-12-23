import { getUserWishlist } from "@/services/userService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteWishlist = (username: string) => {
  return useInfiniteQuery({
    queryKey: ["userWishlist", username],
    queryFn: ({ pageParam = 1 }) => getUserWishlist(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const limit = 10;
      const lastPageCount = lastPage.data.info.results;

      if (lastPageCount < 10) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};
