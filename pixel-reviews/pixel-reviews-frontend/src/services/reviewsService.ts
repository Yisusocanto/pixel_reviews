import axiosInstance from "@/lib/axiosConfig";
import type { AxiosResponse } from "axios";

export const getReviews = async (
  page: number,
  limit: number = 10,
  cookieHeader?: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `/reviews?limit=${limit}&page=${page}`,
    {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    }
  );
  return response;
};

export const getUserReview = async (gameID: number) => {
  const { data } = await axiosInstance.get(`/reviews/user_review/${gameID}`);
  return data;
};

export const createRating = async (gameID: number, score: number) => {
  const { data } = await axiosInstance.post("/reviews/create_rating", {
    game_id: gameID,
    score: score,
  });

  return data;
};

export const createReview = async (
  gameID: number,
  reviewTitle: string,
  reviewContent: string,
  score: number
) => {
  const { data } = await axiosInstance.post("/reviews/create_review", {
    game_id: gameID,
    review_title: reviewTitle,
    review_content: reviewContent,
    score: score,
  });

  return data;
};

export const deleteReview = async (reviewID: number) => {
  const { data } = await axiosInstance.delete(`/reviews/${reviewID}`);
  return data;
};
