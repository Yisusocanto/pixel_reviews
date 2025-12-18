"use client";

import axiosInstance from "@/lib/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/userTypes";

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
