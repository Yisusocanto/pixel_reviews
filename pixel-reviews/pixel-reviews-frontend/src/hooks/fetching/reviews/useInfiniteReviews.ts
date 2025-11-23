import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/reviewsService";

export const useInfiniteReviews = () => {
  return useInfiniteQuery({
    queryKey: ["reviews"],
    queryFn: ({ pageParam = 1 }) => getReviews(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const limit = 10;
      const lastPageCount = lastPage.data.results.length;

      if (lastPageCount < limit) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};
