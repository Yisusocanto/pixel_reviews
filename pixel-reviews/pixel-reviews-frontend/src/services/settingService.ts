import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const updateProfile = async (
  name: string,
  lastname: string,
  location: string,
  bio: string,
  website: string
): Promise<AxiosResponse> => {
  const response = axiosInstance.post("/settings/update_profile", {
    name,
    lastname,
    location,
    bio,
    website,
  });
  return response;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<AxiosResponse> => {
  const response = axiosInstance.post("/settings/change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response;
};

export const uploadAvatar = async (formData: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    "/settings/upload_avatar",
    formData
  );
  return response;
};

export const deleteAvatar = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get("/settings/delete_avatar");
  return response;
};
