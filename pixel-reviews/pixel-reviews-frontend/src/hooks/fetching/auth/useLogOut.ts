"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logOut } from "@/services/authService";

export const useLogOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      router.push("/login");
      queryClient.setQueryData(["authUser"], null);
    },
  });
};
