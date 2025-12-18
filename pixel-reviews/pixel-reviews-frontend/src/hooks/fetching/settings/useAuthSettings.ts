"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/services/settingService";
import { toast } from "sonner";
import axios from "axios";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const displaySuccessToast = () =>
  toast.success("Password changed", {
    description: "The Password has been changed successfully",
    duration: 5000,
  });

const displayErrorToast = (error: string) =>
  toast.error("Error", {
    description: `Error changing the password: ${error}`,
    duration: 5000,
  });

export const useAuthSettings = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordData) =>
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      displaySuccessToast();
    },
    onError: (error) => {
      const errorMsj = axios.isAxiosError(error)
        ? error.response?.data.error
        : "Unknowwn error.";
      displayErrorToast(errorMsj);
    },
  });
};
