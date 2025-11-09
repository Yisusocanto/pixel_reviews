import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const getReviews = async (
  page: number,
  limit: number = 10
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`/main?limit=${limit}&page=${page}`);
  return response;
};
