import axiosInstance from "@/lib/axiosConfig";
import type { AxiosResponse } from "axios";

export const getReviews = async (
  page: number,
  limit: number = 10,
  cookieHeader?: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `/main?limit=${limit}&page=${page}`,
    {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    }
  );
  return response;
};

export const getUserReview = async (gameID: number) => {
  const { data } = await axiosInstance.get(`/main/user_review/${gameID}`);
  return data;
};
