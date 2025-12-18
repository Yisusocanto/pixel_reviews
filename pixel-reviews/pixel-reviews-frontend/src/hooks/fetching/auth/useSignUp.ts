"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "@/services/authService";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: object) => signUp(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      router.push("/feed");
    },
  });
};
