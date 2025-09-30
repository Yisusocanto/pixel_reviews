import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const createRating = async (
  gameID: number,
  score: number
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post("/api/create_rating", {
    game_id: gameID,
    score: score,
  });

  return response;
};

export const createReview = async (
  gameID: number,
  reviewTitle: string,
  reviewContent: string,
  score: number
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post("/api/create_review", {
    game_id: gameID,
    review_title: reviewTitle,
    review_content: reviewContent,
    score: score,
  });

  return response;
};
