import axiosInstance from "@/config/axiosConfig";

export const createRating = async (gameID: number, score: number) => {
  const { data } = await axiosInstance.post("/api/create_rating", {
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
  const { data } = await axiosInstance.post("/api/create_review", {
    game_id: gameID,
    review_title: reviewTitle,
    review_content: reviewContent,
    score: score,
  });

  return data;
};

export const deleteReview = async (gameID: number, userID: number) => {
  const { data } = await axiosInstance.post("/api/delete_review", {
    game_id: gameID,
    user_id: userID,
  });
  return data;
};
