import axiosInstance from "@/config/axiosConfig";

interface ProfileData {
  name: string;
  lastname: string;
  location: string;
  bio: string;
  website: string;
}

export const updateProfile = async (profileData: ProfileData) => {
  const { data } = await axiosInstance.post("/settings/update_profile", {
    name: profileData.name,
    lastname: profileData.lastname,
    location: profileData.location,
    bio: profileData.bio,
    website: profileData.website,
  });
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const { data } = await axiosInstance.post("/settings/change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

export const uploadAvatar = async (formData: any) => {
  const { data } = await axiosInstance.post(
    "/settings/upload_avatar",
    formData
  );
  return data;
};

export const deleteAvatar = async () => {
  const { data } = await axiosInstance.get("/settings/delete_avatar");
  return data;
};
