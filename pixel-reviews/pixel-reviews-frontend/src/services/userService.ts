import axiosInstance from "@/lib/axiosConfig";
import { cache } from "react";

// Cached version for server components - avoids duplicate fetches in generateMetadata + page/layout
export const getUserData = cache(async (username: string) => {
  const { data } = await axiosInstance.get(`/users/${username}`);
  return data;
});

export const getUserWishlist = async (
  username: string,
  page: number,
  limit: number = 10
) => {
  const response = await axiosInstance.get(
    `/users/${username}/wishlist?page=${page}&limit=${limit}`
  );
  return response;
};

export const getUserReviews = async (
  username: string,
  page: number,
  limit: number = 10,
  cookieHeader?: string
) => {
  const response = await axiosInstance.get(
    `/users/${username}/reviews?page=${page}&limit=${limit}`,
    { headers: cookieHeader ? { Cookie: cookieHeader } : {} }
  );
  return response;
};
