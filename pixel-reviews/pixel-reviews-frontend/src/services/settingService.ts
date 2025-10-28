import axiosInstance from "@/config/axiosConfig";

export const updateProfile = async (
  name: string,
  lastname: string,
  location: string,
  bio: string,
  website: string
) => {
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
) => {
  const response = axiosInstance.post("/settings/change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response;
};
