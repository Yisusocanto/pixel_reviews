import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const getGameDetails = async (slug: string): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`/main/games/${slug}`);
  return response;
};

export const searchGames = async (
  gameTitle: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`/main/search/${gameTitle}`);
  return response;
};
