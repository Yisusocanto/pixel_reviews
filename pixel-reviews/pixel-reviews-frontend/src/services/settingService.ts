import axiosInstance from "@/lib/axiosConfig";

interface ProfileData {
  location: string;
  bio: string;
  website: string;
}

export const updateProfile = async (profileData: ProfileData) => {
  const { data } = await axiosInstance.patch("/settings/update_profile", {
    location: profileData.location,
    bio: profileData.bio,
    website: profileData.website,
  });
  return data;
};

export const changeUsername = async (username: string) => {
  const { data } = await axiosInstance.patch("/settings/change_username", {
    username: username,
  });
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const { data } = await axiosInstance.patch("/settings/change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

export const uploadAvatar = async (formData: any) => {
  const { data } = await axiosInstance.patch(
    "/settings/upload_avatar",
    formData
  );
  return data;
};

export const deleteAvatar = async () => {
  const { data } = await axiosInstance.delete("/settings/delete_avatar");
  return data;
};
