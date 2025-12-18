"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

interface LoginData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      router.push("/feed");
    },
  });
};
