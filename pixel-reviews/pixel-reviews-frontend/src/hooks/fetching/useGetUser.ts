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
