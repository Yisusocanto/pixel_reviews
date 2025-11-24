import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/settingService";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  lastname: string;
  location: string;
  bio: string;
  website: string;
}

// Success toast
const displaySuccessToast = () =>
  toast.success("Profile updated", {
    description: "The Profile has been updated successfully",
    duration: 5000,
  });

// Error toast
const displayErrorToast = (error: string) =>
  toast.error("Error", {
    description: `Error updating the profile: ${error}`,
    duration: 5000,
  });

export const useProfileSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: ProfileData) => updateProfile(profileData),
    onSuccess: (data: any) => {
      queryClient.setQueryData(["authUser"], data.user);
      displaySuccessToast();
    },
    onError: (error: any) => {
      displayErrorToast(error.response.data.error);
    },
  });
};
