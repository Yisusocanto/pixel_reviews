import axiosInstance from "@/config/axiosConfig";
import type { User } from "@/types/userTypes";
import { useQuery } from "@tanstack/react-query";

const verifyUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/auth/verify");
  return response.data.user;
};

export const useSession = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: verifyUser,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
