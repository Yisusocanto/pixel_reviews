import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/services/userService";
import type { User } from "@/types/userTypes";

interface getUser {
  user: User;
}

export const useGetUser = (username: string) => {
  const { data, isLoading, isError, isFetching, error, refetch } =
    useQuery<getUser>({
      queryKey: ["user", username],
      queryFn: () => getUserData(username),
      enabled: !!username,
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    });
  return {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  };
};
