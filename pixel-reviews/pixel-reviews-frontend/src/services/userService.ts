import axiosInstance from "../config/axiosConfig";

export const getUserData = async (username: string) => {
  const { data } = await axiosInstance.get(`/users/${username}`);
  return data;
};
