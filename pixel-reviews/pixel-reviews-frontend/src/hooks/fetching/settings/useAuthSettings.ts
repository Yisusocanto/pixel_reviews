import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/settingService";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useAuthSettings = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordData) =>
      changePassword(currentPassword, newPassword),
  });
};
