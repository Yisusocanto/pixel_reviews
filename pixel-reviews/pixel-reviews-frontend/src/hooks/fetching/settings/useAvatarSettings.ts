import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar, deleteAvatar } from "@/services/settingService";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => uploadAvatar(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error: any) => {
      console.log("Error uploading avatar", error);
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error: any) => {
      console.log("Error deleting avatar", error);
    },
  });
};
